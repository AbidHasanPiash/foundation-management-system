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

// Named export for the POST request handler
const handleCreateNews = async (request, context) => {
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
        'create',
        mediaNewsSchema.createSchema
    );

    // Upload file and generate link
    const { fileId, fileLink } = await localFileOperations.uploadFile(
        request,
        userInput[mediaNewsConstants.fileFieldName.banner][0]
    );

    // Upload files and construct the `files` array for documents
    const uploadedFiles = await Promise.all(
        (userInput[mediaNewsConstants.fileFieldName.files] || []).map(
            async (fileEntry) => {
                const { file } = fileEntry;
                const { fileId, fileLink } =
                    await localFileOperations.uploadFile(request, file);
                return {
                    name: fileEntry.name,
                    id: fileId,
                    link: fileLink,
                };
            }
        )
    );

    // Construct the news data object to store in the database
    const newsData = {
        title: userInput.title,
        banner: { id: fileId, link: fileLink },
        description: userInput.description,
        files: uploadedFiles,
        links: userInput.links || [],
    };

    // Create the new news document
    const createdDocument = await MediaNewsModel.create(newsData);

    const filter = { _id: convertToObjectId(createdDocument?._id) }; // Add filters if needed
    const projection = {};
    const pipeline = mediaNewsPipeline(filter, projection);
    const newDocument = await MediaNewsModel.aggregate(pipeline);

    // Send a success response with the created news data
    return sendResponse(
        true,
        httpStatusConstants.CREATED,
        `News created successfully.`,
        newDocument,
        {},
        request
    );
};

// Export the route wrapped with asyncHandler
export const POST = asyncHandler(handleCreateNews);
