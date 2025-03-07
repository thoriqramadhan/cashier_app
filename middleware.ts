import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from './lib/auth/jwt'
import { jwtPayload } from './types/login';
 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    // registered route
    const publicRoute = ['/login'];
    const adminRoute = ['/products' , '/category']
    const pathNow = request.nextUrl.pathname;
    // path chechker
    const isInPublicRoute = publicRoute.includes(pathNow)
    const isInAdminROute = adminRoute.includes(pathNow);
    const cookiesStore = await cookies()
    const jwtSignature = cookiesStore.get('session')?.value

    let authInfo;
    let isAdmin = false;
    try {
        authInfo = await decrypt(jwtSignature) as jwtPayload;
        isAdmin = authInfo.role === 'admin';
    } catch (error) {
        authInfo = false;
    }
    // const headers = new Headers(request.headers)
    // headers.set("x-current-path" , request.nextUrl.pathname)

    if (pathNow == '/' && authInfo && !isAdmin) {
        const response = NextResponse.redirect(new URL('/home', request.nextUrl.origin));
        response.headers.set('x-current-path', request.nextUrl.pathname)
        return response;
    } else if (pathNow == '/' && !authInfo) {
        const response = NextResponse.redirect(new URL('/login', request.nextUrl.origin));
        response.headers.set('x-current-path', request.nextUrl.pathname)
        return response;
    } else if (pathNow == '/' && authInfo && isAdmin) {
        const response = NextResponse.redirect(new URL('/products', request.nextUrl.origin));
        response.headers.set('x-current-path', request.nextUrl.pathname)
        return response;
    }
    if (!isInPublicRoute && !authInfo) {
        const response = NextResponse.redirect(new URL('/login', request.nextUrl.origin));
        response.headers.set('x-current-path', request.nextUrl.pathname)
        return response;
    } else if (isInPublicRoute && authInfo) {
        const response = NextResponse.redirect(new URL('/home', request.nextUrl.origin));
        response.headers.set('x-current-path', request.nextUrl.pathname)
        return response;
    } else if (isInAdminROute && !isAdmin) {
        return NextResponse.rewrite(new URL('/404' , request.url))
    }
    const response = NextResponse.next();
    response.headers.set('x-current-path', request.nextUrl.pathname)
    return response;
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
    /*
       * Match all request paths except for:
       * - API routes
       * - _next/static (static files)
       * - _next/image (image optimization files)
       * - Metadata files (favicon.ico, sitemap.xml, robots.txt)
       * - Static file extensions (e.g., jpg, png, gif, svg, etc.)
       */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:jpg|jpeg|png|gif|svg|ico|webp|json)).*)',
    ],
};
