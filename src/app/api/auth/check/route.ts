import { NextRequest, NextResponse } from 'next/server';
import { makeApiRequest } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('accessToken')?.value;
    
    if (!accessToken) {
      return NextResponse.json(
        { authenticated: false },
        { status: 200 }
      );
    }

    // Validate token by making a lightweight backend call
    // This will automatically refresh the token if it's expired
    try {
      const response = await makeApiRequest('/users/me', request, {
        method: 'GET',
      });
      
      // If we get here, the token is valid (or was successfully refreshed)
      return NextResponse.json(
        { authenticated: true },
        { status: 200 }
      );
    } catch (error) {
      // If the request fails even after refresh attempt, user is not authenticated
      console.log('Token validation failed:', error);
      return NextResponse.json(
        { authenticated: false },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { authenticated: false },
      { status: 200 }
    );
  }
}
