import httpStatusConstants from '@/constants/httpStatus.constants';

import sendResponse from '@/util/sendResponse';

// Utility function for unauthorized response
const unauthorizedResponse = (message, request) => {
    return sendResponse(
        false,
        httpStatusConstants.UNAUTHORIZED,
        message,
        {},
        {},
        request
    );
};

// Utility function for authorized response
const authorizedResponse = (message, returnData, request) => {
    return sendResponse(
        true,
        httpStatusConstants.OK,
        message,
        returnData,
        {},
        request
    );
};

const authUtilities = {
    unauthorizedResponse,
    authorizedResponse,
};

export default authUtilities;
