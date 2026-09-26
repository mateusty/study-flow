import type { StudySession, SessionStatus } from '../types'

export function normalizeSession(session: StudySession): StudySession {
  const statusValue = String(session.status).replace(/([a-z])([A-Z])/g, '$1_$2').replace(/[\s-]+/g, '_').toUpperCase()
  const statusMap: Record<string, SessionStatus> = {
    COMPLETED: 'Completed',
    FINISHED: 'Completed',
    IN_PROGRESS: 'In_Progress',
    CANCELLED: 'Cancelled',
    CANCELED: 'Cancelled',
  }
  const status = statusMap[statusValue]
  if (!status) throw new Error(`Unsupported study session status: ${statusValue}`)

  return { ...session, status, finishedAt: session.finishedAt ?? null, notes: session.notes ?? '' }
}

export function durationMinutes(session: StudySession): number {
  if (!session.finishedAt) return 0
  return Math.max(0, Math.round((new Date(session.finishedAt).getTime() - new Date(session.startedAt).getTime()) / 60000))
}

export function formatHours(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const remainder = minutes % 60
  return `${hours}${remainder ? `.${Math.round(remainder / 60 * 10)}` : ''}`
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return remainingMinutes ? `${hours}h ${remainingMinutes}m` : `${hours}h`
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(value))
}

export function formatTime(value: string): string {
  return new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(new Date(value))
}

export function colorIndex(subject: string): number {
  return subject.split('').reduce((sum, character) => sum + character.charCodeAt(0), 0) % 4
}