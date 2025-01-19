import mongodb from '@/lib/mongodb';
import MemberModel from '@/app/api/v1/member/member.model';
import httpStatusConstants from '@/constants/httpStatus.constants';
import memberConstants from '@/app/api/v1/member/member.constants';
import memberSchema from '@/app/api/v1/member/member.schema';
import localFileOperations from '@/util/localFileOperations';
import serviceShared from '@/shared/service.shared';
import memberEmailTemplate from '@/app/api/v1/member/member.email.template';

import sendResponse from '@/util/sendResponse';
import asyncHandler from '@/util/asyncHandler';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import generateUniqueID from '@/util/generateUniqueID';
import createHashedPassword from '@/util/createHashedPassword';
import getNextSequence from '@/util/getNextSequence';
import convertToObjectId from '@/util/convertToObjectId';
import memberPipeline from '@/app/api/v1/member/member.pipeline';
import schemaShared from '@/shared/schema.shared';
import toSentenceCase from '@/util/toSentenceCase';

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

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'create',
        memberSchema.createSchema
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
            `A member entry with the provided details already exists. Please ensure all details are correct and unique.`,
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

// Named export for the GET request handler
const handleGetMember = async (request, context) => {
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'get',
        schemaShared.pagination
    );

    const query = userInput?.query;
    const filter = {};

    // Extract fields from the query and add them to the filter object if they are provided
    if (query) {
        const fields = [
            'name',
            'educationalBackground',
            'occupation',
            'workplace',
            'bloodGroup',
            'fatherName',
            'spouseName',
            'motherName',
            'email',
            'phone',
            'nid',
            'designation',
            'typeId',
            'statusId',
            'memberId',
        ];
        fields.forEach((field) => {
            if (query[field]) {
                filter[field] = query[field];
            }
        });
    }

    const pipeline = [{ $match: filter }];

    const { page, limit, isActive } = userInput.query || {};
    const currentPage = page !== undefined ? parseInt(page, 10) : null;
    const pageSize =
        limit !== undefined ? parseInt(limit, 10) : currentPage ? 10 : null; // Default limit if page exists

    // Add isActive filtering to the pipeline if provided
    if (isActive !== undefined) {
        const isActiveBool = isActive === 'true'; // Convert isActive to boolean
        filter.isActive = isActiveBool; // Add isActive filter to the main filter object
    }

    // Ensure MongoDB is connected
    await mongodb.connect();

    // Add pagination stages to the pipeline dynamically if applicable
    if (currentPage && pageSize) {
        pipeline.push(
            { $skip: (currentPage - 1) * pageSize },
            { $limit: pageSize }
        );
    }

    // Fetch data using the aggregation pipeline
    const returnData = await MemberModel.aggregate(pipeline);

    // Calculate total count if pagination is applied
    const totalCount =
        currentPage && pageSize
            ? await MemberModel.countDocuments(filter)
            : returnData.length;

    // Check if data exists
    if (!returnData.length) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            'No member available at this time.',
            {},
            {},
            request
        );
    }

    // Prepare pagination metadata if applicable
    const pagination =
        currentPage && pageSize
            ? {
                  currentPage,
                  pageSize,
                  totalPages: Math.ceil(totalCount / pageSize),
                  totalCount,
              }
            : null;

    // Send a success response with the fetched data and pagination metadata
    return sendResponse(
        true,
        httpStatusConstants.OK,
        'Member retrieved successfully.',
        returnData?.length > 1 ? returnData : returnData[0],
        pagination,
        request
    );
};

// Export the route wrapped with asyncHandler
export const POST = asyncHandler(handleCreateMember);

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetMember);
