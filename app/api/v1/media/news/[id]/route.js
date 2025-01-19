import serviceShared from '@/shared/service.shared';
import schemaShared from '@/shared/schema.shared';
import MediaNewsModel from '@/app/api/v1/media/news/media.news.model';

import asyncHandler from '@/util/asyncHandler';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import convertToObjectId from '@/util/convertToObjectId';
import mediaNewsPipeline from '@/app/api/v1/media/news/media.news.pipeline';

const { idValidationSchema } = schemaShared;

// Named export for the GET request handler
const handleGetNewsById = async (request, context) => {
    // Parse and validate form data
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'get',
        idValidationSchema
    );

    // Define the aggregation pipeline using the validated id
    const filter = { _id: convertToObjectId(userInput?.id) }; // Add filters if needed
    const projection = {};
    const pipeline = mediaNewsPipeline(filter, projection);

    // Use the common fetchEntryById function to retrieve the data
    return serviceShared.fetchEntryById(
        MediaNewsModel,
        pipeline,
        'News',
        request,
        userInput
    );
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetNewsById);
