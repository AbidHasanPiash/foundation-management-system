import AboutModel from '@/app/api/v1/about/about.model';
import serviceShared from '@/shared/service.shared';

import asyncHandler from '@/util/asyncHandler';
import aboutPipeline from '@/app/api/v1/about/about.pipeline';

// Named export for the GET request handler
const handleGetAboutList = async (request, context) => {
    const filter = {}; // Add filters if needed
    const projection = {};
    const pipeline = aboutPipeline(filter, projection);

    return serviceShared.fetchEntryList(
        AboutModel,
        pipeline,
        'about',
        request,
        context
    );
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetAboutList);
