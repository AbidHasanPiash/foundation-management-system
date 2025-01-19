import serviceShared from '@/shared/service.shared';
import MediaVideoModel from '@/app/api/v1/media/video/media.video.model';

import asyncHandler from '@/util/asyncHandler';
import mediaVideoPipeline from '@/app/api/v1/media/video/media.video.pipeline';

// Named export for the GET request handler
const handleGetMediaVideos = async (request, context) => {
    const filter = {}; // Add filters if needed
    const projection = {};
    const pipeline = mediaVideoPipeline(filter, projection);

    return serviceShared.fetchEntryList(
        MediaVideoModel,
        pipeline,
        'media videos',
        request,
        context
    );
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetMediaVideos);
