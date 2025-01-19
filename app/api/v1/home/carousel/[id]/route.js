import schemaShared from '@/shared/schema.shared';
import serviceShared from '@/shared/service.shared';
import HomeCarouselModel from '@/app/api/v1/home/carousel/home.carousel.model';

import asyncHandler from '@/util/asyncHandler';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import convertToObjectId from '@/util/convertToObjectId';
import homeCarouselPipeline from '@/app/api/v1/home/carousel/home.carousel.pipeline';

const { idValidationSchema } = schemaShared;

// Named export for the GET request handler
const handleGetHomeCarouselByType = async (request, context) => {
    // Parse and validate form data
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'get',
        idValidationSchema
    );

    const filter = { _id: convertToObjectId(userInput?.id) };
    const projection = {};
    const pipeline = homeCarouselPipeline(filter, projection);

    // Use the common fetchEntryById function to retrieve the data
    return serviceShared.fetchEntryById(
        HomeCarouselModel,
        pipeline,
        'Home page carousel',
        request,
        userInput
    );
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetHomeCarouselByType);
