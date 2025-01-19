import httpStatusConstants from '@/constants/httpStatus.constants';
import mongodb from '@/lib/mongodb';
import MemberModel from '@/app/api/v1/member/member.model';
import localFileOperations from '@/util/localFileOperations';
import memberSchema from '@/app/api/v1/member/member.schema';
import memberConstants from '@/app/api/v1/member/member.constants';
import serviceShared from '@/shared/service.shared';
import schemaShared from '@/shared/schema.shared';
import StatusModel from '@/app/api/v1/status/status.model';
import statusConstants from '@/app/api/v1/status/status.constants';
import TypeModel from '@/app/api/v1/type/type.model';

import sendResponse from '@/util/sendResponse';
import asyncHandler from '@/util/asyncHandler';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import validateToken from '@/util/validateToken';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import generate6DigitFromUUID from '@/util/generate6DigitFromUUID';
import convertToObjectId from '@/util/convertToObjectId';
import memberPipeline from '@/app/api/v1/member/member.pipeline';

const { idValidationSchema } = schemaShared;

// Named export for the PATCH request handler
const handleUpdateMember = async (request, context) => {
    const contentValidationResult = validateUnsupportedContent(
        request,
        memberConstants.allowedContentTypes
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
        memberSchema.updateByAdminSchema
    );

    // Retrieve existing document and handle file replacement if needed
    const existingMemberData = await MemberModel.findOne({
        _id: userInput?.id,
    });
    if (!existingMemberData) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            `Member entry with ID "${userInput?.id}" not found.`,
            {},
            {},
            request
        );
    }

    // Check if the member NID exists
    if (userInput.nid && userInput?.nid === existingMemberData.nid) {
        return sendResponse(
            false,
            httpStatusConstants.CONFLICT,
            `Member entry with NID "${userInput?.nid}" already in used.`,
            {},
            {},
            request
        );
    }

    // Check if the member typeId exists
    if (userInput?.typeId) {
        if (
            !(await TypeModel.findOne({
                category: statusConstants.categories.member,
                _id: userInput?.typeId,
            }))
        ) {
            return sendResponse(
                false,
                httpStatusConstants.BAD_REQUEST,
                `Member typeId entry with ID "${userInput?.typeId}" not found.`,
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
                category: statusConstants.categories.member,
                _id: userInput?.statusId,
            }))
        ) {
            return sendResponse(
                false,
                httpStatusConstants.BAD_REQUEST,
                `Member statusId entry with ID "${userInput?.statusId}" not found.`,
                {},
                {},
                request
            );
        }
    }

    // Handle file replacement if a new file is provided
    let image = existingMemberData?.image;
    if (
        userInput[memberConstants.fileFieldName] &&
        userInput[memberConstants.fileFieldName][0]
    ) {
        // Ensure the file exists before accessing it
        const newFile = userInput[memberConstants.fileFieldName][0];
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
    if (image && image.link !== existingMemberData.image.link) {
        fieldsToUpdate.image = image;
    }

    if (!existingMemberData.memberId) {
        fieldsToUpdate.memberId =
            `mem-${userInput?.typeId}-${generate6DigitFromUUID()}`.toLowerCase();
    }

    // Update the document with the filtered data
    const updatedDocument = await MemberModel.findOneAndUpdate(
        { _id: userInput?.id }, // Find document by type
        { $set: fieldsToUpdate },
        { new: true }
    ).lean();

    if (!updatedDocument) {
        return sendResponse(
            false,
            httpStatusConstants.INTERNAL_SERVER_ERROR,
            `Failed to update member entry with id "${userInput?.id}".`,
            {},
            {},
            request
        );
    }

    const filter = { _id: convertToObjectId(updatedDocument?._id) };
    const projection = {};
    const pipeline = memberPipeline(filter, projection);
    const executiveData = await MemberModel.aggregate(pipeline);

    // Send a success response with the updated document data
    return sendResponse(
        true,
        httpStatusConstants.OK,
        `Member entry with id "${userInput?.id}" updated successfully.`,
        executiveData,
        {},
        request
    );
};

// Named export for the DELETE request handler
const handleDeleteMemberById = async (request, context) => {
    return serviceShared.deleteEntry(
        request,
        context,
        idValidationSchema,
        MemberModel,
        'image.id', // Projection field for file deletion
        `Member`
    );
};

// Export the route wrapped with asyncHandler
export const PATCH = asyncHandler(handleUpdateMember);

// Export the route wrapped with asyncHandler
export const DELETE = asyncHandler(handleDeleteMemberById);
