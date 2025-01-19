import httpStatusConstants from '@/constants/httpStatus.constants';
import mongodb from '@/lib/mongodb';
import formSpecialScholarshipSchema from '@/app/api/v1/event/form/special/scholarship/form.special.scholarship.schema';
import FormSpecialScholarshipModel from '@/app/api/v1/event/form/special/scholarship/form.special.scholarship.model';
import formSpecialConstants from '@/app/api/v1/event/form/special/form.special.constants';
import formSpecialScholarshipConstants from '@/app/api/v1/event/form/special/scholarship/form.special.scholarship.constants';
import SettingsGeneralModel from '@/app/api/v1/settings/general/settings.general.model';

import asyncHandler from '@/util/asyncHandler';
import sendResponse from '@/util/sendResponse';
import validateToken from '@/util/validateToken';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import getNextSequence from '@/util/getNextSequence';
import formSpecialScholarshipPipeline from '@/app/api/v1/event/form/special/scholarship/form.special.scholarship.pipeline';

// Named export for the POST request handler
const handleCreateFormSpecialScholarship = async (request, context) => {
    // Validate content type
    const contentValidationResult = validateUnsupportedContent(
        request,
        formSpecialScholarshipConstants.allowedContentTypes
    );
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Connect to MongoDB
    await mongodb.connect();

    // Validate admin
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response;
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'create',
        formSpecialScholarshipSchema.createSchema
    );

    // Get organization details
    const organizationDetails = await SettingsGeneralModel.aggregate([
        {
            $project: {
                _id: 0,
                name: 1,
                description: 1,
                logo: { $ifNull: ['$logo.link', ''] },
                address: 1,
                emails: 1,
                contacts: 1,
                socialLinks: 1,
            },
        },
    ]);

    if (!organizationDetails[0]) {
        return sendResponse(
            false,
            httpStatusConstants.BAD_REQUEST,
            'Your organization setup is not completed yet. Please set up your organization.',
            {},
            {},
            request
        );
    }

    // Set form code and increment serial number
    userInput.formCode = formSpecialConstants.formCode.scholarship;
    userInput.slNo = await getNextSequence(
        formSpecialConstants.formType.scholarship
    );

    userInput.lastDate = new Date(userInput.lastDate);

    // Create the new scholarship form document
    const createdDocument = await FormSpecialScholarshipModel.create(userInput);

    if (!createdDocument) {
        return sendResponse(
            false,
            httpStatusConstants.INTERNAL_SERVER_ERROR,
            'Failed to retrieve created document.',
            {},
            {},
            request
        );
    }

    const filter = {
        _id: createdDocument._id,
        lastDate: { $gte: new Date() },
    }; // Add filters if needed
    const projection = {};
    const pipeline = formSpecialScholarshipPipeline(filter, projection);
    const specialFormData =
        await FormSpecialScholarshipModel.aggregate(pipeline);

    // Attach organization details to the response data
    specialFormData[0].organizer = organizationDetails[0];

    // Send a success response with the created document data
    return sendResponse(
        true,
        httpStatusConstants.CREATED,
        `Scholarship form entry with serial no "${userInput?.slNo}" created successfully.`,
        specialFormData[0],
        {},
        request
    );
};

// Export the route wrapped with asyncHandler
export const POST = asyncHandler(handleCreateFormSpecialScholarship);
