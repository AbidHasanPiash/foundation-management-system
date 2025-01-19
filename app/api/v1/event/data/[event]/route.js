import httpStatusConstants from '@/constants/httpStatus.constants';
import mongodb from '@/lib/mongodb';
import localFileOperations from '@/util/localFileOperations';
import aboutSchema from '../../../about/about.schema';
import aboutConstants from '@/app/api/v1/about/about.constants';
import EventModel from '@/app/api/v1/event/event.model';
import MemberModel from '@/app/api/v1/member/member.model';
import eventConstants from '@/app/api/v1/event/event.constants';

import asyncHandler from '@/util/asyncHandler';
import sendResponse from '@/util/sendResponse';
import validateToken from '@/util/validateToken';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';

// Named export for the POST request handler
const handleSaveEventData = async (request, context) => {
    const contentValidationResult = validateUnsupportedContent(
        request,
        aboutConstants.allowedContentTypes
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

    const { params } = context;
    const eventId = params?.event;

    const existingEventData = await EventModel.findOne({ _id: eventId });
    if (!existingEventData) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            `Event entry with id "${eventId}" not found.`,
            {},
            {},
            request
        );
    }

    if (!existingEventData?.form) {
        return sendResponse(
            false,
            httpStatusConstants.BAD_REQUEST,
            `Event entry with id "${eventId}" does not support the provided data.`,
            {},
            {},
            request
        );
    }

    const formType = existingEventData?.form;
    let requiredBodyFields,
        requiredParamsFields,
        requiredQueryFields,
        schema,
        fileFieldName = null;
    if (formType === 'member') {
        requiredBodyFields = ['memberId'];
        requiredParamsFields = ['event'];
        requiredQueryFields = [];
        schema = aboutSchema.createSchema;
        fileFieldName = aboutConstants.fileFieldName;
    } else if (formType === 'donation') {
        requiredBodyFields = ['memberId'];
        requiredParamsFields = ['event'];
        requiredQueryFields = [];
        schema = aboutSchema.createSchema;
        fileFieldName = aboutConstants.fileFieldName;
    } else if (formType === 'member') {
        requiredBodyFields = ['memberId'];
        requiredParamsFields = ['event'];
        requiredQueryFields = [];
        schema = aboutSchema.createSchema;
        fileFieldName = aboutConstants.fileFieldName;
    } else {
        requiredBodyFields = ['memberId'];
        requiredParamsFields = ['event'];
        requiredQueryFields = [];
        schema = aboutSchema.createSchema;
        fileFieldName = aboutConstants.fileFieldName;
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'create',
        schema
    );

    const existingMemberData = await MemberModel.findOne({
        _id: userInput?.event,
    });
    if (!existingMemberData) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            `Event entry with id "${eventId}" not found.`,
            {},
            {},
            request
        );
    }

    // Upload file and generate link
    const { fileId, fileLink } = await localFileOperations.uploadFile(
        request,
        userInput[eventConstants.fileFieldName][0]
    );

    // Create a new "about" document with banner details
    const createdDocument = await EventModel.create({
        ...userInput,
        banner: { id: fileId, link: fileLink },
    });

    let projection = {};
    if (formType === 'member') {
        projection = {
            type: 1,
            title: 1,
            description: 1,
            banner: { $ifNull: ['$banner.link', ''] }, // Directly set `banner` to `banner.link` or an empty string if null
        };
    } else if (formType === 'donation') {
        projection = {
            type: 1,
            title: 1,
            description: 1,
            banner: { $ifNull: ['$banner.link', ''] }, // Directly set `banner` to `banner.link` or an empty string if null
        };
    } else if (formType === 'member') {
        projection = {
            type: 1,
            title: 1,
            description: 1,
            banner: { $ifNull: ['$banner.link', ''] }, // Directly set `banner` to `banner.link` or an empty string if null
        };
    } else {
        projection = {
            type: 1,
            title: 1,
            description: 1,
            banner: { $ifNull: ['$banner.link', ''] }, // Directly set `banner` to `banner.link` or an empty string if null
        };
    }

    const aboutData = await EventModel.findOne(
        { _id: createdDocument._id },
        { ...projection }
    ).lean();

    // Send a success response with the created document data
    return sendResponse(
        true,
        httpStatusConstants.CREATED,
        `Event data added successfully in the event id "${eventId}".`,
        aboutData,
        {},
        request
    );
};

// Export the route wrapped with asyncHandler
export const POST = asyncHandler(handleSaveEventData);
