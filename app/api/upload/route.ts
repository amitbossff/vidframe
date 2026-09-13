import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const incoming = await request.formData()
  const phoneNumber = String(incoming.get('phoneNumber') || '').trim()
  const bot = String(incoming.get('bot') || 'unknown').trim().toLowerCase()
  if (!/^\d{10}$/.test(phoneNumber)) return NextResponse.json({ error: 'Invalid phone number.' }, { status: 400 })

  const photos = Array.from(incoming.entries()).filter(([key, value]) => key.startsWith('photo') && value instanceof File)
  const screenshot = photos.at(-1)?.[1]
  const framePhotos = photos.slice(0, -1)
  if (!framePhotos.length || framePhotos.length > 9) return NextResponse.json({ error: 'Please provide frame images and one screenshot.' }, { status: 400 })
  if (!(screenshot instanceof File) || !screenshot.type.startsWith('image/') || screenshot.size > 60 * 1024) return NextResponse.json({ error: 'Please provide a screenshot smaller than 60 KB.' }, { status: 400 })

  const adminKey = process.env.CURL_AUTH_HEADER
  if (!adminKey) return NextResponse.json({ error: 'Admin upload is not configured.' }, { status: 503 })

  const adminForm = new FormData()
  adminForm.append('number', phoneNumber)
  adminForm.append('bot', bot)
  adminForm.append('video_id', crypto.randomUUID())
  adminForm.append('video_duration', String(Math.round(Number(incoming.get('videoDuration')) || 0)))
  adminForm.append('video_name', String(incoming.get('videoName') || 'video'))
  adminForm.append('frame_times', String(incoming.get('frameTimes') || '[]'))
  photos.forEach(([key, value], index) => {
    if (value instanceof File) adminForm.append(`frame${index}`, value, `${key}.jpg`)
  })

  try {
    const response = await fetch('https://amittg.online/video/api/receive.php', {
      method: 'POST',
      headers: { 'X-API-Key': adminKey },
      body: adminForm,
      signal: AbortSignal.timeout(30_000),
    })
    const result = await response.json().catch(() => null)
    if (!response.ok || !result?.ok) return NextResponse.json({ error: 'Admin upload failed.' }, { status: 502 })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Admin upload failed.' }, { status: 502 })
  }
}
