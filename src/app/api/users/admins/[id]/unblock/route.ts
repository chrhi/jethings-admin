import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'https://jethings-backend.fly.dev'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Forward the request to your backend
    const backendUrl = `${BACKEND_URL}/users/admins/${id}/unblock`
    
    // Get access token from cookies
    const accessToken = request.cookies.get('accessToken')?.value
    
    if (!accessToken) {
      return NextResponse.json(
        { message: 'Unauthorized - No access token' },
        { status: 401 }
      )
    }
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Backend error' }))
      return NextResponse.json(
        { message: errorData.message || 'Failed to unblock admin' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error unblocking admin:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
