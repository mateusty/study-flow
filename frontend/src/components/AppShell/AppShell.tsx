import type { ReactNode } from 'react'
import { LayoutDashboard, LogOut, Plus, Sparkles } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import Brand from '../Brand/Brand'
import styles from './AppShell.module.css'

export default function AppShell({ children, onLogout }: { children: ReactNode; onLogout: () => void }) {
  const navigate = useNavigate()
  return <div className={styles.root}>
    <aside className={styles.sidebar}>
      <Brand />
      <div className={styles.sectionLabel}>WORKSPACE</div>
      <nav className={styles.sideNav} aria-label="Main navigation">
        <NavLink to="/dashboard" className={({ isActive }) => `${styles.sideLink}${isActive ? ` ${styles.active}` : ''}`}><LayoutDashboard size={17} /> Overview</NavLink>
        <NavLink to="/sessions/new" className={({ isActive }) => `${styles.sideLink}${isActive ? ` ${styles.active}` : ''}`}><Plus size={17} /> New session</NavLink>
      </nav>
      <div className={styles.sidebarBottom}>
        <div className={styles.weekCard}><span className={styles.weekIcon}><Sparkles size={15} /></span><strong>Small steps add up.</strong><span>Your next focused hour is waiting.</span></div>
        <button type="button" className={`${styles.sideLink} ${styles.logoutLink}`} onClick={() => { onLogout(); navigate('/login') }}><LogOut size={17} /> Sign out</button>
      </div>
    </aside>
    <main className={styles.mainArea}>{children}</main>
  </div>
}