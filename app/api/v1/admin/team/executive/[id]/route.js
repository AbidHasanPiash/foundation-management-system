import httpStatusConstants from '@/constants/httpStatus.constants';
import mongodb from '@/lib/mongodb';
import localFileOperations from '@/util/localFileOperations';
import teamExecutiveConstants from '@/app/api/v1/team/executive/team.executive.constants';
import teamExecutiveSchema from '@/app/api/v1/team/executive/team.executive.schema';
import TeamExecutiveModel from '@/app/api/v1/team/executive/team.executive.model';
import serviceShared from '@/shared/service.shared';
import schemaShared from '@/shared/schema.shared';
import StatusModel from '@/app/api/v1/status/status.model';
import statusConstants from '@/app/api/v1/status/status.constants';
import TypeModel from '@/app/api/v1/type/type.model';

import asyncHandler from '@/util/asyncHandler';
import sendResponse from '@/util/sendResponse';
import validateToken from '@/util/validateToken';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import convertToObjectId from '@/util/convertToObjectId';
import teamExecutivePipeline from '@/app/api/v1/team/executive/team.executive.pipeline';

const { idValidationSchema } = schemaShared;

// Named export for the PATCH request handler
const handleUpdateExecutive = async (request, context) => {
    const contentValidationResult = validateUnsupportedContent(
        request,
        teamExecutiveConstants.allowedContentTypes
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
        teamExecutiveSchema.updateSchema
    );

    // Retrieve existing document and handle file replacement if needed
    const existingExecutiveData = await TeamExecutiveModel.findOne({
        _id: userInput?.id,
    });
    if (!existingExecutiveData) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            `Team executive entry with ID "${userInput?.id}" not found.`,
            {},
            {},
            request
        );
    }

    // Check if the member typeId exists
    if (userInput?.typeId) {
        if (
            !(await TypeModel.findOne({
                category: statusConstants.categories.team,
                _id: userInput?.typeId,
            }))
        ) {
            return sendResponse(
                false,
                httpStatusConstants.BAD_REQUEST,
                `Team executive entry with ID "${userInput?.typeId}" not found.`,
                {},
                {},
                request
            );
        }
    }

    // Check if the member statusId exists
    if (userInput?.statusId) {
        if (
            !(await StatusModel.exists({
                category: statusConstants.categories.team,
                _id: userInput?.statusId,
            }))
        ) {
            return sendResponse(
                false,
                httpStatusConstants.BAD_REQUEST,
                `Team executive entry with ID "${userInput?.statusId}" not found.`,
                {},
                {},
                request
            );
        }
    }

    // Handle file replacement if a new file is provided
    let image = existingExecutiveData.image;
    if (
        userInput[teamExecutiveConstants.fileFieldName] &&
        userInput[teamExecutiveConstants.fileFieldName][0]
    ) {
        // Ensure the file exists before accessing it
        const newFile = userInput[teamExecutiveConstants.fileFieldName][0];
        await localFileOperations.deleteFile(image.id); // Delete old file
        const uploadFileResponse = await localFileOperations.uploadFile(
            request,
            newFile
        ); // Upload new file
        image = {
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

    // Add the image field if it has been replaced
    if (image && image.link !== existingExecutiveData.image.link) {
        fieldsToUpdate.image = image;
    }

    // Update the document with the filtered data
    const updatedDocument = await TeamExecutiveModel.findOneAndUpdate(
        { _id: userInput.id }, // Find document by type
        { $set: fieldsToUpdate },
        { new: true }
    ).lean();

    if (!updatedDocument) {
        return sendResponse(
            false,
            httpStatusConstants.INTERNAL_SERVER_ERROR,
            `Failed to update team executive entry with type "${userInput?.id}".`,
            {},
            {},
            request
        );
    }

    const filter = { _id: convertToObjectId(updatedDocument?._id) };
    const projection = {};
    const pipeline = teamExecutivePipeline(filter, projection);
    const executiveData = await TeamExecutiveModel.aggregate(pipeline);

    // Send a success response with the updated document data
    return sendResponse(
        true,
        httpStatusConstants.OK,
        `Team executive entry with id "${userInput?.id}" updated successfully.`,
        executiveData,
        {},
        request
    );
};

// Named export for the POST request handler
const handleDeleteExecutive = async (request, context) => {
    return serviceShared.deleteEntry(
        request,
        context,
        idValidationSchema,
        TeamExecutiveModel,
        'image.id', // Projection field for file deletion
        `Team executive`
    );
};

// Export the route wrapped with asyncHandler
export const PATCH = asyncHandler(handleUpdateExecutive);

// Export the route wrapped with asyncHandler
export const DELETE = asyncHandler(handleDeleteExecutive);
