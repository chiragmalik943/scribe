// Top-level render() dispatcher that calls the page-specific render functions. 

/* ══════════════════════════════════ render ══════════════════════════════════ */
/* ── room for the panel ───────────────────────────────────────────────────
   A right-hand panel — a watchout, the meeting assistant, a task — is a second
   reading column, and three columns plus a panel leaves the middle one too
   narrow to be worth reading. So opening one folds both left sidebars to their
   icon rails, and closing it gives back exactly what the user had before,
   unless fit() has since decided the window is too narrow for them anyway.

   It runs from render() rather than from each of the six actions that can open
   a panel, so nothing can open one and forget. */
function syncAside(){
  const on=(['folder','meeting'].includes(S.route)&&((S.wpanel&&S.wid)||S.mpanel))
        || (S.route==='tasks'&&S.panel);
  if(on&&!S.asideWas){
    S.asideWas={rail:S.railmin,list:S.listmin};
    S.railmin=true;S.listmin=true;S.peek=null;
  }else if(!on&&S.asideWas){
    S.railmin=AUTO.rail?true:S.asideWas.rail;
    S.listmin=AUTO.list?true:S.asideWas.list;
    S.asideWas=null;
  }
}
/* ── sidebar motion ───────────────────────────────────────────────────────
   See the "panel motion" block in the stylesheet for why this exists. Measured
   before the shell is replaced, replayed after. A peeked sidebar is positioned
   absolutely and is not in flow, so its width means something different — the
   peek has its own animation and this one stays out of its way. */
const REDUCED=()=>!!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches);
function measureBars(){
  const g=s=>{const e=$(s);return e?Math.round(e.getBoundingClientRect().width):null};
  return {rail:g('.rail'),list:g('.listcol'),aside:!!$('.panel'),peek:S.peek};
}
function animateBars(was){
  const panel=$('.panel');
  if(panel&&!was.aside&&!REDUCED())panel.classList.add('asin');
  if(was.peek||S.peek||REDUCED())return;
  [['rail','.rail'],['list','.listcol']].forEach(([k,sel])=>{
    const el=$(sel);if(!el)return;
    const to=Math.round(el.getBoundingClientRect().width);
    /* a column that was not there a moment ago grows out of the edge */
    const from=was[k]==null?0:was[k];
    if(from===to)return;
    el.style.transition='none';
    el.style.width=from+'px';el.style.flexBasis=from+'px';
    void el.offsetWidth;                    /* commit the start, then let go */
    el.style.transition='';el.style.width='';el.style.flexBasis='';
    el.classList.add('sbin');
    setTimeout(()=>el.classList.remove('sbin'),240);
  });
}
/* Every render() replaces #app's innerHTML wholesale, which drops scroll
   position by default — fine when the click just navigated somewhere new (a
   fresh page reasonably opens at the top), but wrong for an in-place update
   to the page already on screen: ticking off a task, opening a menu, or
   expanding a "View all" section a few screens down would each otherwise
   throw the reader back to the top of what they were reading.
   `renderSig()` is what "the same page" means; when it has not changed since
   the last render, scroll position is carried over to the new elements.
   `.body` is the scroll container on most pages; the meeting-notes and
   watchouts tabs scroll their own inner region instead so the title and tabs
   above them can stay in place, hence the extra selectors. */
const renderSig=()=>[S.route,S.mid,S.fid,S.tab,S.view].join('|');
const SCROLL_HOSTS=['.body','.notesgrid','.wscroll'];
let lastRenderSig='';
function render(){
  syncAside();
  const bars=measureBars();
  const prevScrolls=SCROLL_HOSTS.map(sel=>{const el=$(sel);return el?el.scrollTop:null;});
  const samePage=renderSig()===lastRenderSig;
  document.documentElement.dataset.theme=db.settings.theme;
  document.documentElement.dataset.th=db.settings.th||'indigo';
  /* one invariant rather than a clear-the-peek call at every place a modal can
     open: nothing floats over the page while something else is on top of it */
  if(S.settings||S.share||S.addPerson||S.menu)S.peek=null;
  let lc='',main='',aside='';
  /* The home screen is the one page in the meetings family with no list
     column — see viewHome(). Everything below it gets one. */
  if(S.route==='meetings'){lc='';
    main=mhead('Meetings',meetingsState(),`<button class="btn ${db.meetings.length?'p':'s'} sm" data-a="record">${
      ic('rec',15)}Record meeting</button>`)+viewHome();}
  else if(S.route==='mlist'){lc=listMeetings();
    main=mhead('',meetingsState(),`<button class="btn ${db.meetings.length?'p':'s'} sm" data-a="record">${
      ic('rec',15)}Record meeting</button>`,
      `<span class="bk" data-a="go" data-p="meetings">${ic('back',15)}Meetings</span> ${ic('chev',13)}
       <b>${S.view==='recent'?'Recent':'All meetings'}</b>`)+viewMeetings();}
  else if(S.route==='folder'){
    const unf=S.fid==='',f=folder(S.fid);
    /* The tree is folder navigation — useful while browsing the top-level
       categories, redundant once you are inside one: the breadcrumb above
       already says where you are, and the sub-folder grid or the meeting
       list is what you came to read. So it shows only at the top level. */
    lc=(!unf&&f&&!f.parent)?listMeetings():'';
    if(S.wpanel&&S.wid)aside=watchPanel();
    else if(S.mpanel)aside=chatPanel();
    const nm=unf?'Unfiled':(f?f.name:'Folder');
    main=mhead('','','',
      `<span class="bk" data-a="view" data-p="all">${ic('back',15)}All meetings</span> ${ic('chev',13)}
       ${!unf&&f&&f.parent?`<span class="bk" data-a="view" data-p="f:${f.parent}">${
         esc(folderName(f.parent))}</span> ${ic('chev',13)}`:''}
       <b>${esc(nm)}</b>`)+viewFolder();}
  else if(S.route==='meeting'){const m=meeting(S.mid);
    const mf=m?m.folder:'',mfo=folder(mf);
    main=mhead('','',
      `<button class="btn s sm" data-a="share" data-p="${S.mid}">${ic('share',15)}Share</button>
       <span class="tbtn" data-a="menu" data-p="meeting:${S.mid}" title="Meeting options">${ic('dots',18)}</span>`,
      `<span class="bk" data-a="view" data-p="all">${ic('back',15)}All meetings</span> ${ic('chev',13)}
       ${mfo&&mfo.parent?`<span class="bk" data-a="view" data-p="f:${mfo.parent}">${
         esc(folderName(mfo.parent))}</span> ${ic('chev',13)}`:''}
       <span class="bk" data-a="view" data-p="${mf===''?'unfiled':'f:'+mf}">${
         esc(mf===''?'Unfiled':folderName(mf))}</span> ${ic('chev',13)}
       <b>${esc(m?m.title:'')}</b>`)+viewMeeting();
    if(S.wpanel&&S.wid)aside=watchPanel();
    else if(S.mpanel)aside=chatPanel();}
  else if(S.route==='speech'){lc=listSpeechNav();
    main=mhead('Speech to Text',db.transcripts.filter(t=>t.when==='today').length+' today')+viewSpeech();}
  else if(S.route==='vocabulary'){lc=listSpeechNav();
    main=mhead('Vocabulary',db.vocab.length+' terms',
      `<button class="btn p sm" data-a="focusterm">${ic('plus',15)}Add term</button>`)+viewVocab();}
  else if(S.route==='insights'){lc='';
    main=mhead('Insights',RANGES[S.range].label)+viewInsights();}
  else if(S.route==='tasks'){lc=listTasks();
    main=mhead('Tasks',openTasks().length+' open · '+overdue().length+' overdue')+viewTasks();
    if(S.panel)aside=taskPanel();}
  else if(S.route==='assistant'){lc=listConvos();
    const c=db.convos.find(x=>x.id===S.cid);
    main=mhead(c?'':'AI Assistant','',c?`<button class="btn s sm" data-a="demo" data-p="share this conversation">${
      ic('share',15)}Share</button>`:'',c?`<span class="bk" data-a="newchat">AI Assistant</span> ${ic('chev',13)}
      <b>${esc(c.title)}</b>`:null)+viewAssistant();}
  const pkR=S.peek==='rail',pkL=S.peek==='list';
  const cls=[(S.railmin&&!pkR)?'railmin':'',(S.listmin&&!pkL)?'listmin':'',
    pkR?'pkrail':'',pkL?'pklist':'',PKNEW?'pkin':'',
    S.mpanel?'mchat':'',aside?'hasaside':''].filter(Boolean).join(' ');
  if(lc)lc=withFoot(lc);
  /* the peeked sidebar leaves the flex flow, so a placeholder of exactly the
     collapsed width keeps everything to its right where it was */
  const gap=w=>`<div class="pkgap" style="flex-basis:${w}px"></div>`;
  $('#app').innerHTML=`<div class="shell">${topbar()}
    <div class="app ${cls}" style="--railw:${S.railmin?72:260}px">
      ${pkR?gap(72):''}${rail()}${pkL?gap(56):''}${lc}
      <div class="main">${main}</div>${aside}</div>
    ${S.settings?settingsModal():''}${S.share?shareModal():''}${S.addPerson?addPersonModal():''}${menuEl()}</div>`;
  if(samePage)SCROLL_HOSTS.forEach((sel,i)=>{
    if(prevScrolls[i]==null)return;const el=$(sel);if(el)el.scrollTop=prevScrolls[i];});
  lastRenderSig=renderSig();
  animateBars(bars);
  tips($('#app'));
  tipHide();
  renderBubble();
}
/* ── floating bubble ──────────────────────────────────────────────────────
   An always-on control that in the real app floats over other windows. It lives
   in #bubble, a sibling of #app, so a re-render never interrupts a drag or drops
   the CSS :hover that reveals the tray.

   It has three shapes, and which one it wears is derived rather than stored —
   S.rec means a meeting is being recorded, S.bub.rec means the user is
   dictating, neither means idle. Nothing can get the shape and the state out
   of step, which matters because the pill is the surface that stops a recording.

   idle       round core, hover tray: dictate, record, ask, more
   dictating  a capsule — meter, timer, stop. Click the core to paste.
   recording  a pill — timer, meter, pause, stop, and the watchouts badge

   The badge is the whole point of the redesign. While a call runs the assistant
   reads it against everything said before, and anything it notices lands
   behind that badge rather than on screen. A conflict — and only a conflict —
   also peeks for a few seconds, because a contradiction that is caught after
   the call has already cost something. Everything else waits to be asked for. */
const BUBACTS=[['record','rec','Record a meeting'],['ask','spark','Ask the assistant'],
               ['more','dots','More']];
/* The bottom-right corner, 24px clear of both edges — the same inset on each
   side, which is what makes it read as parked in the corner rather than
   floating somewhere down the right-hand side. It is draggable, so this is
   only where it starts and where "Reset position" puts it back. */
function bubHome(){return {x:FW()-84,y:FH()-84};}
const bubMode=()=>S.rec?'meet':S.bub.rec?'dict':'idle';
/* Which edge the control is anchored to. Everything that changes its width —
   growing into a pill on hover, becoming the recording pill, collapsing back —
   keeps this edge still, so the buttons stay under the cursor and the round
   bubble comes back where the pill's end was rather than where its far side
   happened to be. */
const bubSide=()=>(S.bub.x+BW/2)>FW()/2?'right':'left';
const fmtSecs=n=>{const h=Math.floor(n/3600),m=Math.floor(n/60)%60,x=n%60;
  return (h?h+':'+String(m).padStart(2,'0'):String(m).padStart(2,'0'))+':'+String(x).padStart(2,'0');};
/* a fake input meter — deterministic in `secs` so it animates with the timer
   rather than on every render */
const pmBar=(i,secs)=>Math.max(3,Math.round(4+13*Math.abs(Math.sin(i*.85+secs*1.1))*Math.abs(Math.cos(i*.4+secs*.6))));
const pmBars=(n,secs,live)=>Array.from({length:n},(_,i)=>
  `<i style="height:${live?pmBar(i,secs):4}px"></i>`).join('');
const clip=(t,n)=>t.length>n?esc(t.slice(0,n-1))+'…':esc(t);

/* The pill is rebuilt only when its *shape* changes. A second passing is not a
   shape change, and rebuilding for one is what made the pill blink: innerHTML
   threw away the element under the cursor and put back a new one, once a
   second, for as long as the recording ran. So the timer and the meter are
   patched in place and everything else is compared against a signature. */
let BSIG='',BW=60;
function bubTick(){
  const el=$('#bubble');if(!el)return;
  const mode=bubMode();
  const secs=mode==='meet'?S.rec.secs:mode==='dict'?S.bub.secs:0;
  const t=el.querySelector('.ptime');if(t)t.textContent=fmtSecs(secs);
  const m=el.querySelector('.pmeter');
  if(m&&!m.classList.contains('off'))
    for(let i=0;i<m.children.length;i++)m.children[i].style.height=pmBar(i,secs)+'px';
}
function renderBubble(){
  const el=$('#bubble');if(!el)return;
  const b=S.bub;
  if(!db.settings.bubble){el.className='off';el.innerHTML='';BSIG='';return}
  if(b.x===null){const h=bubHome();b.x=h.x;b.y=h.y;}
  const mode=bubMode();
  const open=mode==='meet'?mWatchOpen(S.rec.mid):[];
  const sig=[mode,mode==='meet'&&S.rec.paused,S.wpeek,S.wopen,S.wsay,S.walert,
             open.length,open.map(w=>w.id).join(',')].join('|');
  const side=bubSide();
  b.y=Math.max(72,Math.min(b.y,FH()-80));
  /* the popover is taller than the pill, so it drops below it near the top */
  const head=(S.wpeek||S.wopen||S.wsay)?424:mode==='idle'?150:120;
  /* the class list is what decides the width — idle is a fixed 60px box with an
     absolutely positioned pill hanging off it — so it goes on before anything
     measures, or the shape change is costed against the wrong number and the
     anchored edge slides */
  el.className=[mode,side==='left'?'lft':'',
    mode==='meet'&&S.rec.paused?'paused':'',
    mode==='meet'&&S.walert&&!S.wopen&&!S.wsay?'alert':'',
    b.y<head?'flip':''].filter(Boolean).join(' ');
  if(sig!==BSIG){
    const w0=BW;
    BSIG=sig;
    el.innerHTML=mode==='meet'?pillMeet():mode==='dict'?pillDict():bubIdle(side);
    tips(el);
    BW=el.offsetWidth||60;
    /* hold the anchored edge across the shape change */
    if(side==='right')b.x+=w0-BW;
  }else bubTick();
  b.x=Math.max(8,Math.min(b.x,FW()-BW-12));
  el.style.left=b.x+'px';el.style.top=b.y+'px';
}
function bubIdle(side){
  const opts=`<div class="bopts">${BUBACTS.map(([k,i,l])=>
    `<span class="hopt" data-a="bubact" data-p="${k}" title="${l}">${ic(i,17)}</span>`).join('')}</div>`;
  const core=`<div class="bcore" data-a="bubtalk" title="Click to dictate">${ic('mic',22,2)}</div>`;
  return `<div class="bhome">${side==='right'?opts+core:core+opts}</div>`;
}
function pillDict(){
  const b=S.bub;
  return `<div class="pill">
    <span class="pmark">${ic('mic',17,2)}</span>
    <span class="pmeter live">${pmBars(11,b.secs,true)}</span>
    <span class="plabel">Listening</span>
    <span class="psub ptime">${fmtSecs(b.secs)}</span>
    <span class="pdiv"></span>
    <span class="pbtn stop nodrag" data-a="bubtalk" title="Stop and paste at your cursor">${ic('stop',14,2.2)}</span>
    </div>`;
}
function pillMeet(){
  const r=S.rec,open=mWatchOpen(r.mid),hot=hasConflict(open);
  if(S.wsay){
    return `${wpop()}<div class="pill saying">
      <span class="pmark">${ic('speak',17)}</span>
      <span class="pstat"><i class="rdot"></i><b class="ptime">${fmtSecs(r.secs)}</b></span>
      <span class="pdiv"></span>
      <span class="plabel">Speaking…</span>
      <span class="pbar"><i></i></span>
      <span class="pbtn nodrag" data-a="wcancel" title="Do not say it">${ic('x',15,2.2)}</span></div>`;}
  return `${(S.wpeek||S.wopen)?wpop():''}
    <div class="pill">
    <span class="pmark">${ic('spark',17)}</span>
    <span class="pstat"><i class="rdot"></i><b class="ptime">${fmtSecs(r.secs)}</b></span>
    ${r.paused?`<span class="psub">Paused</span>`
      :`<span class="pmeter live">${pmBars(9,r.secs,true)}</span>`}
    <span class="pdiv"></span>
    <span class="pbtn nodrag" data-a="pauseRec" title="${r.paused?'Resume recording':'Pause recording'}">${
      ic(r.paused?'play':'pause',15,2.2)}</span>
    <span class="pbtn stop nodrag" data-a="stopRec" title="Stop and generate notes">${ic('stop',14,2.2)}</span>
    ${open.length?`<span class="pbtn nodrag ${S.wopen?'on':''}" data-a="bubwatch"
      title="${open.length} watchout${open.length>1?'s':''} — click to review">${ic('radar',17)}<i class="b ${
        hot?'hot':''}">${open.length}</i></span>`:''}
    </div>`;
}
/* one card, two jobs: the peek that a conflict opens by itself, and the list
   the badge opens. Both hand off to the same detail panel in the app, so the
   pill never becomes a second place where watchouts are half-explained. */
function wpop(){
  const r=S.rec,open=mWatchOpen(r.mid);
  if(S.wsay){const x=watchout(S.wsay);if(!x)return '';
    return `<div class="wpop"><div class="wcard w-${x.type}">
      <div class="ph2"><span class="wchip brand">${ic('speak',12)}Speaking</span>
        <span class="age">out loud, into the call</span></div>
      <div class="wtx" style="font-style:italic;color:var(--ink2)">“${esc(x.say)}”</div>
      <div class="wfoot"><span class="pbar" style="flex:1;align-self:center"><i></i></span>
        <button class="btn s sm nodrag" data-a="wcancel">${ic('x',14)}Cancel</button></div>
      </div></div>`;}
  if(S.wopen){
    return `<div class="wpop"><div class="wcard">
      <div class="ph2">${ic('radar',16)}<b style="font-family:var(--f-head);font-size:13.5px">Watchouts</b>
        <span class="age">${open.length} open</span></div>
      <div style="padding:9px 15px 12px;display:flex;gap:12px;flex-wrap:wrap">${
        wCounts(open).map(([t,n])=>`<span class="wstat w-${t}"><i></i>${n} ${
          n===1?WT[t].label.toLowerCase():WT[t].plural.toLowerCase()}</span>`).join('')||
        '<span style="font-size:12.5px;color:var(--sec)">Nothing outstanding.</span>'}</div>
      <div class="wlist">${open.map(x=>`<div class="wl w-${x.type}" data-a="wdetail" data-p="${x.id}">
        <span class="wi">${ic(WT[x.type].icon,12)}</span>
        <span style="flex:1;min-width:0"><span class="l1">${WT[x.type].label}</span>
          <span class="l2">${esc(x.title)}</span></span>
        <span class="age">${esc(x.age)}</span></div>`).join('')}</div>
      <div class="more" data-a="wall">${ic('file',14)}Review all in the meeting
        <span class="n">${ic('chev',13)}</span></div>
      </div></div>`;}
  const x=watchout(S.wpeek);if(!x)return '';
  const rest=open.filter(o=>o.id!==x.id).length;
  return `<div class="wpop"><div class="wcard w-${x.type}">
    <div class="ph2"><span class="wchip">${ic(WT[x.type].icon,12)}${WT[x.type].label}</span>
      <span class="age">${esc(x.age)}</span></div>
    <div class="wtx">${esc(x.title)}</div>
    <div class="wsy"><b>Said now:</b> “${clip(x.now.tx,74)}”<br>
      <b>${WT[x.type].verb}:</b> “${clip(x.ref.tx,74)}” — ${esc(x.ref.who)}${
        x.ref.mt?', '+esc(x.ref.mt):''}${x.ref.date?' · '+esc(x.ref.date):''}</div>
    <div class="wfoot">
      ${db.settings.woSpeak?`<button class="btn p sm nodrag" data-a="wsay" data-p="${x.id}"
        title="The assistant says this out loud">${ic('speak',14)}Bring this up</button>`:''}
      <button class="btn s sm nodrag" data-a="wdetail" data-p="${x.id}">${ic('eye',14)}Details</button>
      <button class="btn s sm nodrag" data-a="wsnooze" data-p="${x.id}" title="Keep it behind the badge"
        style="flex:0 0 auto">${ic('x',14)}</button></div>
    ${rest?`<div class="more" data-a="bubwatch">${ic('radar',14)}${rest} more watchout${rest>1?'s':''}
      <span class="n">${ic('chev',13)}</span></div>`:''}
    </div></div>`;
}
/* Click-to-start, click-to-stop. Distinct from holdStart(), which models the
   press-and-hold hotkey and releases itself after a few seconds. */
function bubStart(){
  if(S.bub.rec)return;
  if(S.rec2)holdStop();
  S.bub.rec=true;S.bub.secs=0;
  clearTimers();
  timers.push(setInterval(()=>{
    if(!S.bub.rec)return;
    S.bub.secs++;renderBubble();
    /* the Speech to Text page mirrors the live session while it runs */
    if(S.route==='speech'){S.rec2={secs:S.bub.secs,bub:true};render()}
  },1000));
  if(S.route==='speech'){S.rec2={secs:0,bub:true};render()}
  renderBubble();
  toast(`${ic('mic',15)}<span><b>Listening.</b> Click stop on the capsule to paste at your cursor.</span>`,2800,'info');
}
function bubStop(){
  if(!S.bub.rec)return;
  const secs=S.bub.secs;
  S.bub.rec=false;S.bub.secs=0;S.rec2=null;clearTimers();
  const samples=['Ask Legal how long the addendum review usually takes',
    'Confirm the seat count with Jennifer before the pricing goes out',
    'Move the migration window to after the training block',
    'Draft the scorecard for the backend candidate this afternoon'];
  const tx=samples[Math.floor(Date.now()/1000)%samples.length];
  db.transcripts.unshift({id:'s'+Date.now(),tx,time:'just now',
    dest:'pasted at your cursor · from the bubble',when:'today'});
  render();
  toast(`${ic('check',15)}<span><b>Pasted.</b> “${esc(tx.slice(0,40))}…” after ${secs}s.</span>`,3000,'ok');
}
/* ── raising a watchout in the room ───────────────────────────────────────
   The assistant speaks the suggested wording into the call and the line lands
   in the live transcript attributed to it, so the recording shows who said
   what. Cancellable for the three seconds before it starts. */
let SAYT=null;
function waySay(id){
  const x=watchout(id);if(!x||!S.rec)return;
  S.wsay=id;S.wpeek=null;S.wopen=false;S.walert=false;
  renderBubble();
  clearTimeout(SAYT);
  SAYT=setTimeout(()=>{
    if(S.wsay!==id)return;
    S.wsay=null;x.raised=true;x.status='resolved';
    if(S.rec&&S.rec.mid===x.mid){
      const t=fmtSecs(S.rec.secs);
      S.rec.lines.push([t,'AIT-Scribe',x.say,'spoken']);
    }
    render();
    toast(`${ic('speak',15)}<span><b>Raised in the call.</b> The wording is in the transcript, and the
      watchout is marked resolved.</span>`,3400,'ok');
  },3100);
}
function wayCancel(){
  clearTimeout(SAYT);S.wsay=null;renderBubble();
  toast('Left unsaid. It stays behind the badge.');
}
/* surfaces the next scripted watchout while a recording runs */
function wFire(x){
  db.watchouts.unshift(x);
  const conflict=x.type==='conflict';
  const peekFor=db.settings.woPeek;
  const shouldPeek=peekFor==='all'||(peekFor==='conflict'&&conflict);
  if(shouldPeek&&!S.wopen&&!S.wsay){S.wpeek=x.id;S.walert=conflict;
    /* the peek retracts on its own — the badge keeps the count */
    setTimeout(()=>{if(S.wpeek===x.id){S.wpeek=null;S.walert=false;renderBubble()}},7200);}
  else if(conflict)S.walert=true;
  const m=meeting(x.mid);if(m)m.woAck=false;
  render();
  /* a peek and a toast for the same watchout is two notifications for one
     event, so only the quiet ones announce themselves */
  if(!shouldPeek)toast(`${ic('radar',15)}<span><b>${WT[x.type].label} noticed.</b>
    ${esc(x.title)} — it is on the pill's badge.</span>`,3600,'info');
}

/* drops the collapse control in just before the list column closes */
function withFoot(lc){const i=lc.lastIndexOf('</div>');return lc.slice(0,i)+lfoot()+lc.slice(i);}
function notesMd(m){
  const L=[];
  L.push('# '+m.title,'');
  L.push(`_${m.day}, ${m.time} · ${m.dur} · ${folderName(m.folder)}_`,'');
  L.push('**Participants:** '+m.people.map(p=>p.n).join(', '),'');
  if(m.notes.summary){L.push('## Summary','',m.notes.summary,'')}
  if(m.notes.decisions.length){L.push('## Decisions','');
    m.notes.decisions.forEach(d=>L.push(`- ${d[0]} _(${d[1]})_`));L.push('')}
  if(m.notes.questions.length){L.push('## Open questions','');
    m.notes.questions.forEach(d=>L.push(`- ${d[0]} _(${d[1]})_`));L.push('')}
  const ts=db.tasks.filter(t=>t.mid===m.id);
  if(ts.length){L.push('## Tasks','');
    ts.forEach(t=>L.push(`- [${t.done?'x':' '}] ${t.title} — ${t.due}`));L.push('')}
  if(m.mynotes){L.push('## My notes','',m.mynotes,'')}
  L.push('---','Generated by AIT-Scribe');
  return L.join('\n');
}
function copyText(t,label){
  const done=()=>toast(`<b>Copied.</b> ${label}`);
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(t).then(done).catch(()=>fallback());
  } else fallback();
  function fallback(){const a=document.createElement('textarea');a.value=t;
    a.style.position='fixed';a.style.opacity='0';document.body.appendChild(a);a.select();
    try{document.execCommand('copy');done()}catch(e){toast('Could not reach the clipboard.')}
    a.remove();}
}
function download(name,text){
  const b=new Blob([text],{type:'text/markdown;charset=utf-8'});
  const u=URL.createObjectURL(b);const a=document.createElement('a');
  a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(u),1500);
  toast(`<b>Downloaded.</b> ${esc(name)}`);
}
const slug=t=>t.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
function meetingsState(){
  const n=db.meetings.length;if(!n)return 'No meetings yet';
  const wk=db.meetings.filter(m=>['Today','Yesterday','Monday'].includes(m.group)).length;
  return `${n} meeting${n>1?'s':''} · ${wk} this week`;
}
