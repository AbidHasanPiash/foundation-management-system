import httpStatusConstants from '@/constants/httpStatus.constants';
import mongodb from '@/lib/mongodb';
import mediaVideoConstants from '@/app/api/v1/media/video/media.video.constants';
import mediaVideoSchema from '@/app/api/v1/media/video/media.video.schema';
import MediaVideoModel from '@/app/api/v1/media/video/media.video.model';
import serviceShared from '@/shared/service.shared';
import schemaShared from '@/shared/schema.shared';

import asyncHandler from '@/util/asyncHandler';
import sendResponse from '@/util/sendResponse';
import validateToken from '@/util/validateToken';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import convertToObjectId from '@/util/convertToObjectId';
import mediaVideoPipeline from '@/app/api/v1/media/video/media.video.pipeline';

const { idValidationSchema } = schemaShared;

// Named export for the PATCH request handler
const handleUpdateMediaVideoById = async (request, context) => {
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
        'update',
        mediaVideoSchema.updateSchema
    );

    // Retrieve existing document and handle file replacement if needed
    const existingMediaVideoData = await MediaVideoModel.findOne({
        _id: userInput?.id,
    });
    if (!existingMediaVideoData) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            `Media videos entry with id "${userInput?.id}" not found.`,
            {},
            {},
            request
        );
    }

    // Filter `userInput` to only include fields with non-null values
    const fieldsToUpdate = Object.keys(userInput).reduce((acc, key) => {
        if (userInput[key] !== undefined && userInput[key] !== null) {
            acc[key] = userInput[key];
        }
        return acc;
    }, {});

    // Update the document with the filtered data
    const updatedDocument = await MediaVideoModel.findOneAndUpdate(
        { _id: userInput?.id }, // Find document by type
        { $set: fieldsToUpdate },
        { new: true }
    ).lean();

    if (!updatedDocument) {
        return sendResponse(
            false,
            httpStatusConstants.INTERNAL_SERVER_ERROR,
            `Failed to update media videos entry with id "${userInput?.id}".`,
            {},
            {},
            request
        );
    }

    const filter = { _id: convertToObjectId(updatedDocument?._id) }; // Add filters if needed
    const projection = {};
    const pipeline = mediaVideoPipeline(filter, projection);
    const mediaVideoData = await MediaVideoModel.aggregate(pipeline);

    // Send a success response with the updated document data
    return sendResponse(
        true,
        httpStatusConstants.OK,
        `Media videos entry with id "${userInput?.id}" updated successfully.`,
        mediaVideoData,
        {},
        request
    );
};

// Named export for the POST request handler
const handleDeleteMediaVideoById = async (request, context) => {
    return serviceShared.deleteEntry(
        request,
        context,
        idValidationSchema,
        MediaVideoModel,
        '', // Projection field for file deletion
        `Media videos`
    );
};

// Export the route wrapped with asyncHandler
export const PATCH = asyncHandler(handleUpdateMediaVideoById);

// Export the route wrapped with asyncHandler
export const DELETE = asyncHandler(handleDeleteMediaVideoById);
