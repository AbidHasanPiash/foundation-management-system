import httpStatusConstants from '@/constants/httpStatus.constants';
import mongodb from '@/lib/mongodb';

import eventCategoryConstants from '@/app/api/v1/event/category/event.category.constants';
import eventCategorySchema from '@/app/api/v1/event/category/event.category.schema';
import EventCategoryModel from '@/app/api/v1/event/category/event.category.model';

import asyncHandler from '@/util/asyncHandler';
import sendResponse from '@/util/sendResponse';
import validateToken from '@/util/validateToken';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import convertToObjectId from '@/util/convertToObjectId';
import eventCategoryPipeline from '@/app/api/v1/event/category/event.category.pipeline';

// Named export for the POST request handler
const handleCreateEventCategory = async (request, context) => {
    const contentValidationResult = validateUnsupportedContent(
        request,
        eventCategoryConstants.allowedContentTypes
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
        eventCategorySchema.createSchema
    );

    // Check if a document with the specified type already exists
    const existingCategoryType = await EventCategoryModel.exists({
        category: userInput?.category,
    });
    if (existingCategoryType) {
        return sendResponse(
            false,
            httpStatusConstants.CONFLICT,
            `Event category entry with name "${userInput?.category}" already exists.`,
            {},
            {},
            request
        );
    }

    // Create a new "type" document with the provided details
    const createdDocument = await EventCategoryModel.create(userInput);

    const filter = { _id: convertToObjectId(createdDocument?._id) }; // Add filters if needed
    const projection = {};
    const pipeline = eventCategoryPipeline(filter, projection);
    const typeData = await EventCategoryModel.aggregate(pipeline);

    // Send a success response with the created document data
    return sendResponse(
        true,
        httpStatusConstants.CREATED,
        `Event category entry with name "${userInput?.category}" created successfully.`,
        typeData,
        {},
        request
    );
};

// Export the route wrapped with asyncHandler
export const POST = asyncHandler(handleCreateEventCategory);
