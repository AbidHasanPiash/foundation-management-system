import { NextResponse } from 'next/server';

import httpMethodsConstants from '@/constants/httpMethods.constants';
import middlewareConstants from '@/constants/middleware.constants';

import getEnvironmentData from '@/util/getEnvironmentData';

const corsMiddleware = async (request, token) => {
    const headers = request.headers;
    const { pathname } = request.nextUrl;
    const response = NextResponse.next();

    const allowedOrigins =
        getEnvironmentData('CORS_ALLOWED_ORIGIN')?.split(',') || [];
    const allowedMethods = getEnvironmentData('CORS_ALLOWED_METHODS');
    const allowedHeaders = getEnvironmentData('CORS_ALLOWED_HEADERS');
    const allowedSiteIdentifier = getEnvironmentData('AUTH_X_SITE_IDENTIFIER');
    const allowedUserAgentForDebug = getEnvironmentData(
        'DEBUG_ALLOWED_USER_AGENT'
    );
    const debugKey = getEnvironmentData('DEBUG_KEY');

    const origin = headers.get('origin') ?? '';
    const userAgent = headers.get('user-agent') || '';
    const requestedSiteIdentifier = headers.get('X-Site-Identifier') ?? '';
    const requestedSiteDebugKey = headers.get('X-Site-Debug-Key') ?? '';

    const corsOptions = {
        'Access-Control-Allow-Methods': allowedMethods,
        'Access-Control-Allow-Headers': allowedHeaders,
    };

    const isAllowedOrigin = allowedOrigins.some((ao) => ao.includes(origin));
    const isPreflight = request.method === httpMethodsConstants.OPTIONS;

    // Handle CORS preflight requests
    if (isPreflight) {
        const preflightHeaders = {
            ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
            ...corsOptions,
        };
        return NextResponse.json({}, { headers: preflightHeaders });
    }

    // Validate CORS origin
    if (!isAllowedOrigin) {
        return new Response('CORS Origin Not Allowed', { status: 403 });
    }

    // Set CORS headers for valid requests
    response.headers.set('Access-Control-Allow-Origin', origin);
    Object.entries(corsOptions).forEach(([key, value]) =>
        response.headers.set(key, value)
    );

    const blockedUserAgents = middlewareConstants.blockedUserAgents;
    const isBlockedUserAgent = blockedUserAgents.some((ua) =>
        userAgent.includes(ua)
    );
    const isBlockedSite = requestedSiteIdentifier !== allowedSiteIdentifier;
    const isDebugUserAgent = userAgent.includes(allowedUserAgentForDebug);
    const isBlockedRequest = isBlockedUserAgent || isBlockedSite;
    const isDebugAuthorized = debugKey === requestedSiteDebugKey;
    const isRequestAllowedForDebug =
        isDebugUserAgent &&
        isAllowedOrigin &&
        !isBlockedSite &&
        isDebugAuthorized;

    // Check blocked user agents or invalid site identifiers
    if (!isRequestAllowedForDebug) {
        if (isBlockedRequest) {
            // return new Response('Access Denied', { status: 403 });
        }
    }

    // Handle authentication for admin routes
    if (pathname.startsWith('/admin') && !token) {
        console.log(
            'Redirecting to /auth/login: Unauthenticated access attempt'
        );
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Redirect authenticated users trying to access auth pages
    if (pathname.startsWith('/auth') && token) {
        console.log(
            'Redirecting to /admin: Authenticated user trying to access auth URL'
        );
        return NextResponse.redirect(new URL('/admin', request.url));
    }

    // Return the response for valid requests
    return response;
};

export default corsMiddleware;
