import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const incoming = await request.formData()
  const phoneNumber = String(incoming.get('phoneNumber') || '').trim()
  if (!/^\d{10}$/.test(phoneNumber)) return NextResponse.json({ error: 'Invalid phone number.' }, { status: 400 })

  const photos = Array.from(incoming.entries()).filter(([key, value]) => key.startsWith('photo') && value instanceof File)
  if (!photos.length || photos.length > 10) return NextResponse.json({ error: 'Please provide one to ten images.' }, { status: 400 })

  const adminKey = process.env.CURL_AUTH_HEADER
  if (!adminKey) return NextResponse.json({ error: 'Admin upload is not configured.' }, { status: 503 })

  const adminForm = new FormData()
  adminForm.append('number', phoneNumber)
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
