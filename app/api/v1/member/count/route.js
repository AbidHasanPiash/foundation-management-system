import mongodb from '@/lib/mongodb';
import httpStatusConstants from '@/constants/httpStatus.constants';
import TypeModel from '@/app/api/v1/type/type.model';
import typeConstants from '@/app/api/v1/type/type.constants';

import sendResponse from '@/util/sendResponse';
import asyncHandler from '@/util/asyncHandler';

const handleGetMemberCount = async (request) => {
    // Connect to MongoDB
    await mongodb.connect();

    // Get all member types
    const memberTypes = await TypeModel.aggregate([
        {
            $match: {
                category: typeConstants.categories.member, // Filter to include only types from specified category
            },
        },
        {
            $lookup: {
                from: 'members',
                localField: '_id',
                foreignField: 'typeId',
                as: 'members',
            },
        },
        {
            $project: {
                _id: 1, // Include _id to identify the type in the results
                type: { $ifNull: ['$type', 'Unknown Type'] },
                count: { $size: '$members' }, // Count the number of members in each type
            },
        },
        {
            $group: {
                _id: null,
                types: {
                    $push: { _id: '$_id', type: '$type', count: '$count' },
                },
                total: { $sum: '$count' },
            },
        },
        {
            $project: {
                types: {
                    $concatArrays: [
                        [{ type: 'Total', count: '$total' }],
                        '$types',
                    ],
                },
            },
        },
        {
            $unwind: '$types',
        },
        {
            $replaceRoot: { newRoot: '$types' },
        },
    ]);

    if (!memberTypes.length) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            'No member types found.',
            {},
            {},
            request
        );
    }

    // Send a success response with the member count data by type
    return sendResponse(
        true,
        httpStatusConstants.OK,
        'Member count by type fetched successfully.',
        memberTypes,
        {},
        request
    );
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetMemberCount);
