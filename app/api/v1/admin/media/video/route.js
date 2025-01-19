import httpStatusConstants from '@/constants/httpStatus.constants';
import mongodb from '@/lib/mongodb';
import mediaVideoConstants from '@/app/api/v1/media/video/media.video.constants';
import mediaVideoSchema from '@/app/api/v1/media/video/media.video.schema';
import MediaVideoModel from '@/app/api/v1/media/video/media.video.model';

import asyncHandler from '@/util/asyncHandler';
import sendResponse from '@/util/sendResponse';
import validateToken from '@/util/validateToken';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import convertToObjectId from '@/util/convertToObjectId';
import mediaVideoPipeline from '@/app/api/v1/media/video/media.video.pipeline';

// Named export for the POST request handler
const handleCreateMediaVideo = async (request, context) => {
    const contentValidationResult = validateUnsupportedContent(
        request,
        mediaVideoConstants.allowedContentTypes
    );
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Check if the "mediaVideo" type already exists in MongoDB
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
        mediaVideoSchema.createSchema
    );

    if (await MediaVideoModel.exists({ title: userInput?.title })) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            `Media video entry with title "${userInput?.title}" already exists.`,
            {},
            {},
            request
        );
    }
    // Create a new "mediaVideo" document with banner details
    const createdDocument = await MediaVideoModel.create(userInput);

    const filter = { _id: convertToObjectId(createdDocument?._id) }; // Add filters if needed
    const projection = {};
    const pipeline = mediaVideoPipeline(filter, projection);
    const mediaVideoData = await MediaVideoModel.aggregate(pipeline);

    // Send a success response with the created document data
    return sendResponse(
        true,
        httpStatusConstants.CREATED,
        `Media videos entry with title "${userInput?.title}" created successfully.`,
        mediaVideoData,
        {},
        request
    );
};

// Export the route wrapped with asyncHandler
export const POST = asyncHandler(handleCreateMediaVideo);
