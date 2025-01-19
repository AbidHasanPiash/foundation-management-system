import formSpecialEligibleSchoolConstants from '@/app/api/v1/event/form/special/scholarship/eligible/institute/form.special.eligible.institute.constants';
import mongodb from '@/lib/mongodb';
import formSpecialEligibleSchoolSchema from '@/app/api/v1/event/form/special/scholarship/eligible/institute/form.special.eligible.institute.schema';
import FormSpecialEligibleSchoolModel from '@/app/api/v1/event/form/special/scholarship/eligible/institute/form.special.eligible.institute.model';
import httpStatusConstants from '@/constants/httpStatus.constants';

import asyncHandler from '@/util/asyncHandler';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import validateToken from '@/util/validateToken';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import sendResponse from '@/util/sendResponse';

const handleCreateEligibleSchool = async (request, context) => {
    // Validate content type
    const contentValidationResult = validateUnsupportedContent(
        request,
        formSpecialEligibleSchoolConstants.allowedContentTypes
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
        formSpecialEligibleSchoolSchema.createSchema
    );

    // Check if a document with the specified status already exists
    const existingStatus = await FormSpecialEligibleSchoolModel.exists({
        name: userInput?.name,
    });
    if (existingStatus) {
        return sendResponse(
            false,
            httpStatusConstants.CONFLICT,
            `Eligible school entry with name "${userInput?.name}" already exists.`,
            {},
            {},
            request
        );
    }

    // Attempt to create a new document with the provided details
    const createdDocument =
        await FormSpecialEligibleSchoolModel.create(userInput);

    // Validate if the document was successfully created
    if (!createdDocument) {
        return sendResponse(
            false,
            httpStatusConstants.INTERNAL_SERVER_ERROR,
            'Failed to create eligible school entry.',
            {},
            {},
            request
        );
    }

    // Retrieve the created document
    const statusData = await FormSpecialEligibleSchoolModel.findOne(
        { _id: createdDocument._id },
        {
            _id: 1,
            name: 1,
            address: 1,
            contactPerson: 1,
            contactNo: 1,
            headOfInstitute: 1,
            headOfInstituteNumber: 1,
        }
    ).lean();

    // Send a success response with the created document data
    return sendResponse(
        true,
        httpStatusConstants.CREATED,
        `Eligible school entry with name "${userInput?.name}" created successfully.`,
        statusData,
        {},
        request
    );
};

// Export the route wrapped with asyncHandler
export const POST = asyncHandler(handleCreateEligibleSchool);
