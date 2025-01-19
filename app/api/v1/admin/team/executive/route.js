import httpStatusConstants from '@/constants/httpStatus.constants';
import mongodb from '@/lib/mongodb';
import localFileOperations from '@/util/localFileOperations';
import teamExecutiveConstants from '@/app/api/v1/team/executive/team.executive.constants';
import teamExecutiveSchema from '@/app/api/v1/team/executive/team.executive.schema';
import TeamExecutiveModel from '@/app/api/v1/team/executive/team.executive.model';
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

// Named export for the POST request handler
const handleCreateExecutive = async (request, context) => {
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
        'create',
        teamExecutiveSchema.createSchema
    );

    if (await TeamExecutiveModel.exists({ email: userInput.email })) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            `Team executive entry with email "${userInput.email}" already exists.`,
            {},
            {},
            request
        );
    }

    if (
        !(await StatusModel.exists({
            category: statusConstants.categories.team,
            _id: convertToObjectId(userInput?.statusId),
        }))
    ) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            `Team entry with status ID "${userInput?.statusId}" not found.`,
            {},
            {},
            request
        );
    }

    if (
        !(await TypeModel.exists({
            category: statusConstants.categories.team,
            _id: convertToObjectId(userInput?.typeId),
        }))
    ) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            `Team entry with type ID "${userInput?.typeId}" not found.`,
            {},
            {},
            request
        );
    }

    // Upload file and generate link
    const { fileId, fileLink } = await localFileOperations.uploadFile(
        request,
        userInput[teamExecutiveConstants.fileFieldName][0]
    );

    // Create a new "executive" document with image details
    const createdDocument = await TeamExecutiveModel.create({
        ...userInput,
        image: { id: fileId, link: fileLink },
    });

    const filter = { _id: convertToObjectId(createdDocument?._id) };
    const projection = {};
    const pipeline = teamExecutivePipeline(filter, projection);
    const executiveData = await TeamExecutiveModel.aggregate(pipeline);

    // Send a success response with the created document data
    return sendResponse(
        true,
        httpStatusConstants.CREATED,
        `Team executive entry with name "${userInput.name}" created successfully.`,
        executiveData,
        {},
        request
    );
};

// Export the route wrapped with asyncHandler
export const POST = asyncHandler(handleCreateExecutive);
