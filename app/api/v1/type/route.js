import TypeModel from '@/app/api/v1/type/type.model';
import serviceShared from '@/shared/service.shared';

import asyncHandler from '@/util/asyncHandler';
import typePipeline from '@/app/api/v1/type/type.pipeline';

// Named export for the GET request handler
const handleGetMemberTypeList = async (request, context) => {
    const filter = {}; // Add filters if needed
    const projection = {};
    const pipeline = typePipeline(filter, projection);

    return serviceShared.fetchEntryList(
        TypeModel,
        pipeline,
        'type',
        request,
        context
    );
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetMemberTypeList);
