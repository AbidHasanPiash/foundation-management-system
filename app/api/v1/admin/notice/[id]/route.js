import httpStatusConstants from '@/constants/httpStatus.constants';
import mongodb from '@/lib/mongodb';
import localFileOperations from '@/util/localFileOperations';
import noticeConstants from '@/app/api/v1/notice/notice.constants';
import noticeSchema from '@/app/api/v1/notice/notice.schema';
import NoticeModel from '@/app/api/v1/notice/notice.model';

import asyncHandler from '@/util/asyncHandler';
import sendResponse from '@/util/sendResponse';
import validateToken from '@/util/validateToken';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import convertToObjectId from '@/util/convertToObjectId';
import noticePipeline from '@/app/api/v1/notice/notice.pipeline';

const handleUpdateNoticeById = async (request, context) => {
    // Validate content type
    const contentValidationResult = validateUnsupportedContent(
        request,
        noticeConstants.allowedContentTypes
    );
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Connect to MongoDB and validate admin authorization
    await mongodb.connect();

    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response;
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'update',
        noticeSchema.updateSchema
    );

    // Retrieve existing document and handle file replacement if needed
    const existingNoticeData = await NoticeModel.findById(userInput?.id);
    if (!existingNoticeData) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            `Notice entry with ID "${userInput?.id}" not found.`,
            {},
            {},
            request
        );
    }

    // Check if a document with the specified type already exists
    const existingStatus = await NoticeModel.exists({
        title: userInput?.title,
    });
    if (existingStatus) {
        return sendResponse(
            false,
            httpStatusConstants.CONFLICT,
            `Notice entry with title "${userInput?.title}" already exists.`,
            {},
            {},
            request
        );
    }

    // Handle file replacement if a new file is provided
    let file = existingNoticeData.file;
    if (
        userInput[noticeConstants.fileFieldName] &&
        userInput[noticeConstants.fileFieldName][0]
    ) {
        // Ensure the file exists before accessing it
        const newFile = userInput[noticeConstants.fileFieldName][0];

        await localFileOperations.deleteFile(file.id); // Delete old file

        const uploadFileResponse = await localFileOperations.uploadFile(
            request,
            newFile
        ); // Upload new file

        file = {
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

    // Add the file field if it has been replaced
    if (file && file.link !== existingNoticeData.file.link) {
        fieldsToUpdate.file = file;
    }

    // Update the document with the filtered data
    const updatedDocument = await NoticeModel.findOneAndUpdate(
        { _id: userInput?.id }, // Find document by type and category
        { $set: fieldsToUpdate },
        { new: true, projection: { _id: 1 } }
    ).lean();

    if (!updatedDocument) {
        return sendResponse(
            false,
            httpStatusConstants.INTERNAL_SERVER_ERROR,
            `Failed to update notice entry with ID "${userInput?.id}".`,
            {},
            {},
            request
        );
    }

    const filter = { _id: convertToObjectId(updatedDocument?._id) };
    const projection = {};
    const pipeline = noticePipeline(filter, projection);
    const noticeData = await NoticeModel.aggregate(pipeline);

    // Send a success response with the created document data
    return sendResponse(
        true,
        httpStatusConstants.CREATED,
        `Notice entry with title "${userInput?.title}" updated successfully.`,
        noticeData,
        {},
        request
    );
};

// Named export for the DELETE request handler
const handleDeleteNotice = async (request, context) => {
    // Connect to MongoDB and validate admin
    await mongodb.connect();
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response; // Return early with the authorization failure response
    }

    // Get notice ID from request parameters
    const { id } = context.params;

    // Find the existing notice document by ID
    const existingNotice = await NoticeModel.findById(id);
    if (!existingNotice) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            'Notice not found.',
            {},
            {},
            request
        );
    }

    // Delete associated files if they exist
    if (existingNotice.files && existingNotice.files.length > 0) {
        try {
            await Promise.all(
                existingNotice.files.map(async (file) => {
                    if (file.id) {
                        await localFileOperations.deleteFile(file.id); // Delete each file by ID
                    }
                })
            );
        } catch (error) {
            return sendResponse(
                false,
                httpStatusConstants.INTERNAL_SERVER_ERROR,
                'Failed to delete associated files.',
                {},
                {},
                request
            );
        }
    }

    // Delete the notice document from the database
    const deleteResult = await NoticeModel.deleteOne({ _id: id });
    if (deleteResult.deletedCount === 0) {
        return sendResponse(
            false,
            httpStatusConstants.INTERNAL_SERVER_ERROR,
            'Failed to delete the notice.',
            {},
            {},
            request
        );
    }

    // Send a success response indicating the notice was deleted
    return sendResponse(
        true,
        httpStatusConstants.OK,
        'Notice deleted successfully.',
        {},
        {},
        request
    );
};

// Export the route wrapped with asyncHandler
export const PATCH = asyncHandler(handleUpdateNoticeById);

// Export the route wrapped with asyncHandler
export const DELETE = asyncHandler(handleDeleteNotice);
