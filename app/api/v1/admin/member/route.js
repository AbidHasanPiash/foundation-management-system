import httpStatusConstants from '@/constants/httpStatus.constants';
import mongodb from '@/lib/mongodb';
import localFileOperations from '@/util/localFileOperations';
import memberConstants from '@/app/api/v1/member/member.constants';
import memberSchema from '@/app/api/v1/member/member.schema';
import MemberModel from '@/app/api/v1/member/member.model';
import StatusModel from '@/app/api/v1/status/status.model';
import TypeModel from '@/app/api/v1/type/type.model';
import statusConstants from '@/app/api/v1/status/status.constants';
import memberEmailTemplate from '@/app/api/v1/member/member.email.template';

import asyncHandler from '@/util/asyncHandler';
import sendResponse from '@/util/sendResponse';
import validateToken from '@/util/validateToken';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import createHashedPassword from '@/util/createHashedPassword';
import generateUniqueID from '@/util/generateUniqueID';
import getNextSequence from '@/util/getNextSequence';
import convertToObjectId from '@/util/convertToObjectId';
import memberPipeline from '@/app/api/v1/member/member.pipeline';

// Named export for the POST request handler
const handleCreateMember = async (request, context) => {
    const contentValidationResult = validateUnsupportedContent(
        request,
        memberConstants.allowedContentTypes
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
        memberSchema.createByAdminSchema
    );

    const existingMember = await MemberModel.exists({
        $or: [
            { email: userInput?.email },
            { phone: userInput?.phone },
            { nid: userInput?.nid },
        ],
    });
    if (existingMember) {
        return sendResponse(
            false,
            httpStatusConstants.CONFLICT,
            `Member entry with email: "${userInput?.email}", phone: "${userInput?.phone}" and nid: "${userInput?.nid}" already exists.`,
            {},
            {},
            request
        );
    }

    // Check if the member typeId exists
    const memberTypeData = await TypeModel.findOne({
        category: statusConstants.categories.member,
        _id: userInput?.typeId,
    });
    if (!memberTypeData) {
        return sendResponse(
            false,
            httpStatusConstants.BAD_REQUEST,
            `Team executive entry with type ID "${userInput?.typeId}" not found.`,
            {},
            {},
            request
        );
    }

    // Check if the member statusId exists
    if (
        !(await StatusModel.exists({
            category: statusConstants.categories.member,
            _id: userInput?.statusId,
        }))
    ) {
        return sendResponse(
            false,
            httpStatusConstants.BAD_REQUEST,
            `Team executive entry with status ID "${userInput?.statusId}" not found.`,
            {},
            {},
            request
        );
    }

    // Upload file and generate link
    const { fileId, fileLink } = await localFileOperations.uploadFile(
        request,
        userInput[memberConstants.fileFieldName][0]
    );

    const tempPassword = generateUniqueID('T3mp');
    const tempHashPassword = await createHashedPassword(tempPassword);
    const memberId = `${memberTypeData?.type?.substring(0, 3).toLowerCase()}-${await getNextSequence('memberId')}`;

    // Create a new "executive" document with image details
    const createdDocument = await MemberModel.create({
        ...userInput,
        image: { id: fileId, link: fileLink },
        password: tempHashPassword,
        memberId,
    });

    await memberEmailTemplate.accountCreationSuccessfulNotification(
        userInput.email,
        userInput.name,
        tempPassword
    );

    const filter = { _id: convertToObjectId(createdDocument?._id) };
    const projection = {};
    const pipeline = memberPipeline(filter, projection);
    const executiveData = await MemberModel.aggregate(pipeline);

    // Send a success response with the created document data
    return sendResponse(
        true,
        httpStatusConstants.CREATED,
        `Member entry with name "${userInput.name}" created successfully.`,
        executiveData,
        {},
        request
    );
};

// Export the route wrapped with asyncHandler
export const POST = asyncHandler(handleCreateMember);
