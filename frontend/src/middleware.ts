import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/", "/signin", "/logout"];
const AUTH_REDIRECT_ROUTES = ["/signin", "/"];

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
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/feed", request.url));
    }
    return NextResponse.redirect(new URL("/feed", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|music).*)",
  ],
};
