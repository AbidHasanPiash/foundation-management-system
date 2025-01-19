import httpStatusConstants from '@/constants/httpStatus.constants';
import mongodb from '@/lib/mongodb';
import localFileOperations from '@/util/localFileOperations';
import mediaPhotoConstants from '@/app/api/v1/media/photo/media.photo.constants';
import mediaPhotoSchema from '@/app/api/v1/media/photo/media.photo.schema';
import MediaPhotoModel from '@/app/api/v1/media/photo/media.photo.model';
import serviceShared from '@/shared/service.shared';
import schemaShared from '@/shared/schema.shared';

import asyncHandler from '@/util/asyncHandler';
import sendResponse from '@/util/sendResponse';
import validateToken from '@/util/validateToken';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import convertToObjectId from '@/util/convertToObjectId';
import mediaPhotoPipeline from '@/app/api/v1/media/photo/media.photo.pipeline';

const { idValidationSchema } = schemaShared;

// Named export for the PATCH request handler
const handleUpdateMediaPhotoById = async (request, context) => {
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
        'update',
        mediaPhotoSchema.updateSchema
    );

    // Retrieve existing document and handle file replacement if needed
    const existingMediaPhotoData = await MediaPhotoModel.findOne({
        _id: userInput?.id,
    });
    if (!existingMediaPhotoData) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            `Media photos entry with id "${userInput?.id}" not found.`,
            {},
            {},
            request
        );
    }

    // Handle file replacement if a new file is provided
    let image = existingMediaPhotoData.image;
    if (
        userInput &&
        userInput[mediaPhotoConstants.fileFieldName] &&
        userInput[mediaPhotoConstants.fileFieldName][0]
    ) {
        // Ensure the file exists before accessing it
        const newFile = userInput[mediaPhotoConstants.fileFieldName][0];
        await localFileOperations.deleteFile(image.id); // Delete old file
        const uploadFileResponse = await localFileOperations.uploadFile(
            request,
            newFile
        ); // Upload new file
        image = {
            id: uploadFileResponse.fileId,
            link: uploadFileResponse.fileLink,
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
    if (image && image.link !== existingMediaPhotoData.image.link) {
        fieldsToUpdate.image = image;
    }

    // Update the document with the filtered data
    const updatedDocument = await MediaPhotoModel.findOneAndUpdate(
        { _id: userInput?.id }, // Find document by type
        { $set: fieldsToUpdate },
        { new: true }
    ).lean();

    if (!updatedDocument) {
        return sendResponse(
            false,
            httpStatusConstants.INTERNAL_SERVER_ERROR,
            `Failed to update media photos entry with id "${userInput?.id}".`,
            {},
            {},
            request
        );
    }

    const filter = { _id: convertToObjectId(updatedDocument?._id) }; // Add filters if needed
    const projection = { extraField: 1 };
    const pipeline = mediaPhotoPipeline(filter, projection);
    const newDocument = await MediaPhotoModel.aggregate(pipeline);

    // Send a success response with the updated document data
    return sendResponse(
        true,
        httpStatusConstants.OK,
        `Media photos entry with id "${userInput?.id}" updated successfully.`,
        newDocument,
        {},
        request
    );
};

// Named export for the POST request handler
const handleDeleteMediaPhotoById = async (request, context) => {
    return serviceShared.deleteEntry(
        request,
        context,
        idValidationSchema,
        MediaPhotoModel,
        'image.id', // Projection field for file deletion
        `Media photos`
    );
};

// Export the route wrapped with asyncHandler
export const PATCH = asyncHandler(handleUpdateMediaPhotoById);

// Export the route wrapped with asyncHandler
export const DELETE = asyncHandler(handleDeleteMediaPhotoById);
