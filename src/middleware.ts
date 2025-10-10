import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define auth routes (public routes that don't require authentication)
const authRoutes = [
  '/signin',
  '/signin/forget-password',
  '/signin/forget-password/step2'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  

  const isAuthRoute = authRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
  
 
  const isStaticFile = pathname.startsWith('/_next/') || 
                      pathname.startsWith('/favicon.ico') ||
                      pathname.startsWith('/public/') ||
                      pathname.includes('.');


  if (isAuthRoute || isStaticFile) {
    return NextResponse.next();
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
