import mongodb from '@/lib/mongodb';
import serviceShared from '@/shared/service.shared';
import httpStatusConstants from '@/constants/httpStatus.constants';
import schemaShared from '@/shared/schema.shared';
import memberConstants from '@/app/api/v1/member/member.constants';
import localFileOperations from '@/util/localFileOperations';
import MemberModel from '@/app/api/v1/member/member.model';

import asyncHandler from '@/util/asyncHandler';
import validateToken from '@/util/validateToken';
import sendResponse from '@/util/sendResponse';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import generate6DigitFromUUID from '@/util/generate6DigitFromUUID';
import convertToObjectId from '@/util/convertToObjectId';
import profilePipeline from '@/app/api/v1/profile/profile.pipeline';

const { updateProfileSchema } = schemaShared;

// Named export for the GET request handler
const handleGetProfile = async (request) => {
    return await serviceShared.handleGetProfile(request);
};

// Named export for the PATCH request handler
const handleUpdateProfile = async (request, context) => {
    // Check if the "about" type already exists in MongoDB
    await mongodb.connect();

    // Validate admin
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response; // Return early with the authorization failure response
    }

    const existingMemberData = authResult.user;

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'update',
        updateProfileSchema
    );

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
        { _id: userInput?._id }, // Find document by type
        { $set: fieldsToUpdate },
        { new: true }
    ).lean();

    if (!updatedDocument) {
        return sendResponse(
            false,
            httpStatusConstants.INTERNAL_SERVER_ERROR,
            'Failed to profile.',
            {},
            {},
            request
        );
    }

    const filter = { _id: convertToObjectId(updatedDocument._id) };
    const projection = {};
    const pipeline = profilePipeline(filter, projection);
    const memberData = await MemberModel.aggregate(pipeline);

    // Send a success response with the updated document data
    return sendResponse(
        true,
        httpStatusConstants.OK,
        'Profile updated successfully.',
        memberData,
        {},
        request
    );
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetProfile);

// Export the route wrapped with asyncHandler
export const PATCH = asyncHandler(handleUpdateProfile);
