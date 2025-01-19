import serviceShared from '@/shared/service.shared';
import HomeBenefitsOfMemberModel from '@/app/api/v1/home/benefits-of-member/home.benefits.of.member.model';

import asyncHandler from '@/util/asyncHandler';
import homeBenefitsOfMemberPipeline from '@/app/api/v1/home/benefits-of-member/home.benefits.of.member.pipeline';

// Named export for the GET request handler
const handleGeHomeBenefitsOfMembers = async (request, context) => {
    const filter = {};
    const projection = {};
    const pipeline = homeBenefitsOfMemberPipeline(filter, projection);

    return serviceShared.fetchEntryList(
        HomeBenefitsOfMemberModel,
        pipeline,
        'home page benefits of members',
        request,
        context
    );
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGeHomeBenefitsOfMembers);
