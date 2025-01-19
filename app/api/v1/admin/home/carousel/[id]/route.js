import httpStatusConstants from '@/constants/httpStatus.constants';
import mongodb from '@/lib/mongodb';
import localFileOperations from '@/util/localFileOperations';
import homeCarouselSchema from '@/app/api/v1/home/carousel/home.carousel.schema';
import HomeCarouselModel from '@/app/api/v1/home/carousel/home.carousel.model';
import homeCarouselConstants from '@/app/api/v1/home/carousel/home.carousel.constants';
import serviceShared from '@/shared/service.shared';
import schemaShared from '@/shared/schema.shared';

import asyncHandler from '@/util/asyncHandler';
import sendResponse from '@/util/sendResponse';
import validateToken from '@/util/validateToken';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import convertToObjectId from '@/util/convertToObjectId';
import homeCarouselPipeline from '@/app/api/v1/home/carousel/home.carousel.pipeline';

const { idValidationSchema } = schemaShared;

// Named export for the PATCH request handler
const handleUpdateHomePageCarousel = async (request, context) => {
    // Check if the "home page carousel" type already exists in MongoDB
    await mongodb.connect();

    // Validate admin
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response; // Return early with the authorization failure response
    }

    const contentValidationResult = validateUnsupportedContent(
        request,
        homeCarouselConstants.allowedContentTypes
    );
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'update',
        homeCarouselSchema.updateSchema
    );

    // Retrieve existing document and handle file replacement if needed
    const existingHomeCarouselData = await HomeCarouselModel.findOne({
        _id: convertToObjectId(userInput?.id),
    });
    if (!existingHomeCarouselData) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            `Home page carousel entry with id "${userInput?.id}" not found.`,
            {},
            {},
            request
        );
    }

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

    // Handle file replacement if a new file is provided
    let image;
    const newFile = userInput[homeCarouselConstants.fileFieldName][0];
    if (newFile) {
        await localFileOperations.deleteFile(
            existingHomeCarouselData?.image?.id
        ); // Delete old file

        const { fileId, fileLink } = await localFileOperations.uploadFile(
            request,
            newFile
        ); // Upload new file

        delete userInput.image;

        image = {
            id: fileId,
            link: fileLink,
        };
    }

    // Filter `userInput` to only include fields with non-null values
    const fieldsToUpdate = Object.keys(userInput).reduce((acc, key) => {
        if (userInput[key] !== undefined && userInput[key] !== null) {
            acc[key] = userInput[key];
        }
        return acc;
    }, {});

    // Add the banner field if it has been replaced
    if (image && image.link !== existingHomeCarouselData.image.link) {
        fieldsToUpdate.image = image;
    }

    // Update the document with the filtered data
    const updatedDocument = await HomeCarouselModel.findOneAndUpdate(
        { _id: convertToObjectId(userInput?.id) }, // Find document by id
        { $set: fieldsToUpdate },
        { new: true, projection: { _id: 1, title: 1, 'image.link': 1 } }
    ).lean();

    if (!updatedDocument) {
        return sendResponse(
            false,
            httpStatusConstants.INTERNAL_SERVER_ERROR,
            `Failed to update home page carousel entry with id "${userInput?.id}".`,
            {},
            {},
            request
        );
    }

    const filter = { _id: convertToObjectId(updatedDocument?._id) };
    const projection = {};
    const pipeline = homeCarouselPipeline(filter, projection);
    const homeCarouselData = await HomeCarouselModel.aggregate(pipeline);

    // Send a success response with the created document data
    return sendResponse(
        true,
        httpStatusConstants.CREATED,
        `Home page carousel entry with id "${userInput?.id}" updated successfully.`,
        homeCarouselData,
        {},
        request
    );
};

// Named export for the POST request handler
const handleDeleteHomePageCarousel = async (request, context) => {
    return serviceShared.deleteEntry(
        request,
        context,
        idValidationSchema,
        HomeCarouselModel,
        'image.id', // Projection field for file deletion
        `Home page carousel`
    );
};

// Export the route wrapped with asyncHandler
export const PATCH = asyncHandler(handleUpdateHomePageCarousel);

// Export the route wrapped with asyncHandler
export const DELETE = asyncHandler(handleDeleteHomePageCarousel);
