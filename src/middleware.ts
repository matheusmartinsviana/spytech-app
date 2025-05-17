import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const publicRoutes = [
  {
    path: '/login',
    whenAuthenticated: 'redirect',
  },
  {
    path: '/registrar',
    whenAuthenticated: 'redirect',
  },
] as const;

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = '/login';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicRoute = publicRoutes.find(route => route.path === path);

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token && isPublicRoute) {
    return NextResponse.next();
  }

  if (!token && !isPublicRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE;
    return NextResponse.redirect(redirectUrl);
  }

  if (token && isPublicRoute?.whenAuthenticated === 'redirect') {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/';
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
