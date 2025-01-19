import httpStatusConstants from '@/constants/httpStatus.constants';
import mongodb from '@/lib/mongodb';
import localFileOperations from '@/util/localFileOperations';
import homeMessageConstants from '@/app/api/v1/home/message/home.message.constants';
import homeMessageSchema from '@/app/api/v1/home/message/home.message.schema';
import HomeMessageModel from '@/app/api/v1/home/message/home.message.model';
import serviceShared from '@/shared/service.shared';
import schemaShared from '@/shared/schema.shared';

import asyncHandler from '@/util/asyncHandler';
import sendResponse from '@/util/sendResponse';
import validateToken from '@/util/validateToken';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';

const { idValidationSchema } = schemaShared;

// Named export for the PATCH request handler
const handleUpdateHomePageMessage = async (request, context) => {
    // Check if the "home page message" type already exists in MongoDB
    await mongodb.connect();

    // Validate admin
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response; // Return early with the authorization failure response
    }

    const contentValidationResult = validateUnsupportedContent(
        request,
        homeMessageConstants.allowedContentTypes
    );
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'update',
        homeMessageSchema.updateSchema
    );

    // Retrieve existing document and handle file replacement if needed
    const existingHomeMessageData = await HomeMessageModel.findOne({
        _id: userInput?.id,
    });
    if (!existingHomeMessageData) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            `Home page message entry with id "${userInput?.id}" not found.`,
            {},
            {},
            request
        );
    }

    if (await HomeMessageModel.exists({ title: userInput?.title })) {
        return sendResponse(
            false,
            httpStatusConstants.CONFLICT,
            `Home page message entry with title "${userInput?.title}" already exists.`,
            {},
            {},
            request
        );
    }

    // Handle file replacement if a new file is provided
    let image = existingHomeMessageData.image;
    if (
        userInput[homeMessageConstants.fileFieldName] &&
        userInput[homeMessageConstants.fileFieldName][0]
    ) {
        // Ensure the file exists before accessing it
        const newFile = userInput[homeMessageConstants.fileFieldName][0];
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
    if (image && image.link !== existingHomeMessageData.image.link) {
        fieldsToUpdate.image = image;
    }

    // Update the document with the filtered data
    const updatedDocument = await HomeMessageModel.findOneAndUpdate(
        { _id: userInput?.id }, // Find document by id
        { $set: fieldsToUpdate },
        {
            new: true,
            projection: {
                _id: 1,
                title: 1,
                name: 1,
                message: 1,
                'image.link': 1,
            },
        }
    ).lean();

    if (!updatedDocument) {
        return sendResponse(
            false,
            httpStatusConstants.INTERNAL_SERVER_ERROR,
            `Failed to update home page message entry with id "${userInput?.id}".`,
            {},
            {},
            request
        );
    }

    // Format the response to match the expected structure
    const responseData = {
        _id: updatedDocument._id,
        title: updatedDocument.title,
        image: updatedDocument.image.link,
    };

    // Send a success response with the created document data
    return sendResponse(
        true,
        httpStatusConstants.CREATED,
        `Home page message entry with id "${userInput?.id}" updated successfully.`,
        responseData,
        {},
        request
    );
};

// Named export for the POST request handler
const handleDeleteHomePageMessage = async (request, context) => {
    return serviceShared.deleteEntry(
        request,
        context,
        idValidationSchema,
        HomeMessageModel,
        'image.id', // Projection field for file deletion
        `Home page message`
    );
};

// Export the route wrapped with asyncHandler
export const PATCH = asyncHandler(handleUpdateHomePageMessage);

// Export the route wrapped with asyncHandler
export const DELETE = asyncHandler(handleDeleteHomePageMessage);
