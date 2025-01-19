import httpStatusConstants from '@/constants/httpStatus.constants';
import mongodb from '@/lib/mongodb';
import typeSchema from '@/app/api/v1/type/type.schema';
import typeConstants from '@/app/api/v1/type/type.constants';
import TypeModel from '@/app/api/v1/type/type.model';

import asyncHandler from '@/util/asyncHandler';
import sendResponse from '@/util/sendResponse';
import validateToken from '@/util/validateToken';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import typePipeline from '@/app/api/v1/type/type.pipeline';

// Named export for the PATCH request handler
const handleUpdateType = async (request, context) => {
    const contentValidationResult = validateUnsupportedContent(
        request,
        typeConstants.allowedContentTypes
    );
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Check if the "membership" type already exists in MongoDB
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
        'update',
        typeSchema.updateSchema
    );

    // Retrieve existing document and handle file replacement if needed
    const existingTypeData = await TypeModel.findOne({
        category: userInput?.categoryParams,
        _id: userInput?.id,
    });
    if (!existingTypeData) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            `Type entry with CATEGORY "${userInput?.categoryParams}" and ID "${userInput?.id}" not found.`,
            {},
            {},
            request
        );
    }

    // Update the document with the filtered data
    const updatedDocument = await TypeModel.findOneAndUpdate(
        { _id: userInput?.id }, // Find document by type
        { $set: userInput },
        { new: true }
    ).lean();

    if (!updatedDocument) {
        return sendResponse(
            false,
            httpStatusConstants.INTERNAL_SERVER_ERROR,
            `Failed to update type entry with CATEGORY "${userInput?.categoryParams}" and ID "${userInput?.id}".`,
            {},
            {},
            request
        );
    }

    const filter = { _id: updatedDocument?._id }; // Add filters if needed
    const projection = {};
    const pipeline = typePipeline(filter, projection);
    const data = await TypeModel.aggregate(pipeline);

    // Send a success response with the updated document data
    return sendResponse(
        true,
        httpStatusConstants.OK,
        `Type entry with CATEGORY "${userInput?.categoryParams}" and ID "${userInput?.id}" updated successfully.`,
        data,
        {},
        request
    );
};

// Named export for the POST request handler
const handleDeleteTeamType = async (request, context) => {
    // Initialize MongoDB connection
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
        'delete',
        typeSchema.categoryAndIdSchema
    );

    // Perform the deletion with the specified projection field for optional file handling
    const entryData = await TypeModel.findOneAndDelete({
        category: userInput?.categoryParams,
        _id: userInput?.id,
    });

    // If no document is found, send a 404 response
    if (!entryData) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            `Type entry with CATEGORY "${userInput?.categoryParams}" and ID "${userInput?.id}" not found.`,
            {},
            {},
            request
        );
    }

    // Send a success response
    return sendResponse(
        true,
        httpStatusConstants.OK,
        `Type entry with CATEGORY "${userInput?.categoryParams}" and ID "${userInput?.id}" deleted successfully.`,
        {},
        {},
        request
    );
};

// Export the route wrapped with asyncHandler
export const PATCH = asyncHandler(handleUpdateType);

// Export the route wrapped with asyncHandler
export const DELETE = asyncHandler(handleDeleteTeamType);
