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

// Named export for the POST request handler
const handleCreateNotice = async (request, context) => {
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
        'create',
        noticeSchema.createSchema
    );

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

    // Upload file and generate link
    const { fileId, fileLink } = await localFileOperations.uploadFile(
        request,
        userInput[noticeConstants.fileFieldName][0]
    );

    // Attempt to create a new document with the provided details
    const createdDocument = await NoticeModel.create({
        ...userInput,
        file: { id: fileId, link: fileLink },
    });

    // Validate if the document was successfully created
    if (!createdDocument) {
        return sendResponse(
            false,
            httpStatusConstants.INTERNAL_SERVER_ERROR,
            `Failed to create notice entry with title "${userInput?.title}".`,
            {},
            {},
            request
        );
    }

    const filter = { _id: convertToObjectId(createdDocument?._id) };
    const projection = {};
    const pipeline = noticePipeline(filter, projection);
    const noticeData = await NoticeModel.aggregate(pipeline);

    // Send a success response with the created document data
    return sendResponse(
        true,
        httpStatusConstants.CREATED,
        `Notice entry with title "${userInput?.title}" created successfully.`,
        noticeData,
        {},
        request
    );
};

// Export the route wrapped with asyncHandler
export const POST = asyncHandler(handleCreateNotice);
