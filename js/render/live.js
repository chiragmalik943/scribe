// The live meeting page: capture controls, what Scribe is noting, and the transcript as it happens.

/* ══════════════════════════════════ live meeting ══════════════════════════════════ */
/* While a call is being recorded this is the page. Two columns under one control
   bar:

     left    Scribe, as a conversation. It says what it is noting as it notes it —
             an agenda item added, a question caught, a task taken on, a decision,
             a new chapter, a watchout — in the first person, each with the line of
             the call it came from.
     right   the transcript, line by line, as it is spoken.

   The bar above them holds the capture controls: the microphone, the other side
   of the call (system audio) and the screen, each switchable on its own, plus
   pause and stop.

   Nothing here re-renders the page on a tick. A second passing patches the timers
   and the level meters; a new line or a new message is appended to its column.
   That is what lets a person scroll back, select text or type in the box below
   while the call carries on. */
const AIK={agenda:{ic:'list',l:'Agenda'},question:{ic:'help',l:'Question'},
  task:{ic:'checkc',l:'Task'},decision:{ic:'check',l:'Decision'},
  chapter:{ic:'flag',l:'Chapter'},note:{ic:'spark',l:'Noted'}};
const SRC={
  mic:{on:'mic',off:'micoff',label:'Microphone',sub:'Your side',hint:'your microphone'},
  sys:{on:'speak',off:'voloff',label:'System audio',sub:'Everyone else',hint:'the other participants'},
  scr:{on:'monitor',off:'monitoroff',label:'Screen',sub:'Slides and docs',hint:'the screen'}};
S.live={stickA:true,stickT:true};

const meterHtml=(n,on,secs,seed)=>`<span class="lmeter ${on?'on':''}">${Array.from({length:n},(_,i)=>
  `<i style="height:${on?pmBar(i+seed,secs):3}px"></i>`).join('')}</span>`;
function srcBtn(r,k){
  const d=SRC[k],on=r[k],cap=!r.paused&&on;
  return `<span class="rsrc ${on?'on':'off'}" data-a="recsrc" data-p="${k}" role="switch"
      aria-checked="${on}" title="${on?'Turn off ':'Turn on '}${d.hint}">
    <span class="si">${ic(on?d.on:d.off,16)}</span>
    <span class="sb"><b>${d.label}</b><span>${on?(r.paused?'Paused':d.sub):'Off'}</span></span>
    ${k==='scr'?'':`<span data-src="${k}">${meterHtml(7,cap,r.secs,k==='mic'?0:3)}</span>`}</span>`;
}
function ctlBar(r){
  return `<div class="ctlbar ${r.paused?'pause':''}">
    <div class="cstat"><i class="rdot"></i>
      <span class="ct"><b>${r.paused?'Paused':'Recording'}</b>
        <span class="rtime">${fmtSecs(r.secs)}</span></span></div>
    <div class="csrc">${srcBtn(r,'mic')}${srcBtn(r,'sys')}${srcBtn(r,'scr')}</div>
    <div class="cact">
      <button class="btn s sm" data-a="pauseRec" title="${r.paused?'Resume recording':'Pause — nothing is captured while paused'}">${
        ic(r.paused?'play':'pause',14)}${r.paused?'Resume':'Pause'}</button>
      <button class="btn d sm" data-a="stopRec" title="Stop and generate notes">${ic('stop',14)}Stop &amp; generate notes</button></div></div>`;
}

/* ── Scribe's side ──────────────────────────────────────────────────────── */
const lineAt=(r,sec)=>r.lines.find(l=>parseClock(l[0])===sec);
function aiMsg(a){
  const r=S.rec;
  if(a.k==='you')return `<div class="am you"><div class="bd"><div class="tx">${a.tx}</div></div></div>`;
  if(a.k==='watch'){
    const w=watchout(a.wid);if(!w)return '';
    const open=w.status==='open';
    return `<div class="am k-watch w-${w.type}">
      <span class="who">${ic('spark',14,1.75)}</span>
      <div class="bd"><div class="hd"><span class="wchip">${ic(WT[w.type].icon,12)}${WT[w.type].label}</span>
        ${open?'':`<span class="kst">${w.status==='resolved'?'Resolved':'Not an issue'}</span>`}
        <span class="at">${fmtClock(a.secs)}</span></div>
        <div class="tx">I caught something that does not sit right: <b>${esc(w.title)}</b></div>
        <div class="wbtns"><button class="btn s sm" data-a="wdetail" data-p="${w.id}">${ic('eye',14)}Details</button>${
          open&&db.settings.woSpeak?`<button class="btn s sm" data-a="wsay" data-p="${w.id}"
            title="The assistant says this out loud">${ic('speak',14)}Bring this up</button>`:''}</div></div></div>`;
  }
  const d=AIK[a.k]||AIK.note;
  const L=a.ref!=null?lineAt(r,a.ref):null;
  return `<div class="am k-${a.k}">
    <span class="who">${ic('spark',14,1.75)}</span>
    <div class="bd"><div class="hd"><span class="kc">${ic(d.ic,12)}${d.l}</span>
      <span class="at">${fmtClock(a.secs)}</span></div>
      <div class="tx">${a.tx}</div>
      ${L?`<div class="rf" data-a="liveline" data-p="${a.ref}" title="Show this in the transcript">
        <span class="q">“${clip(L[2],86)}”</span><span class="by">${esc(L[1])} · ${L[0]}</span></div>`:''}</div></div>`;
}
const AICOUNT=[['agenda','list','agenda'],['question','help','question'],['task','checkc','task'],
               ['decision','check','decision']];
function liveCounts(r){
  const n=k=>r.ai.filter(a=>a.k===k).length;
  const wn=mWatchOpen(r.mid).length;
  return AICOUNT.map(([k,i,l])=>{const c=n(k);
    return `<span class="lc k-${k} ${c?'':'zero'}" title="${c} ${l}${c===1?'':'s'} noted">${ic(i,12)}<b>${c}</b></span>`;}).join('')+
    (wn?`<span class="lc k-watch" title="${wn} open watchout${wn===1?'':'s'}">${ic('radar',12)}<b>${wn}</b></span>`:'');
}
function txLine(l){
  const spoken=l[3]==='spoken',k=spkKey(l[1]);
  const m=meeting(S.rec.mid);
  return `<div class="trs ${spoken?'said':''}" data-s="${parseClock(l[0])}"><span class="tm">${l[0]}</span>
    <span><span class="spk"><i class="sdot ${spoken?'sO':spkCls(m,k)}"></i>${esc(l[1])}${spoken?`<span class="badge" style="margin:0 0 0 8px">${
      ic('speak',11)}raised by the assistant</span>`:''}</span><span class="tx">${esc(l[2])}</span></span></div>`;
}
function viewLive(m){
  const r=S.rec;
  const nothing=!r.mic&&!r.sys;
  return `<div class="body live">${titleBlock(m,'')}
    ${ctlBar(r)}
    <div class="lcols">
      <section class="lcol ai">
        <div class="lhd"><span class="lt">${ic('spark',16)}Scribe<span class="lst"><i></i>noting as you go</span></span>
          <span class="lcnt">${liveCounts(r)}</span></div>
        <div class="lbodywrap"><div class="lfeed" id="lfeed" data-n="${r.ai.length}">${r.ai.map(aiMsg).join('')}</div>
          <span class="jumpbot" data-a="livebottom" data-p="lfeed">${ic('chevd',13)}Latest</span></div>
        <div class="lcomp"><div class="compbox">
          <input id="lbox" placeholder="Jot a note, or ask what has been noted so far…" data-a="lsay">
          <span class="sendb" data-a="lsend" title="Send">${ic('send',15,2)}</span></div></div>
      </section>
      <section class="lcol tx">
        <div class="lhd"><span class="lt">${ic('wave2',16)}Live transcript<span class="lst live"><i></i>live</span></span>
          <span class="lcnt"><span class="lines" id="lnn">${r.lines.length} line${r.lines.length===1?'':'s'}</span></span></div>
        <div class="lbodywrap"><div class="ltx" id="ltx" data-n="${r.lines.length}">
          <div class="llist">${r.lines.map(txLine).join('')}</div>
          <div class="lidle ${r.paused||nothing?'off':''}">${nothing
            ?`${ic('micoff',14)}Nothing is being captured — turn a source back on.`
            :r.paused?`${ic('pause',14)}Paused`
            :`<span class="typing"><i></i><i></i><i></i></span>${r.lines.length?'Listening…':'Listening — lines appear here as people speak.'}`}</div></div>
          <span class="jumpbot" data-a="livebottom" data-p="ltx">${ic('chevd',13)}Live</span></div>
      </section></div></div>`;
}

/* ── patching a running page ────────────────────────────────────────────── */
const nearEnd=el=>el.scrollHeight-el.scrollTop-el.clientHeight<56;
function toEnd(el){if(el)el.scrollTop=el.scrollHeight;}
function liveSync(){
  const r=S.rec;if(!r)return;
  document.querySelectorAll('.rtime').forEach(e=>e.textContent=fmtSecs(r.secs));
  const feed=$('#lfeed'),tx=$('#ltx');if(!feed||!tx)return;
  const fn=+feed.dataset.n||0,tn=+tx.dataset.n||0;
  if(r.ai.length>fn){
    const f0=feed.children.length;
    r.ai.slice(fn).forEach(a=>feed.insertAdjacentHTML('beforeend',aiMsg(a)));
    for(let i=f0;i<feed.children.length;i++)feed.children[i].classList.add('new');
    feed.dataset.n=r.ai.length;tips(feed);
    const c=$('.lcol.ai .lcnt');if(c)c.innerHTML=liveCounts(r);
    if(S.live.stickA)toEnd(feed);else liveJump(feed);
  }
  if(r.lines.length>tn){
    const list=tx.querySelector('.llist');
    const t0=list.children.length;
    r.lines.slice(tn).forEach(l=>list.insertAdjacentHTML('beforeend',txLine(l)));
    for(let i=t0;i<list.children.length;i++)list.children[i].classList.add('new');
    tx.dataset.n=r.lines.length;
    const nn=$('#lnn');if(nn)nn.textContent=r.lines.length+' line'+(r.lines.length===1?'':'s');
    const idle=tx.querySelector('.lidle');if(idle&&!idle.classList.contains('off'))
      idle.lastChild.textContent='Listening…';
    if(S.live.stickT)toEnd(tx);else liveJump(tx);
  }
  /* the level meters move with the clock; a muted source sits flat */
  document.querySelectorAll('.lmeter').forEach(mt=>{
    const k=mt.parentNode.dataset.src,on=r[k]&&!r.paused;
    mt.classList.toggle('on',!!on);
    for(let i=0;i<mt.children.length;i++)
      mt.children[i].style.height=(on?pmBar(i+(k==='mic'?0:3),r.secs):3)+'px';
  });
}
/* the "back to live" chip belongs to the column that has been scrolled away from */
function liveJump(el){
  const w=el&&el.closest('.lbodywrap');if(!w)return;
  w.classList.toggle('away',!nearEnd(el));
}
document.addEventListener('scroll',e=>{
  const el=e.target;if(!el||!el.classList)return;
  if(el.id==='lfeed'){S.live.stickA=nearEnd(el);liveJump(el);}
  else if(el.id==='ltx'){S.live.stickT=nearEnd(el);liveJump(el);}
},true);

/* the composer: a note, or a question about the call so far */
function liveAnswer(q){
  const r=S.rec,n=k=>r.ai.filter(a=>a.k===k);
  const l=q.toLowerCase();
  const list=(a)=>a.map(x=>'&nbsp;&nbsp;·&nbsp; '+x.tx.replace(/^[^:]*:\s*/,'')).join('<br>');
  if(/task|commit|owe|action/.test(l)){
    const t=n('task');return t.length?`${t.length} task${t.length>1?'s':''} so far:<br>${list(t)}`
      :'No tasks yet — I add one when someone commits to something out loud.';}
  if(/agenda|cover|topic/.test(l)){
    const t=n('agenda');return t.length?`On the agenda so far:<br>${list(t)}`:'Nothing on the agenda yet.';}
  if(/question|open|unanswered/.test(l)){
    const t=n('question');return t.length?`Open questions:<br>${list(t)}`:'No open questions so far.';}
  if(/decid|agree|decision/.test(l)){
    const t=n('decision');return t.length?`Decided so far:<br>${list(t)}`:'Nothing has been decided yet.';}
  return `So far I have noted ${n('agenda').length} agenda item${n('agenda').length===1?'':'s'}, ${
    n('question').length} question${n('question').length===1?'':'s'}, ${
    n('task').length} task${n('task').length===1?'':'s'} and ${
    n('decision').length} decision${n('decision').length===1?'':'s'}. Ask once the call is over and I can answer from the full transcript.`;
}
function liveSay(q){
  const r=S.rec;if(!r)return;q=(q||'').trim();if(!q)return;
  const m=meeting(r.mid);
  r.ai.push({k:'you',secs:r.secs,tx:esc(q)});
  if(/\?\s*$/.test(q)||/^(what|who|when|how|which|did|do|is|are)\b/i.test(q)){
    r.ai.push({k:'note',secs:r.secs,tx:liveAnswer(q)});
  }else{
    m.mynotes=(m.mynotes?m.mynotes+'\n':'')+q;
    r.ai.push({k:'note',secs:r.secs,tx:'Added to <b>your notes</b>. I will read it alongside the transcript when I write up the call.'});
  }
  S.live.stickA=true;liveSync();
}
function liveSource(k){
  const r=S.rec;if(!r)return;
  r[k]=!r[k];const d=SRC[k];
  const msg={
    mic:r.mic?'Microphone is back on. I can hear your side again.'
      :'Your microphone is <b>muted</b>. I am not capturing your side, so anything you say now will not reach the transcript or the notes.',
    sys:r.sys?'System audio is on. I can hear the other participants again.'
      :'System audio is <b>off</b>. I cannot hear the other participants — only your microphone is being captured.',
    scr:r.scr?'Screen capture is <b>on</b>. I will read shared slides and documents to make the notes richer. The recording stays on this Mac.'
      :'Screen capture is off.'}[k];
  r.ai.push({k:'note',secs:r.secs,tx:msg});
  if(!r.mic&&!r.sys)r.ai.push({k:'note',secs:r.secs,tx:'Nothing is being captured right now. Turn the microphone or system audio back on to carry on.'});
  S.live.stickA=true;
  render();
  toast(`${ic(r[k]?d.on:d.off,15)}<span><b>${d.label} ${r[k]?'on':'off'}.</b> ${
    r[k]?'Capturing '+d.hint+'.':'Not capturing '+d.hint+'.'}</span>`,2400,r[k]?'':'warn');
}
/* flash the line in the transcript that a message came from */
function liveLine(sec){
  const tx=$('#ltx');if(!tx)return;
  const el=tx.querySelector(`.trs[data-s="${sec}"]`);if(!el)return;
  S.live.stickT=false;
  const top=(el.getBoundingClientRect().top-tx.getBoundingClientRect().top)/SCALE;
  tx.scrollTop=Math.max(0,tx.scrollTop+top-tx.clientHeight*.3);
  liveJump(tx);
  el.classList.remove('flash');void el.offsetWidth;el.classList.add('flash');
}

/* ── keeping the page steady across a full render ───────────────────────── */
let LIVEIN=null;
function liveBefore(){
  const b=$('#lbox');
  LIVEIN=b?{v:b.value,f:document.activeElement===b,s:b.selectionStart}:null;
}
function liveAfter(){
  const feed=$('#lfeed'),tx=$('#ltx');
  if(!feed||!tx){LIVEIN=null;return}
  if(S.live.stickA)toEnd(feed);else liveJump(feed);
  if(S.live.stickT)toEnd(tx);else liveJump(tx);
  const b=$('#lbox');
  if(b&&LIVEIN){b.value=LIVEIN.v;if(LIVEIN.f){b.focus({preventScroll:true});
    try{b.setSelectionRange(LIVEIN.s,LIVEIN.s)}catch(e){}}}
  LIVEIN=null;
}
