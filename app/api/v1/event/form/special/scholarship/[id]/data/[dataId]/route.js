import mongodb from '@/lib/mongodb';
import FormSpecialScholarshipModel from '@/app/api/v1/event/form/special/scholarship/form.special.scholarship.model';
import httpStatusConstants from '@/constants/httpStatus.constants';

import asyncHandler from '@/util/asyncHandler';
import sendResponse from '@/util/sendResponse';

const handleGetSpecificFormSpecialScholarshipData = async (
    request,
    context
) => {
    // Connect to MongoDB
    await mongodb.connect();

    // Extract the main document ID and the specific data ID from the query parameters
    const { id, dataId } = context.params || {};

    // Check if both ID and dataId are provided
    if (!id || !dataId) {
        return sendResponse(
            false,
            httpStatusConstants.BAD_REQUEST,
            `Scholarship ID and scholarship data ID are required.`,
            {},
            {},
            request
        );
    }

    // Query to find the document with the specified main ID
    const document = await FormSpecialScholarshipModel.findOne(
        { _id: id },
        { data: 1 }
    ).lean();

    // Check if the document was found
    if (!document || !document.data) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            `Scholarship form entry with ID "${id}" not found.`,
            {},
            {},
            request
        );
    }

    // Find the specific entry within the data array by its _id
    const specificData = document.data.find(
        (entry) => entry._id.toString() === dataId
    );

    // Check if the specific data entry was found
    if (!specificData) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            `Data entry with ID "${dataId}" not found in document "${id}".`,
            {},
            {},
            request
        );
    }

    // Return the specific data entry
    return sendResponse(
        true,
        httpStatusConstants.OK,
        `Successfully retrieved data entry with ID "${dataId}".`,
        specificData,
        {},
        request
    );
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetSpecificFormSpecialScholarshipData);
