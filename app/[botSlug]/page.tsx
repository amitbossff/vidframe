import UploadPage from '../page'

export default async function BotPage({ params }: { params: Promise<{ botSlug: string }> }) {
  const { botSlug } = await params
  return <UploadPage botName={botSlug} />
}
