import BotPage from '../../[botSlug]/page'

export default function BotNumberPage({params}:{params:Promise<{botNumber:string}>}){
return <BotPage params={params.then(p=>({botSlug:`bot${p.botNumber.replace(/^bot/i,'')}`}))}/>
}
