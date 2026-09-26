import axios from 'axios'
import type { LoginCredentials, StudySession } from './types'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  headers: { 'Content-Type': 'application/json' },
})

http.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authApi = {
  login: (credentials: LoginCredentials) => http.post('/auth/login', credentials),
}

export const sessionsApi = {
  list: () => http.get<StudySession[]>('/study-sessions'),
  create: (session: Omit<StudySession, 'id'>) => http.post<StudySession>('/study-sessions', {
    ...session,
    status: session.status.toUpperCase(),
  }),
  finish: (session: StudySession) => http.put<StudySession>(`/study-sessions/${session.id}`, { ...session, finishedAt: new Date().toISOString(), status: 'COMPLETED' }),
}

