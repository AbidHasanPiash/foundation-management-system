import httpStatusConstants from '@/constants/httpStatus.constants';
import mongodb from '@/lib/mongodb';
import aboutSchema from '@/app/api/v1/about/about.schema';
import aboutConstants from '@/app/api/v1/about/about.constants';
import AboutModel from '@/app/api/v1/about/about.model';
import localFileOperations from '@/util/localFileOperations';

import asyncHandler from '@/util/asyncHandler';
import sendResponse from '@/util/sendResponse';
import validateToken from '@/util/validateToken';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import aboutPipeline from '@/app/api/v1/about/about.pipeline';

// Named export for the POST request handler
const handleCreateAboutByCategoryAndType = async (request, context) => {
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
        type: userInput?.type,
    });
    if (existingStatus) {
        return sendResponse(
            false,
            httpStatusConstants.CONFLICT,
            `About entry with CATEGORY "${userInput?.categoryParams}" and type "${userInput?.type}" already exists.`,
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

// Named export for the PATCH request handler
const handleUpdateAboutByCategoryAndType = async (request, context) => {
    const contentValidationResult = validateUnsupportedContent(
        request,
        aboutConstants.allowedContentTypes
    );
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Check if the "membership" type already exists in MongoDB
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
        aboutSchema.updateSchema
    );

    // Retrieve existing document and handle file replacement if needed
    const existingAboutData = await AboutModel.findOne({
        category: userInput?.categoryParams,
        type: userInput?.type,
    });
    if (!existingAboutData) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            `About entry with CATEGORY "${userInput?.categoryParams}" and TYPE "${userInput?.type}" not found.`,
            {},
            {},
            request
        );
    }

    // Handle file replacement if a new file is provided
    let banner = existingAboutData.banner;
    if (
        userInput[aboutConstants.fileFieldName] &&
        userInput[aboutConstants.fileFieldName][0]
    ) {
        // Ensure the file exists before accessing it
        const newFile = userInput[aboutConstants.fileFieldName][0];
        await localFileOperations.deleteFile(banner.id); // Delete old file
        const uploadFileResponse = await localFileOperations.uploadFile(
            request,
            newFile
        ); // Upload new file
        banner = {
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
    if (banner && banner.link !== existingAboutData.banner.link) {
        fieldsToUpdate.banner = banner;
    }

    // Update the document with the filtered data
    const updatedDocument = await AboutModel.findOneAndUpdate(
        { category: userInput?.categoryParams, type: userInput?.type }, // Find document by type and category
        { $set: fieldsToUpdate },
        {
            new: true,
            projection: {
                _id: 1,
                type: 1,
                category: 1,
                title: 1,
                description: 1,
                'banner.link': 1,
            },
        }
    ).lean();

    if (!updatedDocument) {
        return sendResponse(
            false,
            httpStatusConstants.INTERNAL_SERVER_ERROR,
            `Failed to update about entry with CATEGORY "${userInput?.categoryParams}" and TYPE "${userInput?.type}".`,
            {},
            {},
            request
        );
    }

    // Format the response to match the expected structure
    const responseData = {
        _id: updatedDocument._id,
        type: updatedDocument.type,
        category: updatedDocument.category,
        title: updatedDocument.title,
        description: updatedDocument.description,
        banner: updatedDocument.banner.link,
    };

    // Send a success response with the updated document data
    return sendResponse(
        true,
        httpStatusConstants.OK,
        `About entry with CATEGORY "${userInput?.categoryParams}" and TYPE "${userInput?.type} updated successfully.`,
        responseData,
        {},
        request
    );
};

// Named export for the POST request handler
const handleDeleteAbout = async (request, context) => {
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
        aboutSchema.categoryAndIdSchema
    );

    // Perform the deletion with the specified projection field for optional file handling
    const entryData = await AboutModel.findOneAndDelete({
        category: userInput?.categoryParams,
        type: userInput?.type,
    });

    // If no document is found, send a 404 response
    if (!entryData) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            `About entry with CATEGORY "${userInput?.categoryParams}" and TYPE "${userInput?.type}" not found.`,
            {},
            {},
            request
        );
    }

    // Send a success response
    return sendResponse(
        true,
        httpStatusConstants.OK,
        `About entry with CATEGORY "${userInput?.categoryParams}" and TYPE "${userInput?.type}" deleted successfully.`,
        {},
        {},
        request
    );
};

// Export the route wrapped with asyncHandler
export const POST = asyncHandler(handleCreateAboutByCategoryAndType);

// Export the route wrapped with asyncHandler
export const PATCH = asyncHandler(handleUpdateAboutByCategoryAndType);

// Export the route wrapped with asyncHandler
export const DELETE = asyncHandler(handleDeleteAbout);
