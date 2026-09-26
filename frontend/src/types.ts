export type SessionStatus = 'Completed' | 'In_Progress' | 'Cancelled'

export interface StudySession {
  id: string
  subject: string
  topic: string
  activity: string
  startedAt: string
  finishedAt: string | null
  status: SessionStatus
  notes: string
}

export interface LoginCredentials {
  email: string
  password: string
}