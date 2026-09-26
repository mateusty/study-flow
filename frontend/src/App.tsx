import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components'
import DashboardPage from './pages/DashboardPage/DashboardPage'
import LoginPage from './pages/LoginPage/LoginPage'
import NewSessionPage from './pages/NewSessionPage/NewSessionPage'
import { authApi } from './api'
import type { LoginCredentials } from './types'

function App() {
  const [authenticated, setAuthenticated] = useState(() => Boolean(sessionStorage.getItem('token')))

  const login = async (credentials: LoginCredentials) => {
    const token = await authApi.login(credentials)
    sessionStorage.setItem('token', token.data.token)
    setAuthenticated(true)
  }

  const logout = () => {
    sessionStorage.removeItem('token')
    setAuthenticated(false)
  }

  return <BrowserRouter>
    <Routes>
      <Route path="/login" element={authenticated ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={login} />} />
      <Route path="/" element={<Navigate to={authenticated ? '/dashboard' : '/login'} replace />} />
      <Route path="/dashboard" element={authenticated
        ? <AppShell onLogout={logout}><DashboardPage /></AppShell>
        : <Navigate to="/login" replace />} />
      <Route path="/sessions/new" element={authenticated
        ? <AppShell onLogout={logout}><NewSessionPage /></AppShell>
        : <Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
}

export default App