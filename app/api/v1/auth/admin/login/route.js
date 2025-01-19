import AdminModel from '@/app/api/v1/admin/admin.model';
import serviceShared from '@/shared/service.shared';

import asyncHandler from '@/util/asyncHandler';

const handleAdminLogin = (request, context) => {
    return serviceShared.handleUserLogin(request, context, 'admin', AdminModel);
};

// Export the route wrapped with asyncHandler
export const POST = asyncHandler(handleAdminLogin);
