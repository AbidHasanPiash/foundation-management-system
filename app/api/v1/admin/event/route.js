import httpStatusConstants from '@/constants/httpStatus.constants';
import mongodb from '@/lib/mongodb';
import localFileOperations from '@/util/localFileOperations';
import eventConstants from '@/app/api/v1/event/event.constants';
import eventSchema from '@/app/api/v1/event/event.schema';
import EventModel from '@/app/api/v1/event/event.model';
import EventCategoryModel from '@/app/api/v1/event/category/event.category.model';
import EventSubCategoryModel from '@/app/api/v1/event/sub-category/event.sub.category.model';
import statusConstants from '@/app/api/v1/status/status.constants';
import StatusModel from '@/app/api/v1/status/status.model';

import asyncHandler from '@/util/asyncHandler';
import sendResponse from '@/util/sendResponse';
import validateToken from '@/util/validateToken';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import convertToObjectId from '@/util/convertToObjectId';
import eventPipeline from '@/app/api/v1/event/event.pipeline';

// Named export for the POST request handler
const handleCreateEvent = async (request, context) => {
    const contentValidationResult = validateUnsupportedContent(
        request,
        eventConstants.allowedContentTypes
    );
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Check if the "event" type already exists in MongoDB
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
        eventSchema.createSchema
    );

    if (await EventModel.exists({ title: userInput?.title })) {
        return sendResponse(
            false,
            httpStatusConstants.CONFLICT,
            `Event entry with title "${userInput?.title}" already exists.`,
            {},
            {},
            request
        );
    }

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
            httpStatusConstants.NOT_FOUND,
            'Event entry does not support special form.',
            {},
            {},
            request
        );
    }

    if (
        !(await EventSubCategoryModel.exists({ _id: userInput?.subcategoryId }))
    ) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            `Event entry with sub category ID "${userInput?.subcategoryId}" not found.`,
            {},
            {},
            request
        );
    }

    // Check if the member statusId exists
    if (
        !(await StatusModel.exists({
            category: statusConstants.categories.event,
            _id: userInput?.statusId,
        }))
    ) {
        return sendResponse(
            false,
            httpStatusConstants.BAD_REQUEST,
            `Event entry with status ID "${userInput?.statusId}" not found.`,
            {},
            {},
            request
        );
    }

    // Upload banner
    let uploadBannerResponse = {};
    const bannerFile = userInput[eventConstants.fileFieldName.banner][0];
    if (bannerFile) {
        uploadBannerResponse = await localFileOperations.uploadFile(
            request,
            bannerFile
        );
    }
    const { fileId, fileLink } = uploadBannerResponse;

    // Upload files
    const uploadFilesResponse = await Promise.all(
        userInput[eventConstants.fileFieldName.files]?.map(
            async (fileEntry) => {
                const file = fileEntry.file; // Assuming a single file per entry in `file` array
                const { fileId, fileLink } =
                    await localFileOperations.uploadFile(request, file);
                return {
                    name: fileEntry.name,
                    id: fileId,
                    link: fileLink,
                };
            }
        ) || []
    );

    const prepareEventData = {
        ...userInput,
        ...(fileId && fileLink
            ? { banner: { id: fileId, link: fileLink } }
            : {}),
        files: uploadFilesResponse,
    };

    // Create a new "event" document with banner details
    const createdDocument = await EventModel.create(prepareEventData);

    const filter = { _id: convertToObjectId(createdDocument?._id) }; // Add filters if needed
    const projection = {};
    const pipeline = eventPipeline(filter, projection);
    const eventData = await EventModel.aggregate(pipeline);

    // Send a success response with the created document data
    return sendResponse(
        true,
        httpStatusConstants.CREATED,
        `Event entry with title "${userInput?.title}" created successfully.`,
        eventData,
        {},
        request
    );
};

// Export the route wrapped with asyncHandler
export const POST = asyncHandler(handleCreateEvent);
