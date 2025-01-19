import httpStatusConstants from '@/constants/httpStatus.constants';
import contentTypesConstants from '@/constants/contentTypes.constants';
import logger from '@/lib/logger';

import getCallerFunctionName from '@/util/getCallerFunctionName';
import getDeviceType from '@/util/getDeviceType';

const sendResponse = (
    success,
    status = httpStatusConstants.OK,
    message,
    data = {},
    pagination = {},
    request,
    headers = { 'Content-Type': contentTypesConstants.JSON },
    functionName = getCallerFunctionName()
) => {
    // Detecting device type from User-Agent
    const userAgent = request.headers.get('User-Agent') || '';
    const deviceType = getDeviceType(userAgent);

    // Detecting timezone from headers, if available
    const timezone =
        request.headers.get('Time-Zone') ||
        Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Logging based on the status
    if (status >= 200 && status < 300) {
        logger.info(`RESPONSE SUCCESS: ${functionName} ${status}`);
    } else if (status >= 400 && status < 500) {
        logger.warn(`CLIENT ERROR: ${functionName} ${status}`);
    } else if (status >= 500) {
        logger.error(`SERVER ERROR: ${functionName} ${status}`);
    }

    // const response = {
    //     ...(new Date().toISOString() && { timeStamp: new Date().toISOString() }), // Always include the timestamp
    //     ...(request?.method && { method: request.method }), // Include only if method is defined
    //     ...(request?.url && { route: request.url }), // Include only if route is defined
    //     ...(deviceType && { deviceType }), // Include only if deviceType is present
    //     ...(timezone && { timezone }), // Include only if timezone is present
    //     ...(success && { success }), // Include only if success is defined
    //     ...(status && { status }), // Include only if status is defined
    //     ...(message && { message }), // Include only if message is defined
    //     ...(data && { data }), // Include only if data is defined
    //     ...(pagination && { pagination }) // Include only if pagination is defined
    // }

    const buildResponse = (props) =>
        Object.fromEntries(Object.entries(props).filter(([_, value]) => value));

    const response = buildResponse({
        timeStamp: new Date().toISOString(),
        method: request?.method,
        route: request?.url,
        deviceType,
        timezone,
        success,
        status,
        message,
        data,
        pagination,
    });

    logger.info(`Response: ${JSON.stringify(response)}`);

    return new Response(JSON.stringify(response), {
        status,
        headers: { ...headers },
    });
};

export default sendResponse;
