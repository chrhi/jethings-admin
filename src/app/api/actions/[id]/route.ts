/**
 * @deprecated This API route is deprecated. The actions feature now uses direct API calls to the backend.
 * 
 * The new implementation:
 * - Calls backend API directly from React Query hooks
 * - Eliminates the Next.js API route proxy layer
 * - Provides better performance and simpler architecture
 * 
 * This file can be removed once all actions are migrated to the new React Query implementation.
 */

import { NextRequest, NextResponse } from 'next/server'
import { makeApiRequest } from '@/lib/api-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    return await makeApiRequest(`/actions/${params.id}`, request, { method: 'GET' })
  } catch (error) {
    console.error('Error fetching action:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    return await makeApiRequest(`/actions/${params.id}`, request, {
      method: 'PATCH',
      body: JSON.stringify(body),
    })
  } catch (error) {
    console.error('Error updating action:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    return await makeApiRequest(`/actions/${params.id}`, request, {
      method: 'DELETE',
    })
  } catch (error) {
    console.error('Error deleting action:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
