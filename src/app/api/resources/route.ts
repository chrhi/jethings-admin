import { NextRequest, NextResponse } from 'next/server'
import { makeApiRequest } from '@/lib/api-utils'

export async function GET(request: NextRequest) {
  try {
    // Get the query string from the request
    const { searchParams } = new URL(request.url)
    const queryString = searchParams.toString()
    
    const endpoint = `/resources${queryString ? `?${queryString}` : ''}`
    return await makeApiRequest(endpoint, request, { method: 'GET' })
  } catch (error) {
    console.error('Error fetching resources:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    return await makeApiRequest('/resources', request, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  } catch (error) {
    console.error('Error creating resource:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
