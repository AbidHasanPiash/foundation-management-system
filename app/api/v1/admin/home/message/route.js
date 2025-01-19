import httpStatusConstants from '@/constants/httpStatus.constants';
import mongodb from '@/lib/mongodb';
import localFileOperations from '@/util/localFileOperations';
import homeMessageConstants from '@/app/api/v1/home/message/home.message.constants';
import homeMessageSchema from '@/app/api/v1/home/message/home.message.schema';
import HomeMessageModel from '@/app/api/v1/home/message/home.message.model';

import asyncHandler from '@/util/asyncHandler';
import sendResponse from '@/util/sendResponse';
import validateToken from '@/util/validateToken';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import aboutConstants from '@/app/api/v1/about/about.constants';

// Named export for the POST request handler
const handleCreateHomeMessage = async (request, context) => {
    const contentValidationResult = validateUnsupportedContent(
        request,
        homeMessageConstants.allowedContentTypes
    );
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Check if the "home page message" type already exists in MongoDB
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
        homeMessageSchema.createSchema
    );

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

    // Upload file and generate link
    const { fileId, fileLink } = await localFileOperations.uploadFile(
        request,
        userInput[homeMessageConstants.fileFieldName][0]
    );

    // Create a new "home page message" document with image details
    const createdDocument = await HomeMessageModel.create({
        ...userInput,
        image: { id: fileId, link: fileLink },
    });

    const homeMessageData = await HomeMessageModel.findOne(
        { _id: createdDocument?._id },
        {
            _id: 1,
            title: 1,
            name: 1,
            message: 1,
            image: { $ifNull: ['$image.link', ''] }, // Directly set `image` to `image.link` or an empty string if null
        }
    ).lean();

    // Send a success response with the created document data
    return sendResponse(
        true,
        httpStatusConstants.CREATED,
        `Home page message entry with title "${userInput?.title}" created successfully.`,
        homeMessageData,
        {},
        request
    );
};

// Export the route wrapped with asyncHandler
export const POST = asyncHandler(handleCreateHomeMessage);
