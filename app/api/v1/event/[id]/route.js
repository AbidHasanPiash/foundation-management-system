import schemaShared from '@/shared/schema.shared';
import serviceShared from '@/shared/service.shared';
import EventModel from '@/app/api/v1/event/event.model';

import asyncHandler from '@/util/asyncHandler';
import convertToObjectId from '@/util/convertToObjectId';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import eventPipeline from '@/app/api/v1/event/event.pipeline';

const { idValidationSchema } = schemaShared;

// Named export for the GET request handler
const handleGetEventById = async (request, context) => {
    // Parse and validate form data
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'get',
        idValidationSchema
    );

    const filter = { _id: convertToObjectId(userInput?.id) }; // Add filters if needed
    const projection = {};
    const pipeline = eventPipeline(filter, projection);

    // Use the common fetchEntryById function to retrieve the data
    return serviceShared.fetchEntryById(
        EventModel,
        pipeline,
        'Event',
        request,
        userInput
    );
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetEventById);
