import mongodb from '@/lib/mongodb';
import FormSpecialScholarshipModel from '@/app/api/v1/event/form/special/scholarship/form.special.scholarship.model';
import httpStatusConstants from '@/constants/httpStatus.constants';

import asyncHandler from '@/util/asyncHandler';
import sendResponse from '@/util/sendResponse';

// Named export for the GET request handler
const handleGetAllFormSpecialScholarshipData = async (request, context) => {
    // Connect to MongoDB
    await mongodb.connect();

    // Extract ID from the query parameters, if specified
    const { id } = context.params || {};

    // Query to retrieve all data entries
    const query = id ? { _id: id } : {};

    // Fetch the document(s) with only the 'data' field
    const document = await FormSpecialScholarshipModel.findOne(query, {
        data: 1,
    }).lean();

    // Check if document was found
    if (!document || !document.data) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            `No scholarship form entries found.`,
            {},
            {},
            request
        );
    }

    // Return only the `data` array directly
    return sendResponse(
        true,
        httpStatusConstants.OK,
        `Successfully retrieved scholarship form data.`,
        document.data,
        {},
        request
    );
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetAllFormSpecialScholarshipData);
