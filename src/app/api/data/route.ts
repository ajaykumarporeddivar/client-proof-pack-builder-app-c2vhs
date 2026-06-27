import { NextRequest } from 'next/server'
import {
  campaigns,
  clients,
  proofPacks,
  campaignResults,
  STATS,
} from '@/lib/data'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function GET(): Promise<Response> {
  console.log(JSON.stringify({ route: '/api/data', method: 'GET', ts: Date.now() }))
  try {
    return new Response(
      JSON.stringify({
        ok: true,
        data: {
          campaigns,
          clients,
          proofPacks,
          campaignResults,
          stats: STATS,
          total: {
            campaigns: campaigns.length,
            clients: clients.length,
            proofPacks: proofPacks.length,
            campaignResults: campaignResults.length,
          },
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...CORS_HEADERS,
        },
      }
    )
  } catch (e: unknown) {
    console.error(JSON.stringify({ route: '/api/data', error: String(e), ts: Date.now() }))
    return new Response(
      JSON.stringify({
        ok: false,
        error: String(e),
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...CORS_HEADERS,
        },
      }
    )
  }
}

export async function POST(request: NextRequest): Promise<Response> {
  console.log(JSON.stringify({ route: '/api/data', method: 'POST', ts: Date.now() }))
  try {
    const body = await request.json()
    return new Response(
      JSON.stringify({
        ok: true,
        message: 'Demo mode — data not persisted',
        received: body,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...CORS_HEADERS,
        },
      }
    )
  } catch (e: unknown) {
    console.error(JSON.stringify({ route: '/api/data', error: String(e), ts: Date.now() }))
    return new Response(
      JSON.stringify({
        ok: false,
        error: String(e),
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...CORS_HEADERS,
        },
      }
    )
  }
}

export async function OPTIONS(): Promise<Response> {
  return new Response(null, {
    status: 200,
    headers: CORS_HEADERS,
  })
}