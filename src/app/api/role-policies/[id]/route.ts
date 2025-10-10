import { NextRequest, NextResponse } from 'next/server'
import { makeApiRequest } from '@/lib/api-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    return await makeApiRequest(`/role-policies/${id}`, request, { method: 'GET' })
  } catch (error) {
    console.error('Error fetching role-policy:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    return await makeApiRequest(`/role-policies/${id}`, request, { 
      method: 'PATCH',
      body: JSON.stringify(body)
    })
  } catch (error) {
    console.error('Error updating role-policy:', error)
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
    return await makeApiRequest(`/role-policies/${id}`, request, { method: 'DELETE' })
  } catch (error) {
    console.error('Error deleting role-policy:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
