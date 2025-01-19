import mongodb from '@/lib/mongodb';
import TypeModel from '@/app/api/v1/type/type.model';
import typeSchema from '@/app/api/v1/type/type.schema';
import typeConstants from '@/app/api/v1/type/type.constants';
import httpStatusConstants from '@/constants/httpStatus.constants';

import asyncHandler from '@/util/asyncHandler';
import validateToken from '@/util/validateToken';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import sendResponse from '@/util/sendResponse';
import typePipeline from '@/app/api/v1/type/type.pipeline';

// Named export for the POST request handler
const handleCreateType = async (request, context) => {
    // Validate content category
    const contentValidationResult = validateUnsupportedContent(
        request,
        typeConstants.allowedContentTypes
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
        typeSchema.createSchema
    );

    // Check if a document with the specified type already exists
    const existingStatus = await TypeModel.exists({
        category: userInput?.categoryParams,
        type: userInput?.type,
    });
    if (existingStatus) {
        return sendResponse(
            false,
            httpStatusConstants.CONFLICT,
            `Type entry with CATEGORY "${userInput?.categoryParams}" and type "${userInput?.type}" already exists.`,
            {},
            {},
            request
        );
    }

    userInput.category = userInput.categoryParams;

    // Attempt to create a new document with the provided details
    const createdDocument = await TypeModel.create(userInput);

    // Validate if the document was successfully created
    if (!createdDocument) {
        return sendResponse(
            false,
            httpStatusConstants.INTERNAL_SERVER_ERROR,
            `Failed to create type entry with CATEGORY "${userInput?.categoryParams}" and type "${userInput?.type}".`,
            {},
            {},
            request
        );
    }

    const filter = {
        category: userInput?.categoryParams,
        _id: createdDocument._id,
    }; // Add filters if needed
    const projection = {};
    const pipeline = typePipeline(filter, projection);
    const typeData = await TypeModel.aggregate(pipeline);

    // Send a success response with the created document data
    return sendResponse(
        true,
        httpStatusConstants.CREATED,
        `Type entry with CATEGORY "${userInput?.categoryParams}" and type "${userInput?.type}" created successfully.`,
        typeData,
        {},
        request
    );
};

// Export the route wrapped with asyncHandler
export const POST = asyncHandler(handleCreateType);
