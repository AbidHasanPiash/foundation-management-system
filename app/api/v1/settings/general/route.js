import mongodb from '@/lib/mongodb';
import SettingsGeneralModel from '@/app/api/v1/settings/general/settings.general.model';
import httpStatusConstants from '@/constants/httpStatus.constants';

import asyncHandler from '@/util/asyncHandler';
import settingsGeneralPipeline from '@/app/api/v1/settings/general/settings.general.pipeline';
import sendResponse from '@/util/sendResponse';

// Named export for the GET request handler
const handleGetSettingsGeneral = async (request, context) => {
    const filter = {};
    const projection = {};
    const pipeline = settingsGeneralPipeline(filter, projection);

    // Ensure MongoDB is connected
    await mongodb.connect();

    // Fetch data using the custom aggregation pipeline
    const data = await SettingsGeneralModel.aggregate(pipeline);

    // Check if data exists
    if (!data.length) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            'General settings entry not found.',
            {},
            {},
            request
        );
    }

    // Send a success response with the fetched data
    return sendResponse(
        true,
        httpStatusConstants.OK,
        'General settings entry fetched successfully.',
        data[0],
        {},
        request
    );
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetSettingsGeneral);
