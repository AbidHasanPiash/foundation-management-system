import serviceShared from '@/shared/service.shared';
import EventModel from '@/app/api/v1/event/event.model';
import schemaShared from '@/shared/schema.shared';

import asyncHandler from '@/util/asyncHandler';
import convertToObjectId from '@/util/convertToObjectId';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';

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

    // Define the aggregation pipeline using the validated id and isNewsTack filter
    const pipeline = [
        {
            $match: {
                _id: convertToObjectId(userInput?.id),
                isNewsTack: true,
            },
        },
        {
            $project: {
                _id: 1,
                title: 1,
                description: 1,
                banner: { $ifNull: ['$banner.link', ''] }, // Set `banner` to `banner.link` or empty string if null
                links: 1,
                category: 1,
                subCategory: 1,
                status: 1,
                isNewsTack: 1,
                form: 1,
            },
        },
    ];

    // Use the common fetchEntryById function to retrieve the data
    return serviceShared.fetchEntryById(
        EventModel,
        pipeline,
        'Event newstack',
        request,
        userInput
    );
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetEventById);
