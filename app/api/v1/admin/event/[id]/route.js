import httpStatusConstants from '@/constants/httpStatus.constants';
import mongodb from '@/lib/mongodb';
import localFileOperations from '@/util/localFileOperations';
import eventConstants from '@/app/api/v1/event/event.constants';
import eventSchema from '@/app/api/v1/event/event.schema';
import EventModel from '@/app/api/v1/event/event.model';
import EventCategoryModel from '@/app/api/v1/event/category/event.category.model';
import EventSubCategoryModel from '@/app/api/v1/event/sub-category/event.sub.category.model';
import schemaShared from '@/shared/schema.shared';
import StatusModel from '@/app/api/v1/status/status.model';
import statusConstants from '@/app/api/v1/status/status.constants';

import asyncHandler from '@/util/asyncHandler';
import sendResponse from '@/util/sendResponse';
import validateToken from '@/util/validateToken';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import convertToObjectId from '@/util/convertToObjectId';
import eventPipeline from '@/app/api/v1/event/event.pipeline';

const { idValidationSchema } = schemaShared;

// Named export for the PATCH request handler
const handleUpdateEvent = async (request, context) => {
    // Validate content type
    const contentValidationResult = validateUnsupportedContent(
        request,
        eventConstants.allowedContentTypes
    );
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Connect to MongoDB
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
        eventSchema.updateSchema
    );

    // Retrieve the existing document
    const existingEventData = await EventModel.findOne({ _id: userInput?.id });
    if (!existingEventData) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            `Event entry with ID "${userInput?.id}" not found.`,
            {},
            {},
            request
        );
    }

    // Validate fields and references
    if (
        await EventModel.exists({
            title: userInput?.title,
            _id: { $ne: userInput.id },
        })
    ) {
        return sendResponse(
            false,
            httpStatusConstants.CONFLICT,
            `Event entry with title "${userInput?.title}" already exists.`,
            {},
            {},
            request
        );
    }

    if (userInput.categoryId) {
        const categoryData = await EventCategoryModel.findOne({
            _id: userInput?.categoryId,
        });
        if (!categoryData) {
            return sendResponse(
                false,
                httpStatusConstants.NOT_FOUND,
                `Event entry with category ID "${userInput?.categoryId}" not found.`,
                {},
                {},
                request
            );
        }

        if (userInput.specialFormId && !categoryData.isSpecial) {
            return sendResponse(
                false,
                httpStatusConstants.BAD_REQUEST,
                `Event category "${categoryData?.category}" does not support a special form.`,
                {},
                {},
                request
            );
        }
    }

    if (userInput.subcategoryId) {
        if (
            !(await EventSubCategoryModel.exists({
                _id: userInput?.subcategoryId,
            }))
        ) {
            return sendResponse(
                false,
                httpStatusConstants.NOT_FOUND,
                `Event entry with subcategory ID "${userInput?.subcategoryId}" not found.`,
                {},
                {},
                request
            );
        }
    }

    if (userInput.statusId) {
        if (
            !(await StatusModel.exists({
                type: statusConstants.categories.event,
                _id: userInput?.statusId,
            }))
        ) {
            return sendResponse(
                false,
                httpStatusConstants.NOT_FOUND,
                `Event entry with status ID "${userInput?.statusId}" not found.`,
                {},
                {},
                request
            );
        }
    }

    // Handle banner file replacement
    let banner = existingEventData.banner;
    const newBannerFile = userInput[eventConstants.fileFieldName.banner]?.[0];
    if (newBannerFile) {
        await localFileOperations.deleteFile(banner.id); // Delete old banner file
        const { fileId, fileLink } = await localFileOperations.uploadFile(
            request,
            newBannerFile
        ); // Upload new banner file
        banner = { id: fileId, link: fileLink };
    }

    // Process and upload new files if provided
    let uploadedDocuments = [];
    if (userInput?.files) {
        const fileOperations = userInput.files.map(async (entry) => {
            if (!entry.link) {
                // Upload new document and capture details
                const { fileId, fileLink } =
                    await localFileOperations.uploadFile(request, entry.file);
                return { id: fileId, name: entry.name, link: fileLink };
            } else {
                // Keep existing document references
                return { id: entry.id, name: entry.name, link: entry.link };
            }
        });

        uploadedDocuments = await Promise.all(fileOperations);

        // Collect IDs of files to retain
        const updatedDocumentIds = new Set(
            uploadedDocuments.map((doc) => doc.id)
        );

        // Determine files to delete
        const filesToDeleteIds = existingEventData.files
            .filter((doc) => !updatedDocumentIds.has(doc.id))
            .map((doc) => doc.id);

        // Delete unneeded files
        if (filesToDeleteIds.length > 0) {
            await Promise.all(
                filesToDeleteIds.map((docId) =>
                    localFileOperations.deleteFile(docId)
                )
            );
        }
    }

    // Filter userInput to include only fields with non-null values
    const fieldsToUpdate = { ...userInput };
    Object.keys(fieldsToUpdate).forEach((key) => {
        if (fieldsToUpdate[key] === undefined || fieldsToUpdate[key] === null) {
            delete fieldsToUpdate[key];
        }
    });

    // Add banner and files fields if they were updated
    fieldsToUpdate.banner = banner;
    fieldsToUpdate.files = uploadedDocuments;

    // Update the document with the filtered data
    const updatedDocument = await EventModel.findOneAndUpdate(
        { _id: userInput?.id }, // Find document by ID
        { $set: fieldsToUpdate },
        { new: true }
    ).lean();

    const filter = { _id: convertToObjectId(updatedDocument?._id) }; // Add filters if needed
    const projection = {};
    const pipeline = eventPipeline(filter, projection);
    const updatedDocumentWithReferences = await EventModel.aggregate(pipeline);

    if (!updatedDocument) {
        return sendResponse(
            false,
            httpStatusConstants.INTERNAL_SERVER_ERROR,
            `Failed to update event entry with ID "${userInput?.id}".`,
            {},
            {},
            request
        );
    }

    // Send a success response with the updated document data
    return sendResponse(
        true,
        httpStatusConstants.OK,
        `Event entry with ID "${userInput?.id}" updated successfully.`,
        updatedDocumentWithReferences,
        {},
        request
    );
};

// Named export for the POST request handler
const handleDeleteEvent = async (request, context) => {
    // Initialize MongoDB connection
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
        'delete',
        idValidationSchema
    );

    // Use `findOneAndDelete` to retrieve `banner` and `files` and delete the document in one operation
    const eventData = await EventModel.findOneAndDelete(
        { _id: userInput?.id },
        {
            projection: {
                _id: 1,
                'banner.id': 1, // Retrieve `banner.id` for deletion
                files: 1, // Retrieve the entire files array
            },
        }
    );

    // If no document is found, send a 404 response
    if (!eventData) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            `Event entry with ID "${userInput?.id}" not found.`,
            {},
            {},
            request
        );
    }

    // Delete the banner file if it exists
    if (eventData.banner?.id) {
        await localFileOperations.deleteFile(eventData.banner.id);
    }

    // Delete all files associated with the event
    if (eventData.files?.length > 0) {
        await Promise.all(
            eventData.files.map(async (file) => {
                if (file.id) {
                    await localFileOperations.deleteFile(file.id);
                }
            })
        );
    }

    // Send a success response
    return sendResponse(
        true,
        httpStatusConstants.OK,
        `Event entry with ID "${userInput?.id}" deleted successfully.`,
        {},
        {},
        request
    );
};

// Export the route wrapped with asyncHandler
export const PATCH = asyncHandler(handleUpdateEvent);

// Export the route wrapped with asyncHandler
export const DELETE = asyncHandler(handleDeleteEvent);
