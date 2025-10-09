import { NextRequest, NextResponse } from 'next/server'
import { makeApiRequest } from '@/lib/api-utils'

export async function GET(request: NextRequest) {
  try {
    // Get the query string from the request
    const { searchParams } = new URL(request.url)
    const queryString = searchParams.toString()
    
    const endpoint = `/users${queryString ? `?${queryString}` : ''}`
    return await makeApiRequest(endpoint, request, { method: 'GET' })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
