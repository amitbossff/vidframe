import {NextResponse} from 'next/server'
export const runtime='nodejs'

export async function POST(request:Request){
const incoming=await request.formData()
const phoneNumber=String(incoming.get('phoneNumber')||'').trim()
const bot=String(incoming.get('bot')||'unknown').trim().toLowerCase()
if(!/^\d{10}$/.test(phoneNumber))return NextResponse.json({error:'Invalid phone number.'},{status:400})
if(!/^bot\d{1,2}$/.test(bot))return NextResponse.json({error:'Invalid bot.'},{status:400})

const photos=Array.from(incoming.entries()).filter(([key,value])=>key.startsWith('photo')&&value instanceof File)
const screenshot=photos.find(([key])=>key==='photo1')?.[1]
const framePhotos=photos.filter(([key])=>key!=='photo1')
if(!framePhotos.length||framePhotos.length>9)return NextResponse.json({error:'Please provide frame images and one screenshot.'},{status:400})
if(!(screenshot instanceof File)||!screenshot.type.startsWith('image/')||screenshot.size>5*1024*1024)return NextResponse.json({error:'Please provide a screenshot smaller than 5 MB.'},{status:400})

// Duplicate check via Ninza
try{
const checkRes=await fetch(`https://amittg.online/video/tasks/api/check_submit.php?bot=${bot}&number=${phoneNumber}`,{signal:AbortSignal.timeout(10_000)})
const checkData=await checkRes.json().catch(()=>null)
if(checkData?.submitted)return NextResponse.json({error:'Already submitted in this bot.'},{status:400})
}catch{return NextResponse.json({error:'Could not verify submission.'},{status:502})}

const adminKey=process.env.CURL_AUTH_HEADER
if(!adminKey)return NextResponse.json({error:'Admin upload is not configured.'},{status:503})

const adminForm=new FormData()
adminForm.append('number',phoneNumber)
adminForm.append('bot',bot)
adminForm.append('video_id','')
adminForm.append('video_duration',String(Math.round(Number(incoming.get('videoDuration'))||0)))
adminForm.append('video_name',String(incoming.get('videoName')||'video'))
adminForm.append('frame_times',String(incoming.get('frameTimes')||'[]'))
photos.forEach(([key,value],index)=>{if(value instanceof File)adminForm.append(`frame${index}`,value,`${key}.jpg`)})

try{
const response=await fetch('https://amittg.online/video/tasks/api/receive.php',{method:'POST',headers:{'X-API-Key':adminKey},body:adminForm,signal:AbortSignal.timeout(30_000)})
const result=await response.json().catch(()=>null)
if(!response.ok||!result?.ok)return NextResponse.json({error:result?.error||'Upload failed.'},{status:502})
return NextResponse.json({ok:true})
}catch(e){return NextResponse.json({error:'Upload failed.',detail:e instanceof Error?e.message:''},{status:502})}}
