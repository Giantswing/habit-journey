import { NextResponse } from "next/server";
import i18n from "./i18n";

export function middleware(request) {
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