import { useState } from 'react'
import { ArrowUpRight, BookOpen, Check, Clock3, FileText, X } from 'lucide-react'
import type { StudySession, SessionStatus } from '../../types'
import { colorIndex, durationMinutes, formatDate, formatDuration, formatTime } from '../../utils/sessions'
import styles from './SessionRow.module.css'

const markerStyles = [styles.marker, styles.marker1, styles.marker2, styles.marker3]
const statusStyles: Record<SessionStatus, string> = {
  Completed: styles.status,
  In_Progress: `${styles.status} ${styles.inProgress}`,
  Cancelled: `${styles.status} ${styles.cancelled}`,
}

export default function SessionRow({ session, onFinish, isFinishing = false }: { session: StudySession; onFinish: (id: string) => void | Promise<void>; isFinishing?: boolean }) {
  const [expanded, setExpanded] = useState(false)
  return <article className={styles.rowWrap}>
    <div className={styles.row}>
      <div className={styles.subject}><span className={markerStyles[colorIndex(session.subject)]}><BookOpen size={15} /></span><span><strong>{session.subject}</strong><small>{session.topic}</small></span></div>
      <span className={styles.activity}>{session.activity}</span>
      <span className={styles.date}>{formatDate(session.startedAt)}</span>
      <span className={styles.duration}>{session.status === 'In_Progress' ? 'Ongoing' : formatDuration(durationMinutes(session))}</span>
      <span className={statusStyles[session.status]}><span />{session.status === 'In_Progress' ? 'In progress' : session.status}</span>
      <button type="button" className={styles.more} aria-label={`Details for ${session.subject}`} title="Session details" onClick={() => setExpanded((value) => !value)}>
        {expanded ? <X size={16} /> : <ArrowUpRight size={16} />}
      </button>
    </div>
    {expanded && <div className={styles.details}>
      <span><Clock3 size={14} /> {formatTime(session.startedAt)}{session.finishedAt ? ` — ${formatTime(session.finishedAt)}` : ' — still going'}</span>
      <span><FileText size={14} /> {session.notes || 'No notes added.'}</span>
      {session.status === 'In_Progress' && <button type="button" className={`button ${styles.buttonSmall} ${styles.buttonDark}`} onClick={() => { void onFinish(session.id) }} disabled={isFinishing}><Check size={14} /> {isFinishing ? 'Finishing...' : 'Finish session'}</button>}
    </div>}
  </article>
}