import mongodb from '@/lib/mongodb';
import SettingsLegalDocumentModel from '@/app/api/v1/settings/legal/document/settings.legal.document.model';
import httpStatusConstants from '@/constants/httpStatus.constants';

import asyncHandler from '@/util/asyncHandler';
import settingsLegalDocumentPipeline from '@/app/api/v1/settings/legal/document/settings.legal.document.pipeline';
import sendResponse from '@/util/sendResponse';

// Named export for the GET request handler
const handleGetSettingsLegalDocument = async (request, context) => {
    const filter = {};
    const projection = {};
    const pipeline = settingsLegalDocumentPipeline(filter, projection);

    // Ensure MongoDB is connected
    await mongodb.connect();

    // Fetch data using the custom aggregation pipeline
    const data = await SettingsLegalDocumentModel.aggregate(pipeline);

    // Check if data exists
    if (!data.length) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            'Settings legal document entry not found.',
            {},
            {},
            request
        );
    }

    // Send a success response with the fetched data
    return sendResponse(
        true,
        httpStatusConstants.OK,
        'Settings legal document entry fetched successfully.',
        data[0],
        {},
        request
    );
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetSettingsLegalDocument);
