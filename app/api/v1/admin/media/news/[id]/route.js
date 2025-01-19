import httpStatusConstants from '@/constants/httpStatus.constants';
import mongodb from '@/lib/mongodb';
import localFileOperations from '@/util/localFileOperations';
import mediaNewsConstants from '@/app/api/v1/media/news/media.news.constants';
import mediaNewsSchema from '@/app/api/v1/media/news/media.news.schema';
import MediaNewsModel from '@/app/api/v1/media/news/media.news.model';

import asyncHandler from '@/util/asyncHandler';
import sendResponse from '@/util/sendResponse';
import validateToken from '@/util/validateToken';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import mediaNewsPipeline from '@/app/api/v1/media/news/media.news.pipeline';
import convertToObjectId from '@/util/convertToObjectId';

// Named export for the PATCH request handler
const handleUpdateNewsById = async (request, context) => {
    const contentValidationResult = validateUnsupportedContent(
        request,
        mediaNewsConstants.allowedContentTypes
    );
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Connect to MongoDB and validate admin
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
        mediaNewsSchema.updateSchema
    );

    // Retrieve the existing news document by ID
    const { id } = userInput;
    const existingNews = await MediaNewsModel.findById(id);
    if (!existingNews) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            'News not found. Please create the news first.',
            {},
            {},
            request
        );
    }

    // Handle banner file replacement if a new banner is provided
    let banner = existingNews.banner;
    if (userInput[mediaNewsConstants.fileFieldName.banner]?.length) {
        const bannerFile =
            userInput[mediaNewsConstants.fileFieldName.banner][0];
        if (existingNews.banner?.id) {
            await localFileOperations.deleteFile(existingNews.banner.id); // Delete old banner file
        }
        const { fileId, fileLink } = await localFileOperations.uploadFile(
            request,
            bannerFile
        );
        banner = { id: fileId, link: fileLink };
    }

    // Process and upload new files if provided
    let uploadedFiles = [];
    if (userInput?.files) {
        const documentOperations = userInput.files.map(async (entry) => {
            if (!entry.link) {
                // Upload new document and capture details
                const { fileId, fileLink } =
                    await localFileOperations.uploadFile(
                        request,
                        entry.document
                    );
                return { id: fileId, name: entry.name, link: fileLink };
            } else {
                // Keep existing document references
                return { id: entry.id, name: entry.name, link: entry.link };
            }
        });

        uploadedFiles = await Promise.all(documentOperations);

        // Collect IDs of files to retain
        const updatedDocumentIds = new Set(uploadedFiles.map((doc) => doc.id));

        // Determine files to delete
        const filesToDeleteIds = existingNews.files
            .filter((doc) => !updatedDocumentIds.has(doc.id))
            .map((doc) => doc.id);

        // Delete unneeded files
        if (filesToDeleteIds.length > 0) {
            const deletionPromises = filesToDeleteIds.map((docId) =>
                localFileOperations.deleteFile(docId)
            );
            await Promise.all(deletionPromises);
        }

        // Update settings with the new document list
        existingNews.files = uploadedFiles;
        await existingNews.save();
    }

    // Update the fields with only non-null values
    const fieldsToUpdate = {
        ...userInput,
        banner,
    };
    Object.keys(fieldsToUpdate).forEach((key) => {
        if (fieldsToUpdate[key] === undefined || fieldsToUpdate[key] === null) {
            delete fieldsToUpdate[key];
        }
    });

    // Update the document in MongoDB
    const updatedNews = await MediaNewsModel.findByIdAndUpdate(
        id,
        { $set: fieldsToUpdate },
        { new: true }
    ).lean();

    if (!updatedNews) {
        return sendResponse(
            false,
            httpStatusConstants.INTERNAL_SERVER_ERROR,
            'Failed to update the news.',
            {},
            {},
            request
        );
    }

    const filter = { _id: convertToObjectId(updatedNews?._id) }; // Add filters if needed
    const projection = {};
    const pipeline = mediaNewsPipeline(filter, projection);
    const updatedDocument = await MediaNewsModel.aggregate(pipeline);

    // Send a success response with the updated news data
    return sendResponse(
        true,
        httpStatusConstants.OK,
        'News updated successfully.',
        updatedDocument,
        {},
        request
    );
};

// Named export for the DELETE request handler
const handleDeleteNews = async (request, context) => {
    // Connect to MongoDB and validate admin
    await mongodb.connect();
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response; // Return early with the authorization failure response
    }

    // Get news ID from request parameters
    const { id } = context.params;

    // Find the existing news document by ID
    const existingNews = await MediaNewsModel.findById(id);
    if (!existingNews) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            'News not found.',
            {},
            {},
            request
        );
    }

    // Delete associated banner if it exists
    if (existingNews.banner?.id) {
        try {
            await localFileOperations.deleteFile(existingNews.banner.id); // Delete banner by ID
        } catch (error) {
            return sendResponse(
                false,
                httpStatusConstants.INTERNAL_SERVER_ERROR,
                'Failed to delete banner file.',
                {},
                {},
                request
            );
        }
    }

    // Delete associated files if they exist
    if (existingNews.files && existingNews.files.length > 0) {
        try {
            await Promise.all(
                existingNews.files.map(async (file) => {
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

    // Delete the news document from the database
    const deleteResult = await MediaNewsModel.deleteOne({ _id: id });
    if (deleteResult.deletedCount === 0) {
        return sendResponse(
            false,
            httpStatusConstants.INTERNAL_SERVER_ERROR,
            'Failed to delete the news.',
            {},
            {},
            request
        );
    }

    // Send a success response indicating the news was deleted
    return sendResponse(
        true,
        httpStatusConstants.OK,
        'News deleted successfully.',
        {},
        {},
        request
    );
};

// Export the route wrapped with asyncHandler
export const PATCH = asyncHandler(handleUpdateNewsById);

// Export the route wrapped with asyncHandler
export const DELETE = asyncHandler(handleDeleteNews);
