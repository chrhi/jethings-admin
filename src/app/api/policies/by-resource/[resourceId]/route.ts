import { NextRequest, NextResponse } from 'next/server'
import { makeApiRequest } from '@/lib/api-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: { resourceId: string } }
) {
  try {
    return await makeApiRequest(`/policies/by-resource/${params.resourceId}`, request, { method: 'GET' })
  } catch (error) {
    console.error('Error fetching policies by resource:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
