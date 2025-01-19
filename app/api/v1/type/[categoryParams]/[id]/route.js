import mongodb from '@/lib/mongodb';
import TypeModel from '@/app/api/v1/type/type.model';
import httpStatusConstants from '@/constants/httpStatus.constants';
import typeSchema from '@/app/api/v1/type/type.schema';

import asyncHandler from '@/util/asyncHandler';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import sendResponse from '@/util/sendResponse';
import typePipeline from '@/app/api/v1/type/type.pipeline';

// Named export for the GET request handler
const handleGetTypeByCategoryAndId = async (request, context) => {
    // Parse and validate form data
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'get',
        typeSchema.categoryAndIdSchema
    );

    // Ensure MongoDB is connected
    await mongodb.connect();

    const filter = { category: userInput?.categoryParams, _id: userInput?.id }; // Add filters if needed
    const projection = {};
    const pipeline = typePipeline(filter, projection);

    // Fetch data using the custom aggregation pipeline
    const data = await TypeModel.aggregate(pipeline);

    // Check if data exists
    if (!data.length) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            `Type entry with CATEGORY "${userInput.categoryParams}" and ID "${userInput?.id}" not found.`,
            {},
            {},
            request
        );
    }

    // Send a success response with the fetched data
    return sendResponse(
        true,
        httpStatusConstants.OK,
        `Type entry with CATEGORY "${userInput.categoryParams}" and ID "${userInput?.id}" fetched successfully.`,
        data[0],
        {},
        request
    );
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetTypeByCategoryAndId);
