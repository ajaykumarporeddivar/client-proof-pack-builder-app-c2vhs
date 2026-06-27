import { NextResponse } from 'next/server'
import { metrics, records } from '@/lib/data'

export async function GET() {
  return NextResponse.json({
    ok: true,
    status: 'ready',
    service: 'Client Proof Pack Builder',
    generatedAt: new Date().toISOString(),
    metrics: {
      metricCount: metrics.length,
      recordCount: records.length,
      approvedCount: records.filter(record => record.status === 'approved').length,
      blockedCount: records.filter(record => record.status === 'blocked').length,
    },
  }, { status: 200 })
}
