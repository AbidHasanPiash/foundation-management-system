import serviceShared from '@/shared/service.shared';
import EventSubCategoryModel from '@/app/api/v1/event/sub-category/event.sub.category.model';
import schemaShared from '@/shared/schema.shared';

import asyncHandler from '@/util/asyncHandler';
import convertToObjectId from '@/util/convertToObjectId';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import eventSubCategoryPipeline from '@/app/api/v1/event/sub-category/event.sub.category.pipeline';

const { idValidationSchema } = schemaShared;

// Named export for the GET request handler
const handleGetEventSubCategoryById = async (request, context) => {
    // Parse and validate form data
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'get',
        idValidationSchema
    );

    const filter = { _id: convertToObjectId(userInput?.id) }; // Add filters if needed
    const projection = {};
    const pipeline = eventSubCategoryPipeline(filter, projection);

    // Use the common fetchEntryById function to retrieve the data
    return serviceShared.fetchEntryById(
        EventSubCategoryModel,
        pipeline,
        'Event sub category',
        request,
        userInput
    );
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetEventSubCategoryById);
