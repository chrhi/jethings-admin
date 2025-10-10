/**
 * @deprecated This API route is deprecated. The users feature now uses direct API calls to the backend.
 * 
 * The new implementation:
 * - Calls backend API directly from React Query hooks
 * - Eliminates the Next.js API route proxy layer
 * - Provides better performance and simpler architecture
 * 
 * This file can be removed once all users are migrated to the new React Query implementation.
 */

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
