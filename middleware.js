import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

import appConfig from '@/configs/appConfig';

import { decryptData } from '@/util/crypto.client';
import corsMiddleware from '@/middlewares/cors.middleare';

const clearCookies = (response) => {
    response.cookies.set(appConfig?.CurrentUserToken, '', {
        httpOnly: true,
        secure: true,
        maxAge: -1,
        sameSite: 'Strict',
    });
    response.cookies.set(appConfig?.CurrentUserRefToken, '', {
        httpOnly: true,
        secure: true,
        maxAge: -1,
        sameSite: 'Strict',
    });
    return response;
};

const validateToken = async (token) => {
    try {
        const decryptedToken = decryptData(token);
        const secret = new TextEncoder().encode(
            process.env.JWT_ACCESS_TOKEN_SECRET
        );

        const { payload } = await jwtVerify(decryptedToken, secret);

        return payload?.currentUser || null;
    } catch (error) {
        console.error('Invalid or expired token:', error.message);
        return null;
    }
};

export async function middleware(request, response) {
    const { cookies, nextUrl } = request;
    const { pathname } = nextUrl;
    const token = cookies.get(appConfig?.CurrentUserToken)?.value;

    // Define route type flags
    const isAPI = pathname.startsWith('/api');
    const isAdmin = pathname.startsWith('/admin');
    const isAuthPage =
        pathname.startsWith('/auth/login') ||
        pathname.startsWith('/auth/sa-login');
    const isMemberLogin = pathname.startsWith('/auth/member-login');
    const isMemberProfile = pathname.startsWith('/member/profile');
    const isHomePage = pathname === '/';

    // Initialize user data and roles
    let userData = null;
    let isAdminRole = false;
    let isMemberRole = false;

    // Validate and decode token
    if (token) {
        userData = await validateToken(token);

        if (userData) {
            isAdminRole = ['admin', 'super-admin'].includes(userData?.userType);
            isMemberRole = userData?.userType === 'member';
            console.log('@@@@@@@@@@@@@@@ User data:', userData);
        } else {
            // Clear cookies if token is invalid
            return clearCookies(NextResponse.next());
        }
    }

    // API routes: CORS and permissions
    if (isAPI) {
        // Run CORS handling
        const corsResponse = corsMiddleware(request, token);
        if (corsResponse) return corsResponse;

        // If all checks pass, allow the request to proceed
        return null;
    }

    // Admin routes: Redirect unauthenticated users
    if (isAdmin && !isAdminRole) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Auth pages: Redirect authenticated users to appropriate dashboards
    if (isAuthPage && isAdminRole) {
        return NextResponse.redirect(new URL('/admin', request.url));
    }
    if (isMemberLogin && isMemberRole) {
        return NextResponse.redirect(new URL('/member/profile', request.url));
    }
    if (isMemberProfile && !isMemberRole) {
        return NextResponse.redirect(
            new URL('/auth/member-login', request.url)
        );
    }

    // Allow access to home page and other routes
    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};
