import serviceShared from '@/shared/service.shared';
import EventCategoryModel from '@/app/api/v1/event/category/event.category.model';

import asyncHandler from '@/util/asyncHandler';
import eventCategoryPipeline from '@/app/api/v1/event/category/event.category.pipeline';

// Named export for the GET request handler
const handleGetEventCategoryList = async (request, context) => {
    const filter = {}; // Add filters if needed
    const projection = {};
    const pipeline = eventCategoryPipeline(filter, projection);

    return serviceShared.fetchEntryList(
        EventCategoryModel,
        pipeline,
        'event',
        request,
        context
    );
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetEventCategoryList);
