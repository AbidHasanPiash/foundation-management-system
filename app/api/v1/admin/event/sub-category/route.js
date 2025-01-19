import httpStatusConstants from '@/constants/httpStatus.constants';
import mongodb from '@/lib/mongodb';
import eventSubCategoryConstants from '@/app/api/v1/event/sub-category/event.sub.category.constants';
import eventSubCategorySchema from '@/app/api/v1/event/sub-category/event.sub.category.schema';
import EventSubCategoryModel from '@/app/api/v1/event/sub-category/event.sub.category.model';
import EventCategoryModel from '@/app/api/v1/event/category/event.category.model';

import asyncHandler from '@/util/asyncHandler';
import sendResponse from '@/util/sendResponse';
import validateToken from '@/util/validateToken';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import convertToObjectId from '@/util/convertToObjectId';
import eventSubCategoryPipeline from '@/app/api/v1/event/sub-category/event.sub.category.pipeline';

// Named export for the POST request handler
const handleCreateEventSubCategory = async (request, context) => {
    const contentValidationResult = validateUnsupportedContent(
        request,
        eventSubCategoryConstants.allowedContentTypes
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
        eventSubCategorySchema.createSchema
    );

    // Check if a document with the specified type already exists
    const existingEventSubCategory = await EventSubCategoryModel.exists({
        subCategory: userInput?.subCategory,
    });
    if (existingEventSubCategory) {
        return sendResponse(
            false,
            httpStatusConstants.CONFLICT,
            `Event sub category entry with name "${userInput?.subCategory}" already exists.`,
            {},
            {},
            request
        );
    }

    // Check if a document with the specified category already exists
    const existingEventCategory = await EventCategoryModel.exists({
        _id: userInput?.category,
    });
    if (!existingEventCategory) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            `Event category entry with id "${userInput?.category}" not found.`,
            {},
            {},
            request
        );
    }

    // Create a new "type" document with the provided details
    const createdDocument = await EventSubCategoryModel.create(userInput);

    const filter = { _id: convertToObjectId(createdDocument?._id) }; // Add filters if needed
    const projection = {};
    const pipeline = eventSubCategoryPipeline(filter, projection);
    const typeData = await EventSubCategoryModel.aggregate(pipeline);

    // Send a success response with the created document data
    return sendResponse(
        true,
        httpStatusConstants.CREATED,
        `Event sub category entry with name "${userInput?.subCategory}" created successfully.`,
        typeData,
        {},
        request
    );
};

// Export the route wrapped with asyncHandler
export const POST = asyncHandler(handleCreateEventSubCategory);
