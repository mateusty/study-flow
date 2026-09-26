import { BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import styles from './Brand.module.css'

export default function Brand({ light = false }: { light?: boolean }) {
  return <Link className={`${styles.brand}${light ? ` ${styles.light}` : ''}`} to={light ? '/login' : '/dashboard'}>
    <span className={styles.mark}><BookOpen size={18} /></span> studyflow
  </Link>
}