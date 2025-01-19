import httpStatusConstants from '@/constants/httpStatus.constants';
import mongodb from '@/lib/mongodb';
import localFileOperations from '@/util/localFileOperations';
import settingsLegalDocumentConstants from '@/app/api/v1/settings/legal/document/settings.legal.document.constants';
import settingsLegalDocumentSchema from '@/app/api/v1/settings/legal/document/settings.legal.document.schema';
import SettingsLegalDocumentModel from '@/app/api/v1/settings/legal/document/settings.legal.document.model';

import asyncHandler from '@/util/asyncHandler';
import sendResponse from '@/util/sendResponse';
import validateToken from '@/util/validateToken';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import settingsLegalDocumentPipeline from '@/app/api/v1/settings/legal/document/settings.legal.document.pipeline';
import convertToObjectId from '@/util/convertToObjectId';

// Named export for the POST request handler
const handleCreateSettingsLegalDocument = async (request, context) => {
    // Validate unsupported content
    const contentValidationResult = validateUnsupportedContent(
        request,
        settingsLegalDocumentConstants.allowedContentTypes
    );
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Connect to MongoDB
    await mongodb.connect();

    // Validate admin authorization
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response;
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'create',
        settingsLegalDocumentSchema.createSchema
    );

    // Check if a settings legal document already exists
    const existingSettings = await SettingsLegalDocumentModel.findOne();
    if (existingSettings) {
        return sendResponse(
            false,
            httpStatusConstants.CONFLICT,
            'Settings legal document already exists. Please update the existing document.',
            {},
            {},
            request
        );
    }

    // Process and upload documents
    const documents =
        userInput?.documents?.map(async (entry) => {
            const { document } = entry; // Extract the document
            const { fileId, fileLink } = await localFileOperations.uploadFile(
                request,
                document
            );
            return {
                name: entry.name,
                id: fileId,
                link: fileLink,
            };
        }) || [];

    const uploadedDocuments = await Promise.all(documents);

    // Create the new settings legal document
    let createdDocument;
    try {
        createdDocument = await SettingsLegalDocumentModel.create({
            title: userInput.title,
            effectiveDate: userInput.effectiveDate,
            description: userInput.description,
            documents: uploadedDocuments,
        });
    } catch (error) {
        return sendResponse(
            false,
            httpStatusConstants.INTERNAL_SERVER_ERROR,
            'Failed to create settings legal document.',
            { error: error.message },
            {},
            request
        );
    }

    const filter = { _id: convertToObjectId(createdDocument._id) };
    const projection = {};
    const pipeline = settingsLegalDocumentPipeline(filter, projection);
    const data = await SettingsLegalDocumentModel.aggregate(pipeline);

    // Send a success response
    return sendResponse(
        true,
        httpStatusConstants.CREATED,
        'Settings legal document created successfully.',
        data,
        {},
        request
    );
};

// Named export for the PATCH request handler
const handleUpdateSettingsLegalDocument = async (request, context) => {
    // Validate unsupported content
    const contentValidationResult = validateUnsupportedContent(
        request,
        settingsLegalDocumentConstants.allowedContentTypes
    );
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Connect to MongoDB
    await mongodb.connect();

    // Validate admin authorization
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response;
    }

    // Parse and validate form data for updating
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'update',
        settingsLegalDocumentSchema.updateSchema
    );

    // Retrieve the existing document
    const existingSettings = await SettingsLegalDocumentModel.findOne();
    if (!existingSettings) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            'Settings legal document not found. Please create the settings first.',
            {},
            {},
            request
        );
    }

    // Process and upload new documents if provided
    let uploadedDocuments = [];
    if (userInput?.documents) {
        const documentOperations = userInput.documents.map(async (entry) => {
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

        uploadedDocuments = await Promise.all(documentOperations);

        // Collect IDs of documents to retain
        const updatedDocumentIds = new Set(
            uploadedDocuments.map((doc) => doc.id)
        );

        // Determine documents to delete
        const documentsToDeleteIds = existingSettings.documents
            .filter((doc) => !updatedDocumentIds.has(doc.id))
            .map((doc) => doc.id);

        // Delete unneeded documents
        if (documentsToDeleteIds.length > 0) {
            const deletionPromises = documentsToDeleteIds.map((docId) =>
                localFileOperations.deleteFile(docId)
            );
            await Promise.all(deletionPromises);
        }

        // Update settings with the new document list
        existingSettings.documents = uploadedDocuments;
        await existingSettings.save();
    }

    // Update the settings with any other user-provided data
    const fieldsToUpdate = { ...userInput, documents: uploadedDocuments };
    const updatedSettings = await SettingsLegalDocumentModel.findOneAndUpdate(
        {},
        { $set: fieldsToUpdate },
        { new: true, lean: true }
    );

    if (!updatedSettings) {
        return sendResponse(
            false,
            httpStatusConstants.INTERNAL_SERVER_ERROR,
            'Failed to update settings legal document.',
            {},
            {},
            request
        );
    }

    const filter = { _id: convertToObjectId(updatedSettings._id) };
    const projection = {};
    const pipeline = settingsLegalDocumentPipeline(filter, projection);
    const data = await SettingsLegalDocumentModel.aggregate(pipeline);

    // Send a success response
    return sendResponse(
        true,
        httpStatusConstants.OK,
        'Settings legal document updated successfully.',
        data,
        {},
        request
    );
};

// Named export for the DELETE request handler
const handleDeleteSettingsLegalDocument = async (request) => {
    // Check if the "executive" type already exists in MongoDB
    await mongodb.connect();

    // Validate admin
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response; // Return early with the authorization failure response
    }

    // Find the existing settings document
    const existingSettings =
        await SettingsLegalDocumentModel.findOneAndDelete();
    if (!existingSettings) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            'Settings legal document not found.',
            {},
            {},
            request
        );
    }

    // Delete all files associated with the event
    if (existingSettings.document?.id) {
        await localFileOperations.deleteFile(existingSettings?.document?.id);
    }

    // Send a success response with the created document data
    return sendResponse(
        true,
        httpStatusConstants.OK,
        'Settings legal document deleted successfully.',
        {},
        {},
        request
    );
};

// Export the route wrapped with asyncHandler
export const POST = asyncHandler(handleCreateSettingsLegalDocument);

// Export the route wrapped with asyncHandler
export const PATCH = asyncHandler(handleUpdateSettingsLegalDocument);

// Export the route wrapped with asyncHandler
export const DELETE = asyncHandler(handleDeleteSettingsLegalDocument);
