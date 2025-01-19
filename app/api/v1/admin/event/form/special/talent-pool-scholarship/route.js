import httpStatusConstants from '@/constants/httpStatus.constants';
import mongodb from '@/lib/mongodb';
import settingsGeneralModel from '@/app/api/v1/settings/general/settings.general.model';
import formSpecialConstants from '@/app/api/v1/event/form/special/form.special.constants';
import formSpecialTalentPoolScholarshipConstants from '@/app/api/v1/event/form/special/talent-pool-scholarship/form.special.talentPoolScholarship.constants';
import formSpecialTalentPoolScholarshipSchema from '@/app/api/v1/event/form/special/talent-pool-scholarship/form.special.talentPoolScholarship.schema';
import FormSpecialTalentPoolScholarshipModel from '@/app/api/v1/event/form/special/talent-pool-scholarship/form.special.talentPoolScholarship.model';

import asyncHandler from '@/util/asyncHandler';
import sendResponse from '@/util/sendResponse';
import validateToken from '@/util/validateToken';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import getNextSequence from '@/util/getNextSequence';

// Named export for the POST request handler
const handleCreateFormSpecialScholarship = async (request, context) => {
    const contentValidationResult = validateUnsupportedContent(
        request,
        formSpecialTalentPoolScholarshipConstants.allowedContentTypes
    );
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Check if the "specialForm" type already exists in MongoDB
    await mongodb.connect();

    // Validate admin
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response; // Return early with the authorization failure response
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'create',
        formSpecialTalentPoolScholarshipSchema.createSchema
    );

    // Get the organization details
    const pipeline = [
        { $match: {} }, // No filter, includes all documents
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
    ];
    const organizationDetails = await settingsGeneralModel.aggregate(pipeline);
    if (!organizationDetails[0]) {
        return sendResponse(
            false,
            httpStatusConstants.BAD_REQUEST,
            'Your organization setup is not completed yet. Please setup your organization.',
            {},
            {},
            request
        );
    }

    userInput.formCode = formSpecialConstants.formCode.talentPoolScholarship;
    userInput.slNo = await getNextSequence(
        formSpecialConstants.formType.talentPoolScholarship
    );

    // Create a new "specialForm" document with banner details
    const createdDocument =
        await FormSpecialTalentPoolScholarshipModel.create(userInput);

    const specialFormData = await FormSpecialTalentPoolScholarshipModel.findOne(
        { _id: createdDocument?._id },
        {
            _id: 1,
            formCode: 1,
            slNo: 1,
            formTitle: 1,
            formName: 1,
            scholarshipType: 1,
            scholarshipAmount: 1,
            note: 1,
            contact: 1,
            email: 1,
            isActive: 1,
        }
    ).lean();

    specialFormData.organizer = organizationDetails[0];

    // Send a success response with the created document data
    return sendResponse(
        true,
        httpStatusConstants.CREATED,
        `Talent pool scholarship form entry with serial no "${userInput?.slNo}" created successfully.`,
        specialFormData,
        {},
        request
    );
};

// Export the route wrapped with asyncHandler
export const POST = asyncHandler(handleCreateFormSpecialScholarship);
