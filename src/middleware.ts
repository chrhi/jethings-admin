import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';


const protectedRoutes = ['/admins', '/users'];
const authRoutes = ['/signin' , '/signin/forget-password' , '/signin/forget-password/step2'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if it's a protected route (including root path)
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  ) || pathname === '/';
  
  // Check if it's an auth route
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );

  const accessToken = request.cookies.get('accessToken')?.value;

  // If accessing a protected route without a token, redirect to signin
  if (isProtectedRoute && !accessToken) {
    const signInUrl = new URL('/signin', request.url);
    signInUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // If accessing an auth route with a token, redirect to dashboard
  if (isAuthRoute && accessToken) {
    const redirectUrl = request.nextUrl.searchParams.get('redirect') || '/';
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
