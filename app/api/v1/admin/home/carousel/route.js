import httpStatusConstants from '@/constants/httpStatus.constants';
import mongodb from '@/lib/mongodb';
import localFileOperations from '@/util/localFileOperations';
import homeCarouselConstants from '@/app/api/v1/home/carousel/home.carousel.constants';
import homeCarouselSchema from '@/app/api/v1/home/carousel/home.carousel.schema';
import HomeCarouselModel from '@/app/api/v1/home/carousel/home.carousel.model';

import asyncHandler from '@/util/asyncHandler';
import sendResponse from '@/util/sendResponse';
import validateToken from '@/util/validateToken';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import convertToObjectId from '@/util/convertToObjectId';
import homeCarouselPipeline from '@/app/api/v1/home/carousel/home.carousel.pipeline';

// Named export for the POST request handler
const handleCreateHomeCarousel = async (request, context) => {
    const contentValidationResult = validateUnsupportedContent(
        request,
        homeCarouselConstants.allowedContentTypes
    );
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Check if the "home page carousel" type already exists in MongoDB
    await mongodb.connect();

    // Validate admin
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response; // Return early with the authorization failure response
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'create',
        homeCarouselSchema.createSchema
    );

    if (await HomeCarouselModel.exists({ title: userInput?.title })) {
        return sendResponse(
            false,
            httpStatusConstants.CONFLICT,
            `Home page carousel entry with title "${userInput?.title}" already exists.`,
            {},
            {},
            request
        );
    }

    // Upload file and generate link
    const { fileId, fileLink } = await localFileOperations.uploadFile(
        request,
        userInput[homeCarouselConstants.fileFieldName][0]
    );

    // Create a new "home page carousel" document with image details
    const createdDocument = await HomeCarouselModel.create({
        ...userInput,
        image: { id: fileId, link: fileLink },
    });

    const filter = { _id: convertToObjectId(createdDocument?._id) };
    const projection = {};
    const pipeline = homeCarouselPipeline(filter, projection);
    const homeCarouselData = await HomeCarouselModel.aggregate(pipeline);

    // Send a success response with the created document data
    return sendResponse(
        true,
        httpStatusConstants.CREATED,
        `Home page carousel entry with title "${userInput?.title}" created successfully.`,
        homeCarouselData,
        {},
        request
    );
};

// Export the route wrapped with asyncHandler
export const POST = asyncHandler(handleCreateHomeCarousel);
