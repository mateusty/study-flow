import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowLeft, ArrowUpRight, BookOpen, Check, Clock3, Sparkles, Timer } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { sessionsApi } from '../../api'
import type { StudySession, SessionStatus } from '../../types'
import { getApiErrorMessage } from '../../utils/apiErrors'
import { formatDuration, formatTime } from '../../utils/sessions'
import styles from './NewSessionPage.module.css'

export default function NewSessionPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<'timer' | 'manual'>('timer')
  const [subject, setSubject] = useState('')
  const [topic, setTopic] = useState('')
  const [activity, setActivity] = useState('')
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState<SessionStatus>('Completed')
  const [startedAt, setStartedAt] = useState('')
  const [finishedAt, setFinishedAt] = useState('')
  const [timerStartedAt, setTimerStartedAt] = useState<string | null>(null)
  const [timerFinishedAt, setTimerFinishedAt] = useState<string | null>(null)
  const [now, setNow] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!timerStartedAt || timerFinishedAt) return
    const interval = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(interval)
  }, [timerStartedAt, timerFinishedAt])

  const elapsedSeconds = timerStartedAt
    ? Math.max(0, Math.floor(((timerFinishedAt ? new Date(timerFinishedAt).getTime() : now) - new Date(timerStartedAt).getTime()) / 1000))
    : 0

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const start = mode === 'timer' ? timerStartedAt : startedAt ? new Date(startedAt).toISOString() : null
    const finish = mode === 'timer' ? timerFinishedAt : finishedAt ? new Date(finishedAt).toISOString() : null
    if (!start) return
    const resolvedStatus = mode === 'timer' ? (finish ? 'Completed' : 'In_Progress') : status
    const session: Omit<StudySession, 'id'> = {
      subject: subject.trim(), topic: topic.trim(), activity: activity.trim(),
      startedAt: start, finishedAt: resolvedStatus === 'In_Progress' ? null : finish,
      status: resolvedStatus, notes: notes.trim(),
    }
    setError(null)
    setSaving(true)
    try {
      await sessionsApi.create(session)
      navigate('/dashboard')
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to save this study session.'))
    } finally {
      setSaving(false)
    }
  }

  return <div className={`${styles.page} page-content`}>
    <header className="page-header form-page-header">
      <div><div className="breadcrumb"><Link to="/dashboard">WORKSPACE</Link> <span>/</span> NEW SESSION</div><h1>Log a study session</h1><p className="header-subtitle">Give this block of focus a place in your story.</p></div>
      <Link to="/dashboard" className="button button-quiet"><ArrowLeft size={16} /> Back to overview</Link>
    </header>
    <form className="session-form" onSubmit={submit}>
      <div className="form-main-column">
        <section className="form-block">
          <div className="form-section-title"><span className="form-step">01</span><div><h2>The essentials</h2><p>What are you spending time on?</p></div></div>
          <div className="field-grid">
            <label className="field field-wide">Subject<input value={subject} onChange={(event) => setSubject(event.target.value)} required /></label>
            <label className="field field-wide">Topic<input value={topic} onChange={(event) => setTopic(event.target.value)} required /></label>
            <label className="field field-wide">Activity<select value={activity} onChange={(event) => setActivity(event.target.value)} required>
              <option value="" disabled>Choose an activity</option><option>Reading</option><option>Lecture notes</option><option>Problem set</option><option>Practice quiz</option><option>Project work</option><option>Revision</option><option>Other</option>
            </select></label>
          </div>
        </section>
        <section className="form-block time-block">
          <div className="form-section-title"><span className="form-step">02</span><div><h2>Set your time</h2><p>Start a live timer or enter the details.</p></div></div>
          <div className="mode-switch" role="tablist" aria-label="Time entry method">
            <button type="button" role="tab" aria-selected={mode === 'timer'} className={mode === 'timer' ? 'mode-active' : ''} onClick={() => setMode('timer')}><Timer size={15} /> Live timer</button>
            <button type="button" role="tab" aria-selected={mode === 'manual'} className={mode === 'manual' ? 'mode-active' : ''} onClick={() => setMode('manual')}><Clock3 size={15} /> Enter times</button>
          </div>
          {mode === 'timer' ? <div className="timer-panel">
            <div className="timer-orbit"><span>{timerStartedAt ? new Date(elapsedSeconds * 1000).toISOString().slice(11, 19) : '00:00:00'}</span></div>
            <div className="timer-copy"><strong>{timerStartedAt ? timerFinishedAt ? 'Session complete' : 'Your focus time' : 'Ready when you are'}</strong><span>{timerStartedAt ? `Started at ${formatTime(timerStartedAt)}` : 'The clock begins when you do.'}</span></div>
            {!timerStartedAt ? <button type="button" className="button button-dark" onClick={() => setTimerStartedAt(new Date().toISOString())}><Timer size={16} /> Start timer</button>
              : !timerFinishedAt ? <button type="button" className="button button-coral" onClick={() => setTimerFinishedAt(new Date().toISOString())}><Check size={16} /> Finish timer</button>
                : <button type="button" className="button button-outline" onClick={() => { setTimerStartedAt(null); setTimerFinishedAt(null) }}><Timer size={16} /> Start again</button>}
          </div> : <div className="field-grid time-fields">
            <label className="field">Started at<input type="datetime-local" value={startedAt} onChange={(event) => setStartedAt(event.target.value)} required /></label>
            <label className="field">Finished at<input type="datetime-local" value={finishedAt} onChange={(event) => setFinishedAt(event.target.value)} min={startedAt || undefined} required={status === 'Completed'} /></label>
            <label className="field">Status<select value={status} onChange={(event) => setStatus(event.target.value as SessionStatus)}><option value="Completed">Completed</option><option value="In_Progress">In progress</option><option value="Cancelled">Cancelled</option></select></label>
          </div>}
        </section>
        <section className="form-block notes-block">
          <div className="form-section-title"><span className="form-step">03</span><div><h2>Leave a note</h2><p>Capture a thought for next time.</p></div></div>
          <label className="field">Notes <span className="optional-label">OPTIONAL</span><textarea rows={4} value={notes} onChange={(event) => setNotes(event.target.value)} /></label>
        </section>
        {error && <p className="request-error" role="alert">{error}</p>}
        <div className="form-actions"><Link to="/dashboard" className="button button-quiet">Cancel</Link><button type="submit" className="button button-primary" disabled={saving || (mode === 'timer' ? !timerStartedAt : !startedAt)}>{saving ? 'Saving...' : mode === 'timer' && timerStartedAt && !timerFinishedAt ? 'Save as in progress' : 'Save session'} <ArrowUpRight size={16} /></button></div>
      </div>
      <aside className="form-side-column">
        <div className="session-preview">
          <span className="preview-label">SESSION PREVIEW</span>
          <div className="preview-illustration"><div className="preview-book"><BookOpen size={27} /></div><span className="preview-sun" /></div>
          {subject && <div className="preview-title">{subject}{topic && <span>{topic}</span>}</div>}
          <div className="preview-divider" />
          <div className="preview-meta">
            <span><Clock3 size={14} /> {timerStartedAt ? formatDuration(Math.floor(elapsedSeconds / 60)) : mode === 'manual' && startedAt && finishedAt ? formatDuration(Math.max(0, Math.round((new Date(finishedAt).getTime() - new Date(startedAt).getTime()) / 60000))) : '—'}</span>
            <span><span className={`status-dot-preview ${timerStartedAt && !timerFinishedAt ? 'is-running' : ''}`} />{mode === 'timer' ? timerFinishedAt ? 'Completed' : timerStartedAt ? 'In progress' : 'Not started' : status === 'In_Progress' ? 'In progress' : status}</span>
          </div>
        </div>
        <div className="side-tip"><span className="tip-icon"><Sparkles size={16} /></span><div><strong>Make it count</strong><p>A short note now can make it easier to get started next time.</p></div></div>
      </aside>
    </form>
  </div>
}