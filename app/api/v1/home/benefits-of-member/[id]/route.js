import serviceShared from '@/shared/service.shared';
import HomeBenefitsOfMemberModel from '@/app/api/v1/home/benefits-of-member/home.benefits.of.member.model';
import schemaShared from '@/shared/schema.shared';

import asyncHandler from '@/util/asyncHandler';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import convertToObjectId from '@/util/convertToObjectId';
import homeBenefitsOfMemberPipeline from '@/app/api/v1/home/benefits-of-member/home.benefits.of.member.pipeline';

const { idValidationSchema } = schemaShared;

// Named export for the GET request handler
const handleGetHomeBenefitsOfMemberById = async (request, context) => {
    // Parse and validate form data
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'get',
        idValidationSchema
    );

    const filter = { _id: convertToObjectId(userInput?.id) };
    const projection = {};
    const pipeline = homeBenefitsOfMemberPipeline(filter, projection);

    // Use the common fetchEntryById function to retrieve the data
    return serviceShared.fetchEntryById(
        HomeBenefitsOfMemberModel,
        pipeline,
        'Home page benefits of members',
        request,
        userInput
    );
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetHomeBenefitsOfMemberById);
