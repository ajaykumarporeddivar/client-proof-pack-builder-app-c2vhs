export type WorkflowStatus = 'queued' | 'in_review' | 'approved' | 'blocked'
export type WorkflowPriority = 'low' | 'medium' | 'high'

export interface DemoMetric {
  id: string
  label: string
  value: string
  change: string
  trend: 'up' | 'down'
  detail: string
}

export interface DemoRecord {
  id: string
  name: string
  customer: string
  status: WorkflowStatus
  owner: string
  value: number
  priority: WorkflowPriority
  confidence: number
  cycleTime: string
  nextStep: string
  notes: string
  createdAt: string
}

export interface ActivityEvent {
  id: string
  title: string
  actor: string
  timestamp: string
  status: WorkflowStatus
}

export interface NavItem {
  label: string
  href: string
  badge?: string
}
