import middlewareConstants from '@/constants/middleware.constants';
import httpStatusConstants from '@/constants/httpStatus.constants';

const permissionValidator = async (request) => {
    try {
        const userAgent = request.headers.get('user-agent') || '';
        const referer = request.headers.get('referer');
        const origin = request.headers.get('origin') ?? '';
        const requestedSite = request.headers.get('X-Site-Identifier') ?? '';

        // Block requests from specific user agents or missing headers
        const isBlockedUserAgent = middlewareConstants.blockedUserAgents.some(
            (ua) => userAgent.includes(ua)
        );

        const isBlockedSite = requestedSite !== 'foundation-management-system';

        if (isBlockedUserAgent || isBlockedSite) {
            // return new Response('Access Denied', { status: httpStatusConstants.FORBIDDEN });
        }

        // If everything passes, return null
        return null;
    } catch (error) {
        return new Response('Service unavailable', {
            status: httpStatusConstants.SERVICE_UNAVAILABLE,
        });
    }
};

export default permissionValidator;
