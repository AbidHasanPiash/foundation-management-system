import serviceShared from '@/shared/service.shared';

import asyncHandler from '@/util/asyncHandler';

// Named export for the GET request handler
const handleGetProfile = async (request) => {
    return await serviceShared.handleGetProfile(request);
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetProfile);
