'use client'

import { useMemo, useState } from 'react'
import { Badge, Button, Card, EmptyState, Input, Table, Textarea } from '@/components/ui'
import { records } from '@/lib/data'
import { formatCurrency, formatDate } from '@/lib/utils'

const statusTone = {
  queued: 'info',
  in_review: 'warning',
  approved: 'success',
  blocked: 'danger',
} as const

export default function FeaturePage() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return records.filter(record => {
      const searchable = [record.name, record.customer, record.owner, record.notes, record.nextStep].join(' ').toLowerCase()
      return (!q || searchable.includes(q)) && (status === 'all' || record.status === status)
    })
  }, [query, status])

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-zinc-500">Workflow operations</p>
          <h1 className="mt-1 text-3xl font-black text-zinc-950">Operating queue</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">Filter, review, and prepare high-confidence client handoffs from a complete generated workflow surface.</p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="secondary" onClick={() => setStatus('blocked')}>Blocked</Button>
          <Button type="button" onClick={() => setStatus('approved')}>Approved</Button>
        </div>
      </div>

      <Card>
        <div className="grid gap-3 md:grid-cols-[1fr_220px_160px]">
          <Input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search customer, owner, workflow, next step..." />
          <select value={status} onChange={event => setStatus(event.target.value)} className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm">
            <option value="all">All statuses</option>
            <option value="queued">Queued</option>
            <option value="in_review">In review</option>
            <option value="approved">Approved</option>
            <option value="blocked">Blocked</option>
          </select>
          <Button type="button" variant="secondary" onClick={() => { setQuery(''); setStatus('all') }}>Reset</Button>
        </div>
      </Card>

      <Card className="overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState title="No matching workflows" description="Adjust filters to return active records, or create a new intake once connected to production data." action={<Button type="button" onClick={() => setStatus('all')}>Show all</Button>} />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <thead>
                <tr className="border-b border-zinc-200 text-left text-xs uppercase tracking-widest text-zinc-500">
                  <th className="pb-3">Workflow</th>
                  <th className="pb-3">Next step</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Priority</th>
                  <th className="pb-3">Value</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(record => (
                  <tr key={record.id} className="border-b border-zinc-100 align-top">
                    <td className="py-4 pr-4"><p className="font-semibold text-zinc-950">{record.name}</p><p className="text-xs text-zinc-500">{record.customer} · {record.owner} · {formatDate(record.createdAt)}</p><p className="mt-1 max-w-md text-xs leading-5 text-zinc-500">{record.notes}</p></td>
                    <td className="py-4 pr-4 text-sm text-zinc-700">{record.nextStep}</td>
                    <td className="py-4 pr-4"><Badge tone={statusTone[record.status]}>{record.status.replace('_', ' ')}</Badge></td>
                    <td className="py-4 pr-4 capitalize">{record.priority}</td>
                    <td className="py-4 pr-4 font-semibold">{formatCurrency(record.value)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card>

      <Card>
        <h2 className="text-lg font-black text-zinc-950">Create follow-up note</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_220px]">
          <Textarea placeholder="Summarize buyer context, blocker, or next action..." />
          <div className="space-y-3">
            <Input placeholder="Owner" />
            <Button type="button" className="w-full">Save note</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
