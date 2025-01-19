import MemberModel from '@/app/api/v1/member/member.model';
import schemaShared from '@/shared/schema.shared';
import mongodb from '@/lib/mongodb';
import httpStatusConstants from '@/constants/httpStatus.constants';

import asyncHandler from '@/util/asyncHandler';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import sendResponse from '@/util/sendResponse';

// Named export for the GET request handler
const handleGetMember = async (request, context) => {
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'get',
        schemaShared.pagination
    );

    const pipeline = [
        // Step 1: Join with the `Types` collection to get `typeDetails`
        {
            $lookup: {
                from: 'types', // The collection name for `TypeModel`
                localField: 'typeId',
                foreignField: '_id',
                as: 'typeDetails',
            },
        },
        // Step 2: Flatten the `typeDetails` array
        {
            $unwind: '$typeDetails',
        },
        // Step 3: Group by `typeDetails.type` and calculate total members
        {
            $group: {
                _id: '$typeDetails.type', // Group by type
                total: { $sum: 1 }, // Count the number of members for each type
            },
        },
        // Step 4: Transform the data structure to include "details" and calculate the overall total
        {
            $group: {
                _id: null, // Combine all groups into one document
                total: { $sum: '$total' }, // Calculate overall total
                summary: {
                    $push: {
                        type: '$_id',
                        total: '$total',
                    },
                },
            },
        },
        // Step 5: Project the final structure
        {
            $project: {
                _id: 0,
                total: 1,
                summary: 1,
            },
        },
    ];

    const { page, limit, isActive } = userInput.query || {};
    const currentPage = page !== undefined ? parseInt(page, 10) : null;
    const pageSize =
        limit !== undefined ? parseInt(limit, 10) : currentPage ? 10 : null; // Default limit if page exists

    // Add isActive filtering to the pipeline if provided
    if (isActive) {
        const isActiveBool = isActive === 'true'; // Convert isActive to boolean
        pipeline.unshift({ $match: { isActive: isActiveBool } }); // Add match stage at the beginning of the pipeline
    }

    // Ensure MongoDB is connected
    await mongodb.connect();

    // Add pagination stages to the pipeline dynamically if applicable
    if (currentPage && pageSize) {
        pipeline.push(
            { $skip: (currentPage - 1) * pageSize },
            { $limit: pageSize }
        );
    }

    // Fetch data using the aggregation pipeline
    const data = await MemberModel.aggregate(pipeline);

    // Calculate total count if pagination is applied
    const totalCount =
        currentPage && pageSize
            ? await MemberModel.countDocuments(pipeline[0]?.$match || {})
            : data.length;

    // Check if data exists
    if (!data.length) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            'No member available at this time.',
            {},
            {},
            request
        );
    }

    // Prepare pagination metadata if applicable
    const pagination =
        currentPage && pageSize
            ? {
                  currentPage,
                  pageSize,
                  totalPages: Math.ceil(totalCount / pageSize),
                  totalCount,
              }
            : null;

    // Send a success response with the fetched data and pagination metadata
    return sendResponse(
        true,
        httpStatusConstants.OK,
        'Member retrieved successfully.',
        data[0],
        pagination,
        request
    );
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetMember);
