import httpStatusConstants from '@/constants/httpStatus.constants';
import mongodb from '@/lib/mongodb';
import homeBenefitsOfMemberConstants from '@/app/api/v1/home/benefits-of-member/home.benefits.of.member.constants';
import homeBenefitsOfMemberSchema from '@/app/api/v1/home/benefits-of-member/home.benefits.of.member.schema';
import HomeBenefitsOfMemberModel from '@/app/api/v1/home/benefits-of-member/home.benefits.of.member.model';

import asyncHandler from '@/util/asyncHandler';
import sendResponse from '@/util/sendResponse';
import validateToken from '@/util/validateToken';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import convertToObjectId from '@/util/convertToObjectId';
import homeBenefitsOfMemberPipeline from '@/app/api/v1/home/benefits-of-member/home.benefits.of.member.pipeline';

// Named export for the POST request handler
const handleCreateHomeBenefitsOfMember = async (request, context) => {
    const contentValidationResult = validateUnsupportedContent(
        request,
        homeBenefitsOfMemberConstants.allowedContentTypes
    );
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Check if the "home page BenefitsOfMember" type already exists in MongoDB
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
        homeBenefitsOfMemberSchema.createSchema
    );

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

    // Create a new "home page BenefitsOfMember" document with image details
    const createdDocument = await HomeBenefitsOfMemberModel.create(userInput);

    const filter = { _id: convertToObjectId(createdDocument?._id) };
    const projection = {};
    const pipeline = homeBenefitsOfMemberPipeline(filter, projection);
    const homeBenefitsOfMemberData =
        await HomeBenefitsOfMemberModel.aggregate(pipeline);

    // Send a success response with the created document data
    return sendResponse(
        true,
        httpStatusConstants.CREATED,
        `Home page benefits of members entry with title "${userInput?.text}" created successfully.`,
        homeBenefitsOfMemberData,
        {},
        request
    );
};

// Export the route wrapped with asyncHandler
export const POST = asyncHandler(handleCreateHomeBenefitsOfMember);
