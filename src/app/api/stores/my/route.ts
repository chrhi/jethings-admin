import { NextRequest, NextResponse } from 'next/server'
import { StoreResponse, StoreFilters } from '@/types/store'

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

// GET /api/stores/my - Get user's stores
export async function GET(request: NextRequest) {
  const token = getAuthToken(request)
  if (!token) {
    return NextResponse.json(
      { message: 'Authorization token required', statusCode: 401 },
      { status: 401 }
    )
  }

  const { searchParams } = new URL(request.url)
  const filters: StoreFilters = {
    search: searchParams.get('search') || undefined,
    name: searchParams.get('name') || undefined,
    status: searchParams.getAll('status') as StoreStatus[] || undefined,
    isActive: searchParams.get('isActive') ? searchParams.get('isActive') === 'true' : undefined,
    page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : undefined,
    limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
    sortBy: searchParams.get('sortBy') || undefined,
    sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || undefined,
  }

  // Build query string
  const queryParams = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach(v => queryParams.append(key, v))
      } else {
        queryParams.append(key, value.toString())
      }
    }
  })

  const queryString = queryParams.toString()
  const apiUrl = `${BASE_URL}/stores/my${queryString ? `?${queryString}` : ''}`

  return makeApiRequest(apiUrl, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })
}
