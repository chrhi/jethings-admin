import { NextRequest, NextResponse } from 'next/server'
import { makeApiRequest } from '@/lib/api-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ policyId: string }> }
) {
  try {
    const { policyId } = await params
    return await makeApiRequest(`/role-policies/by-policy/${policyId}`, request, { method: 'GET' })
  } catch (error) {
    console.error('Error fetching role-policies by policy:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
