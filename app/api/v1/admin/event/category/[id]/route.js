import httpStatusConstants from '@/constants/httpStatus.constants';
import mongodb from '@/lib/mongodb';
import eventCategorySchema from '@/app/api/v1/event/category/event.category.schema';
import eventCategoryConstants from '@/app/api/v1/event/category/event.category.constants';
import EventCategoryModel from '@/app/api/v1/event/category/event.category.model';
import serviceShared from '@/shared/service.shared';
import schemaShared from '@/shared/schema.shared';

import asyncHandler from '@/util/asyncHandler';
import sendResponse from '@/util/sendResponse';
import validateToken from '@/util/validateToken';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import convertToObjectId from '@/util/convertToObjectId';
import eventCategoryPipeline from '@/app/api/v1/event/category/event.category.pipeline';

const { idValidationSchema } = schemaShared;

// Named export for the PATCH request handler
const handleUpdateEventCategory = async (request, context) => {
    const contentValidationResult = validateUnsupportedContent(
        request,
        eventCategoryConstants.allowedContentTypes
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
        eventCategorySchema.updateSchema
    );

    // Retrieve existing document and handle file replacement if needed
    const existingCategoryTypeData = await EventCategoryModel.findOne({
        _id: userInput?.id,
    });
    if (!existingCategoryTypeData) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            `Event category entry with id "${userInput?.id}" not found.`,
            {},
            {},
            request
        );
    }

    if (existingCategoryTypeData.category === userInput?.category) {
        return sendResponse(
            false,
            httpStatusConstants.CONFLICT,
            `Event category entry with category: "${userInput?.category}" already exists.`,
            {},
            {},
            request
        );
    }

    // Update the document with the filtered data
    const updatedDocument = await EventCategoryModel.findOneAndUpdate(
        { _id: userInput?.id }, // Find document by type
        { $set: userInput },
        { new: true }
    ).lean();

    if (!updatedDocument) {
        return sendResponse(
            false,
            httpStatusConstants.INTERNAL_SERVER_ERROR,
            `Failed to update event category entry with id "${userInput?.id}".`,
            {},
            {},
            request
        );
    }

    const filter = { _id: convertToObjectId(updatedDocument?._id) }; // Add filters if needed
    const projection = {};
    const pipeline = eventCategoryPipeline(filter, projection);
    const typeData = await EventCategoryModel.aggregate(pipeline);

    // Send a success response with the updated document data
    return sendResponse(
        true,
        httpStatusConstants.OK,
        `Event type entry with id "${userInput?.id}" updated successfully.`,
        typeData,
        {},
        request
    );
};

// Named export for the POST request handler
const handleDeleteEventCategory = async (request, context) => {
    return serviceShared.deleteEntry(
        request,
        context,
        idValidationSchema,
        EventCategoryModel,
        '', // Projection field for file deletion
        `Event category`
    );
};

// Export the route wrapped with asyncHandler
export const PATCH = asyncHandler(handleUpdateEventCategory);

// Export the route wrapped with asyncHandler
export const DELETE = asyncHandler(handleDeleteEventCategory);
