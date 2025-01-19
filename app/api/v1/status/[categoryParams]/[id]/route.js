import mongodb from '@/lib/mongodb';
import StatusModel from '@/app/api/v1/status/status.model';
import httpStatusConstants from '@/constants/httpStatus.constants';
import statusSchema from '@/app/api/v1/status/status.schema';

import asyncHandler from '@/util/asyncHandler';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import sendResponse from '@/util/sendResponse';
import statusPipeline from '@/app/api/v1/status/status.pipeline';

// Named export for the GET request handler
const handleGetStatusByCategoryAndId = async (request, context) => {
    // Parse and validate form data
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'get',
        statusSchema.categoryAndIdSchema
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
            `Status entry with CATEGORY "${userInput.categoryParams}" and ID "${userInput?.id}" not found.`,
            {},
            {},
            request
        );
    }

    // Send a success response with the fetched data
    return sendResponse(
        true,
        httpStatusConstants.OK,
        `Status entry with CATEGORY "${userInput.categoryParams}" and ID "${userInput?.id}" fetched successfully.`,
        data[0],
        {},
        request
    );
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetStatusByCategoryAndId);
