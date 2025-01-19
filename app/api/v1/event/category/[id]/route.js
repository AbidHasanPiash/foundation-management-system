import schemaShared from '@/shared/schema.shared';
import serviceShared from '@/shared/service.shared';
import EventCategoryModel from '@/app/api/v1/event/category/event.category.model';

import asyncHandler from '@/util/asyncHandler';
import convertToObjectId from '@/util/convertToObjectId';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import eventCategoryPipeline from '@/app/api/v1/event/category/event.category.pipeline';

const { idValidationSchema } = schemaShared;

// Named export for the GET request handler
const handleGetEventCategoryById = async (request, context) => {
    // Parse and validate form data
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'get',
        idValidationSchema
    );

    const filter = { _id: convertToObjectId(userInput?.id) }; // Add filters if needed
    const projection = {};
    const pipeline = eventCategoryPipeline(filter, projection);

    // Use the common fetchEntryById function to retrieve the data
    return serviceShared.fetchEntryById(
        EventCategoryModel,
        pipeline,
        'Event category',
        request,
        userInput
    );
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetEventCategoryById);
