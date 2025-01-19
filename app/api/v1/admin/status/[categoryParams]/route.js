import mongodb from '@/lib/mongodb';
import StatusModel from '@/app/api/v1/status/status.model';
import statusSchema from '@/app/api/v1/status/status.schema';
import statusConstants from '@/app/api/v1/status/status.constants';
import httpStatusConstants from '@/constants/httpStatus.constants';

import asyncHandler from '@/util/asyncHandler';
import validateToken from '@/util/validateToken';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import sendResponse from '@/util/sendResponse';
import statusPipeline from '@/app/api/v1/status/status.pipeline';
import convertToObjectId from '@/util/convertToObjectId';

// Named export for the POST request handler
const handleCreateStatus = async (request, context) => {
    // Validate content category
    const contentValidationResult = validateUnsupportedContent(
        request,
        statusConstants.allowedContentTypes
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
        statusSchema.createSchema
    );

    // Check if a document with the specified status already exists
    const existingStatus = await StatusModel.exists({
        category: userInput?.categoryParams,
        status: userInput?.status,
    });
    if (existingStatus) {
        return sendResponse(
            false,
            httpStatusConstants.CONFLICT,
            `Status entry with CATEGORY "${userInput?.categoryParams}" and status "${userInput?.status}" already exists.`,
            {},
            {},
            request
        );
    }

    userInput.category = userInput.categoryParams;

    // Attempt to create a new document with the provided details
    const createdDocument = await StatusModel.create(userInput);

    // Validate if the document was successfully created
    if (!createdDocument) {
        return sendResponse(
            false,
            httpStatusConstants.INTERNAL_SERVER_ERROR,
            `Failed to create status entry with CATEGORY "${userInput?.categoryParams}" and status "${userInput?.status}".`,
            {},
            {},
            request
        );
    }

    const filter = { _id: convertToObjectId(createdDocument._id) };
    const projection = {};
    const pipeline = statusPipeline(filter, projection);
    const statusData = await StatusModel.aggregate(pipeline);

    // Send a success response with the created document data
    return sendResponse(
        true,
        httpStatusConstants.CREATED,
        `Status entry with CATEGORY "${userInput?.categoryParams}" and status "${userInput?.status}" created successfully.`,
        statusData,
        {},
        request
    );
};

// Export the route wrapped with asyncHandler
export const POST = asyncHandler(handleCreateStatus);
