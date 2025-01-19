import httpStatusConstants from '@/constants/httpStatus.constants';
import mongodb from '@/lib/mongodb';
import localFileOperations from '@/util/localFileOperations';
import settingsGeneralConstants from '@/app/api/v1/settings/general/settings.general.constants';
import settingsGeneralSchema from '@/app/api/v1/settings/general/settings.general.schema';
import SettingsGeneralModel from '@/app/api/v1/settings/general/settings.general.model';

import asyncHandler from '@/util/asyncHandler';
import sendResponse from '@/util/sendResponse';
import validateToken from '@/util/validateToken';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import settingsGeneralPipeline from '@/app/api/v1/settings/general/settings.general.pipeline';
import convertToObjectId from '@/util/convertToObjectId';

// Named export for the POST request handler
const handleCreateSettingsGeneral = async (request, context) => {
    const contentValidationResult = validateUnsupportedContent(
        request,
        settingsGeneralConstants.allowedContentTypes
    );
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Check if the "executive" type already exists in MongoDB
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
        settingsGeneralSchema.createSchema
    );

    const existingSettings = await SettingsGeneralModel.findOne();
    if (existingSettings) {
        return sendResponse(
            false,
            httpStatusConstants.CONFLICT,
            'General settings already exist. Please update the existing settings.',
            {},
            {},
            request
        );
    }

    // Upload file and generate link
    const { fileId, fileLink } = await localFileOperations.uploadFile(
        request,
        userInput[settingsGeneralConstants.fileFieldName][0]
    );

    // Create the new settings document
    const createdDocument = await SettingsGeneralModel.create({
        ...userInput,
        logo: { id: fileId, link: fileLink },
        startDate: new Date(userInput?.startDate),
    });

    const filter = { _id: convertToObjectId(createdDocument._id) };
    const projection = {};
    const pipeline = settingsGeneralPipeline(filter, projection);
    const settingsGeneralData = await SettingsGeneralModel.aggregate(pipeline);

    // Send a success response with the created document data
    return sendResponse(
        true,
        httpStatusConstants.CREATED,
        `General settings created successfully.`,
        settingsGeneralData,
        {},
        request
    );
};

// Named export for the PATCH request handler
const handleUpdateSettingsGeneral = async (request, context) => {
    const contentValidationResult = validateUnsupportedContent(
        request,
        settingsGeneralConstants.allowedContentTypes
    );
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Check if the "executive" type already exists in MongoDB
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
        settingsGeneralSchema.updateSchema
    );

    // Retrieve the existing document
    const existingSettings = await SettingsGeneralModel.findOne();
    if (!existingSettings) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            'General settings not found. Please create the settings first.',
            {},
            {},
            request
        );
    }

    // Handle file replacement if a new file is provided
    let logo = existingSettings.logo;
    if (
        userInput[settingsGeneralConstants.fileFieldName] &&
        userInput[settingsGeneralConstants.fileFieldName][0]
    ) {
        // Ensure the file exists before accessing it
        const newFile = userInput[settingsGeneralConstants.fileFieldName][0];
        await localFileOperations.deleteFile(logo.id); // Delete old file
        const uploadFileResponse = await localFileOperations.uploadFile(
            request,
            newFile
        ); // Upload new file
        logo = {
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

    // Add the logo field if it has been replaced
    if (logo && logo.link !== existingSettings.logo.link) {
        fieldsToUpdate.logo = logo;
    }

    // Update the document
    const updatedDocument = await SettingsGeneralModel.findOneAndUpdate(
        {}, // No filter needed
        { $set: fieldsToUpdate },
        { new: true }
    ).lean();

    if (!updatedDocument) {
        return sendResponse(
            false,
            httpStatusConstants.INTERNAL_SERVER_ERROR,
            'Failed to update general settings.',
            {},
            {},
            request
        );
    }

    const filter = { _id: convertToObjectId(updatedDocument._id) };
    const projection = {};
    const pipeline = settingsGeneralPipeline(filter, projection);
    const settingsGeneralData = await SettingsGeneralModel.aggregate(pipeline);

    // Send a success response with the created document data
    return sendResponse(
        true,
        httpStatusConstants.OK,
        'General settings updated successfully.',
        settingsGeneralData,
        {},
        request
    );
};

// Named export for the DELETE request handler
const handleDeleteSettingsGeneral = async (request) => {
    // Check if the "executive" type already exists in MongoDB
    await mongodb.connect();

    // Validate admin
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response; // Return early with the authorization failure response
    }

    // Find the existing settings document
    const existingSettings = await SettingsGeneralModel.findOne();
    if (!existingSettings) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            'General settings not found.',
            {},
            {},
            request
        );
    }

    // Delete the logo file if it exists
    if (existingSettings?.logo && existingSettings?.logo?.id) {
        try {
            await localFileOperations.deleteFile(existingSettings?.logo?.id);
        } catch (error) {
            return sendResponse(
                false,
                httpStatusConstants.INTERNAL_SERVER_ERROR,
                'Failed to delete logo file.',
                {},
                {},
                request
            );
        }
    }

    // Delete the settings document from the database
    const deleteResult = await SettingsGeneralModel.deleteOne({
        _id: existingSettings?._id,
    });
    if (deleteResult.deletedCount === 0) {
        return sendResponse(
            false,
            httpStatusConstants.INTERNAL_SERVER_ERROR,
            'Failed to delete general settings.',
            {},
            {},
            request
        );
    }

    // Send a success response with the created document data
    return sendResponse(
        true,
        httpStatusConstants.OK,
        'General settings deleted successfully.',
        {},
        {},
        request
    );
};

// Export the route wrapped with asyncHandler
export const POST = asyncHandler(handleCreateSettingsGeneral);

// Export the route wrapped with asyncHandler
export const PATCH = asyncHandler(handleUpdateSettingsGeneral);

// Export the route wrapped with asyncHandler
export const DELETE = asyncHandler(handleDeleteSettingsGeneral);
