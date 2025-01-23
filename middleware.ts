import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from './lib/auth/jwt'
 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const publicRoute = ['/login'];
    const pathNow = request.nextUrl.pathname;
    const isInPublicRoute = publicRoute.includes(pathNow)
    const cookiesStore = await cookies()
    const jwtSignature = cookiesStore.get('session')?.value

    let authInfo;
    try {
        authInfo = await decrypt(jwtSignature);
    } catch (error) {
        authInfo = false;
    }
    const headers = new Headers(request.headers)
    headers.set("x-current-path" , request.nextUrl.pathname)

    if (!isInPublicRoute && !authInfo) {
        return NextResponse.redirect(new URL('/login', request.nextUrl.origin) , {headers});
    } else if (isInPublicRoute && authInfo) {
        return NextResponse.redirect(new URL('/home' , request.nextUrl.origin) ,{headers})
    }
    return NextResponse.next({headers})
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
