import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define auth routes (public routes that don't require authentication)
const authRoutes = [
  '/signin',
  '/signin/forget-password',
  '/signin/forget-password/step2',
  '/signin/create-first-admin',
  '/accept-invitation'
];

// Define API routes that should be excluded from middleware
const apiRoutes = [
  '/api/auth/set-tokens',
  '/api/auth/clear-tokens',
  '/api/auth/proxy'
];

// Define protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/users',
  '/roles',
  '/policies',
  '/resources',
  '/actions',
  '/stores',
  '/products',
  '/product-types',
  '/admins',
  '/settings'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if it's an auth route (public)
  const isAuthRoute = authRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
  
  // Check if it's an API route
  const isApiRoute = apiRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Check if it's a static file
  const isStaticFile = pathname.startsWith('/_next/') || 
                      pathname.startsWith('/favicon.ico') ||
                      pathname.startsWith('/public/') ||
                      pathname.includes('.') ||
                      pathname.startsWith('/api/');

  // Allow auth routes, API routes, and static files to pass through
  if (isAuthRoute || isApiRoute || isStaticFile) {
    return NextResponse.next();
  }

  // Check if it's a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  ) || pathname === '/';

  if (isProtectedRoute) {
    // Check for access token in cookies
    const accessToken = request.cookies.get('accessToken')?.value;
    
    // If no access token, redirect to signin
    if (!accessToken) {
      const signInUrl = new URL('/signin', request.url);
      // Add redirect parameter to return user to original page after login
      signInUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(signInUrl);
    }
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
