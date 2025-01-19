import mongodb from '@/lib/mongodb';
import aboutSchema from '@/app/api/v1/about/about.schema';
import AboutModel from '@/app/api/v1/about/about.model';
import httpStatusConstants from '@/constants/httpStatus.constants';

import asyncHandler from '@/util/asyncHandler';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import sendResponse from '@/util/sendResponse';
import aboutPipeline from '@/app/api/v1/about/about.pipeline';

// Named export for the GET request handler
const handleGetTypeByCategory = async (request, context) => {
    // Parse and validate form data
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'get',
        aboutSchema.categorySchema
    );

    // Ensure MongoDB is connected
    await mongodb.connect();

    const filter = { category: userInput?.categoryParams }; // Add filters if needed
    const projection = {};
    const pipeline = aboutPipeline(filter, projection);
    const data = await AboutModel.aggregate(pipeline);

    // Check if data exists
    if (!data.length) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            `No about entry with CATEGORY "${userInput?.categoryParams}" available at this time.`,
            {},
            {},
            request
        );
    }

    // Send a success response with the fetched data
    return sendResponse(
        true,
        httpStatusConstants.OK,
        `About entry list with CATEGORY "${userInput?.categoryParams}" retrieved successfully.`,
        data,
        {},
        request
    );
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetTypeByCategory);
