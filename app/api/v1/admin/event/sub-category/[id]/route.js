import httpStatusConstants from '@/constants/httpStatus.constants';
import mongodb from '@/lib/mongodb';
import eventSubCategorySchema from '@/app/api/v1/event/sub-category/event.sub.category.schema';
import eventSubCategoryConstants from '@/app/api/v1/event/sub-category/event.sub.category.constants';
import EventSubCategoryModel from '@/app/api/v1/event/sub-category/event.sub.category.model';
import serviceShared from '@/shared/service.shared';
import schemaShared from '@/shared/schema.shared';

import asyncHandler from '@/util/asyncHandler';
import sendResponse from '@/util/sendResponse';
import validateToken from '@/util/validateToken';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import convertToObjectId from '@/util/convertToObjectId';
import eventSubCategoryPipeline from '@/app/api/v1/event/sub-category/event.sub.category.pipeline';

const { idValidationSchema } = schemaShared;

// Named export for the PATCH request handler
const handleUpdateEventSubCategory = async (request, context) => {
    const contentValidationResult = validateUnsupportedContent(
        request,
        eventSubCategoryConstants.allowedContentTypes
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
        eventSubCategorySchema.updateSchema
    );

    // Retrieve existing document and handle file replacement if needed
    const existingSubCategoryTypeData = await EventSubCategoryModel.findOne({
        _id: convertToObjectId(userInput?.id),
    });
    if (!existingSubCategoryTypeData) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            `Event sub category entry with id "${userInput?.id}" not found.`,
            {},
            {},
            request
        );
    }

    if (existingSubCategoryTypeData.subCategory === userInput?.subCategory) {
        return sendResponse(
            false,
            httpStatusConstants.CONFLICT,
            `Event sub-category entry with sub-category: "${userInput?.subCategory}" already exists.`,
            {},
            {},
            request
        );
    }

    // Update the document with the filtered data
    const updatedDocument = await EventSubCategoryModel.findOneAndUpdate(
        { _id: userInput?.id }, // Find document by type
        { $set: userInput },
        { new: true }
    ).lean();

    if (!updatedDocument) {
        return sendResponse(
            false,
            httpStatusConstants.INTERNAL_SERVER_ERROR,
            `Failed to update event sub category entry with id "${userInput?.id}".`,
            {},
            {},
            request
        );
    }

    const filter = { _id: convertToObjectId(updatedDocument?._id) }; // Add filters if needed
    const projection = {};
    const pipeline = eventSubCategoryPipeline(filter, projection);
    const document = await EventSubCategoryModel.aggregate(pipeline);

    // Send a success response with the updated document data
    return sendResponse(
        true,
        httpStatusConstants.OK,
        `Event sub category entry with id "${userInput?.id}" updated successfully.`,
        document,
        {},
        request
    );
};

// Named export for the POST request handler
const handleDeleteEventSubCategory = async (request, context) => {
    return serviceShared.deleteEntry(
        request,
        context,
        idValidationSchema,
        EventSubCategoryModel,
        '', // Projection field for file deletion
        `Event sub category`
    );
};

// Export the route wrapped with asyncHandler
export const PATCH = asyncHandler(handleUpdateEventSubCategory);

// Export the route wrapped with asyncHandler
export const DELETE = asyncHandler(handleDeleteEventSubCategory);
