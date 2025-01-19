import serviceShared from '@/shared/service.shared';
import schemaShared from '@/shared/schema.shared';
import MediaVideoModel from '../media.video.model';

import asyncHandler from '@/util/asyncHandler';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import convertToObjectId from '@/util/convertToObjectId';
import mediaVideoPipeline from '@/app/api/v1/media/video/media.video.pipeline';

const { idValidationSchema } = schemaShared;

// Named export for the GET request handler
const handleGetMediaVideosById = async (request, context) => {
    // Parse and validate form data
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'get',
        idValidationSchema
    );

    const filter = { _id: convertToObjectId(userInput?.id) }; // Add filters if needed
    const projection = {};
    const pipeline = mediaVideoPipeline(filter, projection);

    // Use the common fetchEntryById function to retrieve the data
    return serviceShared.fetchEntryById(
        MediaVideoModel,
        pipeline,
        'Media videos',
        request,
        userInput
    );
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetMediaVideosById);
