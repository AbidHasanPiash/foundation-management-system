import httpStatusConstants from '@/constants/httpStatus.constants';

import getContentType from '@/util/getContentType';
import sendResponse from '@/util/sendResponse';

const validateUnsupportedContent = (request, allowedContentTypes) => {
    const contentType = getContentType(request);

    const isValid = allowedContentTypes.some((type) =>
        contentType.includes(type)
    );
    if (!isValid) {
        // Return early with a response if content type is unsupported
        return {
            isValid: false,
            response: sendResponse(
                false,
                httpStatusConstants.UNSUPPORTED_MEDIA_TYPE,
                `Unsupported Content-Type: ${contentType}`,
                {},
                request
            ),
        };
    }
    return { isValid: true };
};

export default validateUnsupportedContent;
