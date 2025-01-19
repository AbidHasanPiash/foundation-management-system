import serviceShared from '@/shared/service.shared';
import SuperAdminModel from '@/app/api/v1/auth/super-admin/super.admin.model';

import asyncHandler from '@/util/asyncHandler';

const handleRequestNewPassword = async (request, context) => {
    return await serviceShared.handlePasswordResetRequest(
        request,
        context,
        SuperAdminModel
    );
};

// Export the route wrapped with asyncHandler
export const PUT = asyncHandler(handleRequestNewPassword);
