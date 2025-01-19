import httpStatusConstants from '@/constants/httpStatus.constants';
import mongodb from '@/lib/mongodb';
import statusSchema from '@/app/api/v1/status/status.schema';
import statusConstants from '@/app/api/v1/status/status.constants';
import StatusModel from '@/app/api/v1/status/status.model';

import asyncHandler from '@/util/asyncHandler';
import sendResponse from '@/util/sendResponse';
import validateToken from '@/util/validateToken';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import statusPipeline from '@/app/api/v1/status/status.pipeline';
import convertToObjectId from '@/util/convertToObjectId';

// Named export for the PATCH request handler
const handleUpdateStatus = async (request, context) => {
    const contentValidationResult = validateUnsupportedContent(
        request,
        statusConstants.allowedContentTypes
    );
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Check if the "membership" status already exists in MongoDB
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
        statusSchema.updateSchema
    );

    // Retrieve existing document and handle file replacement if needed
    const existingStatusData = await StatusModel.findOne({
        category: userInput?.categoryParams,
        _id: userInput?.id,
    });
    if (!existingStatusData) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            `Status entry with CATEGORY "${userInput?.categoryParams}" and ID "${userInput?.id}" not found.`,
            {},
            {},
            request
        );
    }

    // Update the document with the filtered data
    const updatedDocument = await StatusModel.findOneAndUpdate(
        { _id: userInput?.id }, // Find document by status
        { $set: userInput },
        { new: true }
    ).lean();

    if (!updatedDocument) {
        return sendResponse(
            false,
            httpStatusConstants.INTERNAL_SERVER_ERROR,
            `Failed to update status entry with CATEGORY "${userInput?.categoryParams}" and ID "${userInput?.id}".`,
            {},
            {},
            request
        );
    }

    const filter = { _id: convertToObjectId(updatedDocument?._id) };
    const projection = {};
    const pipeline = statusPipeline(filter, projection);
    const data = await StatusModel.aggregate(pipeline);

    // Send a success response with the updated document data
    return sendResponse(
        true,
        httpStatusConstants.OK,
        `Status entry with CATEGORY "${userInput?.categoryParams}" and ID "${userInput?.id}" updated successfully.`,
        data,
        {},
        request
    );
};

// Named export for the POST request handler
const handleDeleteTeamStatus = async (request, context) => {
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
        statusSchema.categoryAndIdSchema
    );

    // Perform the deletion with the specified projection field for optional file handling
    const entryData = await StatusModel.findOneAndDelete({
        category: userInput?.categoryParams,
        _id: userInput?.id,
    });

    // If no document is found, send a 404 response
    if (!entryData) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            `Status entry with CATEGORY "${userInput?.categoryParams}" and ID "${userInput?.id}" not found.`,
            {},
            {},
            request
        );
    }

    // Send a success response
    return sendResponse(
        true,
        httpStatusConstants.OK,
        `Status entry with CATEGORY "${userInput?.categoryParams}" and ID "${userInput?.id}" deleted successfully.`,
        {},
        {},
        request
    );
};

// Export the route wrapped with asyncHandler
export const PATCH = asyncHandler(handleUpdateStatus);

// Export the route wrapped with asyncHandler
export const DELETE = asyncHandler(handleDeleteTeamStatus);
