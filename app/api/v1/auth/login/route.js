import MemberModel from '@/app/api/v1/member/member.model';
import serviceShared from '@/shared/service.shared';

import asyncHandler from '@/util/asyncHandler';

const handleMemberLogin = (request, context) => {
    return serviceShared.handleUserLogin(
        request,
        context,
        'member',
        MemberModel
    );
};
// Export the route wrapped with asyncHandler
export const POST = asyncHandler(handleMemberLogin);
