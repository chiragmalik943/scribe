// DOM event listener wiring. 

/* ══════════════════════════════════ events ══════════════════════════════════ */
const KEYS=['Fn','Right ⌘','⌃⌥','F13'];
const LANGS=['English (US)','English (UK)','Spanish','French','German'];
const TIMES=['6:00 AM','7:00 AM','8:00 AM','9:00 AM','12:00 PM','5:00 PM','6:00 PM','8:00 PM'];

document.addEventListener('click',e=>{
  const el=e.target.closest('[data-a]');if(!el)return;
  const a=el.dataset.a,p=el.dataset.p||'';
  const stop=()=>{e.preventDefault();e.stopPropagation()};
  switch(a){
  case 'noop':return;
  case 'demo':stop();demo(p);return;
  case 'go':stop();pkDismiss();S.route=p;S.q='';S.panel=false;S.menu=null;S.mpanel=false;S.fid=null;S.wpanel=false;
    S.view=p==='tasks'?'all':p==='speech'?'today':p==='vocabulary'?'all':'all';render();return;
  case 'view':{stop();S.view=p;S.q='';S.menu=null;S.mpanel=false;pkDismiss();
    /* Tasks, Speech and Vocabulary filter their own list in place — only the
       meetings family reads a view as somewhere to go. */
    if(S.route==='tasks'){S.panel=false;render();return}
    if(isSpeech(S.route)){render();return}
    if(S.route==='insights'){render();return}
    if(p.startsWith('f:')){
      /* a folder has its own page: sub-folders, rolled-up notes and its meetings */
      const fid=p.slice(2);const f=folder(fid);
      if(!f){S.route='mlist';S.view='all';render();return}
      if(f.parent)S.openF[f.parent]=true;
      S.route='folder';S.fid=fid;S.mid=null;render();return;}
    if(p==='unfiled'){S.route='folder';S.fid='';S.mid=null;render();return;}
    /* everything else is a filter on the flat meeting list, so a detail page
       steps back out to that list rather than just re-highlighting the sidebar */
    S.route='mlist';S.mid=null;render();return;}
  case 'upcoming':{stop();const e=allEvents().find(x=>x.id===p);if(!e)return;
    toast(`${ic('cal',15)}<span><b>${esc(e.title)}</b> — ${relDay(e.date)}, ${
      clockLabel(e.s)}–${clockLabel(e.e)}${e.who?'. With '+esc(e.who):''}.
      AIT-Scribe will offer to take notes when it starts.</span>`,4200,'info');return;}
  case 'foldtoggle':stop();S.openF[p]=!S.openF[p];render();return;
  case 'newfolder':{stop();
    /* p is either a parent folder id, '' for a new top-level folder, or
       '|<meetingId>' when it came from a move-to-folder menu */
    let parent=p,moveMid='';
    if(p.indexOf('|')>=0){[parent,moveMid]=p.split('|');}
    const n=prompt(parent?`${addFolderLabel(parent)} — name it`:'Add Folder — name it','');
    if(!n||!n.trim()){S.menu=null;render();return}
    const name=n.trim();
    if(db.folders.some(f=>f.name.toLowerCase()===name.toLowerCase()&&(f.parent||'')===(parent||''))){
      S.menu=null;render();toast(`A folder called <b>${esc(name)}</b> is already there.`,3000,'warn');return}
    const id=newFolderId();
    const f={id,name};if(parent)f.parent=parent;
    /* keep sub-folders grouped directly under their parent in the list */
    if(parent){const last=db.folders.map(x=>x.id).lastIndexOf(
        (subFolders(parent).slice(-1)[0]||{id:parent}).id);
      db.folders.splice(last+1,0,f);S.openF[parent]=true;}
    else db.folders.push(f);
    if(moveMid){meeting(moveMid).folder=id;}
    S.menu=null;S.view='f:'+id;
    /* land on the new folder unless it was created to receive a meeting, in
       which case stay where the user was */
    if(!moveMid){S.route='folder';S.fid=id;S.mid=null;S.mpanel=false;}
    render();
    toast(moveMid?`<b>${esc(name)}</b> created — the meeting moved into it.`
      :`<b>${esc(name)}</b> created.`,2800,'ok');return;}
  case 'renamefolder':{stop();const f=folder(p);if(!f)return;
    const n=prompt('Rename folder',f.name);
    if(n&&n.trim())f.name=n.trim();
    S.menu=null;render();if(n&&n.trim())toast('Folder renamed.');return;}
  case 'delfolder':{stop();const f=folder(p);if(!f)return;
    const gone=[p,...subFolders(p).map(x=>x.id)];
    const n=db.meetings.filter(m=>gone.includes(m.folder)).length;
    db.meetings.forEach(m=>{if(gone.includes(m.folder))m.folder='';});
    db.folders=db.folders.filter(x=>!gone.includes(x.id));
    if(gone.some(g=>S.view==='f:'+g))S.view='all';
    if(S.route==='folder'&&gone.includes(S.fid)){
      /* step up to the parent if there is one, otherwise out to all meetings */
      if(f.parent&&!gone.includes(f.parent)){S.fid=f.parent;S.view='f:'+f.parent}
      else {S.route='mlist';S.view='all';S.fid=null}}
    S.menu=null;render();
    toast(`<b>${esc(f.name)}</b> deleted. ${n?`${n} meeting${n>1?'s':''} now Unfiled`
      :'It was empty'} — no notes were removed.`,3400,'warn');return;}
  case 'range':stop();S.range=p;pkDismiss();render();return;
  /* Collapsing leaves the pointer sitting on the strip that would re-open it,
     so the zone is disarmed until the pointer moves off. Expanding is the
     ordinary toggle. */
  case 'railmin':stop();S.railmin=!S.railmin;pkDismiss();render();return;
  case 'listmin':stop();S.listmin=!S.listmin;pkDismiss();render();return;
  /* pinning turns a peek into the real thing, which is the whole point of
     showing the control while peeked */
  case 'railpin':stop();S.railmin=false;S.peek=null;pkStop();render();
    toast(`${ic('panelL',15)}<span>Sidebar pinned open.</span>`,2200);return;
  case 'listpin':stop();S.listmin=false;S.peek=null;pkStop();render();
    toast(`${ic('panelL',15)}<span>List pinned open.</span>`,2200);return;
  case 'expandlist':if(!S.listmin&&S.peek!=='list')return;stop();
    S.listmin=false;S.peek=null;pkStop();render();
    setTimeout(()=>{const i=document.querySelector('.srch input');if(i)i.focus()},60);return;
  case 'open':stop();pkDismiss();S.route='meeting';S.mid=p;S.tab=(S.rec&&S.rec.mid===p)?'mynotes':'notes';
    S.menu=null;S.tq='';S.speakers='All speakers';render();return;
  case 'tab':stop();S.tab=p;if(p!=='watch')S.wpanel=false;render();return;
  case 'record':stop();startRecording();return;
  case 'pauseRec':stop();S.rec.paused=!S.rec.paused;render();
    toast(S.rec.paused?'Paused — nothing is being captured.':'Recording resumed.');return;
  case 'stopRec':stop();stopRecording();return;
  case 'jump':stop();S.tab='transcript';S.tq='';render();toast(`Jumped to <b>${p}</b> in the transcript.`);return;
  case 'playpause':stop();S.playing=!S.playing;
    if(S.playing){timers.push(setInterval(()=>{S.playPos=(S.playPos+1)%80;render()},700))}else clearTimers();
    render();return;
  case 'seek':{stop();const r=el.getBoundingClientRect();
    S.playPos=Math.round((e.clientX-r.left)/r.width*80);render();return;}
  case 'rename':{stop();const m=meeting(p);const n=prompt('Rename meeting',m.title);
    if(n&&n.trim()){m.title=n.trim();toast('Renamed.')}S.menu=null;render();return;}
  case 'movefolder':{stop();const [id,f]=p.split('|');meeting(id).folder=f;S.menu=null;render();
    toast(`Moved to <b>${folderName(f)}</b>.`);return;}
  case 'regen':{stop();S.menu=null;S.busy=true;render();
    setTimeout(()=>{S.busy=false;const m=meeting(p);
      m.genAt='just now';
      render();toast('<b>Notes regenerated</b> from your notes and the transcript.')},2000);return;}
  case 'confirmDelete':stop();S.settings=false;S.menu='confirm:'+p;render();return;
  case 'delmeeting':{stop();db.meetings=db.meetings.filter(m=>m.id!==p);
    db.tasks=db.tasks.filter(t=>t.mid!==p);S.menu=null;
    S.route=S.route==='meeting'?'mlist':S.route;S.view='all';render();
    toast('Meeting moved to <b>Recently deleted</b>. 30 days to restore.');return;}
  case 'ackWatch':{stop();const m=meeting(p);if(m)m.woAck=true;render();
    toast(`${ic('radar',15)}<span>Hidden. The Watchouts tab still has ${
      mWatchOpen(p).length} open.</span>`,2800,'info');return;}
  case 'ackNotes':stop();meeting(p).ackd=true;render();return;
  case 'menu':{stop();S.settings=false;const r=el.getBoundingClientRect();const fr=$('#frame').getBoundingClientRect();
    S.menuXY={x:(r.left-fr.left)/SCALE-140,y:(r.bottom-fr.top)/SCALE+6};
    S.menu=p;render();return;}
  case 'closemenu':stop();S.menu=null;render();return;
  case 'notifs':stop();S.settings=false;S.menu='notifs:';render();return;
  case 'shortcuts':stop();S.settings=false;S.menu='shortcuts:';render();return;
  case 'share':stop();S.settings=false;S.share=p;S.shareOpts={who:'link',notes:true,fups:true,tx:false,exp:'30 days',link:''};
    S.menu=null;render();return;
  case 'closeShare':stop();S.share=false;render();return;
  case 'sharewho':stop();if(p==='invite'){demo('require a Team plan for private sharing');return}
    S.shareOpts.who=p;render();return;
  case 'shareinc':stop();S.shareOpts[p]=!S.shareOpts[p];render();
    if(p==='tx'&&S.shareOpts.tx)toast('Full transcript will be included — everything said, word for word.');return;
  case 'shareexp':stop();S.shareOpts.exp=p;render();return;
  case 'createlink':stop();S.shareOpts.link='ait.sc/m/'+Math.random().toString(36).slice(2,9);render();
    toast('<b>Link created.</b> Revoke it any time from here.');return;
  case 'copylink':stop();toast('Link copied to your clipboard.');return;
  case 'revoke':stop();S.shareOpts.link='';render();toast('Link revoked. It no longer opens.');return;
  case 'settings':stop();S.settings=true;S.spane=p||'appearance';S.menu=null;render();return;
  case 'closeSettings':stop();S.settings=false;render();return;
  case 'spane':stop();S.spane=p;render();return;
  case 'theme':stop();db.settings.theme=p;db.settings.sysTheme=false;render();
    toast(`${theme(db.settings.th).name} — ${p==='dark'?'dark':'light'} mode.`);return;
  case 'setth':{stop();if(db.settings.th===p){render();return}
    db.settings.th=p;render();
    toast(`${ic('check',15)}<span><b>${esc(theme(p).name)}</b> — ${esc(theme(p).ds)}</span>`,3000,'ok');return;}
  case 'tog':{stop();const g=db.settings;g[p]=!g[p];
    if(p==='sysTheme'&&g.sysTheme){g.theme=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}
    if(p==='detect'){db.setupDone=g.detect?(g.calendar?3:2):(g.calendar?2:1);
      if(!g.detect)g.hearOthers=false;}
    if(p==='convo'&&g.convo)toast('Conversation mode is on. Hold '+g.convoHotkey+' to talk.');
    render();return;}
  case 'togdis':stop();toast('Turn on <b>Detect meetings</b> first — there is nothing to capture without it.');return;
  case 'toggleDetect':stop();db.settings.detect=true;db.settings.hearOthers=true;
    db.setupDone=db.settings.calendar?3:2;render();toast('<b>Call detection is on.</b> Your next call will be offered notes.');return;
  case 'connectCal':stop();db.settings.calendar=true;
    db.setupDone=db.settings.detect?3:2;render();toast('<b>Calendar connected.</b> You will get a nudge before each call.');return;
  case 'dismissSetup':stop();db.setupDone=3;render();toast('Setup card hidden. Reopen it from Settings.');return;
  case 'dismissOk':stop();db.dismissedOk=true;render();return;
  case 'engine':stop();db.settings.engine=p;S.menu=null;render();
    toast(p==='cloud'?'Cloud engine on — audio now leaves this Mac for transcription.':'On-device engine on — audio stays here.');return;
  case 'cyclekey':{stop();const g=db.settings;g.hotkey=KEYS[(KEYS.indexOf(g.hotkey)+1)%KEYS.length];render();
    toast(g.hotkey==='Fn'?'Fn is claimed by macOS for the emoji picker.':`Hotkey set to ${g.hotkey} — nothing else claims it.`);return;}
  case 'cyclelang':{stop();const g=db.settings;g.lang=LANGS[(LANGS.indexOf(g.lang)+1)%LANGS.length];render();return;}
  case 'cycletime':{stop();const g=db.settings;g[p]=TIMES[(TIMES.indexOf(g[p])+1)%TIMES.length];render();return;}
  case 'pastekey':stop();db.settings.anthropicKey='sk-ant-api03-demo-key-not-real';render();
    toast('Key pasted. Conversation mode can now be turned on.');return;
  case 'connect':stop();db.settings[p]=true;render();
    toast(`<b>${p==='gmail'?'Gmail':p==='gcal'?'Google Calendar':'Slack'} connected.</b> The assistant can now use it — and will still ask first.`);return;
  case 'addname':{stop();const n=prompt('Another name people call you');
    if(n&&n.trim()){db.settings.names.push(n.trim());render()}return;}
  case 'govocab':stop();S.settings=false;S.route='vocabulary';S.view='all';render();return;
  case 'resetDemo':stop();S.settings=false;resetDemo(true);return;
  case 'reloadDemo':stop();S.settings=false;resetDemo(false);return;
  /* ── demo page ─────────────────────────────────────────────────────── */
  case 'dtoast':{stop();
    if(p==='long'){toast('<b>Cloud transcription is off.</b> Dictation is running on this Mac, '+
      'so accents and noisy rooms will be a little rougher. Change it in Settings &rsaquo; Engine.',4200,'info');return}
    if(p==='stack'){toast('Task added.');
      setTimeout(()=>toast(`${ic('check',15)}<span><b>Moved</b> to Client Calls / Acme.</span>`,2600,'ok'),320);
      setTimeout(()=>toast(`${ic('alert',15)}<span><b>Fn is claimed by macOS.</b> Pick another key.</span>`,2600,'warn'),640);
      return}
    const L={'':'Link copied to your clipboard.',
      ok:`${ic('check',15)}<span><b>Notes regenerated</b> from your notes and the transcript.</span>`,
      warn:`${ic('alert',15)}<span><b>8 of 10 meetings used</b> this month on the Free plan.</span>`,
      dg:`${ic('alertc',15)}<span><b>Could not reach the clipboard.</b> Nothing was copied.</span>`,
      info:`${ic('info',15)}<span>Transcripts stay on this Mac until you delete them.</span>`};
    toast(L[p],2800,p);return;}
  case 'dosn':{stop();
    if(p==='clear'){osnClear();return}
    if(p==='all'){Object.keys(OSN).forEach((k,i)=>setTimeout(()=>osNotif(k),i*260));return}
    osNotif(p);return;}
  case 'tfilter':stop();S.taskFilter=p;render();return;
  case 'showdone':stop();S.showDone=!S.showDone;render();return;
  case 'secmore':stop();S.expand[p]=!S.expand[p];render();return;
  case 'folderview':stop();S.folderView=p;render();return;
  case 'toggletask':{stop();const t=task(p);t.done=!t.done;render();
    toast(t.done?`<b>Done.</b> ${esc(t.title)}`:'Marked not done.');return;}
  case 'opentask':stop();S.tid=p;S.panel=true;S.menu=null;S.route='tasks';render();return;
  case 'closepanel':stop();S.panel=false;render();return;
  case 'setpri':{stop();const [id,k]=p.split('|');task(id).pri=k;S.menu=null;render();
    toast('Priority updated.');return;}
  case 'cyclepri':{stop();const t=task(p);const o=['','md','hi'];
    t.pri=o[(o.indexOf(t.pri)+1)%3];render();return;}
  case 'deltask':stop();db.tasks=db.tasks.filter(t=>t.id!==p);S.menu=null;S.panel=false;render();
    toast('Task deleted.');return;
  /* ── watchouts ─────────────────────────────────────────────────────────
     Every entry point — a row, the pill's peek, the pill's list, the project
     band — lands on the same panel, so there is one place a watchout is
     explained and one place it is settled. */
  case 'wdetail':{stop();
    const w=watchout(p);if(!w)return;
    S.wid=p;S.wpanel=true;S.mpanel=false;S.menu=null;
    /* opening one acknowledges the pill: the peek retracts and the halo clears */
    S.wpeek=null;S.wopen=false;S.walert=false;
    if(!S.wseen.includes(p))S.wseen.push(p);
    /* if it was opened from the pill, take the user to the meeting it is in */
    if(S.route!=='folder'||!S.fid){S.route='meeting';S.mid=w.mid;S.tab='watch';}
    render();return;}
  case 'wclose':stop();S.wpanel=false;render();return;
  case 'wfilter':stop();S.wfilter=p;render();return;
  case 'wshowdone':stop();S.wdone=!S.wdone;render();return;
  case 'wall':stop();if(!S.rec)return;
    S.wopen=false;S.wpeek=null;S.walert=false;
    S.route='meeting';S.mid=S.rec.mid;S.tab='watch';render();return;
  case 'wresolve':{stop();const w=watchout(p);if(!w)return;
    w.status='resolved';S.wpeek=null;S.walert=false;render();
    toast(`${ic('check',15)}<span><b>Resolved.</b> ${esc(w.title)}</span>`,2800,'ok');return;}
  case 'wdismiss':{stop();const w=watchout(p);if(!w)return;
    w.status='dismissed';S.wpeek=null;S.walert=false;
    if(S.wid===p)S.wpanel=false;
    render();
    toast(`${ic('eyeoff',15)}<span><b>Dismissed.</b> The assistant will stop raising this one.</span>`,3000,'info');
    return;}
  case 'wreopen':{stop();const w=watchout(p);if(!w)return;
    w.status='open';w.raised=false;render();toast('Reopened.');return;}
  /* the peek only retracts — the count stays on the badge, because hiding a
     watchout and settling it are different things */
  case 'wsnooze':stop();S.wpeek=null;S.walert=false;renderBubble();return;
  case 'wstat':{stop();const [id,k]=p.split('|');const w=watchout(id);if(!w)return;
    w.status=k;if(k==='open')w.raised=false;S.menu=null;render();return;}
  case 'wtask':{stop();const w=watchout(p);if(!w)return;
    const m=meeting(w.mid);
    const titles={conflict:'Resolve: '+w.title,discrepancy:'Check: '+w.title,
                  clarification:'Follow up: '+w.title};
    db.tasks.unshift({id:'n'+Date.now(),title:titles[w.type],mid:w.mid,due:'Today',late:false,
      pri:w.type==='conflict'?'hi':'md',done:false,grp:'Today',
      quote:w.now.tx,who:w.now.who,at:w.now.at,from:w.id});
    w.status='resolved';render();
    toast(`${ic('list',15)}<span><b>Task added.</b> Due today, from ${esc(m?m.title:'this meeting')}.</span>`,3200,'ok');
    return;}
  case 'bubdemo':{stop();
    /* drives the real control rather than a mock, so what the demo shows is
       what a recording shows */
    clearTimeout(SAYT);
    db.settings.bubble=true;S.settings=false;S.wpeek=null;S.wopen=false;S.walert=false;S.wsay=null;
    if(p==='idle'){S.rec=null;S.bub.rec=false;clearTimers();}
    else if(p==='dict'){S.rec=null;S.bub.rec=true;S.bub.secs=7;}
    else{
      S.bub.rec=false;
      if(!S.rec||S.rec.mid!=='m1')S.rec={mid:'m1',secs:2067,paused:false,lines:[],next:0,wnext:99};
      S.rec.paused=p==='paused';
      if(p==='peek'){S.wpeek=(mWatchOpen('m1')[0]||{}).id||null;S.walert=true;}
      if(p==='list')S.wopen=true;
      if(p==='say')S.wsay=(mWatchOpen('m1')[0]||{}).id||null;
    }
    render();
    toast(`${ic('info',15)}<span>The bubble is now in its <b>${
      {idle:'idle',dict:'dictating',rec:'recording',paused:'paused',peek:'conflict peek',
       list:'watchout list',say:'speaking'}[p]}</b> state. Nothing is really being recorded.</span>`,3200,'info');
    return;}
  case 'wopeek':stop();db.settings.woPeek=p;render();
    toast(p==='none'?'Nothing will interrupt you. Watchouts wait on the badge.'
      :p==='all'?'Every watchout will peek out of the pill.'
      :'Only conflicts will interrupt you.');return;
  case 'wsay':stop();waySay(p);return;
  case 'wcancel':stop();wayCancel();return;
  case 'wcopy':{stop();const w=watchout(p);if(!w)return;copyText(w.say,'Wording');return;}
  case 'bubwatch':stop();
    /* the badge toggles the list; opening it acknowledges any alert */
    S.wopen=!S.wopen;S.wpeek=null;if(S.wopen)S.walert=false;
    renderBubble();return;
  case 'holdstart':stop();holdStart();return;
  /* ── floating bubble ───────────────────────────────────────────────── */
  case 'bubtalk':stop();
    /* a drag that ended on the core must not also read as a click */
    if(Date.now()-BUBSUP<220)return;
    S.bub.rec?bubStop():bubStart();return;
  case 'bubact':{stop();
    if(p==='record'){if(S.bub.rec)bubStop();startRecording();return}
    if(p==='ask'){if(S.bub.rec)bubStop();S.route='assistant';S.cid='new';S.menu=null;render();
      setTimeout(()=>{const i=document.querySelector('#askbox');if(i)i.focus()},80);return}
    if(p==='more'){const r=el.getBoundingClientRect();const fr=$('#frame').getBoundingClientRect();
      S.menuXY={x:(r.left-fr.left)/SCALE-206,y:(r.top-fr.top)/SCALE-8};
      S.menu='bubmore:';render();return}
    return;}
  case 'bubreset':{stop();const h=bubHome();S.bub.x=h.x;S.bub.y=h.y;S.menu=null;render();
    toast('Bubble back at the bottom right.');return;}
  case 'bubhide':stop();if(S.bub.rec)bubStop();db.settings.bubble=false;S.menu=null;render();
    toast(`${ic('info',15)}<span><b>Bubble hidden.</b> Settings &rsaquo; Hotkey brings it back.</span>`,3400,'info');return;
  case 'copytx':stop();toast('Transcript copied to your clipboard.');return;
  case 'deltx':stop();db.transcripts=db.transcripts.filter(t=>t.id!==p);render();toast('Transcript deleted.');return;
  case 'delterm':stop();db.vocab=db.vocab.filter(v=>v.t!==p);render();toast(`“${esc(p)}” removed from your vocabulary.`);return;
  case 'focusterm':stop();{const i=document.querySelector('[data-a="addterm"]');if(i)i.focus();}return;
  case 'convo':stop();S.cid=p;pkDismiss();render();return;
  case 'newchat':stop();S.cid='new';render();return;
  case 'ask':{stop();if(el.classList.contains('chip')){askAssistant(p);return}
    const i=document.querySelector('#askbox');if(i)i.focus();return;}
  case 'asksend':{stop();const i=document.querySelector('#askbox');
    if(i&&i.value.trim()){const q=i.value;i.value='';askAssistant(q)}return;}
  case 'clearq':stop();S.q='';render();return;
  case 'win':{stop();
    if(p==='close')demo('close the window');
    else if(p==='min')demo('minimize AIT-Scribe to the Dock');
    else{S.zoom=!S.zoom;fit();render();
      toast(S.zoom?'Filling the screen.':'Back to a window.');}
    return;}
  /* ── meeting assistant panel ────────────────────────────────────────── */
  case 'mchat':stop();S.mpanel=!S.mpanel;S.menu=null;render();
    if(S.mpanel){const i=document.querySelector('#mbox');if(i)i.focus();}
    return;
  case 'mask':{stop();
    /* a suggestion chip carries its question in data-p; the input does not */
    if(p){askChat(p);return}
    const i=document.querySelector('#mbox');
    if(i&&i.value.trim()){const q=i.value;i.value='';askChat(q)}
    else if(i)i.focus();
    return;}
  case 'msend':{stop();const i=document.querySelector('#mbox');
    if(i&&i.value.trim()){const q=i.value;i.value='';askChat(q)}return;}
  case 'mclear':{stop();const h=chatHost();if(h)h.chat=[];render();
    toast('Thread cleared.');return;}
  /* ── attendees ──────────────────────────────────────────────────────── */
  case 'delperson':{stop();const [mid,ix]=p.split('|');const m=meeting(mid);
    const who=m.people[+ix];
    if(!who||who.n==='you')return;
    m.people.splice(+ix,1);render();
    toast(`<b>${esc(who.n)} removed.</b> They will not be sent the notes.`,2800,'warn');return;}
  case 'addperson':stop();S.settings=false;S.menu=null;S.addPerson=p;render();
    setTimeout(()=>{const i=document.querySelector('#pname');if(i)i.focus()},60);return;
  case 'closeperson':stop();S.addPerson=false;render();return;
  case 'saveperson':{stop();const n=(document.querySelector('#pname')||{}).value||'';
    const em=(document.querySelector('#pmail')||{}).value||'';
    if(!n.trim()){toast('A name is needed — the email is optional.');return}
    const m=meeting(p);const init=n.trim()[0].toUpperCase();
    const pal=['#C24600','#1570EF','#0A7548','#7C3AED','#8A5300','#0E7490','#BE185D','#4D7C0F'];
    m.people.push({n:n.trim(),i:init,c:pal[m.people.length%pal.length],e:em.trim()});
    S.addPerson=false;render();
    toast(`<b>${esc(n.trim())} added.</b> ${em.trim()?'They can be sent the notes.':'No email — they will not receive the notes.'}`);
    return;}
  case 'copymd':{stop();S.menu=null;const m=meeting(p);
    copyText(notesMd(m),'Markdown notes are on your clipboard.');render();return;}
  case 'dlmd':{stop();S.menu=null;const m=meeting(p);
    download(slug(m.title)+'.md',notesMd(m));render();return;}
  case 'spk':stop();S.speakers=p;render();return;
  }
});
document.addEventListener('input',e=>{
  const el=e.target.closest('[data-a]');if(!el)return;const a=el.dataset.a;
  if(a==='q'){S.q=el.value;const pos=el.selectionStart;render();
    const n=document.querySelector('[data-a="q"]');if(n){n.focus();n.setSelectionRange(pos,pos)}}
  if(a==='tq'){S.tq=el.value;const pos=el.selectionStart;render();
    const n=document.querySelector('[data-a="tq"]');if(n){n.focus();n.setSelectionRange(pos,pos)}}
  if(a==='vq'){S.vq=el.value;const pos=el.selectionStart;render();
    const n=document.querySelector('[data-a="vq"]');if(n){n.focus();n.setSelectionRange(pos,pos)}}
  if(a==='key'){db.settings.anthropicKey=el.value;}
});
document.addEventListener('keydown',e=>{
  const el=e.target.closest('[data-a]');
  if(e.key==='Enter'&&el){
    const a=el.dataset.a;
    if(a==='addtask'&&el.value.trim()){
      db.tasks.unshift({id:'u'+Date.now(),title:el.value.trim(),mid:null,due:'No date',late:false,
        pri:'',done:false,grp:'Today',quote:'',who:'',at:''});
      el.value='';render();toast('Task added.');return;}
    if(a==='addterm'&&el.value.trim()){
      db.vocab.unshift({t:el.value.trim(),h:'—',n:0,s:'you'});el.value='';render();
      toast('Term added. It applies to dictation and meetings.');return;}
    if(a==='ask'&&el.value.trim()){const q=el.value;el.value='';askAssistant(q);return;}
    if(a==='mask'&&el.value.trim()){const q=el.value;el.value='';askChat(q);return;}
    if(a==='key'){db.settings.anthropicKey=el.value;render();return;}
  }
  if(e.key==='Enter'&&S.addPerson&&(e.target.id==='pname'||e.target.id==='pmail')){
    const b=document.querySelector('[data-a="saveperson"]');if(b)b.click();}
  if(e.key==='Escape'){
    if(S.peek){pkDismiss();render();return}
    if(S.addPerson){S.addPerson=false;render();return}
    if(S.menu){S.menu=null;render();return}
    if(S.share){S.share=false;render();return}
    if(S.settings){S.settings=false;render();return}
    if(S.panel){S.panel=false;render();return}
    if(S.mpanel){S.mpanel=false;render();return}
  }
  if(e.key===','&&(e.metaKey||e.ctrlKey)){e.preventDefault();S.settings=true;S.spane='appearance';render()}
});

/* ── bubble dragging ──────────────────────────────────────────────────────
   Pointer coordinates are viewport-space and the frame may be scaled, so every
   delta is divided by SCALE. A press that moves less than a few pixels is left
   alone and becomes an ordinary click; anything more sets BUBSUP so the click
   that follows mouseup is ignored. */
let BDRAG=null,BUBSUP=0;
document.addEventListener('mousedown',e=>{
  const el=$('#bubble');
  if(!el||!db.settings.bubble)return;
  if(!e.target.closest('#bubble')){
    if(S.wopen||S.wpeek){S.wopen=false;S.wpeek=null;S.walert=false;renderBubble()}
    return;}
  if(e.target.closest('[data-a="bubact"]'))return;   /* tray buttons are not handles */
  /* the pill's controls and its popover are not drag handles either — only the
     bare pill and the round core are */
  if(e.target.closest('.nodrag')||e.target.closest('.wpop'))return;
  const r=el.getBoundingClientRect();
  BDRAG={ox:(e.clientX-r.left)/SCALE,oy:(e.clientY-r.top)/SCALE,x0:e.clientX,y0:e.clientY,live:false};
});
document.addEventListener('mousemove',e=>{
  if(!BDRAG)return;
  if(!BDRAG.live&&Math.abs(e.clientX-BDRAG.x0)+Math.abs(e.clientY-BDRAG.y0)<4)return;
  BDRAG.live=true;
  e.preventDefault();
  const fr=$('#frame').getBoundingClientRect();
  const bw=($('#bubble')||{offsetWidth:60}).offsetWidth||60;
  S.bub.x=Math.max(8,Math.min((e.clientX-fr.left)/SCALE-BDRAG.ox,FW()-bw-12));
  S.bub.y=Math.max(72,Math.min((e.clientY-fr.top)/SCALE-BDRAG.oy,FH()-76));
  const el=$('#bubble');
  if(el){el.style.left=S.bub.x+'px';el.style.top=S.bub.y+'px';el.classList.add('drag')}
});
document.addEventListener('mouseup',()=>{
  if(BDRAG&&BDRAG.live){BUBSUP=Date.now();const el=$('#bubble');if(el)el.classList.remove('drag')}
  BDRAG=null;
});

