import { NextRequest, NextResponse } from 'next/server'
import { makeApiRequest } from '@/lib/api-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: { actionId: string } }
) {
  try {
    return await makeApiRequest(`/policies/by-action/${params.actionId}`, request, { method: 'GET' })
  } catch (error) {
    console.error('Error fetching policies by action:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
