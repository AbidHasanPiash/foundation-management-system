import serviceShared from '@/shared/service.shared';
import HomeMessageModel from '@/app/api/v1/home/message/home.message.model';

import asyncHandler from '@/util/asyncHandler';

// Named export for the GET request handler
const handleGeHomeMessage = async (request, context) => {
    const pipeline = [
        { $match: {} }, // Find document by type
        {
            $project: {
                _id: 1,
                title: 1,
                name: 1,
                message: 1,
                image: '$image.link', // Map `image.link` directly to `image`
            },
        },
    ];

    return serviceShared.fetchEntryList(
        HomeMessageModel,
        pipeline,
        'home page message',
        request,
        context
    );
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGeHomeMessage);
