import AdminModel from '@/app/api/v1/admin/admin.model';
import httpStatusConstants from '@/constants/httpStatus.constants';

import asyncHandler from '@/util/asyncHandler';
import convertToObjectId from '@/util/convertToObjectId';
import sendResponse from '@/util/sendResponse';

const handleVerifyUser = async (request, context) => {
    const { params } = context;
    const userId = convertToObjectId(params.id);
    const existingUser = await AdminModel.findOne({ _id: userId }).lean();

    if (!existingUser) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            'User not found.',
            {},
            {},
            request
        );
    }

    return sendResponse(
        true,
        httpStatusConstants.OK,
        'User verified.',
        existingUser,
        {},
        request
    );
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleVerifyUser);
