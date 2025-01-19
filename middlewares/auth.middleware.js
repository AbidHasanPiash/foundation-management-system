import { NextResponse } from 'next/server';

const handleAdminAuthentication = (request, token) => {
    const { pathname } = request.nextUrl;

    if (pathname.startsWith('/admin') && !token) {
        console.log(
            'Redirecting to /auth/login: Unauthenticated access attempt'
        );
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    if (pathname.startsWith('/auth') && token) {
        console.log(
            'Redirecting to /admin: Authenticated user trying to access auth URL'
        );
        return NextResponse.redirect(new URL('/admin', request.url));
    }

    return null;
};

export default handleAdminAuthentication;
