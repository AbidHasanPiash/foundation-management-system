import serviceShared from '@/shared/service.shared';
import SuperAdminModel from '@/app/api/v1/auth/super-admin/super.admin.model';

import asyncHandler from '@/util/asyncHandler';

const handleResetPassword = async (request, context) => {
    return await serviceShared.handlePasswordReset(
        request,
        context,
        SuperAdminModel
    );
};

// Export the route wrapped with asyncHandler
export const PUT = asyncHandler(handleResetPassword);
