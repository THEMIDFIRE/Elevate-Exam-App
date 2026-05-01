import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server'


const privateRoutes = new Set([
    '/',
    '/account',
]);

const authRoutes = new Set([
    '/login',
    '/register',
]);

const resetPassRoute = new Set([
    '/reset-password',
])

const forgotPassRoute = new Set([
    '/forgot-password',
])


export default async function proxy(request: NextRequest) {
    const token = await getToken({ req: request });
    const pathname = request.nextUrl.pathname;

    if (privateRoutes.has(pathname) || request.nextUrl.pathname.startsWith('/diplomas') || request.nextUrl.pathname.startsWith('/account')) {

        if (token) return NextResponse.next();

        const redirectUrl = new URL('/login', request.nextUrl.origin);

        redirectUrl.searchParams.set('callbackUrl', pathname)

        return NextResponse.redirect(redirectUrl);
    }

    if (authRoutes.has(pathname)) {
        if (!token) return NextResponse.next();

        const redirectUrl = new URL('/', request.nextUrl.origin);

        return NextResponse.redirect(redirectUrl);
    }

    if (resetPassRoute.has(pathname)) {
        if (request.nextUrl.searchParams.has('token') && !token) {
            return NextResponse.next();
        } else if (token) {
            const redirectUrl = new URL('/', request.nextUrl.origin);
            return NextResponse.redirect(redirectUrl);
        }
        const redirectUrl = new URL('/forgot-password', request.nextUrl.origin);

        return NextResponse.redirect(redirectUrl);
    }

    if (forgotPassRoute.has(pathname)) {
        if (!token) return NextResponse.next();
        const redirectUrl = new URL('/', request.nextUrl.origin);
        return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
}