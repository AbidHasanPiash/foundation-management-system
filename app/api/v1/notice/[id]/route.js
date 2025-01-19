import serviceShared from '@/shared/service.shared';
import NoticeModel from '@/app/api/v1/notice/notice.model';
import schemaShared from '@/shared/schema.shared';

import asyncHandler from '@/util/asyncHandler';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import convertToObjectId from '@/util/convertToObjectId';
import noticePipeline from '@/app/api/v1/notice/notice.pipeline';

const { idValidationSchema } = schemaShared;

// Named export for the GET request handler
const handleGetNoticeById = async (request, context) => {
    // Parse and validate form data
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'get',
        idValidationSchema
    );

    const filter = { _id: convertToObjectId(userInput?.id) };
    const projection = {};
    const pipeline = noticePipeline(filter, projection);

    // Use the common fetchEntryById function to retrieve the data
    return serviceShared.fetchEntryById(
        NoticeModel,
        pipeline,
        'Notice',
        request,
        userInput
    );
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetNoticeById);
