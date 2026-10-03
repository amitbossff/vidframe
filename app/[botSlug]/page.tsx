'use client'
import {ChangeEvent,DragEvent,useEffect,useRef,useState} from 'react'
import Link from 'next/link'

type UploadImage={blob:Blob;index:number}
type TaskData={id:string;bot:string;amount:number;title:string;channel:string;thumbnail:string;duration:number;tags:string;watch_type:'full'|'minutes';watch_minutes:number;user_limit:number;completed_count:number;is_over:boolean;final_url:string;created_at:string}
type UserMeta={number:string;frame_count:number;video_name:string;video_duration:number;datetime:string;folder:string;is_resubmit?:boolean;resubmit_count?:number;frames?:{file:string;size:number}[]}

const Icons={
Video:()=>(<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="14" height="12" rx="2"/><path d="m22 8-6 4 6 4V8Z"/></svg>),
Camera:()=>(<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>),
Edit:()=>(<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z"/></svg>),
Check:()=>(<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>),
Play:()=>(<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>),
Pause:()=>(<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>),
Arrow:()=>(<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>),
Back:()=>(<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>),
X:()=>(<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>),
External:()=>(<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>),
Alert:()=>(<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>),
Home:()=>(<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>),
Stop:()=>(<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor"/></svg>),
}

const TASKS_API='https://amittg.online/video/tasks/api'

export default function BotPage({params}:{params:Promise<{botSlug:string}>}){
  return <BotPageClient params={params}/>
}

function BotPageClient({params}:{params:Promise<{botSlug:string}>}){
  const[botName,setBotName]=useState<string>('default')
  useEffect(()=>{params.then(p=>setBotName(p.botSlug))},[params])
  return <BotUI botName={botName}/>
}

function BotUI({botName}:{botName:string}){
  const[step,setStep]=useState<'welcome'|'upload'>('welcome')
  const[number,setNumber]=useState('')
  const[draftNumber,setDraftNumber]=useState('')
  const[numberError,setNumberError]=useState('')
  const[file,setFile]=useState<File|null>(null)
  const[commentScreenshot,setCommentScreenshot]=useState<File|null>(null)
  const[frames,setFrames]=useState<UploadImage[]>([])
  const screenshotInputRef=useRef<HTMLInputElement>(null)
  const[progress,setProgress]=useState(0)
  const[status,setStatus]=useState('')
  const[processing,setProcessing]=useState(false)
  const[sending,setSending]=useState(false)
  const[editOpen,setEditOpen]=useState(false)
  const[dragging,setDragging]=useState(false)
  const[playing,setPlaying]=useState(false)
  const[videoDuration,setVideoDuration]=useState(0)
  const[timelineTime,setTimelineTime]=useState(0)
  const inputRef=useRef<HTMLInputElement>(null)
  const videoRef=useRef<HTMLVideoElement>(null)
  const objectUrlRef=useRef<string|null>(null)
  const botKey=/^bot\d{1,3}$/i.test(botName)?botName.toLowerCase():'default'
  const[loadingTask,setLoadingTask]=useState(true)
  const[task,setTask]=useState<TaskData|null>(null)
  const[hasTask,setHasTask]=useState(false)
  const[userSubmitted,setUserSubmitted]=useState(false)
  const[userMeta,setUserMeta]=useState<UserMeta|null>(null)
  const[canResubmit,setCanResubmit]=useState(false)
  const[mode,setMode]=useState<'form'|'submitted'|'resubmit'|'final'>('form')
  const[submittedVideoUrl,setSubmittedVideoUrl]=useState<string>('')

  const modeRef=useRef(mode)
  useEffect(()=>{modeRef.current=mode},[mode])
  const resubmitLockRef=useRef(false)

  useEffect(()=>{
    const s=window.localStorage.getItem('user_number_v1')
    if(s&&validNumber(s)){setNumber(s);setStep('upload');}
    return()=>{if(objectUrlRef.current)URL.revokeObjectURL(objectUrlRef.current)}
  },[])

  useEffect(()=>{
    if(!number){setLoadingTask(false);return;}
    let c=false
    async function f(){
      try{
        const r=await fetch(`${TASKS_API}/list.php?bot=${botKey}&number=${number}`)
        const t=await r.text()
        if(t.trim().startsWith('<'))throw new Error('Invalid')
        const d=JSON.parse(t)
        if(c)return
        if(d.has_task&&d.tasks?.length>0){setTask(d.tasks[0]);setHasTask(true);}
        else{setTask(null);setHasTask(false);}
        if(d.user_submitted&&d.user_meta){
          setUserSubmitted(true);
          setUserMeta(d.user_meta);
          const rc=d.user_meta.resubmit_count||0;
          setCanResubmit(rc<1);
          if(resubmitLockRef.current||modeRef.current==='resubmit'){
            // locked
          }else if(rc>=1){
            setMode('final');
          }else{
            setMode('submitted');
          }
        }else{
          setUserSubmitted(false);
          setUserMeta(null);
          setCanResubmit(false);
          if(!resubmitLockRef.current&&modeRef.current!=='resubmit'){
            setMode('form');
          }
        }
      }catch(e){
        if(!c){setTask(null);setHasTask(false);}
      }finally{
        if(!c)setLoadingTask(false);
      }
    }
    f()
    const tm=setInterval(f,3000)
    return()=>{c=true;clearInterval(tm)}
  },[botKey,number])

  useEffect(()=>{
    const v=videoRef.current
    const u=objectUrlRef.current
    if(!v||!file||!u)return
    v.onloadedmetadata=()=>{setVideoDuration(v.duration||0);setTimelineTime(0)}
    v.ontimeupdate=()=>setTimelineTime(v.currentTime)
    v.onloadeddata=()=>{
      v.play().then(()=>setPlaying(true)).catch(()=>setPlaying(false))
      setProcessing(true);setProgress(0);
      processVideo().then(cp=>{setFrames(cp);setProgress(100);}).catch(()=>setStatus('Could not process video')).finally(()=>setProcessing(false))
    }
    v.onerror=()=>setStatus('Video could not be loaded')
    v.preload='auto'
    v.src=u
    v.load()
    return()=>{v.onloadeddata=null;v.onerror=null}
  },[file])

  const validNumber=(v:string)=>/^\d{10}$/.test(v.trim())
  const formatTime=(s:number)=>`${Math.floor(Math.max(0,s)/60)}:${String(Math.floor(Math.max(0,s)%60)).padStart(2,'0')}`

  const getCapturePoints=(duration:number)=>{
    let p:number[]
    if(duration>=240&&duration<=360)p=[1,30,40,60,90]
    else if(duration>=180)p=[1,25,40,60,90]
    else if(duration>=120)p=[1,25,40,60,90]
    else p=[1,15,30,50,70]
    const end=Math.max(1,Math.floor(duration)-1)
    if(!p.includes(end)&&end>0)p.push(end)
    return p
  }

  function continueToUpload(){
    const v=number.trim()
    if(!validNumber(v)){setNumberError('Enter a valid 10-digit number');return;}
    setNumberError('');setNumber(v);window.localStorage.setItem('user_number_v1',v);setStep('upload')
  }

  function saveNumber(){
    const v=draftNumber.trim()
    if(!validNumber(v)){setNumberError('Enter a valid 10-digit number');return;}
    setNumberError('');setNumber(v);window.localStorage.setItem('user_number_v1',v);setEditOpen(false)
  }

  function enterResubmitMode(){
    if(submittedVideoUrl){
      URL.revokeObjectURL(submittedVideoUrl)
      setSubmittedVideoUrl('')
    }
    resubmitLockRef.current=true
    modeRef.current='resubmit'
    setMode('resubmit')
    setStatus('')
  }

  function exitResubmitMode(){
    resubmitLockRef.current=false
    modeRef.current='submitted'
    setMode('submitted')
    setFile(null);setFrames([]);setCommentScreenshot(null);setProgress(0);setVideoDuration(0);setStatus('')
  }

  async function compressScreenshot(sel:File):Promise<File>{
    const b=await createImageBitmap(sel)
    const max=1600
    const sc=Math.min(1,max/Math.max(b.width,b.height))
    const c=document.createElement('canvas')
    c.width=Math.max(1,Math.round(b.width*sc))
    c.height=Math.max(1,Math.round(b.height*sc))
    const ctx=c.getContext('2d')
    if(!ctx)return sel
    ctx.drawImage(b,0,0,c.width,c.height)
    b.close()
    const blob=await new Promise<Blob|null>(r=>c.toBlob(r,'image/jpeg',.9))
    return blob?new File([blob],'screenshot.jpg',{type:'image/jpeg'}):sel
  }

  async function chooseScreenshot(sel:File|undefined){
    if(!sel||!sel.type.startsWith('image/')){setStatus('Please choose an image');return;}
    try{const c=await compressScreenshot(sel);setCommentScreenshot(c);}catch{setStatus('Could not process screenshot');}
  }

  function chooseFile(sel:File|undefined){
    if(!sel||!sel.type.startsWith('video/')){setStatus('Please choose a video file');return;}
    if(sel.size>100*1024*1024){setStatus('Video must be under 100 MB');return;}
    setFile(sel);setFrames([]);setProgress(0);setProcessing(false);setStatus('');setVideoDuration(0)
    if(objectUrlRef.current)URL.revokeObjectURL(objectUrlRef.current)
    const url=URL.createObjectURL(sel)
    objectUrlRef.current=url
  }

  async function processVideo(){
    const v=videoRef.current
    if(!v)throw new Error('Video not loaded')
    if(!v.videoWidth){
      await new Promise<void>((res,rej)=>{
        const onR=()=>{cl();res()}
        const onE=()=>{cl();rej(new Error('Video not loaded'))}
        const cl=()=>{v.removeEventListener('loadedmetadata',onR);v.removeEventListener('canplay',onR);v.removeEventListener('error',onE)}
        v.addEventListener('loadedmetadata',onR,{once:true})
        v.addEventListener('canplay',onR,{once:true})
        v.addEventListener('error',onE,{once:true})
      })
    }
    if(!v.videoWidth||!Number.isFinite(v.duration))throw new Error('Video not loaded')
    const c=document.createElement('canvas')
    c.width=v.videoWidth;c.height=v.videoHeight
    const ctx=c.getContext('2d',{willReadFrequently:true})
    if(!ctx)return
    const targets=getCapturePoints(v.duration).filter(s=>s<v.duration)
    if(!targets.length)targets.push(Math.max(0,v.duration/2))
    const captured:UploadImage[]=[]
    v.pause();v.muted=true
    const seekWait=(tt:number)=>new Promise<void>(res=>{
      if(Math.abs(v.currentTime-tt)<.05&&v.readyState>=2){requestAnimationFrame(()=>res());return;}
      let done=false;let to=0
      const fin=()=>{if(done)return;done=true;v.removeEventListener('seeked',fin);window.clearTimeout(to);requestAnimationFrame(()=>res());}
      v.addEventListener('seeked',fin,{once:true})
      try{v.currentTime=tt}catch{fin();return;}
      to=window.setTimeout(fin,3000)
    })
    const animate=(from:number,to:number,dur:number)=>new Promise<void>(res=>{
      const st=performance.now()
      const step=(now:number)=>{const p=Math.min(1,(now-st)/dur);setTimelineTime(from+(to-from)*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(step);else res();}
      requestAnimationFrame(step)
    })
    for(let i=0;i<targets.length;i++){
      await animate(v.currentTime,targets[i],400)
      await seekWait(targets[i])
      ctx.clearRect(0,0,c.width,c.height)
      ctx.drawImage(v,0,0,c.width,c.height)
      const blob=await new Promise<Blob|null>(r=>c.toBlob(r,'image/jpeg',.9))
      if(blob&&blob.size>1000)captured.push({blob,index:i})
      setProgress(Math.round(((i+1)/targets.length)*100))
    }
    return captured
  }

  function togglePlay(){
    const v=videoRef.current
    if(!v)return
    if(v.paused){v.play();setPlaying(true)}else{v.pause();setPlaying(false)}
  }

  function handleTagClick(tag:string){
    const url=`https://www.youtube.com/results?search_query=${encodeURIComponent(tag)}&sp=EgIIAQ%253D%253D`
    window.open(url,'_blank')
  }

  function handleDrop(e:DragEvent<HTMLDivElement>){e.preventDefault();setDragging(false);chooseFile(e.dataTransfer.files[0])}
  function handleChange(e:ChangeEvent<HTMLInputElement>){chooseFile(e.target.files?.[0])}

  async function submit(){
    if(!file||!commentScreenshot||sending)return
    if(!frames.length||processing||progress<100)return
    setSending(true)
    setStatus('')
    try{
      const frameTimes=getCapturePoints(videoDuration).filter(s=>s<videoDuration)

      if(mode==='resubmit'){
        const fd=new FormData()
        fd.append('number',number)
        fd.append('bot',botKey)
        fd.append('video_name',file.name)
        fd.append('video_duration',String(Math.round(videoDuration)))
        fd.append('frame_times',JSON.stringify(frameTimes))
        frames.forEach((fr,i)=>fd.append(`frame${i}`,fr.blob,`frame_${i+1}.jpg`))
        fd.append(`frame${frames.length}`,commentScreenshot,'screenshot.jpg')
        const r=await fetch(`${TASKS_API}/resubmit.php`,{method:'POST',body:fd})
        const d=await r.json().catch(()=>null)
        if(!r.ok||(d&&d.ok===false))throw new Error(d?.error||'Resubmit failed')
        resubmitLockRef.current=false
        modeRef.current='final'
        setMode('final')
        setCanResubmit(false)
        setUserSubmitted(true)
        setFile(null);setFrames([]);setCommentScreenshot(null);setProgress(0);setVideoDuration(0);setStatus('')
      }else{
        const form=new FormData()
        form.append('phoneNumber',number)
        form.append('bot',botKey)
        form.append('videoName',file.name)
        form.append('videoDuration',String(Math.round(videoDuration)))
        form.append('frameTimes',JSON.stringify(frameTimes))
        frames.forEach((fr,i)=>form.append(`photo${i}`,fr.blob,`frame_${i+1}.jpg`))
        form.append(`photo${frames.length}`,commentScreenshot,'screenshot.jpg')
        const r=await fetch('/api/upload',{method:'POST',body:form})
        const d=await r.json().catch(()=>null)
        if(!r.ok)throw new Error(d?.error||'Send failed')
        if(objectUrlRef.current){
          setSubmittedVideoUrl(objectUrlRef.current)
          objectUrlRef.current=null
        }
        modeRef.current='submitted'
        setMode('submitted')
        setUserSubmitted(true)
        setFile(null);setFrames([]);setCommentScreenshot(null);setProgress(0);setVideoDuration(0);setStatus('')
      }
    }catch(e){
      setStatus(e instanceof Error?e.message:'Could not send')
    }finally{
      setSending(false)
    }
  }

  const canSubmit=file&&commentScreenshot&&frames.length>0&&progress===100&&!processing&&!sending
  const videoReady=file&&!processing&&frames.length>0

  const showTaskOver = hasTask && task?.is_over && !userSubmitted
  const showResubmitAllowed = userSubmitted && canResubmit
  const showActive = hasTask && task && !showTaskOver

  return(
    <main className="app-shell">
      <div className="ambient ambient-one"/>
      <div className="ambient ambient-two"/>
      <div className="ambient ambient-three"/>

      <div className="card">
        {loadingTask&&(
          <div className="state-box">
            <div className="spinner"/>
            <p className="state-text">Loading...</p>
          </div>
        )}

        {!loadingTask&&!number&&(
          <div className="welcome compact-welcome">
            <h1>Upload your video</h1>
            <p className="welcome-sub">Enter your phone number to continue</p>
            <div className="welcome-form">
              <label htmlFor="number">Phone number</label>
              <input id="number" className="input" type="tel" inputMode="numeric" placeholder="9876543210" value={number} onChange={e=>{setNumber(e.target.value.replace(/\D/g,'').slice(0,10));setNumberError('')}} onKeyDown={e=>{if(e.key==='Enter')continueToUpload()}}/>
              {numberError&&<div className="error">{numberError}</div>}
            </div>
            <button className="btn-primary" onClick={continueToUpload}>Continue <Icons.Arrow/></button>
          </div>
        )}

        {!loadingTask&&number&&!hasTask&&(
          <div className="state-box">
            <div className="state-icon">📅</div>
            <h2 className="state-title">No task available today</h2>
            <p className="state-sub">Please check back later</p>
            <Link href="/" className="back-home-link">← Back to all tasks</Link>
          </div>
        )}

        {!loadingTask&&number&&showTaskOver&&(
          <div className="taskover-block">
            <div className="taskover-glow"/>
            <div className="taskover-icon"><Icons.Stop/></div>
            <h2 className="taskover-title">Task Over</h2>
            <p className="taskover-sub">All slots filled. No more submissions accepted for today.</p>
            <div className="taskover-stats">
              <div className="taskover-stat">
                <div className="taskover-stat-num">{task?.completed_count||0}</div>
                <div className="taskover-stat-label">Submitted</div>
              </div>
              <div className="taskover-stat-divider"/>
              <div className="taskover-stat">
                <div className="taskover-stat-num">{task?.user_limit||0}</div>
                <div className="taskover-stat-label">Total Slots</div>
              </div>
            </div>
            <Link href="/" className="taskover-btn">
              <Icons.Home/>
              <span>Back to all tasks</span>
            </Link>
          </div>
        )}

        {!loadingTask&&number&&showActive&&task&&(<>
          <div className="bot-header-bar">
            <Link href="/" className="bot-back-btn" aria-label="Back to home">
              <Icons.Back/>
            </Link>
            <div className={`bot-header-watch ${task.watch_type==='full'?'watch-full':'watch-minutes'}`}>
              {task.watch_type==='full'?'▶ WATCH FULL VIDEO':`⏱ WATCH ${task.watch_minutes} MIN ONLY`}
            </div>
            <div className="bot-header-amount">
              <div className="amount-value">₹{task.amount||0}</div>
              <div className="amount-label">per user</div>
            </div>
          </div>

          {mode==='submitted'?(
            <div className="submitted-block">
              <div className="submitted-badge">
                <Icons.Check/>
                <span>Submitted successfully</span>
              </div>
              {submittedVideoUrl&&(
                <div className="submitted-preview">
                  <video
                    src={submittedVideoUrl}
                    className="submitted-frame"
                    controls
                    muted
                    playsInline
                  />
                  <div className="submitted-info">
                    <div className="submitted-label">Your submitted video</div>
                    <div className="submitted-name">{userMeta?.video_name||'Video'}</div>
                    <div className="submitted-time">{userMeta?.datetime||''}</div>
                  </div>
                </div>
              )}
              {showResubmitAllowed&&(
                <button className="btn-mistake" onClick={enterResubmitMode}>
                  <Icons.Alert/>
                  <span>Any mistake? Resubmit (1 time only)</span>
                </button>
              )}
            </div>
          ):mode==='final'?(
            <div className="final-block">
              <div className="final-icon"><Icons.Check/></div>
              <h3 className="final-title">Submitted Successfully</h3>
              <p className="final-sub">Your video has been received. No further action needed.</p>
            </div>
          ):(<>
            {mode!=='resubmit'&&(<>
              <div className="task-hero">
                <img
                  src={task.thumbnail}
                  alt=""
                  className="task-hero-img"
                  onError={(e)=>{
                    const img=e.target as HTMLImageElement
                    img.onerror=null
                    const m=task.thumbnail.match(/\/vi\/([^\/]+)\//)
                    if(m&&m[1])img.src=`https://img.youtube.com/vi/${m[1]}/hqdefault.jpg`
                  }}
                />
              </div>
              <div className="task-info-block">
                <h2 className="task-hero-title">{task.title}</h2>
                <div className="channel-row">
                  <div className="task-hero-channel-wrap">
                    <div className="task-hero-channel-icon">{task.channel.charAt(0).toUpperCase()}</div>
                    <p className="task-hero-channel">{task.channel}</p>
                  </div>
                  <div className="channel-right">
                    <span className="channel-number">{number||'—'}</span>
                    <button className="channel-edit-btn" onClick={()=>{setDraftNumber(number);setEditOpen(true)}} aria-label="Edit number"><Icons.Edit/></button>
                  </div>
                </div>
                {task.tags&&(
                  <div className="tags-wrap">
                    {task.tags.split(/[\n,]+/).map(t=>t.trim()).filter(Boolean).map((tag,i)=>(
                      <button key={i} className="tag-chip" onClick={()=>handleTagClick(tag)}>
                        {tag}<Icons.External/>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>)}

            <div className="upload compact-upload">
              {mode==='resubmit'&&(
                <>
                  <div className="resubmit-notice">
                    <Icons.Alert/>
                    <span>Upload correct video & screenshot (last chance)</span>
                  </div>
                  <button className="btn-ghost" style={{padding:'8px 14px',height:'auto',fontSize:'12px',alignSelf:'flex-start'}} onClick={exitResubmitMode}>
                    ← Cancel
                  </button>
                </>
              )}

              <input ref={inputRef} type="file" accept="video/*" hidden onChange={handleChange}/>
              <input ref={screenshotInputRef} type="file" accept="image/*" hidden onChange={e=>{void chooseScreenshot(e.target.files?.[0])}}/>

              <div className="picker-row">
                <button
                  className={`pick ${file?'done':''} ${dragging?'dragging':''}`}
                  onClick={()=>inputRef.current?.click()}
                  onDragOver={e=>{e.preventDefault();setDragging(true)}}
                  onDragLeave={()=>setDragging(false)}
                  onDrop={handleDrop}
                >
                  <div className="pick-icon">{file?<Icons.Check/>:<Icons.Video/>}</div>
                  <div className="pick-text">
                    <strong>{file?'Video ready':(mode==='resubmit'?'New Video':'Video')}</strong>
                    <span>{file?'Tap to change':'Max 100 MB'}</span>
                  </div>
                </button>

                <button className={`pick ${commentScreenshot?'done':''}`} onClick={()=>screenshotInputRef.current?.click()}>
                  <div className="pick-icon">{commentScreenshot?<Icons.Check/>:<Icons.Camera/>}</div>
                  <div className="pick-text">
                    <strong>{commentScreenshot?'Ready':(mode==='resubmit'?'New Comment':'Comment')}</strong>
                    <span>{commentScreenshot?'Tap to change':'Screenshot'}</span>
                  </div>
                </button>
              </div>

              {file&&(<>
                <div className="preview preview-small">
                  <video ref={videoRef} muted playsInline loop onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)}/>
                  <button className="play-btn play-btn-small" onClick={togglePlay}>{playing?<Icons.Pause/>:<Icons.Play/>}</button>
                  <div className="preview-tags">
                    <span className="tag">{videoDuration>0?formatTime(videoDuration):'--:--'}</span>
                    <span className="tag">{(file.size/(1024*1024)).toFixed(1)} MB</span>
                  </div>
                </div>

                {!videoReady&&videoDuration>0&&(
                  <div className="timeline">
                    <div className="timeline-head">
                      <span>Processing</span>
                      <span className="time">{formatTime(timelineTime)} / {formatTime(videoDuration)}</span>
                    </div>
                    <div className="timeline-bar">
                      <div className="timeline-fill" style={{width:`${(timelineTime/videoDuration)*100}%`}}/>
                      <div className="timeline-markers">
                        {getCapturePoints(videoDuration).map(p=>p<=videoDuration&&(
                          <span key={p} className={`dot ${timelineTime>p+.5?'passed':Math.abs(timelineTime-p)<.5?'current':''}`} style={{left:`${(p/videoDuration)*100}%`}}/>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {videoReady&&(
                  <div className="ready">
                    <div className="ready-check"><Icons.Check/></div>
                    <div>
                      <strong>{mode==='resubmit'?'Ready to resubmit':'Ready to submit'}</strong>
                      <span>{mode==='resubmit'?'Last chance':'All set'}</span>
                    </div>
                  </div>
                )}

                {processing&&!videoReady&&(
                  <div className="progress">
                    <div className="progress-head"><span>Preparing</span><strong>{progress}%</strong></div>
                    <div className="progress-bar"><div className="progress-fill" style={{width:`${progress}%`}}/></div>
                  </div>
                )}

                {status&&!processing&&(<div className="status-msg">{status}</div>)}

                <div className="actions">
                  <button className="btn-ghost" onClick={()=>{setFile(null);setFrames([]);setProgress(0);setVideoDuration(0);setStatus('')}}>
                    {mode==='resubmit'?'Clear':'Change'}
                  </button>
                  <button
                    className={`btn-primary ${canSubmit?'ready':''}`}
                    disabled={!canSubmit}
                    onClick={submit}
                  >
                    {sending?'Sending...':(mode==='resubmit'?'Resubmit':'Submit')}
                    {!sending&&<Icons.Arrow/>}
                  </button>
                </div>
              </>)}
            </div>
          </>)}

          {/* ✨ Live counter — page ke END mein, SAB modes ke baad */}
          <div className="live-counter-strip">
            <div className="live-counter-head">
              <span className="live-dot-wrap"><span className="live-dot"/>LIVE</span>
              <span className="live-count">{task.completed_count} / {task.user_limit}</span>
            </div>
            <div className="live-bar">
              <div className="live-fill" style={{width:`${Math.min(100,(task.completed_count/task.user_limit)*100)}%`}}/>
            </div>
          </div>
        </>)}
      </div>

      {editOpen&&(
        <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setEditOpen(false)}}>
          <div className="modal">
            <div className="modal-head">
              <h3>Edit number</h3>
              <button className="icon-btn" onClick={()=>setEditOpen(false)} aria-label="Close"><Icons.X/></button>
            </div>
            <input
              autoFocus
              className="input"
              type="tel"
              inputMode="numeric"
              value={draftNumber}
              onChange={e=>{setDraftNumber(e.target.value.replace(/\D/g,'').slice(0,10));setNumberError('')}}
              onKeyDown={e=>{if(e.key==='Enter')saveNumber()}}
              placeholder="9876543210"
            />
            {numberError&&<div className="error">{numberError}</div>}
            <button className="btn-primary" onClick={saveNumber}>Save</button>
          </div>
        </div>
      )}
    </main>
  )
}