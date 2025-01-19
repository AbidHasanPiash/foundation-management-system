import serviceShared from '@/shared/service.shared';
import NoticeModel from '@/app/api/v1/notice/notice.model';

import asyncHandler from '@/util/asyncHandler';
import noticePipeline from '@/app/api/v1/notice/notice.pipeline';

// Named export for the GET request handler
const handleGetNoticeList = async (request, context) => {
    const filter = {};
    const projection = {};
    const pipeline = noticePipeline(filter, projection);

    return serviceShared.fetchEntryList(
        NoticeModel,
        pipeline,
        'notice',
        request,
        context
    );
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetNoticeList);
