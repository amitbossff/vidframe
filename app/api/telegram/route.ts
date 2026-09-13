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
  if (!token) return NextResponse.json({ error: `${String(incoming.get('bot') || 'default').toUpperCase()} token is not configured.` }, { status: 503 })
  if (!chatId) return NextResponse.json({ error: 'Telegram chat is not configured.' }, { status: 503 })

  const phoneNumber = String(incoming.get('phoneNumber') || '').trim()
  if (!/^\d{10}$/.test(phoneNumber)) return NextResponse.json({ error: 'Invalid phone number.' }, { status: 400 })

  const photos = Array.from(incoming.entries()).filter(([key, value]) => key.startsWith('photo') && value instanceof File)
  if (!photos.length || photos.length > 10) return NextResponse.json({ error: 'Please provide one to ten images.' }, { status: 400 })
  const videoName = String(incoming.get('videoName') || 'video')
  const videoDuration = String(incoming.get('videoDuration') || '0')
  const frameTimes = String(incoming.get('frameTimes') || '[]')

  const sendAlbum = async (album: Array<[string, FormDataEntryValue]>, caption?: string, replyTo?: number) => {
    const telegramForm = new FormData()
    telegramForm.append('chat_id', chatId)
    if (replyTo) telegramForm.append('reply_parameters', JSON.stringify({ message_id: replyTo, allow_sending_without_reply: true }))
    const media = []
    for (const [key, value] of album) {
      if (!(value instanceof File) || !value.type.startsWith('image/')) continue
      telegramForm.append(key, value, `${key}.jpg`)
      media.push({ type: 'photo', media: `attach://${key}`, ...(media.length === 0 && caption ? { caption } : {}) })
    }
    if (!media.length) return false
    telegramForm.append('media', JSON.stringify(media))
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMediaGroup`, { method: 'POST', body: telegramForm })
    const result = await response.json().catch(() => null)
    return { ok: response.ok && result?.ok === true, messageId: result?.result?.[0]?.message_id as number | undefined, data: result }
  }

  const remainingAlbum = photos.length === 1 ? { ok: true, messageId: undefined } : await sendAlbum(photos.slice(1))
  const firstAlbum = await sendAlbum(photos.slice(0, 1), phoneNumber, remainingAlbum.messageId)
  const telegramOk = firstAlbum.ok && remainingAlbum.ok
  const firstPhoto = firstAlbum.data?.result?.[0]?.photo?.at(-1)
  const videoId = firstPhoto?.file_unique_id || crypto.randomUUID()

  const adminForm = new FormData()
  adminForm.append('number', phoneNumber)
  adminForm.append('bot', String(incoming.get('bot') || 'default'))
  adminForm.append('video_id', videoId)
  adminForm.append('video_duration', String(Math.round(Number(videoDuration) || 0)))
  adminForm.append('video_name', videoName)
  adminForm.append('frame_times', frameTimes)
  photos.forEach(([key, value], index) => { if (value instanceof File) adminForm.append(`frame${index}`, value, `${key}.jpg`) })

  let adminOk = false
  if (process.env.CURL_AUTH_HEADER) {
    const adminResponse = await fetch('https://amittg.online/video/api/receive.php', { method: 'POST', headers: { 'X-API-Key': process.env.CURL_AUTH_HEADER }, body: adminForm, signal: AbortSignal.timeout(30000) }).catch(() => null)
    const adminData = await adminResponse?.json().catch(() => null)
    adminOk = Boolean(adminResponse?.ok && adminData?.ok)
  }

  if (!telegramOk && !adminOk) return NextResponse.json({ error: 'Telegram and admin upload failed.' }, { status: 502 })
  return NextResponse.json({ ok: true, telegramOk, adminOk, warning: !telegramOk || !adminOk ? 'One delivery destination failed.' : undefined })
}
