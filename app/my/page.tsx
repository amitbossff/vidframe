'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type BotCount = { bot: string; count: number }
type DateData = { date: string; bot_count: number; total: number; bots: BotCount[] }
type MonthData = { month: string; total: number; dates: DateData[] }

const API = 'https://amittg.online/video/tasks/api'

const Icons = {
  Arrow: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  Back: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  ),
  Phone: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  ),
  Calendar: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Robot: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v4" />
      <line x1="8" y1="16" x2="8" y2="16" />
      <line x1="16" y1="16" x2="16" y2="16" />
    </svg>
  ),
}

export default function MySubmissionsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [number, setNumber] = useState('')
  const [months, setMonths] = useState<MonthData[]>([])
  const [totalUploads, setTotalUploads] = useState(0)
  const [totalBots, setTotalBots] = useState(0)
  const [totalDays, setTotalDays] = useState(0)

  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedDate, setSelectedDate] = useState('')

  useEffect(() => {
    const saved = window.localStorage.getItem('user_number_v1')
    if (saved && /^\d{10}$/.test(saved)) {
      setNumber(saved)
    } else {
      setError('No number saved. Please set it from home.')
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!number) return
    let cancelled = false

    async function fetchData() {
      try {
        const res = await fetch(`${API}/user_list.php?number=${number}`)
        const text = await res.text()
        if (text.trim().startsWith('<')) throw new Error('Invalid response')
        const data = JSON.parse(text)
        if (cancelled) return

        if (!data.ok) throw new Error(data.error || 'Failed')

        setMonths(data.months || [])
        setTotalUploads(data.total_uploads || 0)
        setTotalBots(data.total_bots || 0)
        setTotalDays(data.total_days || 0)

        // Auto select latest month
        if (data.months?.length > 0 && !selectedMonth) {
          setSelectedMonth(data.months[0].month)
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchData()
    return () => { cancelled = true }
  }, [number])

  const currentMonthData = months.find(m => m.month === selectedMonth)
  const currentDateData = currentMonthData?.dates.find(d => d.date === selectedDate)

  function formatMonth(m: string) {
    const [y, mo] = m.split('-')
    const date = new Date(parseInt(y), parseInt(mo) - 1, 1)
    const names = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    return names[date.getMonth()] + ' ' + date.getFullYear()
  }

  function formatDate(d: string) {
    const [y, m, day] = d.split('-')
    const names = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    return day + ' ' + names[parseInt(m) - 1] + ' ' + y
  }

  function formatDateShort(d: string) {
    const [y, m, day] = d.split('-')
    const names = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    return day + ' ' + names[parseInt(m) - 1]
  }

  function goBack() {
    if (selectedDate) {
      setSelectedDate('')
    } else if (selectedMonth) {
      setSelectedMonth('')
    } else {
      window.location.href = '/'
    }
  }

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />

      <div className="card my-card">

        {/* ============ HEADER ============ */}
        <div className="my-header">
          <button className="my-back-btn" onClick={goBack}>
            <Icons.Back />
          </button>
          <div className="my-header-info">
            <div className="my-header-title">
              {selectedDate
                ? formatDate(selectedDate)
                : selectedMonth
                  ? formatMonth(selectedMonth)
                  : 'My Submissions'}
            </div>
            <div className="my-header-sub">
              {selectedDate && currentDateData
                ? `${currentDateData.bot_count} bot${currentDateData.bot_count !== 1 ? 's' : ''} · ${currentDateData.total} upload${currentDateData.total !== 1 ? 's' : ''}`
                : selectedMonth && currentMonthData
                  ? `${currentMonthData.dates.length} day${currentMonthData.dates.length !== 1 ? 's' : ''}`
                  : number ? `Number: ${number}` : ''}
            </div>
          </div>
          <div className="my-header-spacer" />
        </div>

        {/* ============ LOADING ============ */}
        {loading && (
          <div className="state-box" style={{ padding: '40px 20px' }}>
            <div className="spinner" />
            <p className="state-text">Loading...</p>
          </div>
        )}

        {/* ============ ERROR / NO NUMBER ============ */}
        {!loading && error && (
          <div className="state-box" style={{ padding: '40px 20px' }}>
            <div className="state-icon">📱</div>
            <h2 className="state-title" style={{ fontSize: '16px' }}>Number not set</h2>
            <p className="state-sub">Please set your number from home page</p>
            <Link href="/" className="back-home-link">← Back to home</Link>
          </div>
        )}

        {/* ============ NO SUBMISSIONS ============ */}
        {!loading && !error && months.length === 0 && (
          <div className="state-box" style={{ padding: '40px 20px' }}>
            <div className="state-icon">📭</div>
            <h2 className="state-title" style={{ fontSize: '16px' }}>No submissions yet</h2>
            <p className="state-sub">Complete tasks to see them here</p>
            <Link href="/" className="back-home-link">← Back to home</Link>
          </div>
        )}

        {/* ============ STATS ============ */}
        {!loading && !error && months.length > 0 && !selectedMonth && (
          <div className="my-stats">
            <div className="my-stat">
              <div className="my-stat-num">{totalUploads}</div>
              <div className="my-stat-label">Total Uploads</div>
            </div>
            <div className="my-stat">
              <div className="my-stat-num">{totalBots}</div>
              <div className="my-stat-label">Bots Used</div>
            </div>
            <div className="my-stat">
              <div className="my-stat-num">{totalDays}</div>
              <div className="my-stat-label">Active Days</div>
            </div>
          </div>
        )}

        {/* ============ MONTHS LIST ============ */}
        {!loading && !error && months.length > 0 && !selectedMonth && (
          <div className="my-content">
            <div className="my-section-title">Select Month</div>
            <div className="my-chips">
              {months.map(m => (
                <button
                  key={m.month}
                  className="my-chip"
                  onClick={() => setSelectedMonth(m.month)}
                >
                  <Icons.Calendar />
                  <span>{formatMonth(m.month)}</span>
                  <span className="my-chip-count">{m.total}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ============ DATES LIST ============ */}
        {!loading && !error && selectedMonth && !selectedDate && currentMonthData && (
          <div className="my-content">
            <div className="my-section-title">Select Date</div>
            <div className="my-chips">
              {currentMonthData.dates.map(d => (
                <button
                  key={d.date}
                  className="my-chip"
                  onClick={() => setSelectedDate(d.date)}
                >
                  <Icons.Calendar />
                  <span>{formatDateShort(d.date)}</span>
                  <span className="my-chip-count">{d.total}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ============ BOT LIST FOR DATE ============ */}
        {!loading && !error && selectedDate && currentDateData && (
          <div className="my-content">
            <div className="my-section-title">Your Bots</div>
            <div className="my-chips">
              {currentDateData.bots.map(b => (
                <div key={b.bot} className="my-bot-chip">
                  <Icons.Robot />
                  <span className="my-bot-name">{b.bot}</span>
                  <span className="my-chip-count">{b.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
