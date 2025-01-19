import serviceShared from '@/shared/service.shared';
import MediaNewsModel from '@/app/api/v1/media/news/media.news.model';

import asyncHandler from '@/util/asyncHandler';
import mediaNewsPipeline from '@/app/api/v1/media/news/media.news.pipeline';

// Named export for the GET request handler
const handleGetNewsList = async (request, context) => {
    const filter = {}; // Add filters if needed
    const projection = { extraField: 1 };
    const pipeline = mediaNewsPipeline(filter, projection);

    return serviceShared.fetchEntryList(
        MediaNewsModel,
        pipeline,
        'news',
        request,
        context
    );
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetNewsList);
