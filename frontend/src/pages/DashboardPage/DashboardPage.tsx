import { useEffect, useMemo, useState } from 'react'
import { ArrowUpRight, Check, Clock3, FileText, Plus, Search, Sparkles, Timer } from 'lucide-react'
import { Link } from 'react-router-dom'
import { sessionsApi } from '../../api'
import { SessionRow, SummaryCard } from '../../components'
import type { StudySession, SessionStatus } from '../../types'
import { getApiErrorMessage } from '../../utils/apiErrors'
import { durationMinutes, formatHours, normalizeSession } from '../../utils/sessions'
import styles from './DashboardPage.module.css'

type SessionFilter = 'All' | SessionStatus

export default function DashboardPage() {
  const [sessions, setSessions] = useState<StudySession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [finishingId, setFinishingId] = useState<string | null>(null)
  const [reloadVersion, setReloadVersion] = useState(0)
  const [filter, setFilter] = useState<SessionFilter>('All')
  const [search, setSearch] = useState('')

  const retryLoad = () => {
    setLoading(true)
    setError(null)
    setReloadVersion((version) => version + 1)
  }

  useEffect(() => {
    let mounted = true
    sessionsApi.list()
      .then(({ data }) => {
        if (mounted) setSessions(data.map(normalizeSession))
      })
      .catch((requestError: unknown) => {
        if (mounted) setError(getApiErrorMessage(requestError, 'Unable to load study sessions.'))
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => { mounted = false }
  }, [reloadVersion])

  const finishSession = async (id: string) => {
    const session = sessions.find((item) => item.id === id)
    if (!session || finishingId) return
    setFinishingId(id)
    setError(null)
    try {
      const { data } = await sessionsApi.finish(session)
      const updated = normalizeSession(data)
      setSessions((current) => current.map((item) => item.id === id ? updated : item))
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to finish this session.'))
    } finally {
      setFinishingId(null)
    }
  }

  const sortedSessions = useMemo(() => [...sessions].sort((a, b) => b.startedAt.localeCompare(a.startedAt)), [sessions])
  const visibleSessions = sortedSessions.filter((session) => (filter === 'All' || session.status === filter)
    && `${session.subject} ${session.topic} ${session.activity}`.toLowerCase().includes(search.toLowerCase()))
  const completedCount = sessions.filter((session) => session.status === 'Completed').length
  const weekStart = new Date()
  weekStart.setHours(0, 0, 0, 0)
  weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7))
  const completedMinutes = sessions.filter((session) => session.status === 'Completed' && new Date(session.startedAt) >= weekStart)
    .reduce((total, session) => total + durationMinutes(session), 0)
  const activeCount = sessions.filter((session) => session.status === 'In_Progress').length

  return <div className={`${styles.page} page-content`}>
    <header className="page-header dashboard-header">
      <div>
        <div className="breadcrumb">WORKSPACE <span>/</span> OVERVIEW</div>
        <p className="date-line">{new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())}</p>
        <h1>Your study space</h1>
        <p className="header-subtitle">A clear view of where your focus is going.</p>
      </div>
      <Link to="/sessions/new" className="button button-primary"><Plus size={17} /> New session</Link>
    </header>

    {error && <div className="request-error" role="alert"><span>{error}</span><button type="button" className="button button-quiet" onClick={retryLoad}>Retry</button></div>}

    <section className="summary-grid" aria-label="Study summary">
      <SummaryCard label="TIME INVESTED" value={formatHours(completedMinutes)} suffix="hrs" icon={<Clock3 size={16} />} tone="dark" decoration foot={<><span className="trend-up"><ArrowUpRight size={14} /> THIS WEEK</span><span>Completed sessions</span></>} />
      <SummaryCard label="SESSIONS COMPLETED" value={completedCount.toString().padStart(2, '0')} suffix="sessions" icon={<Check size={16} />} foot={<><span className="metric-dot dot-coral" /> Across all subjects</>} />
      <SummaryCard label="IN PROGRESS" value={activeCount.toString().padStart(2, '0')} suffix="active" icon={<Timer size={16} />} tone="accent" foot={<><span className="metric-dot dot-green" /> Keep your momentum</>} />
    </section>

    <section className="session-section">
      <div className="section-heading">
        <div><span className="section-overline">YOUR RECENT WORK</span><h2>Study sessions <span className="count-badge">{sessions.length}</span></h2></div>
        <Link to="/sessions/new" className="quiet-link">See your progress <ArrowUpRight size={14} /></Link>
      </div>
      <div className="session-toolbar">
        <div className="filter-tabs" role="tablist" aria-label="Filter sessions">
          {(['All', 'Completed', 'In_Progress', 'Cancelled'] as const).map((value) => <button key={value} type="button" role="tab" aria-selected={filter === value} className={`filter-tab${filter === value ? ' selected' : ''}`} onClick={() => setFilter(value)}>
            {value === 'In_Progress' ? 'In progress' : value}<span>{value === 'All' ? sessions.length : sessions.filter((session) => session.status === value).length}</span>
          </button>)}
        </div>
        <label className="search-box"><Search size={15} /><input aria-label="Search sessions" placeholder="Search sessions" value={search} onChange={(event) => setSearch(event.target.value)} /><kbd>⌘ K</kbd></label>
      </div>
      <div className="session-list">
        <div className="session-list-header"><span>SUBJECT / TOPIC</span><span>ACTIVITY</span><span>DATE</span><span>DURATION</span><span>STATUS</span><span /></div>
        {loading ? <div className="empty-state" role="status">Loading sessions...</div> : error && sessions.length === 0 ? <div className="empty-state" role="status">Sessions are unavailable until the connection is restored.</div> : visibleSessions.length ? visibleSessions.map((session) => <SessionRow key={session.id} session={session} onFinish={finishSession} isFinishing={finishingId === session.id} />) : <div className="empty-state">
          <span className="empty-icon"><FileText size={19} /></span><strong>No sessions found</strong><span>Try a different filter or start a new session.</span>
          <Link to="/sessions/new" className="button button-outline"><Plus size={15} /> New session</Link>
        </div>}
      </div>
      <div className="list-footer"><span>Showing <strong>{visibleSessions.length}</strong> of <strong>{sessions.length}</strong> sessions</span><span>YOU'RE BUILDING SOMETHING GOOD <Sparkles size={13} /></span></div>
    </section>
  </div>
}