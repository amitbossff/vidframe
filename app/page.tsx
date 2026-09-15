'use client'

import { useEffect, useState } from 'react'

type TaskListing = {
  id: string
  bot: string
  title: string
  channel: string
  thumbnail: string
  video_id: string
  tags: string
  watch_type: 'full' | 'minutes'
  watch_minutes: number
  user_limit: number
  completed_count: number
  slots_left: number
  created_at: string
}

const Icons = {
  Edit: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />
    </svg>
  ),
  Arrow: () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  Folder: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  External: () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17L17 7" />
      <path d="M7 7h10v10" />
    </svg>
  ),
  Phone: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  ),
}

const TASKS_API = 'https://amittg.online/video/tasks/api'
const USER_PANEL = 'https://amittg.online/video/user/'

export default function HomePage() {
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState<TaskListing[]>([])
  const [number, setNumber] = useState('')
  const [draftNumber, setDraftNumber] = useState('')
  const [editOpen, setEditOpen] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const savedNumber = window.localStorage.getItem('user_number_v1')
    if (savedNumber && /^\d{10}$/.test(savedNumber)) {
      setNumber(savedNumber)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function fetchAll() {
      try {
        const res = await fetch(`${TASKS_API}/list_all.php`)
        const text = await res.text()
        if (text.trim().startsWith('<')) throw new Error('Invalid')
        const data = JSON.parse(text)
        if (cancelled) return
        setTasks(data.tasks || [])
      } catch {
        if (!cancelled) setTasks([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchAll()
    const timer = setInterval(fetchAll, 7000)
    return () => {
      cancelled = true
      clearInterval(timer)
    }
  }, [])

  function saveNumber() {
    const v = draftNumber.trim()
    if (!/^\d{10}$/.test(v)) {
      setError('Enter a valid 10-digit number')
      return
    }
    setError('')
    setNumber(v)
    window.localStorage.setItem('user_number_v1', v)
    setEditOpen(false)
  }

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />

      <div className="card home-card">

        <div className="home-header">
          <div>
            <h1 className="home-title">Available Tasks</h1>
            <p className="home-sub">Today's active tasks · Live</p>
          </div>
        </div>

        <div className="number-bar">
          <div className="number-bar-left">
            <Icons.Phone />
            <div>
              <div className="number-bar-label">Your number</div>
              <div className="number-bar-value">{number || 'Not set'}</div>
            </div>
          </div>
          <button
            className="number-edit-btn"
            onClick={() => { setDraftNumber(number); setEditOpen(true) }}
          >
            <Icons.Edit />
            <span>{number ? 'Change' : 'Set'}</span>
          </button>
        </div>

        <a
          href={USER_PANEL}
          target="_blank"
          rel="noopener noreferrer"
          className="view-submitted-btn"
        >
          <Icons.Folder />
          <span>View My Submitted Tasks</span>
          <Icons.External />
        </a>

        {loading && (
          <div className="state-box" style={{ padding: '40px 20px' }}>
            <div className="spinner" />
            <p className="state-text">Loading tasks...</p>
          </div>
        )}

        {!loading && tasks.length === 0 && (
          <div className="state-box" style={{ padding: '40px 20px' }}>
            <div className="state-icon">📅</div>
            <h2 className="state-title" style={{ fontSize: '16px' }}>No tasks available</h2>
            <p className="state-sub">Please check back later</p>
          </div>
        )}

        {!loading && tasks.length > 0 && (
          <div className="task-list">
            {tasks.map(t => {
              const percent = Math.min(100, (t.completed_count / t.user_limit) * 100)
              const botNumber = t.bot.replace(/^bot/i, '')
              return (
                <a
                  key={t.id}
                  href={`/bot${botNumber}`}
                  className="task-list-item"
                >
                  <div className="task-list-thumb-wrap">
                    <img
                      src={t.thumbnail}
                      alt=""
                      className="task-list-thumb"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement
                        img.onerror = null
                        const m = t.thumbnail.match(/\/vi\/([^\/]+)\//)
                        if (m && m[1]) img.src = `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg`
                      }}
                    />
                    <div className={`task-list-badge ${t.watch_type === 'full' ? 'watch-full' : 'watch-minutes'}`}>
                      {t.watch_type === 'full' ? '▶ FULL' : `⏱ ${t.watch_minutes}M`}
                    </div>
                  </div>

                  <div className="task-list-body">
                    <div className="task-list-top">
                      <span className="task-list-bot">{t.bot}</span>
                      <span className="task-list-slots">
                        <strong>{t.completed_count}</strong>/{t.user_limit}
                      </span>
                    </div>

                    <h3 className="task-list-title">{t.title}</h3>
                    <p className="task-list-channel">{t.channel}</p>

                    <div className="task-list-bar">
                      <div className="task-list-fill" style={{ width: `${percent}%` }} />
                    </div>

                    <div className="task-list-bottom">
                      <span className="task-list-remaining">
                        {t.slots_left > 0 ? `${t.slots_left} slots left` : 'Full'}
                      </span>
                      <span className="task-list-open">
                        Open <Icons.Arrow />
                      </span>
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        )}
      </div>

      {editOpen && (
        <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setEditOpen(false) }}>
          <div className="modal">
            <div className="modal-head">
              <h3>Your number</h3>
            </div>
            <input
              autoFocus
              className="input"
              type="tel"
              inputMode="numeric"
              value={draftNumber}
              onChange={e => { setDraftNumber(e.target.value.replace(/\D/g, '').slice(0, 10)); setError('') }}
              onKeyDown={e => { if (e.key === 'Enter') saveNumber() }}
              placeholder="9876543210"
            />
            {error && <div className="error">{error}</div>}
            <button className="btn-primary" onClick={saveNumber}>Save</button>
            <button className="btn-ghost" style={{ marginTop: 8 }} onClick={() => setEditOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </main>
  )
}
