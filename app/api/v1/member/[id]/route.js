import serviceShared from '@/shared/service.shared';
import MemberModel from '@/app/api/v1/member/member.model';
import schemaShared from '@/shared/schema.shared';

import asyncHandler from '@/util/asyncHandler';
import convertToObjectId from '@/util/convertToObjectId';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import memberPipeline from '@/app/api/v1/member/member.pipeline';

const { idValidationSchema } = schemaShared;

// Named export for the GET request handler
const handleGetMemberById = async (request, context) => {
    // Parse and validate form data
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'get',
        idValidationSchema
    );

    const filter = { _id: convertToObjectId(userInput?.id) };
    const projection = {};
    const pipeline = memberPipeline(filter, projection);

    // Use the common fetchEntryById function to retrieve the data
    return serviceShared.fetchEntryById(
        MemberModel,
        pipeline,
        'Member',
        request,
        userInput
    );
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetMemberById);
