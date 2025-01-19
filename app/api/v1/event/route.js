import EventModel from '@/app/api/v1/event/event.model';
import serviceShared from '@/shared/service.shared';

import asyncHandler from '@/util/asyncHandler';
import convertToObjectId from '@/util/convertToObjectId';
import eventPipeline from '@/app/api/v1/event/event.pipeline';

// Named export for the GET request handler
const handleGetEventList = async (request, context) => {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.search);
    const queryObject = Object.fromEntries(searchParams.entries());

    const { categoryId, subcategoryId } = queryObject;

    // Build the $match stage dynamically based on query parameters
    const matchStage = {};
    if (categoryId) {
        matchStage.categoryId = convertToObjectId(categoryId); // Match categoryId if provided
    }
    if (subcategoryId) {
        matchStage.subcategoryId = convertToObjectId(subcategoryId); // Match subcategoryId if provided
    }

    const filter = {}; // Add filters if needed
    const projection = { extraField: 1 };
    const pipeline = eventPipeline(filter, projection);

    return serviceShared.fetchEntryList(
        EventModel,
        pipeline,
        'event',
        request,
        context
    );
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetEventList);
