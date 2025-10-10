/**
 * @deprecated This API route is deprecated. The policies feature now uses direct API calls to the backend.
 * 
 * The new implementation:
 * - Calls backend API directly from React Query hooks
 * - Eliminates the Next.js API route proxy layer
 * - Provides better performance and simpler architecture
 * 
 * This file can be removed once all policies are migrated to the new React Query implementation.
 */

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
