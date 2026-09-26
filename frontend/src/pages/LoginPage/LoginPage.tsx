import { useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Brand } from '../../components'
import { getApiErrorMessage } from '../../utils/apiErrors'
import styles from './LoginPage.module.css'

export default function LoginPage({ onLogin }: { onLogin: (credentials: { email: string; password: string }) => Promise<void> }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await onLogin({ email: email.trim(), password })
      navigate('/dashboard')
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to sign in. Check your details and try again.'))
    } finally {
      setSubmitting(false)
    }
  }

  return <main className={styles.page}>
    <section className="login-story">
      <Brand light />
      <div className="story-content">
        <span className="eyebrow"><Sparkles size={14} /> A little more intention</span>
        <h1>Make room<br />for deep work.</h1>
        <p>Keep your learning in motion. One focused session at a time.</p>
        <div className="story-note"><span className="note-line" /><span>Today is a good day to begin.</span></div>
      </div>
      <div className="story-footer"><span>01 / 03</span><span>YOUR STUDY PRACTICE, IN FOCUS</span></div>
      <div className="story-orbit orbit-one" /><div className="story-orbit orbit-two" />
    </section>
    <section className="login-panel">
      <div className="login-topline"><span>WELCOME BACK</span><span>STUDYFLOW / 01</span></div>
      <div className="login-form-wrap">
        <span className="form-kicker">Your desk is ready</span>
        <h2>Sign in</h2>
        <p className="muted">Pick up where your curiosity left off.</p>
        <form className="login-form" onSubmit={submit}>
          <label htmlFor="email">Email address</label>
          <input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <div className="label-row"><label htmlFor="password">Password</label></div>
          <input id="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          {error && <p className="request-error" role="alert">{error}</p>}
          <button type="submit" className="button button-primary button-full" disabled={submitting}>{submitting ? 'Signing in...' : 'Sign in'} <ArrowUpRight size={16} /></button>
        </form>
      </div>
      <div className="login-bottomline"><span>LEARN AT YOUR OWN PACE</span><span>© STUDYFLOW</span></div>
    </section>
  </main>
}