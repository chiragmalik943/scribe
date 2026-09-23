// Renders the meeting-assistant side panel. 

/* ══════════════════════════════════ meeting assistant ══════════════════════════════════ */
/* A side panel rather than a tab, so a question can be asked while the notes or
   the transcript stay on screen. The thread lives on the meeting, so switching
   tabs — or leaving and coming back — keeps it. */
const MCHIPS=[['What did I commit to?','list'],['Summarise this call','file'],
              ['What was left unresolved?','alertc'],['Draft a recap email','send']];
const FCHIPS=[['Summarise this project','file'],['What is still open?','alertc'],
              ['Anything I should watch out for?','radar'],['Draft a status update','send']];
/* One panel, two scopes. A meeting answers from its own transcript and notes; a
   project answers across every call filed in it. Which one is on screen is
   already in the route, so the scope is derived rather than stored — there is
   no way for the panel and the page behind it to disagree. */
const chatProj=()=>S.route==='folder';
const chatHost=()=>chatProj()?folder(S.fid):meeting(S.mid);
function chatPanel(){
  const proj=chatProj(),host=chatHost();
  if(!host)return '';
  const name=proj?host.name:host.title;
  const msgs=host.chat||[];
  const n=proj?folderMeetings(host.id).length:0;
  return `<div class="panel chat"><div class="ph">${ic('spark',17)}<b>${
      proj?'Ask about this project':'Ask about this meeting'}</b>
    <span style="margin-left:auto;display:flex;gap:4px">
      ${msgs.length?`<span class="tbtn" data-a="mclear" title="Clear this thread">${
        ic('reset',17)}</span>`:''}
      <span class="tbtn" data-a="mchat" title="Close">${ic('x',17)}</span></span></div>
   <div class="pb2">
    ${msgs.length?msgs.map(x=>`<div class="msg ${x.r}">
        <span class="who">${x.r==='u'?db.user.initial:ic('spark',14,2)}</span>
        <span class="tx">${x.tx}</span></div>`).join('')
      :`<div class="cempty">Ask anything about <b>${esc(name)}</b> — the assistant reads ${
        proj?`the ${n} call${n===1?'':'s'} filed in this project`
            :"this call's transcript and notes"} only, and answers from what was actually said.
        <div class="cchips">${(proj?FCHIPS:MCHIPS).map(([q,i])=>
          `<span data-a="mask" data-p="${esc(q)}">${ic(i,15)}${q}</span>`).join('')}</div></div>`}
    ${S.mtyping?`<div class="msg a"><span class="who">${ic('spark',14,2)}</span>
      <span class="tx typing"><i></i><i></i><i></i></span></div>`:''}
   </div>
   <div class="cfoot"><div class="comp"><div class="compbox">
     <span class="ic" data-a="demo" data-p="dictate your question" title="Dictate your question">${ic('mic',16)}</span>
     <input placeholder="${proj?'Ask about this project…':'Ask about this meeting…'}" data-a="mask" id="mbox">
     <span class="sendb" data-a="msend" title="Send">${ic('send',15,2)}</span></div></div></div></div>`;
}
/* Canned but not random: each answer is assembled from this meeting's own notes,
   tasks and transcript, so it stays true to whatever is on screen. */
function meetingAnswer(m,q){
  const l=q.toLowerCase();
  const ts=db.tasks.filter(t=>t.mid===m.id);
  const cite=` <span class="src" data-a="jump" data-p="${(m.transcript[0]||['00:00'])[0]}">${
    ic('users',13)}${esc(m.title)} · from the transcript</span>`;
  const wo=mWatchOpen(m.id);
  if(/watch ?out|conflict|discrepan|contradic|clash/.test(l))
    return wo.length?`${wo.length} thing${wo.length>1?'s':''} to watch out for on this call:<br>${
      wo.map(w=>`&nbsp;&nbsp;·&nbsp; <b>${WT[w.type].label}</b> — ${esc(w.title)}`).join('<br>')}`+
      `<br>They are on the Watchouts tab, each with what it collides with.`
      :'Nothing on this call contradicted an earlier decision or left a number unexplained.';
  if(/commit|task|action|owe|follow/.test(l))
    return ts.length?`You took ${ts.length} thing${ts.length>1?'s':''} away from this call:<br>${
      ts.map((t,i)=>`&nbsp;&nbsp;${i+1}.&nbsp; ${esc(t.title)} — <b>${esc(t.due)}</b>.`).join('<br>')}`+
      `<br>All of them are already on your task list.`
      :'Nothing was committed on this call — no task came out of it.';
  if(/summar|recap|overview|what happened|about/.test(l)&&!/email|draft/.test(l))
    return esc(m.notes.summary||'This call has not been summarised yet.')+cite;
  if(/draft|email|write|send/.test(l))
    return `Here is a recap you could send:<br><br>Hi ${esc((m.people.find(x=>x.n!=='you')||{n:'there'}).n.split(' ')[0])},<br><br>`+
      `Thanks for the time today. ${esc((m.notes.summary||'').split('.')[0])}.`+
      (m.notes.decisions.length?` To confirm what we agreed: ${
        m.notes.decisions.map(d=>esc(d[0].replace(/\.$/,'').toLowerCase())).join('; ')}.`:'')+
      `<br><br>Best,<br>${esc(db.user.name.split(' ')[0])}`;
  if(/unresolved|open|question|unanswered|unclear/.test(l))
    return m.notes.questions.length?`${m.notes.questions.length} thing${
      m.notes.questions.length>1?'s were':' was'} left open:<br>${
      m.notes.questions.map(x=>`&nbsp;&nbsp;·&nbsp; ${esc(x[0])} <b>(${x[1]})</b>`).join('<br>')}`
      :'Nothing was left hanging — every question raised on this call got an answer.';
  if(/decide|decision|agree/.test(l))
    return m.notes.decisions.length?`${m.notes.decisions.length} decision${
      m.notes.decisions.length>1?'s':''} came out of it:<br>${
      m.notes.decisions.map(d=>`&nbsp;&nbsp;·&nbsp; ${esc(d[0])} <b>(${d[1]})</b>`).join('<br>')}`
      :'No decisions were recorded on this call.';
  if(/who|attend|people|present/.test(l))
    return `${m.people.length} people were on it: ${esc(m.people.map(x=>
      x.n==='you'?db.user.name:x.n).join(', '))}.`;
  if(/when|time|how long|durat/.test(l))
    return `${esc(m.day)} at ${esc(m.time)}, and it ran ${m.dur}.`;
  return `I can only answer from this call. Here is what it covered:<br><br>${
    esc(m.notes.summary||'No notes have been generated for it yet.')}${cite}`;
}
/* The project answers the same questions, read across its calls rather than
   inside one — which is the only reason to ask it here rather than in a meeting. */
function folderAnswer(f,q){
  const l=q.toLowerCase(),id=f.id;
  const ms=folderMeetings(id),ts=folderTasks(id),wo=fWatchOpen(id);
  const dec=folderLines(id,'decisions'),qs=folderLines(id,'questions');
  const from=x=>` <span class="src" data-a="open" data-p="${x.mid}">${ic('users',13)}${esc(x.mt)}</span>`;
  if(/watch ?out|conflict|discrepan|contradic|clash|risk/.test(l))
    return wo.length?`${wo.length} open across this project:<br>${wo.map(w=>
      `&nbsp;&nbsp;·&nbsp; <b>${WT[w.type].label}</b> — ${esc(w.title)} <i>(${
        esc((meeting(w.mid)||{title:''}).title)})</i>`).join('<br>')}`
      :'Nothing outstanding — no call in this project contradicts another.';
  if(/task|action|owe|commit|follow|do/.test(l))
    return ts.length?`${ts.length} task${ts.length>1?'s are':' is'} open across ${
      ms.length} call${ms.length===1?'':'s'}:<br>${ts.map((t,i)=>
      `&nbsp;&nbsp;${i+1}.&nbsp; ${esc(t.title)} — <b>${esc(t.due)}</b>`).join('<br>')}`
      :'Nothing open from this project.';
  if(/status|update|draft|email|write/.test(l))
    return `Here is a status update you could send:<br><br>${esc(folderSummary(id))}`+
      (ts.length?`<br><br>Open with us: ${ts.slice(0,3).map(t=>
        esc(t.title.charAt(0).toLowerCase()+t.title.slice(1))).join('; ')}.`:'')+
      (wo.length?`<br><br>One thing to flag: ${esc(wo[0].title.charAt(0).toLowerCase()+wo[0].title.slice(1))}.`:'');
  if(/unresolved|open question|unanswered|unclear|still open/.test(l))
    return qs.length?`${qs.length} question${qs.length>1?'s are':' is'} still open:<br>${
      qs.map(x=>`&nbsp;&nbsp;·&nbsp; ${esc(x.tx)}${from(x)}`).join('<br>')}`
      :'No questions are left hanging across these calls.';
  if(/decide|decision|agree/.test(l))
    return dec.length?`What has been agreed so far:<br>${dec.map(x=>
      `&nbsp;&nbsp;·&nbsp; ${esc(x.tx)}${from(x)}`).join('<br>')}`
      :'No decisions have been recorded in this project yet.';
  if(/meeting|call|when|history/.test(l))
    return ms.length?`${ms.length} call${ms.length===1?'':'s'} filed here:<br>${ms.map(x=>
      `&nbsp;&nbsp;·&nbsp; <b>${esc(x.title)}</b> — ${esc(x.day)}, ${x.dur}`).join('<br>')}`
      :'Nothing has been filed in this project yet.';
  return `Across the ${ms.length} call${ms.length===1?'':'s'} in ${esc(f.name)}:<br><br>${
    esc(folderSummary(id))}`+(wo.length?`<br><br>${wo.length} watchout${
    wo.length>1?'s are':' is'} open — the first is ${esc(wo[0].title)}.`:'');
}
function askChat(q){
  const proj=chatProj(),host=chatHost();
  if(!host||!q.trim())return;
  host.chat=host.chat||[];
  host.chat.push({r:'u',tx:esc(q.trim())});
  S.mtyping=true;render();
  const el=document.querySelector('.panel.chat .pb2');if(el)el.scrollTop=el.scrollHeight;
  setTimeout(()=>{
    S.mtyping=false;
    host.chat.push({r:'a',tx:proj?folderAnswer(host,q):meetingAnswer(host,q)});
    render();
    const e2=document.querySelector('.panel.chat .pb2');if(e2)e2.scrollTop=e2.scrollHeight;
    const i=document.querySelector('#mbox');if(i)i.focus();
  },1100);
}

/* ── tooltips ──────────────────────────────────────────────────────────────
   `title` stays the way these are authored — it is the obvious thing to write
   and it survives if this ever renders somewhere else. But Chromium shows it
   only on form controls, so after every render each one is rewritten into the
   pseudo-element tooltip in the stylesheet. aria-label keeps the control named
   for a screen reader now that the title is gone. */
/* actions that are not controls: a contenteditable region, a no-op wrapper,
   and the inputs, which are focusable already */
const NOKEY=new Set(['noop','q','tq','vq','ask','addtask','addterm']);
function tips(root){
  if(!root)return;
  root.querySelectorAll('[title]').forEach(el=>{
    const t=el.getAttribute('title');
    el.removeAttribute('title');
    if(!t)return;
    el.setAttribute('aria-label',t);
    el.setAttribute('data-tt',t);
  });
  root.querySelectorAll('[data-a]').forEach(el=>{
    const tag=el.tagName;
    if(tag==='INPUT'||tag==='BUTTON'||tag==='TEXTAREA')return;
    if(el.isContentEditable||el.hasAttribute('contenteditable'))return;
    if(NOKEY.has(el.dataset.a))return;
    if(!el.hasAttribute('tabindex'))el.setAttribute('tabindex','0');
    if(!el.hasAttribute('role'))el.setAttribute('role','button');
  });
  /* the switches and checkboxes say what they are and what state they are in,
     rather than being a div with a class on it */
  root.querySelectorAll('.tog').forEach(el=>{
    el.setAttribute('role','switch');
    el.setAttribute('aria-checked',el.classList.contains('on')?'true':'false');
    if(el.classList.contains('dis'))el.setAttribute('aria-disabled','true');
  });
  root.querySelectorAll('.cbx').forEach(el=>{
    el.setAttribute('role','checkbox');
    el.setAttribute('aria-checked',el.classList.contains('on')?'true':'false');
  });
  root.querySelectorAll('.tabs a').forEach(el=>{
    el.setAttribute('role','tab');
    el.setAttribute('aria-selected',el.classList.contains('on')?'true':'false');
    if(el.classList.contains('off'))el.setAttribute('aria-disabled','true');
  });
  root.querySelectorAll('.nav a,.subnav a,.views a,.menu a,.mnav a').forEach(el=>{
    if(el.getAttribute('role')==='button')el.setAttribute('role','link');
    if(el.classList.contains('on'))el.setAttribute('aria-current','true');
  });
}
/* Enter and Space on one of those spans does what a click does. Space is
   swallowed so the page does not scroll out from under the control. */
document.addEventListener('keydown',e=>{
  if(e.key!=='Enter'&&e.key!==' ')return;
  const el=e.target;
  if(!el||!el.dataset||!el.dataset.a)return;
  if(!el.hasAttribute('tabindex'))return;
  if(el.isContentEditable)return;
  e.preventDefault();
  el.click();
},true);
/* Showing it. The delay is what stops a mouse crossing a row of actions from
   flashing four tooltips on its way past; the warm window is what stops the
   delay from being felt again when the user is deliberately reading along a
   row, because by then they have already waited once. */
const TT={delay:340,warm:450};
let TTEL=null,TTT=null,TTWARM=0;
function tipHide(){
  clearTimeout(TTT);TTT=null;
  if(!TTEL)return;
  TTEL=null;TTWARM=Date.now();
  const t=$('#tip');if(t)t.className='';
}
function tipShow(el){
  const t=$('#tip'),fr=$('#frame');
  if(!t||!fr||!el.isConnected)return;
  const txt=el.getAttribute('data-tt');if(!txt)return;
  t.textContent=txt;t.className='on';
  /* frame coordinates: the window mock is CSS-scaled when it does not fit, so
     every measured pixel has to be divided back out */
  const f=fr.getBoundingClientRect(),r=el.getBoundingClientRect();
  const L=(r.left-f.left)/SCALE,T=(r.top-f.top)/SCALE;
  const W=r.width/SCALE,H=r.height/SCALE;
  const tw=t.offsetWidth,th=t.offsetHeight;
  let y=T-th-8;
  if(y<6)y=T+H+8;                                   /* no room above: go below */
  const x=Math.max(6,Math.min(L+W/2-tw/2,FW()-tw-6));  /* and never off the sides */
  t.style.left=Math.round(x)+'px';t.style.top=Math.round(y)+'px';
}
/* A control in a sidebar is a special case: if that sidebar is open, or is
   about to open under the pointer, its real label is already on screen or a
   few hundred milliseconds away. Showing a tooltip too would answer the same
   question twice and flash it away again as the sidebar expands. Where peeking
   cannot happen — a coarse pointer, or a zone the user has just collapsed and
   disarmed — the tooltip is the only label there is, so it stays. */
function tipMuted(el){
  const z=pkZone(el);if(!z)return false;
  const collapsed=z==='rail'?S.railmin:S.listmin;
  return !collapsed||S.peek===z||(FINE&&PKARM[z]&&!pkBusy());
}
document.addEventListener('mouseover',e=>{
  const el=e.target.closest&&e.target.closest('[data-tt]');
  if(el===TTEL)return;
  tipHide();
  if(!el||tipMuted(el))return;
  TTEL=el;
  const wait=Date.now()-TTWARM<TT.warm?0:TT.delay;
  TTT=setTimeout(()=>{if(TTEL===el)tipShow(el)},wait);
});
document.addEventListener('mouseout',e=>{
  const el=e.target.closest&&e.target.closest('[data-tt]');
  if(el&&el===TTEL&&!(e.relatedTarget&&el.contains(e.relatedTarget)))tipHide();
});
/* anything that moves the control out from under the tooltip retires it */
document.addEventListener('mousedown',tipHide,true);
document.addEventListener('scroll',tipHide,true);
window.addEventListener('blur',tipHide);

/* ── sidebar hover peek ───────────────────────────────────────────────────
   Hover intent, roughly the classic hoverIntent test: sample the pointer every
   100ms and open only once it has been in the strip long enough AND stopped
   moving much between two samples. A fast diagonal across the rail never
   produces two close-together samples, so it never opens; scanning slowly down
   the icons does, which is exactly when the labels are wanted.

   PKARM is the other half. After an explicit collapse — or after clicking
   something in a peeked sidebar — the pointer is left sitting on the strip, and
   re-opening under it would undo what the user just asked for. That zone stays
   disarmed until the pointer leaves it. */
const PEEK={open:350,close:420,tick:100,slop:9};
const FINE=window.matchMedia&&window.matchMedia('(hover:hover) and (pointer:fine)').matches;
const PKARM={rail:true,list:true};
let PKZONE=null,PKINT=null,PKCLOSE=null,PKMS=0,PKX=0,PKY=0,PKLX=0,PKLY=0,PKNEW=false;
const listOpen=()=>!S.listmin||S.peek==='list';
document.addEventListener('mousemove',e=>{PKX=e.clientX;PKY=e.clientY},{passive:true});

const pkBusy=()=>S.settings||S.share||S.addPerson||S.menu||BDRAG;
function pkZone(t){
  if(!t||!t.closest)return null;
  if(t.closest('.rail'))return 'rail';
  if(t.closest('.listcol'))return 'list';
  return null;
}
function pkStop(){clearInterval(PKINT);PKINT=null;PKZONE=null;PKMS=0;}
function pkOpen(z){
  if(S.peek===z)return;
  S.peek=z;PKNEW=true;render();PKNEW=false;
}
/* clears the peek and keeps it cleared until the pointer moves off the strip —
   used when the user has just made a choice inside it, or just collapsed it */
function pkDismiss(){
  pkStop();clearTimeout(PKCLOSE);PKCLOSE=null;
  PKARM.rail=false;PKARM.list=false;
  if(S.peek)S.peek=null;
}
function pkEnter(z){
  clearTimeout(PKCLOSE);PKCLOSE=null;
  if(S.peek===z||PKZONE===z)return;
  const eligible=FINE&&!pkBusy()&&PKARM[z]&&(z==='rail'?S.railmin:S.listmin);
  if(!eligible){pkStop();return}
  pkStop();PKZONE=z;PKLX=PKX;PKLY=PKY;
  PKINT=setInterval(()=>{
    PKMS+=PEEK.tick;
    const moved=Math.abs(PKX-PKLX)+Math.abs(PKY-PKLY);
    PKLX=PKX;PKLY=PKY;
    if(PKMS>=PEEK.open&&moved<PEEK.slop){const z2=PKZONE;pkStop();pkOpen(z2);}
  },PEEK.tick);
}
function pkLeave(){
  pkStop();
  if(!S.peek||PKCLOSE)return;
  PKCLOSE=setTimeout(()=>{PKCLOSE=null;if(S.peek){S.peek=null;render()}},PEEK.close);
}
document.addEventListener('mouseover',e=>{
  if(!FINE)return;
  const z=pkZone(e.target);
  if(z)pkEnter(z);
  else{PKARM.rail=true;PKARM.list=true;pkLeave();}
});
/* leaving the window entirely counts as leaving the strip */
document.addEventListener('mouseleave',()=>{PKARM.rail=true;PKARM.list=true;pkLeave()});
/* keyboard parity: tabbing into a collapsed sidebar opens it at once — there is
   no pointer to read intent from, and arriving by Tab is intent enough */
document.addEventListener('focusin',e=>{
  const z=pkZone(e.target);
  if(z&&!pkBusy()&&(z==='rail'?S.railmin:S.listmin)&&S.peek!==z){pkStop();pkOpen(z)}
});
document.addEventListener('focusout',e=>{
  if(!S.peek)return;
  setTimeout(()=>{
    const a=document.activeElement;
    if(S.peek&&(!a||pkZone(a)!==S.peek)&&!document.querySelector('.rail:hover,.listcol:hover'))
      {S.peek=null;render()}
  },0);
});

