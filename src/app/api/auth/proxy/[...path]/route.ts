import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://jethings-backend.fly.dev';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleRequest(request, path, 'GET');
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleRequest(request, path, 'POST');
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleRequest(request, path, 'PUT');
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleRequest(request, path, 'PATCH');
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleRequest(request, path, 'DELETE');
}

async function handleRequest(
  request: NextRequest,
  pathSegments: string[],
  method: string
) {
  try {
    const path = `/${pathSegments.join('/')}`;
    const url = new URL(request.url);
    const queryString = url.search;
    const backendUrl = `${API_BASE_URL}${path}${queryString}`;

    console.log(`[Proxy] ${method} ${path}${queryString}`);

    // Get tokens from cookies
    const accessToken = request.cookies.get('accessToken')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value;

    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add authorization headers if tokens exist
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
      console.log('[Proxy] Access token present');
    } else {
      console.log('[Proxy] No access token found');
    }
    if (refreshToken) {
      headers['x-refresh-token'] = refreshToken;
      console.log('[Proxy] Refresh token present');
    }

    // Prepare request body for non-GET requests
    let body: string | undefined;
    if (method !== 'GET' && method !== 'DELETE') {
      try {
        const requestBody = await request.text();
        body = requestBody || undefined;
        if (body) {
          console.log('[Proxy] Request body length:', body.length);
        }
      } catch (error) {
        console.error('[Proxy] Error reading request body:', error);
      }
    }

    // Make request to backend
    console.log('[Proxy] Sending request to:', backendUrl);
    const backendResponse = await fetch(backendUrl, {
      method,
      headers,
      body,
      credentials: 'include',
    });

    console.log(`[Proxy] Backend response: ${backendResponse.status} ${backendResponse.statusText}`);

    // Create response
    const response = new NextResponse(backendResponse.body, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
    });

    // Copy relevant headers from backend response
    const headersToCopy = [
      'content-type',
      'content-length',
      'cache-control',
      'etag',
      'last-modified',
    ];

    headersToCopy.forEach(header => {
      const value = backendResponse.headers.get(header);
      if (value) {
        response.headers.set(header, value);
      }
    });

    // Check for token refresh headers and update cookies
    const newAccessToken = backendResponse.headers.get('x-new-access-token');
    const newRefreshToken = backendResponse.headers.get('x-new-refresh-token');
    const tokenRefreshed = backendResponse.headers.get('x-token-refreshed');

    if (tokenRefreshed === 'true' && newAccessToken) {
      console.log('[Proxy] Token refreshed, updating cookies');
      // Update access token cookie
      response.cookies.set('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });

      // Update refresh token cookie if provided
      if (newRefreshToken) {
        response.cookies.set('refreshToken', newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 30 * 24 * 60 * 60, // 30 days
        });
      }
    }

    return response;
  } catch (error) {
    console.error('[Proxy] Request error:', {
      path: pathSegments.join('/'),
      method,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    return NextResponse.json(
      { 
        error: 'Proxy request failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        path: `/${pathSegments.join('/')}`,
      },
      { status: 500 }
    );
  }
}
