import serviceShared from '@/shared/service.shared';
import HomeCarouselModel from '@/app/api/v1/home/carousel/home.carousel.model';

import asyncHandler from '@/util/asyncHandler';
import homeCarouselPipeline from '@/app/api/v1/home/carousel/home.carousel.pipeline';

// Named export for the GET request handler
const handleGeHomeCarousel = async (request, context) => {
    const filter = {};
    const projection = {};
    const pipeline = homeCarouselPipeline(filter, projection);

    return serviceShared.fetchEntryList(
        HomeCarouselModel,
        pipeline,
        'home page carousel',
        request,
        context
    );
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGeHomeCarousel);
