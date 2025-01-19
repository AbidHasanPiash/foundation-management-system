import mongodb from '@/lib/mongodb';
import statusSchema from '@/app/api/v1/status/status.schema';
import StatusModel from '@/app/api/v1/status/status.model';
import httpStatusConstants from '@/constants/httpStatus.constants';

import asyncHandler from '@/util/asyncHandler';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import sendResponse from '@/util/sendResponse';
import statusPipeline from '@/app/api/v1/status/status.pipeline';

// Named export for the GET request handler
const handleGetStatusByCategory = async (request, context) => {
    // Parse and validate form data
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'get',
        statusSchema.categorySchema
    );

    // Ensure MongoDB is connected
    await mongodb.connect();

    const filter = { category: userInput?.categoryParams };
    const projection = {};
    const pipeline = statusPipeline(filter, projection);
    const data = await StatusModel.aggregate(pipeline);

    // Check if data exists
    if (!data.length) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            `No status with CATEGORY "${userInput?.categoryParams}" available at this time.`,
            {},
            {},
            request
        );
    }

    // Send a success response with the fetched data
    return sendResponse(
        true,
        httpStatusConstants.OK,
        `Status with CATEGORY "${userInput?.categoryParams}" retrieved successfully.`,
        data,
        {},
        request
    );
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetStatusByCategory);
