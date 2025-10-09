import { NextRequest, NextResponse } from 'next/server';
import { getTokensFromRequest, clearTokensInResponse } from '@/lib/api-utils';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://jethings-backend.fly.dev';

export async function POST(request: NextRequest) {
  try {
    const { accessToken, refreshToken } = getTokensFromRequest(request);
    
    if (!accessToken) {
      return NextResponse.json(
        { message: 'No access token found' },
        { status: 401 }
      );
    }

    // Prepare headers for backend request
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    };
    
    if (refreshToken) {
      headers['x-refresh-token'] = refreshToken;
    }

    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers,
    });

    const data = await response.json();

    // Clear cookies regardless of API response
    const nextResponse = NextResponse.json(data, { status: response.status });
    return clearTokensInResponse(nextResponse);
  } catch (error) {
    console.error('Logout API error:', error);
    
    // Clear cookies even if API call fails
    const nextResponse = NextResponse.json(
      { message: 'Logout completed (local only)' },
      { status: 200 }
    );
    
    return clearTokensInResponse(nextResponse);
  }
}
