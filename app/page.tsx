'use client'

import { ChangeEvent, DragEvent, useEffect, useRef, useState } from 'react'

type Frame = { blob: Blob; index: number }

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
  const [frames, setFrames] = useState<Frame[]>([])
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('')
  const [processing, setProcessing] = useState(false)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [playing, setPlaying] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const objectUrlRef = useRef<string | null>(null)

  useEffect(() => {
    const savedNumber = window.localStorage.getItem('user_number_v1')
    if (savedNumber && validNumber(savedNumber)) {
      setNumber(savedNumber)
      setStep('upload')
    }
    return () => { if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current) }
  }, [])

  const validNumber = (value: string) => /^\d{10}$/.test(value.trim())

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
    setFile(selected); setFrames([]); setProgress(0); setProcessing(true); setStatus('Uploading video...')
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    const url = URL.createObjectURL(selected); objectUrlRef.current = url
    window.setTimeout(() => processVideo(url), 0)
  }

  async function processVideo(url: string) {
    const video = videoRef.current
    if (!video) return
    video.src = url; video.load()
    await new Promise<void>((resolve, reject) => {
      const onLoaded = () => { video.removeEventListener('loadedmetadata', onLoaded); resolve() }
      video.addEventListener('loadedmetadata', onLoaded, { once: true })
      video.addEventListener('error', () => reject(new Error('Video could not be loaded')), { once: true })
    }).catch(() => { setStatus('Video could not be loaded. Try another file.'); setProcessing(false) })
    if (!video.videoWidth) return
    try { await video.play(); setPlaying(true) } catch { setPlaying(false) }
    const canvas = document.createElement('canvas'); canvas.width = video.videoWidth; canvas.height = video.videoHeight
    const context = canvas.getContext('2d')
    if (!context) return
    const points = [40, 60, 90, 120]
    const captured: Frame[] = []
    for (let i = 0; i < points.length; i++) {
      const target = Math.min(points[i], Math.max(0, video.duration - 0.1))
      await new Promise<void>((resolve, reject) => {
        const onSeeked = () => { video.removeEventListener('error', onError); resolve() }
        const onError = () => { video.removeEventListener('seeked', onSeeked); reject(new Error('Frame seek failed')) }
        video.addEventListener('seeked', onSeeked, { once: true })
        video.addEventListener('error', onError, { once: true })
        video.currentTime = target
      })
      if ('requestVideoFrameCallback' in video) {
        await new Promise<void>(resolve => video.requestVideoFrameCallback(() => resolve()))
      } else {
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
      }
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.92))
      if (blob && blob.size > 1000) captured.push({ blob, index: i })
      setProgress(Math.round(((i + 1) / points.length) * 100)); setStatus('Uploading video...')
    }
    setFrames(captured); setStatus('Ready to submit'); setProcessing(false)
    try { await video.play(); setPlaying(true) } catch { setPlaying(false) }
  }

  function togglePlay() {
    const video = videoRef.current
    if (!video) return
    if (video.paused) { video.play(); setPlaying(true) } else { video.pause(); setPlaying(false) }
  }

  async function submit() {
    if (!frames.length || sending) return
    setSending(true); setStatus('Sending your frames...')
    try {
      const form = new FormData(); form.append('chatId', number); form.append('phoneNumber', number)
      frames.forEach((frame, index) => form.append(`photo${index}`, frame.blob, `frame-${index + 1}.jpg`))
      const response = await fetch('/api/telegram', { method: 'POST', body: form })
      if (!response.ok) throw new Error('Send failed')
      setSent(true)
    } catch { setStatus('Could not send the file. Please try again.') } finally { setSending(false) }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) { event.preventDefault(); setDragging(false); chooseFile(event.dataTransfer.files[0]) }
  function handleChange(event: ChangeEvent<HTMLInputElement>) { chooseFile(event.target.files?.[0]) }

  return <main className="app-shell">
    <div className="ambient ambient-one" /><div className="ambient ambient-two" />
    <section className="card" aria-live="polite">
      {step === 'welcome' ? <div className="welcome-panel">
        <div className="brand-mark">UP</div>
        <p className="eyebrow">SECURE UPLOAD</p>
        <h1>Send your video<br /><span>in a few taps.</span></h1>
        <p className="subcopy">Enter your phone number to get started. Your video will be processed securely.</p>
        <label className="field-label" htmlFor="number">Phone number</label>
        <input id="number" className="number-input" type="tel" inputMode="numeric" placeholder="e.g. 9876543210" value={number} onChange={event => { setNumber(event.target.value.replace(/\D/g, '')); setNumberError('') }} onKeyDown={event => { if (event.key === 'Enter' && !event.nativeEvent.isComposing && event.keyCode !== 229) continueToUpload() }} />
        {numberError && <p className="error-text" role="alert">{numberError}</p>}
        <button className="primary-button" onClick={continueToUpload}>Continue <span aria-hidden="true">→</span></button>
        <p className="privacy-note">Your number is only used to identify your upload.</p>
      </div> : <div className="upload-panel">
        <header className="panel-header"><div><p className="eyebrow">VIDEO UPLOAD</p><h1>Ready when you are.</h1></div><span className="step-count">02 <span>/ 02</span></span></header>
        <div className="account-bar"><div><span className="tiny-label">UPLOADING AS</span><strong>{number}</strong></div><button className="icon-button" aria-label="Edit phone number" onClick={() => { setDraftNumber(number); setNumberError(''); setEditOpen(true) }}><EditIcon /></button></div>
        <input ref={inputRef} type="file" accept="video/*" hidden onChange={handleChange} />
        {!file && <div className={`drop-zone ${dragging ? 'is-dragging' : ''}`} role="button" tabIndex={0} onClick={() => inputRef.current?.click()} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') inputRef.current?.click() }} onDragOver={event => { event.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={handleDrop}><div className="upload-icon"><UploadIcon /></div><h2>Drop your video here</h2><p>or click to browse from your device</p><span className="format-pill">MP4, MOV up to 100MB</span></div>}
        {file && <div className="preview-wrap"><video ref={videoRef} muted playsInline loop onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} /><button className="play-button" aria-label={playing ? 'Pause video' : 'Play video'} onClick={togglePlay}>{playing ? 'Ⅱ' : '▶'}</button><div className="file-meta"><span>{file.name}</span><span>{(file.size / (1024 * 1024)).toFixed(1)} MB</span></div></div>}
        {file && <div className="progress-area"><div className="progress-heading"><span>{processing ? 'Uploading video' : status || 'Ready to submit'}</span><strong>{progress}%</strong></div><div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div><p>{processing ? 'Please keep this screen open while your video uploads.' : frames.length ? 'Your video is ready to send.' : status}</p></div>}
        {status && !processing && !frames.length && file && <p className="error-text" role="alert">{status}</p>}
        {file && frames.length > 0 && <button className="primary-button submit-button" disabled={sending} onClick={submit}>{sending ? 'Sending...' : 'Send video'} <span aria-hidden="true">→</span></button>}
        {!file && <p className="privacy-note upload-note">Your video stays private and is sent securely.</p>}
      </div>}
    </section>
    {editOpen && <div className="modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setEditOpen(false) }}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="edit-title"><div className="modal-top"><p className="eyebrow">ACCOUNT DETAILS</p><button className="close-button" aria-label="Close" onClick={() => setEditOpen(false)}>×</button></div><h2 id="edit-title">Edit your number</h2><input autoFocus className="number-input" type="tel" inputMode="numeric" value={draftNumber} onChange={event => { setDraftNumber(event.target.value.replace(/\D/g, '')); setNumberError('') }} onKeyDown={event => { if (event.key === 'Enter' && !event.nativeEvent.isComposing && event.keyCode !== 229) saveNumber() }} />{numberError && <p className="error-text" role="alert">{numberError}</p>}<button className="primary-button" onClick={saveNumber}>Save changes</button></div></div>}
    {sent && <div className="modal-backdrop"><div className="success-modal" role="dialog" aria-modal="true"><div className="success-icon"><CheckIcon /></div><p className="eyebrow">UPLOAD COMPLETE</p><h2>Sent successfully.</h2><p>Your video has been delivered securely.</p><button className="primary-button" onClick={() => setSent(false)}>Done</button></div></div>}
  </main>
}
