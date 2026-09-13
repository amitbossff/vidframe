import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

function getBotToken(bot: unknown) {
  const match = typeof bot === 'string' ? bot.toLowerCase().match(/^bot(\d{1,2})$/) : null
  return process.env[match ? `BOT${match[1]}_TOKEN` : 'TELEGRAM_BOT_TOKEN']
}

export async function POST(request: Request) {
  const incoming = await request.formData()
  const token = getBotToken(incoming.get('bot'))
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return NextResponse.json({ error: 'Telegram is not configured.' }, { status: 500 })

  const phoneNumber = String(incoming.get('phoneNumber') || '').trim()
  if (!/^\d{10}$/.test(phoneNumber)) return NextResponse.json({ error: 'Invalid phone number.' }, { status: 400 })

  const media = []
  const telegramForm = new FormData()
  telegramForm.append('chat_id', chatId)
  const photos = Array.from(incoming.entries()).filter(([key, value]) => key.startsWith('photo') && value instanceof File)
  if (!photos.length || photos.length > 4) return NextResponse.json({ error: 'Please provide one to four images.' }, { status: 400 })

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
