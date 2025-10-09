import { NextRequest, NextResponse } from 'next/server'
import { Store, UpdateStoreRequest, ApiError } from '@/types/store'

const BASE_URL = 'https://jethings-backend.fly.dev'

// Helper function to get auth token from request
function getAuthToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  return authHeader.substring(7)
}

// Helper function to make API request
async function makeApiRequest(url: string, options: RequestInit = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'API request failed', statusCode: response.status },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('API request error:', error)
    return NextResponse.json(
      { message: 'Internal server error', statusCode: 500 },
      { status: 500 }
    )
  }
}

// GET /api/stores/[id] - Get store by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = getAuthToken(request)
  if (!token) {
    return NextResponse.json(
      { message: 'Authorization token required', statusCode: 401 },
      { status: 401 }
    )
  }

  const { id } = await params
  const apiUrl = `${BASE_URL}/stores/${id}`

  return makeApiRequest(apiUrl, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })
}

// PUT /api/stores/[id] - Update store (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = getAuthToken(request)
  if (!token) {
    return NextResponse.json(
      { message: 'Authorization token required', statusCode: 401 },
      { status: 401 }
    )
  }

  const { id } = await params
  const body = await request.json()
  const apiUrl = `${BASE_URL}/stores/${id}`

  return makeApiRequest(apiUrl, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  })
}

// DELETE /api/stores/[id] - Delete store (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = getAuthToken(request)
  if (!token) {
    return NextResponse.json(
      { message: 'Authorization token required', statusCode: 401 },
      { status: 401 }
    )
  }

  const { id } = await params
  const apiUrl = `${BASE_URL}/stores/${id}`

  return makeApiRequest(apiUrl, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })
}
