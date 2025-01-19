import serviceShared from '@/shared/service.shared';
import HomeMessageModel from '@/app/api/v1/home/message/home.message.model';
import schemaShared from '@/shared/schema.shared';

import asyncHandler from '@/util/asyncHandler';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import convertToObjectId from '@/util/convertToObjectId';

const { idValidationSchema } = schemaShared;

// Named export for the GET request handler
const handleGetHomeMessageByType = async (request, context) => {
    // Parse and validate form data
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'get',
        idValidationSchema
    );

    // Define the aggregation pipeline using the validated id
    const pipeline = [
        { $match: { _id: convertToObjectId(userInput?.id) } }, // Find document by id
        {
            $project: {
                _id: 1,
                title: 1,
                name: 1,
                message: 1,
                image: { $ifNull: ['$image.link', ''] }, // Set `image` to `image.link` or an empty string if null
            },
        },
    ];

    // Use the common fetchEntryById function to retrieve the data
    return serviceShared.fetchEntryById(
        HomeMessageModel,
        pipeline,
        'Home page message',
        request,
        userInput
    );
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetHomeMessageByType);
