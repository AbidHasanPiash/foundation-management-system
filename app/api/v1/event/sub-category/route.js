import serviceShared from '@/shared/service.shared';
import EventSubCategoryModel from '@/app/api/v1/event/sub-category/event.sub.category.model';

import asyncHandler from '@/util/asyncHandler';
import eventSubCategoryPipeline from '@/app/api/v1/event/sub-category/event.sub.category.pipeline';

// Named export for the GET request handler
const handleGetEventSubCategoryList = async (request, context) => {
    const filter = {}; // Add filters if needed
    const projection = {};
    const pipeline = eventSubCategoryPipeline(filter, projection);

    return serviceShared.fetchEntryList(
        EventSubCategoryModel,
        pipeline,
        'event sub category',
        request,
        context
    );
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetEventSubCategoryList);
