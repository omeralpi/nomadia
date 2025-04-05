import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    const publicPaths = ["/"];
    const isPublicPath = publicPaths.includes(path);

    const ignorePaths = ["/api/auth", "/_next", "/favicon.ico"];
    const shouldIgnore = ignorePaths.some((ignorePath) =>
        path.startsWith(ignorePath)
    );

    if (shouldIgnore) {
        return NextResponse.next();
    }

    const token = await getToken({ req: request });

    if (isPublicPath && token) {
        return NextResponse.redirect(new URL("/p2p", request.url));
    }

    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
    ],
};