'use client'

import { ChangeEvent, DragEvent, useEffect, useRef, useState } from 'react'

type UploadImage = { blob: Blob; index: number }

const Icons = {
  Upload: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  ),
  Video: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="14" height="12" rx="2" />
      <path d="m22 8-6 4 6 4V8Z" />
    </svg>
  ),
  Camera: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  ),
  Edit: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />
    </svg>
  ),
  Check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Play: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  ),
  Pause: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
    </svg>
  ),
  Shield: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Arrow: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  X: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
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
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17L17 7" />
      <path d="M7 7h10v10" />
    </svg>
  ),
}

export default function Page({ botName = 'default' }: { botName?: string }) {
  const [step, setStep] = useState<'welcome' | 'upload'>('welcome')
  const [number, setNumber] = useState('')
  const [draftNumber, setDraftNumber] = useState('')
  const [numberError, setNumberError] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [commentScreenshot, setCommentScreenshot] = useState<File | null>(null)
  const [frames, setFrames] = useState<UploadImage[]>([])
  const screenshotInputRef = useRef<HTMLInputElement>(null)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('')
  const [processing, setProcessing] = useState(false)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [videoDuration, setVideoDuration] = useState(0)
  const [timelineTime, setTimelineTime] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const objectUrlRef = useRef<string | null>(null)
  const botKey = /^bot\d{1,2}$/i.test(botName) ? botName.toLowerCase() : 'default'

  useEffect(() => {
    const savedNumber = window.localStorage.getItem('user_number_v1')
    if (savedNumber && validNumber(savedNumber)) {
      setNumber(savedNumber)
      setStep('upload')
    }
    return () => { if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current) }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    const url = objectUrlRef.current
    if (!video || !file || !url) return

    video.onloadedmetadata = () => { setVideoDuration(video.duration || 0); setTimelineTime(0) }
    video.ontimeupdate = () => setTimelineTime(video.currentTime)
    video.onloadeddata = () => {
      video.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
      setProcessing(true)
      setProgress(0)
      processVideo().then(captured => {
        setFrames(captured)
        setProgress(100)
      }).catch(() => setStatus('Could not process video')).finally(() => setProcessing(false))
    }
    video.onerror = () => setStatus('Video could not be loaded')
    video.preload = 'auto'
    video.src = url
    video.load()

    return () => {
      video.onloadeddata = null
      video.onerror = null
    }
  }, [file])

  const validNumber = (value: string) => /^\d{10}$/.test(value.trim())
  const formatTime = (seconds: number) => `${Math.floor(Math.max(0, seconds) / 60)}:${String(Math.floor(Math.max(0, seconds) % 60)).padStart(2, '0')}`

  // ============ CAPTURE POINTS (with end frame) ============
  const getCapturePoints = (duration: number) => {
    let points: number[]
    if (duration >= 240 && duration <= 360) points = [1, 30, 40, 60, 90]
    else if (duration >= 180) points = [1, 25, 40, 60, 90]
    else if (duration >= 120) points = [1, 25, 40, 60, 90]
    else points = [1, 15, 30, 50, 70]

    // Add frame 1 second before video ends
    const endFrame = Math.max(1, Math.floor(duration) - 1)
    if (!points.includes(endFrame) && endFrame > 0) {
      points.push(endFrame)
    }

    return points
  }

  function continueToUpload() {
    const value = number.trim()
    if (!validNumber(value)) { setNumberError('Enter a valid 10-digit number'); return }
    setNumberError(''); setNumber(value); window.localStorage.setItem('user_number_v1', value); setStep('upload')
  }

  function saveNumber() {
    const value = draftNumber.trim()
    if (!validNumber(value)) { setNumberError('Enter a valid 10-digit number'); return }
    setNumberError(''); setNumber(value); window.localStorage.setItem('user_number_v1', value); setEditOpen(false)
  }

  async function compressScreenshot(selected: File): Promise<File> {
    const bitmap = await createImageBitmap(selected)
    const maxSide = 1600
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(bitmap.width * scale))
    canvas.height = Math.max(1, Math.round(bitmap.height * scale))
    const context = canvas.getContext('2d')
    if (!context) return selected
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()
    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.9))
    return blob ? new File([blob], 'comment-screenshot.jpg', { type: 'image/jpeg' }) : selected
  }

  async function chooseScreenshot(selected: File | undefined) {
    if (!selected || !selected.type.startsWith('image/')) { setStatus('Please choose an image'); return }
    try {
      const compressed = await compressScreenshot(selected)
      setCommentScreenshot(compressed)
    } catch { setStatus('Could not process screenshot') }
  }

  function chooseFile(selected: File | undefined) {
    if (!selected || !selected.type.startsWith('video/')) { setStatus('Please choose a video file'); return }
    if (selected.size > 100 * 1024 * 1024) { setStatus('Video must be under 100 MB'); return }
    setFile(selected); setFrames([]); setProgress(0); setProcessing(false); setStatus(''); setVideoDuration(0)
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    const url = URL.createObjectURL(selected); objectUrlRef.current = url
  }

  async function processVideo() {
    const video = videoRef.current
    if (!video) throw new Error('Video not loaded')
    if (!video.videoWidth) {
      await new Promise<void>((resolve, reject) => {
        const onReady = () => { cleanup(); resolve() }
        const onError = () => { cleanup(); reject(new Error('Video not loaded')) }
        const cleanup = () => {
          video.removeEventListener('loadedmetadata', onReady)
          video.removeEventListener('canplay', onReady)
          video.removeEventListener('error', onError)
        }
        video.addEventListener('loadedmetadata', onReady, { once: true })
        video.addEventListener('canplay', onReady, { once: true })
        video.addEventListener('error', onError, { once: true })
      })
    }
    if (!video.videoWidth || !Number.isFinite(video.duration)) throw new Error('Video not loaded')
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const context = canvas.getContext('2d', { willReadFrequently: true })
    if (!context) return
    const captureTargets = getCapturePoints(video.duration).filter(second => second < video.duration)
    if (!captureTargets.length) captureTargets.push(Math.max(0, video.duration / 2))
    const captured: UploadImage[] = []
    video.pause()
    video.muted = true

    const seekAndWait = (targetTime: number) => new Promise<void>(resolve => {
      if (Math.abs(video.currentTime - targetTime) < 0.05 && video.readyState >= 2) {
        requestAnimationFrame(() => resolve()); return
      }
      let done = false
      let timeout = 0
      const finish = () => {
        if (done) return
        done = true
        video.removeEventListener('seeked', finish)
        window.clearTimeout(timeout)
        requestAnimationFrame(() => resolve())
      }
      video.addEventListener('seeked', finish, { once: true })
      try { video.currentTime = targetTime } catch { finish(); return }
      timeout = window.setTimeout(finish, 3000)
    })

    const animateTimeline = (from: number, to: number, duration: number) => new Promise<void>(resolve => {
      const start = performance.now()
      const step = (now: number) => {
        const p = Math.min(1, (now - start) / duration)
        setTimelineTime(from + (to - from) * (1 - Math.pow(1 - p, 3)))
        if (p < 1) requestAnimationFrame(step); else resolve()
      }
      requestAnimationFrame(step)
    })

    for (let i = 0; i < captureTargets.length; i++) {
      await animateTimeline(video.currentTime, captureTargets[i], 400)
      await seekAndWait(captureTargets[i])
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.9))
      if (blob && blob.size > 1000) captured.push({ blob, index: i })
      setProgress(Math.round(((i + 1) / captureTargets.length) * 100))
    }
    return captured
  }

  function togglePlay() {
    const video = videoRef.current
    if (!video) return
    if (video.paused) { video.play(); setPlaying(true) } else { video.pause(); setPlaying(false) }
  }

  async function submit() {
    if (!file || !commentScreenshot || sending) return
    if (!frames.length || processing || progress < 100) return
    setSending(true)
    try {
      const frameTimes = getCapturePoints(videoDuration).filter(second => second < videoDuration)
      const form = new FormData()
      form.append('phoneNumber', number)
      form.append('bot', botKey)
      form.append('videoName', file.name)
      form.append('videoDuration', String(Math.round(videoDuration)))
      form.append('frameTimes', JSON.stringify(frameTimes))
      if (frames[0]) form.append('photo0', frames[0].blob, 'upload-1.jpg')
      form.append('photo1', commentScreenshot, 'comment-screenshot.jpg')
      frames.slice(1).forEach((frame, index) => form.append(`photo${index + 2}`, frame.blob, `upload-${index + 2}.jpg`))
      const response = await fetch('/api/upload', { method: 'POST', body: form })
      const result = await response.json().catch(() => null)
      if (!response.ok) throw new Error(result?.error || 'Send failed')
      setSent(true)
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Could not send')
    } finally {
      setSending(false)
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) { event.preventDefault(); setDragging(false); chooseFile(event.dataTransfer.files[0]) }
  function handleChange(event: ChangeEvent<HTMLInputElement>) { chooseFile(event.target.files?.[0]) }

  const canSubmit = file && commentScreenshot && frames.length > 0 && progress === 100 && !processing && !sending
  const videoReady = file && !processing && frames.length > 0

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />
      
      <div className="card">
        {step === 'welcome' ? (
          <div className="welcome">
            <div className="welcome-icon">
              <Icons.Upload />
            </div>
            
            <h1>Upload your video</h1>
            <p className="welcome-sub">Enter your phone number to continue</p>

            <div className="welcome-form">
              <label htmlFor="number">Phone number</label>
              <input
                id="number"
                className="input"
                type="tel"
                inputMode="numeric"
                placeholder="9876543210"
                value={number}
                onChange={e => { setNumber(e.target.value.replace(/\D/g, '').slice(0, 10)); setNumberError('') }}
                onKeyDown={e => { if (e.key === 'Enter') continueToUpload() }}
              />
              {numberError && <div className="error">{numberError}</div>}
            </div>

            <button className="btn-primary" onClick={continueToUpload}>
              Continue
              <Icons.Arrow />
            </button>

            <div className="secure-note">
              <Icons.Shield />
              <span>Your number is used only to identify your upload</span>
            </div>

            <a 
              href="https://amittg.online/video/user/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="submissions-link"
            >
              <Icons.Folder />
              <span>View My Submissions</span>
              <Icons.External />
            </a>
          </div>
        ) : (
          <div className="upload">
            <header className="top">
              <div className="top-left">
                <div className="bot-chip">{botKey}</div>
                <h2>Upload</h2>
              </div>
              <button className="icon-btn" onClick={() => { setDraftNumber(number); setEditOpen(true) }} aria-label="Edit number">
                <Icons.Edit />
              </button>
            </header>

            <div className="account">
              <span className="account-label">Uploading as</span>
              <span className="account-value">{number}</span>
            </div>

            <input ref={inputRef} type="file" accept="video/*" hidden onChange={handleChange} />
            <input ref={screenshotInputRef} type="file" accept="image/*" hidden onChange={e => { void chooseScreenshot(e.target.files?.[0]) }} />

            <div className="picker-row">
              <button
                className={`pick ${file ? 'done' : ''} ${dragging ? 'dragging' : ''}`}
                onClick={() => inputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
              >
                <div className="pick-icon">
                  {file ? <Icons.Check /> : <Icons.Video />}
                </div>
                <div className="pick-text">
                  <strong>{file ? 'Video ready' : 'Video'}</strong>
                  <span>{file ? 'Tap to change' : 'Max 100 MB'}</span>
                </div>
              </button>

              <button
                className={`pick ${commentScreenshot ? 'done' : ''}`}
                onClick={() => screenshotInputRef.current?.click()}
              >
                <div className="pick-icon">
                  {commentScreenshot ? <Icons.Check /> : <Icons.Camera />}
                </div>
                <div className="pick-text">
                  <strong>{commentScreenshot ? 'Ready' : 'Comment'}</strong>
                  <span>{commentScreenshot ? 'Tap to change' : 'Screenshot'}</span>
                </div>
              </button>
            </div>

            {file && (
              <>
                <div className="preview">
                  <video ref={videoRef} muted playsInline loop onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
                  <button className="play-btn" onClick={togglePlay}>
                    {playing ? <Icons.Pause /> : <Icons.Play />}
                  </button>
                  <div className="preview-tags">
                    <span className="tag">{videoDuration > 0 ? formatTime(videoDuration) : '--:--'}</span>
                    <span className="tag">{(file.size / (1024 * 1024)).toFixed(1)} MB</span>
                  </div>
                </div>

                {!videoReady && videoDuration > 0 && (
                  <div className="timeline">
                    <div className="timeline-head">
                      <span>Processing</span>
                      <span className="time">{formatTime(timelineTime)} / {formatTime(videoDuration)}</span>
                    </div>
                    <div className="timeline-bar">
                      <div className="timeline-fill" style={{ width: `${(timelineTime / videoDuration) * 100}%` }} />
                      <div className="timeline-markers">
                        {getCapturePoints(videoDuration).map((point, i) => point <= videoDuration && (
                          <span
                            key={point}
                            className={`dot ${timelineTime > point + 0.5 ? 'passed' : Math.abs(timelineTime - point) < 0.5 ? 'current' : ''}`}
                            style={{ left: `${(point / videoDuration) * 100}%` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {videoReady && (
                  <div className="ready">
                    <div className="ready-check"><Icons.Check /></div>
                    <div>
                      <strong>Ready to submit</strong>
                      <span>All set</span>
                    </div>
                  </div>
                )}

                {processing && !videoReady && (
                  <div className="progress">
                    <div className="progress-head">
                      <span>Preparing</span>
                      <strong>{progress}%</strong>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                )}

                {status && !processing && (
                  <div className="status-msg">{status}</div>
                )}

                <div className="actions">
                  <button className="btn-ghost" onClick={() => { setFile(null); setFrames([]); setProgress(0); setVideoDuration(0); setStatus('') }}>
                    Change
                  </button>
                  <button className={`btn-primary ${canSubmit ? 'ready' : ''}`} disabled={!canSubmit} onClick={submit}>
                    {sending ? 'Sending...' : 'Submit'}
                    {!sending && <Icons.Arrow />}
                  </button>
                </div>
              </>
            )}

            {!file && (
              <>
                <div className="secure-note">
                  <Icons.Shield />
                  <span>Your files are sent securely</span>
                </div>

                <a 
                  href="https://amittg.online/video/user/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="submissions-link"
                >
                  <Icons.Folder />
                  <span>View My Submissions</span>
                  <Icons.External />
                </a>
              </>
            )}
          </div>
        )}
      </div>

      {editOpen && (
        <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setEditOpen(false) }}>
          <div className="modal">
            <div className="modal-head">
              <h3>Edit number</h3>
              <button className="icon-btn" onClick={() => setEditOpen(false)} aria-label="Close">
                <Icons.X />
              </button>
            </div>
            <input
              autoFocus
              className="input"
              type="tel"
              inputMode="numeric"
              value={draftNumber}
              onChange={e => { setDraftNumber(e.target.value.replace(/\D/g, '').slice(0, 10)); setNumberError('') }}
              onKeyDown={e => { if (e.key === 'Enter') saveNumber() }}
              placeholder="9876543210"
            />
            {numberError && <div className="error">{numberError}</div>}
            <button className="btn-primary" onClick={saveNumber}>Save</button>
          </div>
        </div>
      )}

      {sent && (
        <div className="modal-backdrop">
          <div className="modal success">
            <div className="success-icon"><Icons.Check /></div>
            <h3>Submitted</h3>
            <p>Your video has been sent successfully</p>
            <button className="btn-primary" onClick={() => setSent(false)}>Done</button>
          </div>
        </div>
      )}
    </main>
  )
}
