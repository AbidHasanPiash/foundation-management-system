import httpStatusConstants from '@/constants/httpStatus.constants';
import mongodb from '@/lib/mongodb';
import localFileOperations from '@/util/localFileOperations';
import mediaPhotoConstants from '@/app/api/v1/media/photo/media.photo.constants';
import mediaPhotoSchema from '@/app/api/v1/media/photo/media.photo.schema';
import MediaPhotoModel from '@/app/api/v1/media/photo/media.photo.model';

import asyncHandler from '@/util/asyncHandler';
import sendResponse from '@/util/sendResponse';
import validateToken from '@/util/validateToken';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import convertToObjectId from '@/util/convertToObjectId';
import mediaPhotoPipeline from '@/app/api/v1/media/photo/media.photo.pipeline';
import MediaNewsModel from '@/app/api/v1/media/news/media.news.model';

// Named export for the POST request handler
const handleCreateMediaPhoto = async (request, context) => {
    const contentValidationResult = validateUnsupportedContent(
        request,
        mediaPhotoConstants.allowedContentTypes
    );
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Check if the "mediaPhoto" type already exists in MongoDB
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
        mediaPhotoSchema.createSchema
    );

    if (await MediaPhotoModel.exists({ title: userInput?.title })) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            `Media photo entry with title "${userInput?.title}" already exists.`,
            {},
            {},
            request
        );
    }

    // Upload file and generate link
    const { fileId, fileLink } = await localFileOperations.uploadFile(
        request,
        userInput[mediaPhotoConstants.fileFieldName][0]
    );

    // Create a new "mediaPhoto" document with banner details
    const createdDocument = await MediaPhotoModel.create({
        ...userInput,
        image: { id: fileId, link: fileLink },
    });

    const filter = { _id: convertToObjectId(createdDocument?._id) }; // Add filters if needed
    const projection = { extraField: 1 };
    const pipeline = mediaPhotoPipeline(filter, projection);
    const newDocument = await MediaPhotoModel.aggregate(pipeline);

    // Send a success response with the created document data
    return sendResponse(
        true,
        httpStatusConstants.CREATED,
        `Media photos entry with title "${userInput?.title}" created successfully.`,
        newDocument,
        {},
        request
    );
};

// Export the route wrapped with asyncHandler
export const POST = asyncHandler(handleCreateMediaPhoto);
