import type { ReactNode } from 'react'
import styles from './SummaryCard.module.css'

interface SummaryCardProps {
  label: string
  value: string
  suffix: string
  icon: ReactNode
  foot: ReactNode
  tone?: 'dark' | 'accent'
  decoration?: boolean
}

export default function SummaryCard({ label, value, suffix, icon, foot, tone, decoration }: SummaryCardProps) {
  return <article className={`${styles.card}${tone ? ` ${styles[tone]}` : ''}`}>
    <div className={styles.top}><span>{label}</span>{icon}</div>
    <div className={styles.number}>{value}<small> {suffix}</small></div>
    <div className={styles.foot}>{foot}</div>
    {decoration && <div className={styles.decoration}><span /><span /><span /><span /><span /><span /><span /></div>}
  </article>
}