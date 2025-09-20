import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'https://jethings-backend.fly.dev'

export async function GET(request: NextRequest) {
  try {
    // Get the query string from the request
    const { searchParams } = new URL(request.url)
    const queryString = searchParams.toString()
    
    // Forward the request to your backend
    const backendUrl = `${BACKEND_URL}/users${queryString ? `?${queryString}` : ''}`
    
    // Get access token from cookies
    const accessToken = request.cookies.get('accessToken')?.value
    
    if (!accessToken) {
      return NextResponse.json(
        { message: 'Unauthorized - No access token' },
        { status: 401 }
      )
    }
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Backend error' }))
      return NextResponse.json(
        { message: errorData.message || 'Failed to fetch users' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
