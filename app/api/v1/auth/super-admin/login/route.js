import SuperAdminModel from '@/app/api/v1/auth/super-admin/super.admin.model';
import serviceShared from '@/shared/service.shared';

import asyncHandler from '@/util/asyncHandler';

const handleSuperAdminLogin = (request, context) => {
    return serviceShared.handleUserLogin(
        request,
        context,
        'super-admin',
        SuperAdminModel
    );
};

// Export the route wrapped with asyncHandler
export const POST = asyncHandler(handleSuperAdminLogin);
