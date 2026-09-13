'use client'

import { ChangeEvent, DragEvent, useEffect, useRef, useState } from 'react'

type UploadImage = { blob: Blob; index: number }

type IconProps = { size?: number; className?: string }

function UploadIcon({ size = 30, className }: IconProps) {
  return <svg aria-hidden="true" className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16V4" /><path d="m7 9 5-5 5 5" /><path d="M5 20h14" /></svg>
}

function EditIcon({ size = 16 }: IconProps) {
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" /></svg>
}

function CheckIcon({ size = 28 }: IconProps) {
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 4 4L19 6" /></svg>
}

export default function Page() {
  const [step, setStep] = useState<'welcome' | 'upload'>('welcome')
  const [number, setNumber] = useState('')
  const [draftNumber, setDraftNumber] = useState('')
  const [numberError, setNumberError] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [frames, setFrames] = useState<UploadImage[]>([])
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
  const botMatch = typeof window !== 'undefined' ? window.location.pathname.match(/^\/bot(\d{1,2})(?:\/)?$/i) : null
  const botKey = botMatch ? `bot${botMatch[1]}` : 'default'

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
      setStatus('Preparing upload...')
      processVideo().then(captured => {
        setFrames(captured)
        setProgress(100)
        setStatus(captured.length ? 'Ready to send' : 'Could not prepare video')
      }).catch(() => setStatus('Could not prepare video')).finally(() => setProcessing(false))
    }
    video.onerror = () => setStatus('Video could not be loaded. Try another file.')
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
  const getCapturePoints = (duration: number) => {
    if (duration >= 240 && duration <= 360) return [1, 30, 40, 60, 90]
    if (duration >= 180) return [1, 25, 40, 60, 90]
    if (duration >= 120) return [1, 25, 40, 60, 90]
    return [1, 15, 30, 50, 70]
  }

  function continueToUpload() {
    const value = number.trim()
    if (!validNumber(value)) { setNumberError('Please enter a valid number'); return }
    setNumberError(''); setNumber(value); window.localStorage.setItem('user_number_v1', value); setStep('upload')
  }

  function saveNumber() {
    const value = draftNumber.trim()
    if (!validNumber(value)) { setNumberError('Please enter a valid number'); return }
    setNumberError(''); setNumber(value); window.localStorage.setItem('user_number_v1', value); setEditOpen(false)
  }

  function chooseFile(selected: File | undefined) {
    if (!selected || !selected.type.startsWith('video/')) { setStatus('Please choose a video file.'); return }
    if (selected.size > 100 * 1024 * 1024) { setStatus('Video must be smaller than 100 MB.'); return }
    setFile(selected); setFrames([]); setProgress(0); setProcessing(false); setStatus('Ready to send'); setVideoDuration(0)
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    const url = URL.createObjectURL(selected); objectUrlRef.current = url
  }

  async function processVideo() {
    const video = videoRef.current
    if (!video) throw new Error('Video could not be loaded')
    if (!video.videoWidth) {
      await new Promise<void>((resolve, reject) => {
        const onReady = () => { cleanup(); resolve() }
        const onError = () => { cleanup(); reject(new Error('Video could not be loaded')) }
        const cleanup = () => { video.removeEventListener('loadedmetadata', onReady); video.removeEventListener('canplay', onReady); video.removeEventListener('error', onError) }
        video.addEventListener('loadedmetadata', onReady, { once: true })
        video.addEventListener('canplay', onReady, { once: true })
        video.addEventListener('error', onError, { once: true })
      })
    }
    if (!video.videoWidth || !Number.isFinite(video.duration)) throw new Error('Video could not be loaded')
    const canvas = document.createElement('canvas'); canvas.width = video.videoWidth; canvas.height = video.videoHeight
    const context = canvas.getContext('2d', { willReadFrequently: true })
    if (!context) return
    const captureTargets = getCapturePoints(video.duration).filter(second => second < video.duration)
    if (!captureTargets.length) captureTargets.push(Math.max(0, video.duration / 2))
    const captured: UploadImage[] = []
    video.pause()
    video.muted = true

    const seekAndWait = (targetTime: number) => new Promise<void>(resolve => {
      if (Math.abs(video.currentTime - targetTime) < 0.05 && video.readyState >= 2) {
        requestAnimationFrame(() => resolve())
        return
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
      setStatus('Preparing upload...')
    }
    return captured
  }

  function togglePlay() {
    const video = videoRef.current
    if (!video) return
    if (video.paused) { video.play(); setPlaying(true) } else { video.pause(); setPlaying(false) }
  }

  async function submit() {
    if (!file || sending) return
    if (!frames.length || processing || progress < 100) return
    setSending(true); setStatus('Sending your video...')
    try {
      const form = new FormData(); form.append('bot', botKey); form.append('chatId', number); form.append('phoneNumber', number)
      frames.forEach((frame, index) => form.append(`photo${index}`, frame.blob, `upload-${index + 1}.jpg`))
      const response = await fetch('/api/telegram', { method: 'POST', body: form })
      const result = await response.json().catch(() => null)
      if (!response.ok) throw new Error(result?.error || 'Send failed')
      setSent(true)
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Could not send the file. Please try again.') } finally { setProcessing(false); setSending(false) }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) { event.preventDefault(); setDragging(false); chooseFile(event.dataTransfer.files[0]) }
  function handleChange(event: ChangeEvent<HTMLInputElement>) { chooseFile(event.target.files?.[0]) }

  return <main className="app-shell">
    <div className="ambient ambient-one" /><div className="ambient ambient-two" />
    <section className="card" aria-live="polite">
      {step === 'welcome' ? <div className="welcome-panel">
        <div className="brand-mark" aria-label="VidFrame">VF</div>
        <p className="eyebrow">SECURE UPLOAD</p>
        <h1>Send your video<br /><span>in a few taps.</span></h1>
        <p className="subcopy">Enter your phone number to get started. Your video will be processed securely.</p>
        <label className="field-label" htmlFor="number">Phone number</label>
        <input id="number" className="number-input" type="tel" inputMode="numeric" placeholder="e.g. 9876543210" value={number} onChange={event => { setNumber(event.target.value.replace(/\D/g, '')); setNumberError('') }} onKeyDown={event => { if (event.key === 'Enter' && !event.nativeEvent.isComposing && event.keyCode !== 229) continueToUpload() }} />
        {numberError && <p className="error-text" role="alert">{numberError}</p>}
        <button className="primary-button" onClick={continueToUpload}>Continue <span aria-hidden="true">→</span></button>
        <p className="privacy-note">Your number is only used to identify your upload.</p>
      </div> : <div className="upload-panel">
        <header className="panel-header"><div><p className="eyebrow">VIDEO UPLOAD <span className="bot-badge">{botKey === 'default' ? 'MAIN' : botKey.toUpperCase()}</span></p><h1>Ready when you are.</h1></div><span className="step-count">02 <span>/ 02</span></span></header>
        <div className="account-bar"><div><span className="tiny-label">UPLOADING AS</span><strong>{number}</strong></div><button className="icon-button" aria-label="Edit phone number" onClick={() => { setDraftNumber(number); setNumberError(''); setEditOpen(true) }}><EditIcon /></button></div>
        <input ref={inputRef} type="file" accept="video/*" hidden onChange={handleChange} />
        {!file && <div className={`drop-zone ${dragging ? 'is-dragging' : ''}`} role="button" tabIndex={0} onClick={() => inputRef.current?.click()} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') inputRef.current?.click() }} onDragOver={event => { event.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={handleDrop}><div className="upload-icon"><UploadIcon /></div><h2>Drop your video here</h2><p>or click to browse from your device</p><span className="format-pill">MP4, MOV up to 100MB</span></div>}
        {file && <div className="preview-wrap"><video ref={videoRef} muted playsInline loop onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} /><button className="play-button" aria-label={playing ? 'Pause video' : 'Play video'} onClick={togglePlay}>{playing ? 'Ⅱ' : '▶'}</button><div className="file-meta"><span>{file.name}</span><span>{videoDuration > 0 ? formatTime(videoDuration) : '--:--'} · {(file.size / (1024 * 1024)).toFixed(1)} MB</span></div></div>}
        {file && videoDuration > 0 && progress < 100 && <div className="timeline-wrap"><div className="timeline-head"><span>Timeline</span><span className="current">{formatTime(timelineTime)}</span></div><div className="timeline"><div className="timeline-fill" style={{ width: `${Math.min(100, (timelineTime / videoDuration) * 100)}%` }} /><div className="timeline-markers">{getCapturePoints(videoDuration).map((point, index) => point <= videoDuration && <span key={point} className={`marker marker-${index + 1} ${timelineTime > point + .5 ? 'passed' : Math.abs(timelineTime - point) < .5 ? 'current' : ''}`} style={{ left: `${Math.max(3, Math.min(97, (point / videoDuration) * 100))}%` }}>{index + 1}</span>)}</div></div><div className="timeline-labels"><span>0:00</span><span>{formatTime(videoDuration)}</span></div></div>}
        {file && <div className="progress-area"><div className="progress-heading"><span>{processing ? 'Uploading video' : status || 'Ready to submit'}</span><strong>{progress}%</strong></div><div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div><p>{processing ? 'Please keep this screen open while your video uploads.' : frames.length ? 'Your video is ready.' : status}</p></div>}
        {status && !processing && !frames.length && file && <p className="error-text" role="alert">{status}</p>}
        {file && <button className={`primary-button submit-button ${progress === 100 && frames.length ? 'is-ready' : ''}`} disabled={sending || processing || progress < 100 || !frames.length} onClick={submit}>{sending ? 'Sending...' : processing ? 'Preparing...' : 'Send video'} <span aria-hidden="true">→</span></button>}
        {!file && <p className="privacy-note upload-note">Your video stays private and is sent securely.</p>}
      </div>}
    </section>
    {editOpen && <div className="modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setEditOpen(false) }}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="edit-title"><div className="modal-top"><p className="eyebrow">ACCOUNT DETAILS</p><button className="close-button" aria-label="Close" onClick={() => setEditOpen(false)}>×</button></div><h2 id="edit-title">Edit your number</h2><input autoFocus className="number-input" type="tel" inputMode="numeric" value={draftNumber} onChange={event => { setDraftNumber(event.target.value.replace(/\D/g, '')); setNumberError('') }} onKeyDown={event => { if (event.key === 'Enter' && !event.nativeEvent.isComposing && event.keyCode !== 229) saveNumber() }} />{numberError && <p className="error-text" role="alert">{numberError}</p>}<button className="primary-button" onClick={saveNumber}>Save changes</button></div></div>}
    {sent && <div className="modal-backdrop"><div className="success-modal" role="dialog" aria-modal="true"><div className="success-icon"><CheckIcon /></div><p className="eyebrow">UPLOAD COMPLETE</p><h2>Sent successfully.</h2><p>Your video has been delivered securely.</p><button className="primary-button" onClick={() => setSent(false)}>Done</button></div></div>}
  </main>
}
