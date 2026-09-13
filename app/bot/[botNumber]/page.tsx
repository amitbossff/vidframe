import UploadPage from '../../page'

export default async function BotPage({ params }: { params: Promise<{ botNumber: string }> }) {
  const { botNumber } = await params
  return <UploadPage botName={`bot${botNumber.replace(/^bot/i, '')}`} />
}
