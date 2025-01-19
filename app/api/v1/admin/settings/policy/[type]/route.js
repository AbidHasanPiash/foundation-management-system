import httpStatusConstants from '@/constants/httpStatus.constants';
import mongodb from '@/lib/mongodb';
import serviceShared from '@/shared/service.shared';
import settingsPolicyConstants from '@/app/api/v1/settings/policy/settings.policy.constants';
import settingsPolicySchema from '@/app/api/v1/settings/policy/settings.policy.schema';
import SettingsPolicyModel from '@/app/api/v1/settings/policy/settings.policy.model';

import asyncHandler from '@/util/asyncHandler';
import sendResponse from '@/util/sendResponse';
import validateToken from '@/util/validateToken';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import convertToObjectId from '@/util/convertToObjectId';
import settingsPolicyPipeline from '@/app/api/v1/settings/policy/settings.policy.pipeline';

// Named export for the POST request handler
const handleCreateSettingsPolicy = async (request, context) => {
    const contentValidationResult = validateUnsupportedContent(
        request,
        settingsPolicyConstants.allowedContentTypes
    );
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Check if the "about" type already exists in MongoDB
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
        settingsPolicySchema.createSchema
    );

    if (await SettingsPolicyModel.exists({ type: userInput?.type })) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            `Settings policy entry with type "${userInput?.type}" already exists.`,
            {},
            {},
            request
        );
    }

    // Create a new "about" document with banner details
    const createdDocument = await SettingsPolicyModel.create(userInput);

    const filter = { _id: convertToObjectId(createdDocument?._id) };
    const projection = {};
    const pipeline = settingsPolicyPipeline(filter, projection);
    const settingsPolicyData = await SettingsPolicyModel.aggregate(pipeline);

    // Send a success response with the created document data
    return sendResponse(
        true,
        httpStatusConstants.CREATED,
        `Settings policy entry with type "${userInput?.type}" created successfully.`,
        settingsPolicyData,
        {},
        request
    );
};

// Named export for the PATCH request handler
const handleUpdateSettingsPolicy = async (request, context) => {
    const contentValidationResult = validateUnsupportedContent(
        request,
        settingsPolicyConstants.allowedContentTypes
    );
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Check if the "about" type already exists in MongoDB
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
        settingsPolicySchema.updateSchema
    );

    // Retrieve existing document and handle file replacement if needed
    const existingSettingsPolicyData = await SettingsPolicyModel.findOne({
        type: userInput?.type,
    });
    if (!existingSettingsPolicyData) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            `About entry with type "${userInput?.type}" not found.`,
            {},
            {},
            request
        );
    }

    // Filter `userInput` to only include fields with non-null values
    const fieldsToUpdate = Object.keys(userInput).reduce((acc, key) => {
        if (userInput[key] !== undefined && userInput[key] !== null) {
            acc[key] = userInput[key];
        }
        return acc;
    }, {});

    // Update the document with the filtered data
    const updatedDocument = await SettingsPolicyModel.findOneAndUpdate(
        { type: userInput?.type }, // Find document by type
        { $set: fieldsToUpdate },
        { new: true }
    ).lean();

    if (!updatedDocument) {
        return sendResponse(
            false,
            httpStatusConstants.INTERNAL_SERVER_ERROR,
            `Failed to update settings policy entry with type "${userInput?.type}".`,
            {},
            {},
            request
        );
    }

    const filter = { _id: convertToObjectId(updatedDocument?._id) };
    const projection = {};
    const pipeline = settingsPolicyPipeline(filter, projection);
    const settingsPolicyData = await SettingsPolicyModel.aggregate(pipeline);

    // Send a success response with the updated document data
    return sendResponse(
        true,
        httpStatusConstants.OK,
        `About entry with type "${userInput?.type}" updated successfully.`,
        settingsPolicyData,
        {},
        request
    );
};

// Named export for the POST request handler
const handleDeleteSettingsPolicy = async (request, context) => {
    // Check if the "executive" type already exists in MongoDB
    await mongodb.connect();

    // Validate admin
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response; // Return early with the authorization failure response
    }

    // Find the existing settings document
    const existingSettings = await SettingsPolicyModel.findOneAndDelete();
    if (!existingSettings) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            'Settings policy not found.',
            {},
            {},
            request
        );
    }

    // Send a success response with the created document data
    return sendResponse(
        true,
        httpStatusConstants.OK,
        'Settings policy deleted successfully.',
        {},
        {},
        request
    );
};

// Export the route wrapped with asyncHandler
export const POST = asyncHandler(handleCreateSettingsPolicy);

// Export the route wrapped with asyncHandler
export const PATCH = asyncHandler(handleUpdateSettingsPolicy);

// Export the route wrapped with asyncHandler
export const DELETE = asyncHandler(handleDeleteSettingsPolicy);
