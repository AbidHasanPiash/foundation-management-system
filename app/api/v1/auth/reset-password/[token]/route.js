import serviceShared from '@/shared/service.shared';
import MemberModel from '@/app/api/v1/member/member.model';

import asyncHandler from '@/util/asyncHandler';

const handleResetPassword = async (request, context) => {
    return await serviceShared.handlePasswordReset(
        request,
        context,
        MemberModel
    );
};

// Export the route wrapped with asyncHandler
export const PUT = asyncHandler(handleResetPassword);
