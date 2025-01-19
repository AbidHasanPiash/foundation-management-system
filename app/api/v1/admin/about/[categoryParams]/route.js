import mongodb from '@/lib/mongodb';
import aboutSchema from '@/app/api/v1/about/about.schema';
import aboutConstants from '@/app/api/v1/about/about.constants';
import httpStatusConstants from '@/constants/httpStatus.constants';
import AboutModel from '@/app/api/v1/about/about.model';
import localFileOperations from '@/util/localFileOperations';

import asyncHandler from '@/util/asyncHandler';
import validateToken from '@/util/validateToken';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import sendResponse from '@/util/sendResponse';
import aboutPipeline from '@/app/api/v1/about/about.pipeline';

// Named export for the POST request handler
const handleCreateAbout = async (request, context) => {
    // Validate content category
    const contentValidationResult = validateUnsupportedContent(
        request,
        aboutConstants.allowedContentTypes
    );
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Connect to MongoDB
    await mongodb.connect();

    // Validate admin
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response;
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'create',
        aboutSchema.createSchema
    );

    // Check if a document with the specified type already exists
    const existingStatus = await AboutModel.exists({
        category: userInput?.categoryParams,
        title: userInput?.title,
    });
    if (existingStatus) {
        return sendResponse(
            false,
            httpStatusConstants.CONFLICT,
            `About entry with CATEGORY "${userInput?.categoryParams}" and type "${userInput?.title}" already exists.`,
            {},
            {},
            request
        );
    }

    // Upload file and generate link
    const { fileId, fileLink } = await localFileOperations.uploadFile(
        request,
        userInput[aboutConstants.fileFieldName][0]
    );

    userInput.category = userInput.categoryParams;

    // Attempt to create a new document with the provided details
    const createdDocument = await AboutModel.create({
        ...userInput,
        banner: { id: fileId, link: fileLink },
    });

    // Validate if the document was successfully created
    if (!createdDocument) {
        return sendResponse(
            false,
            httpStatusConstants.INTERNAL_SERVER_ERROR,
            `Failed to create about entry with CATEGORY "${userInput?.categoryParams}" and type "${userInput?.title}".`,
            {},
            {},
            request
        );
    }

    const filter = {
        category: userInput?.categoryParams,
        _id: createdDocument._id,
    };
    const projection = {};
    const pipeline = aboutPipeline(filter, projection);
    const typeData = await AboutModel.aggregate(pipeline);

    // Send a success response with the created document data
    return sendResponse(
        true,
        httpStatusConstants.CREATED,
        `About entry with CATEGORY "${userInput?.categoryParams}" and type "${userInput?.title}" created successfully.`,
        typeData,
        {},
        request
    );
};

// Export the route wrapped with asyncHandler
export const POST = asyncHandler(handleCreateAbout);
