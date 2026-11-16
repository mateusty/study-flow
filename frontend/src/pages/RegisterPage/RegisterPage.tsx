import { useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Brand } from '../../components'
import { authApi } from '../../api'
import { getApiErrorMessage } from '../../utils/apiErrors'
import styles from '../LoginPage/LoginPage.module.css'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    if (password.trim().length === 0) {
      setError('Password cannot be blank.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setSubmitting(true)
    try {
      await authApi.register({ email: email.trim(), password })
      navigate('/login', { replace: true, state: { registrationComplete: true } })
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to create your account. Please try again.'))
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
      <div className="login-topline"><span>GET STARTED</span><span>STUDYFLOW / 01</span></div>
      <div className="login-form-wrap">
        <span className="form-kicker">Your desk is waiting</span>
        <h2>Create account</h2>
        <p className="muted">Start building a more intentional study practice.</p>
        <form className="login-form" onSubmit={submit}>
          <label htmlFor="register-email">Email address</label>
          <input id="register-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <label htmlFor="register-password">Password</label>
          <input id="register-password" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          <label htmlFor="confirm-password">Confirm password</label>
          <input id="confirm-password" type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
          {error && <p className="request-error" role="alert">{error}</p>}
          <button type="submit" className="button button-primary button-full" disabled={submitting}>{submitting ? 'Creating account...' : 'Create account'} <ArrowUpRight size={16} /></button>
        </form>
        <p className="login-footnote">Already have an account? <Link to="/login" className="text-button">Sign in</Link></p>
      </div>
      <div className="login-bottomline"><span>LEARN AT YOUR OWN PACE</span><span>© STUDYFLOW</span></div>
    </section>
  </main>
}
