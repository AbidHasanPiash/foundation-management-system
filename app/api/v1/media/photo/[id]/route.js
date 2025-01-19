import serviceShared from '@/shared/service.shared';
import MediaPhotoModel from '../media.photo.model';
import schemaShared from '@/shared/schema.shared';

import asyncHandler from '@/util/asyncHandler';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import convertToObjectId from '@/util/convertToObjectId';
import mediaPhotoPipeline from '@/app/api/v1/media/photo/media.photo.pipeline';

const { idValidationSchema } = schemaShared;

// Named export for the GET request handler
const handleGetMediaPhotosById = async (request, context) => {
    // Parse and validate form data
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'get',
        idValidationSchema
    );

    const filter = { _id: convertToObjectId(userInput?.id) }; // Add filters if needed
    const projection = { extraField: 1 };
    const pipeline = mediaPhotoPipeline(filter, projection);

    // Use the common fetchEntryById function to retrieve the data
    return serviceShared.fetchEntryById(
        MediaPhotoModel,
        pipeline,
        'Media photos',
        request,
        userInput
    );
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetMediaPhotosById);
