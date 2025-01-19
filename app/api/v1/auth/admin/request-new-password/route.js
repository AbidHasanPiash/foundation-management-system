import serviceShared from '@/shared/service.shared';
import AdminModel from '@/app/api/v1/admin/admin.model';

import asyncHandler from '@/util/asyncHandler';

const handleRequestNewPassword = async (request, context) => {
    return await serviceShared.handlePasswordResetRequest(
        request,
        context,
        AdminModel
    );
};

// Export the route wrapped with asyncHandler
export const PUT = asyncHandler(handleRequestNewPassword);
