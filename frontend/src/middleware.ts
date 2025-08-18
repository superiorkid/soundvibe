import { NextRequest, NextResponse } from "next/server";

import "dotenv/config";

const PUBLIC_ROUTES = ["/", "/signin", "/logout", "/discover"];
const AUTH_REDIRECT_ROUTES = ["/", "/signin", "/logout"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get(process.env.COOKIE_NAME as string);

  const isAuthenticated = Boolean(sessionToken);
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const shouldRedirectAuthUser = AUTH_REDIRECT_ROUTES.includes(pathname);

  if (!isAuthenticated && !isPublicRoute) {
    const signinUrl = new URL("/signin", request.url);
    signinUrl.searchParams.set("callback", pathname);
    return NextResponse.redirect(signinUrl);
  }

  if (isAuthenticated && shouldRedirectAuthUser) {
    return NextResponse.redirect(new URL("/discover", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
