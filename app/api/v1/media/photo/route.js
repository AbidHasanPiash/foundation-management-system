import serviceShared from '@/shared/service.shared';
import MediaPhotoModel from '@/app/api/v1/media/photo/media.photo.model';

import asyncHandler from '@/util/asyncHandler';
import mediaPhotoPipeline from '@/app/api/v1/media/photo/media.photo.pipeline';

// Named export for the GET request handler
const handleGetMediaPhotos = async (request, context) => {
    const filter = {}; // Add filters if needed
    const projection = { extraField: 1 };
    const pipeline = mediaPhotoPipeline(filter, projection);

    return serviceShared.fetchEntryList(
        MediaPhotoModel,
        pipeline,
        'media photos',
        request,
        context
    );
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetMediaPhotos);
