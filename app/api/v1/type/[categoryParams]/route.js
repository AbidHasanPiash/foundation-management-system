import mongodb from '@/lib/mongodb';
import typeSchema from '@/app/api/v1/type/type.schema';
import TypeModel from '@/app/api/v1/type/type.model';
import httpStatusConstants from '@/constants/httpStatus.constants';

import asyncHandler from '@/util/asyncHandler';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import sendResponse from '@/util/sendResponse';
import typePipeline from '@/app/api/v1/type/type.pipeline';

// Named export for the GET request handler
const handleGetTypeByCategory = async (request, context) => {
    // Parse and validate form data
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'get',
        typeSchema.categorySchema
    );

    // Ensure MongoDB is connected
    await mongodb.connect();

    const filter = { category: userInput?.categoryParams }; // Add filters if needed
    const projection = {};
    const pipeline = typePipeline(filter, projection);

    // Fetch data using the custom aggregation pipeline
    const data = await TypeModel.aggregate(pipeline);

    // Check if data exists
    if (!data.length) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            `No type with CATEGORY "${userInput?.categoryParams}" available at this time.`,
            {},
            {},
            request
        );
    }

    // Send a success response with the fetched data
    return sendResponse(
        true,
        httpStatusConstants.OK,
        `Type with CATEGORY "${userInput?.categoryParams}" retrieved successfully.`,
        data,
        {},
        request
    );
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetTypeByCategory);
