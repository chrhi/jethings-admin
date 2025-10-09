import { NextRequest, NextResponse } from 'next/server';
import { getTokensFromRequest, setTokensInResponse } from '@/lib/api-utils';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://jethings-backend.fly.dev';

export async function POST(request: NextRequest) {
  try {
    const { refreshToken } = getTokensFromRequest(request);
    
    if (!refreshToken) {
      return NextResponse.json(
        { message: 'No refresh token found' },
        { status: 401 }
      );
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-refresh-token': refreshToken,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    // Set new tokens in response cookies using utility
    const nextResponse = NextResponse.json(data);
    return setTokensInResponse(nextResponse, data.accessToken, data.refreshToken);
  } catch (error) {
    console.error('Refresh token API error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
