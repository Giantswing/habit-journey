import { NextResponse } from "next/server";
import i18n from "./i18n";

export function middleware(request) {
    //Take users to the login page if they are not logged in
    // const nextUrl = request.nextUrl

    // if (nextUrl.pathname === '/') {
    //     if (!request.cookies.authToken) {
    //         return NextResponse.rewrite(new URL('/login', request.url))
    //     }
    // }

    //Rewrite the URL to include the locale
    const locale = request.nextUrl.locale || i18n.defaultLocale;
    request.nextUrl.searchParams.set("lang", locale);
    request.nextUrl.href = request.nextUrl.href.replace(`/${locale}`, "");
    return NextResponse.rewrite(request.nextUrl);
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
        '/',
    ],
};