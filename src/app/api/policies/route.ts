import { NextRequest, NextResponse } from 'next/server'
import { makeApiRequest } from '@/lib/api-utils'

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const queryString = searchParams.toString()
    
    const endpoint = `/policies${queryString ? `?${queryString}` : ''}`
    return await makeApiRequest(endpoint, request, { method: 'GET' })
  } catch (error) {
    console.error('Error fetching policies:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    return await makeApiRequest('/policies', request, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  } catch (error) {
    console.error('Error creating policy:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
