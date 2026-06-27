import { NextRequest } from 'next/server'
import {
  campaigns,
  clients,
  proofPacks,
  campaignResults,
  type Campaign,
  type Client,
  type ProofPack,
  type CampaignResult,
} from '@/lib/data'

type SearchableItem = Campaign | Client | ProofPack | CampaignResult

export async function GET(request: NextRequest): Promise<Response> {
  console.log(JSON.stringify({ route: '/api/search', method: 'GET', ts: Date.now() }))
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q') || ''
    const type = searchParams.get('type')

    const lowerCaseQuery = query.toLowerCase()
    const MAX_RESULTS = 20

    let results: SearchableItem[] = []

    const searchInCollection = <T extends SearchableItem>(
      collection: T[],
      nameField: keyof T,
      filterType: string | null,
      typeName: string
    ): T[] => {
      if (filterType && filterType !== typeName) {
        return []
      }
      return collection.filter((item) => {
        const field = item[nameField]
        return typeof field === 'string' && field.toLowerCase().includes(lowerCaseQuery)
      })
    }

    if (!query) {
      // If query is empty, return the first 5 items from each collection or from a specific type
      if (type) {
        switch (type) {
          case 'campaigns':
            results.push(...campaigns.slice(0, 5))
            break
          case 'clients':
            results.push(...clients.slice(0, 5))
            break
          case 'proofPacks':
            results.push(...proofPacks.slice(0, 5))
            break
          case 'campaignResults':
            results.push(...campaignResults.slice(0, 5))
            break
        }
      } else {
        // If no query and no type, return first 5 of each for a general overview
        results.push(...campaigns.slice(0, 5))
        results.push(...clients.slice(0, 5))
        results.push(...proofPacks.slice(0, 5))
        results.push(...campaignResults.slice(0, 5))
      }
    } else {
      // Perform search across all relevant collections
      results.push(...searchInCollection(campaigns, 'name', type, 'campaigns'))
      results.push(...searchInCollection(clients, 'name', type, 'clients'))
      results.push(...searchInCollection(proofPacks, 'title', type, 'proofPacks'))
      results.push(...searchInCollection(campaignResults, 'title', type, 'campaignResults'))
    }

    const finalResults = results.slice(0, MAX_RESULTS)

    return new Response(
      JSON.stringify({
        ok: true,
        data: {
          results: finalResults,
          total: finalResults.length,
          query: query,
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (e: unknown) {
    console.error(JSON.stringify({ route: '/api/search', error: String(e), ts: Date.now() }))
    return new Response(
      JSON.stringify({
        ok: false,
        error: String(e),
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}