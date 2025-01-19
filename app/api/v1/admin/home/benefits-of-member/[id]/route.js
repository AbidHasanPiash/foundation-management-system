import httpStatusConstants from '@/constants/httpStatus.constants';
import mongodb from '@/lib/mongodb';
import homeBenefitsOfMemberConstants from '@/app/api/v1/home/benefits-of-member/home.benefits.of.member.constants';
import homeBenefitsOfMemberSchema from '@/app/api/v1/home/benefits-of-member/home.benefits.of.member.schema';
import HomeBenefitsOfMemberModel from '@/app/api/v1/home/benefits-of-member/home.benefits.of.member.model';
import serviceShared from '@/shared/service.shared';
import schemaShared from '@/shared/schema.shared';

import asyncHandler from '@/util/asyncHandler';
import sendResponse from '@/util/sendResponse';
import validateToken from '@/util/validateToken';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import convertToObjectId from '@/util/convertToObjectId';
import homeBenefitsOfMemberPipeline from '@/app/api/v1/home/benefits-of-member/home.benefits.of.member.pipeline';

const { idValidationSchema } = schemaShared;

// Named export for the PATCH request handler
const handleUpdateHomePageBenefitsOfMember = async (request, context) => {
    const contentValidationResult = validateUnsupportedContent(
        request,
        homeBenefitsOfMemberConstants.allowedContentTypes
    );
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Check if the "home page benefitsOfMembers" type already exists in MongoDB
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
        homeBenefitsOfMemberSchema.updateSchema
    );

    // Retrieve existing document and handle file replacement if needed
    const existingHomeBenefitsOfMemberData =
        await HomeBenefitsOfMemberModel.findOne({ _id: userInput?.id });
    if (!existingHomeBenefitsOfMemberData) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            `Home page benefits of members entry with id "${userInput?.id}" not found.`,
            {},
            {},
            request
        );
    }

    if (await HomeBenefitsOfMemberModel.exists({ text: userInput?.text })) {
        return sendResponse(
            false,
            httpStatusConstants.CONFLICT,
            `Home page benefits of members entry with title "${userInput?.text}" already exists.`,
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
    const updatedDocument = await HomeBenefitsOfMemberModel.findOneAndUpdate(
        { _id: userInput?.id }, // Find document by id
        { $set: fieldsToUpdate },
        { new: true }
    ).lean();

    if (!updatedDocument) {
        return sendResponse(
            false,
            httpStatusConstants.INTERNAL_SERVER_ERROR,
            `Failed to update home page benefits of members entry with id "${userInput?.id}".`,
            {},
            {},
            request
        );
    }

    const filter = { _id: convertToObjectId(updatedDocument?._id) };
    const projection = {};
    const pipeline = homeBenefitsOfMemberPipeline(filter, projection);
    const homeBenefitsOfMemberData =
        await HomeBenefitsOfMemberModel.aggregate(pipeline);

    // Send a success response with the created document data
    return sendResponse(
        true,
        httpStatusConstants.CREATED,
        `Home page benefits of members entry with id "${userInput?.id}" updated successfully.`,
        homeBenefitsOfMemberData,
        {},
        request
    );
};

// Named export for the POST request handler
const handleDeleteHomePageBenefitsOfMember = async (request, context) => {
    return serviceShared.deleteEntry(
        request,
        context,
        idValidationSchema,
        HomeBenefitsOfMemberModel,
        '', // Projection field for file deletion
        `Home page benefits of members`
    );
};

// Export the route wrapped with asyncHandler
export const PATCH = asyncHandler(handleUpdateHomePageBenefitsOfMember);

// Export the route wrapped with asyncHandler
export const DELETE = asyncHandler(handleDeleteHomePageBenefitsOfMember);
