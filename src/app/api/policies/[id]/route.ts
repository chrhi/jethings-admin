import { NextRequest, NextResponse } from 'next/server'
import { makeApiRequest } from '@/lib/api-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    return await makeApiRequest(`/policies/${params.id}`, request, { method: 'GET' })
  } catch (error) {
    console.error('Error fetching policy:', error)
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
    return await makeApiRequest(`/policies/${params.id}`, request, {
      method: 'PATCH',
      body: JSON.stringify(body),
    })
  } catch (error) {
    console.error('Error updating policy:', error)
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
    return await makeApiRequest(`/policies/${params.id}`, request, { method: 'DELETE' })
  } catch (error) {
    console.error('Error deleting policy:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
