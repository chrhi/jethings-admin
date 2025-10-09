import { NextRequest, NextResponse } from 'next/server';
import { setTokensInResponse } from '@/lib/api-utils';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://jethings-backend.fly.dev';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    // Set tokens in response cookies using utility
    const nextResponse = NextResponse.json(data);
    return setTokensInResponse(nextResponse, data.accessToken, data.refreshToken);
  } catch (error) {
    console.error('Sign in API error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
