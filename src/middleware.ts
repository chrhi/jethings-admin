import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';


// Define auth routes (public routes that don't require authentication)
const authRoutes = [
  '/signin',
  '/signin/forget-password',
  '/signin/forget-password/step2'
];

// Define API routes that don't require authentication
const publicApiRoutes = [
  '/api/auth/signin',
  '/api/auth/request-password-reset',
  '/api/auth/verify-password-reset',
  '/api/auth/refresh-token'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if it's an auth route (public)
  const isAuthRoute = authRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
  
  // Check if it's a public API route
  const isPublicApiRoute = publicApiRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Check if it's an API route
  const isApiRoute = pathname.startsWith('/api/');
  
  // Check if it's a static file
  const isStaticFile = pathname.startsWith('/_next/') || 
                      pathname.startsWith('/favicon.ico') ||
                      pathname.startsWith('/public/') ||
                      pathname.includes('.');

  // Allow auth routes, public API routes, and static files
  if (isAuthRoute || isPublicApiRoute || isStaticFile) {
    return NextResponse.next();
  }

  // For API routes that require authentication, let them handle it
  if (isApiRoute) {
    return NextResponse.next();
  }

  // Check if user has valid access token cookie
  const accessToken = request.cookies.get('accessToken')?.value;
  
  // If no access token, redirect to signin
  if (!accessToken) {
    const signInUrl = new URL('/signin', request.url);
    signInUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // If user has access token, allow access to protected routes
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
