import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Define Protected Routes
  const isDashboardRoute = pathname.startsWith("/dashboard");

  // 2. Check for Token (Session) in Cookies
  // Note: We use cookies for middleware since localStorage isn't available on the server-side
  const token = request.cookies.get("turff_token")?.value;

  // 3. Redirection Logic
  if (isDashboardRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    // Optional: add a callback URL to return after login
    // loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Default: Allow all other routes (including "/" which should never redirect)
  return NextResponse.next();
}

// 5. Matcher configuration to precisely target intended routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public folder assets)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
