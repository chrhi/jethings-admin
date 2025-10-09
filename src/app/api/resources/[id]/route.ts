import { NextRequest, NextResponse } from 'next/server'
import { makeApiRequest } from '@/lib/api-utils'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json()
    const { id } = await params
    
    console.log('Resource update - ID received:', id)
    console.log('Resource update - Body:', body)
    
    return await makeApiRequest(`/resources/${id}`, request, {
      method: 'PATCH',
      body: JSON.stringify(body),
    })
  } catch (error) {
    console.error('Error updating resource:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    return await makeApiRequest(`/resources/${id}`, request, {
      method: 'DELETE',
    })
  } catch (error) {
    console.error('Error deleting resource:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
