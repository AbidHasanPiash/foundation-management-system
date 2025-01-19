import StatusModel from './status.model';
import serviceShared from '@/shared/service.shared';

import asyncHandler from '@/util/asyncHandler';
import statusPipeline from '@/app/api/v1/status/status.pipeline';

// Named export for the GET request handler
const handleGetStatusList = async (request, context) => {
    const filter = {};
    const projection = {};
    const pipeline = statusPipeline(filter, projection);

    return serviceShared.fetchEntryList(
        StatusModel,
        pipeline,
        'status',
        request,
        context
    );
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetStatusList);
