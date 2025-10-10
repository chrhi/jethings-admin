import { NextRequest, NextResponse } from 'next/server'
import { makeApiRequest } from '@/lib/api-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ roleId: string }> }
) {
  try {
    const { roleId } = await params
    return await makeApiRequest(`/role-policies/by-role/${roleId}`, request, { method: 'GET' })
  } catch (error) {
    console.error('Error fetching role-policies by role:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
