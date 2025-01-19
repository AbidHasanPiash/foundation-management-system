import serviceShared from '@/shared/service.shared';
import EventModel from '@/app/api/v1/event/event.model';

import asyncHandler from '@/util/asyncHandler';

// Named export for the GET request handler
const handleGetEventList = async (request, context) => {
    const pipeline = [
        { $match: { isNewsTack: true } }, // Find document by category
        {
            $project: {
                _id: 1,
                title: 1,
                description: 1,
                banner: { $ifNull: ['$banner.link', ''] }, // Directly set `banner` to `banner.link` or an empty string if null
                links: 1,
                category: 1,
                subCategory: 1,
                status: 1,
                isNewsTack: 1,
                form: 1,
            },
        },
    ];

    return serviceShared.fetchEntryList(
        EventModel,
        pipeline,
        'event newstack',
        request,
        context
    );
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetEventList);
