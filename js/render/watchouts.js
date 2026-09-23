// Renders the watchouts panel. 

/* ══════════════════════════════════ watchouts ══════════════════════════════════ */
/* What the assistant noticed reading this call against everything said before
   it. The list is deliberately shallow — a title, the pair in one line, and the
   actions that settle it — because the reason a watchout exists is a comparison,
   and a comparison needs room. That room is the detail panel. */
const wsrc=w=>w.ref.mid===w.mid?'Earlier in this call'
  :w.ref.mid?esc(w.ref.mt):esc(w.ref.mt||'Project history');

function watchRow(w,showMeeting){
  const t=WT[w.type],settled=w.status!=='open',m=meeting(w.mid);
  return `<div class="wrow w-${w.type} ${settled?'done':''} ${
      S.wid===w.id&&S.wpanel?'wsel':''}" data-a="wdetail" data-p="${w.id}">
    <span class="wi">${ic(settled?(w.status==='resolved'?'check':'eyeoff'):t.icon,15)}</span>
    <span class="wmain">
      <span class="wt">${esc(w.title)}</span>
      <span class="ws"><b>${esc(w.now.who)}</b>, ${w.now.at} — “${clip(w.now.tx,66)}”</span>
      <span class="wm">
        <span class="wsr">${ic(t.icon,12)}${t.rel}</span>
        <span>·</span>
        <span class="wsr">${w.ref.mid?ic('users',12):ic('history',12)}${wsrc(w)}${
          w.ref.date&&w.ref.mid!==w.mid?' · '+esc(w.ref.date):''}${w.ref.at?' · '+w.ref.at:''}</span>
        ${showMeeting&&m?`<span>·</span><span class="wsr">${ic('file',12)}${esc(m.title)}</span>`:''}
        ${settled?`<span>·</span><span style="font-weight:600">${
          w.status==='resolved'?(w.raised?'Raised in the call':'Resolved'):'Dismissed'}</span>`:''}</span></span>
    <span class="wr">
      ${settled?`<span class="wacts"><span data-a="wreopen" data-p="${w.id}" title="Reopen">${
          ic('undo',14)}</span></span>`
        :`<span class="age">${esc(w.age)}</span>
          <span class="wacts">
            <span data-a="wtask" data-p="${w.id}" title="Turn into a task">${ic('list',14)}</span>
            <span class="gd" data-a="wresolve" data-p="${w.id}" title="Mark resolved">${ic('check',14)}</span>
            <span data-a="wdismiss" data-p="${w.id}" title="Not an issue">${ic('eyeoff',14)}</span></span>`}
    </span></div>`;
}
/* Grouped by classification rather than by time, because the three of them ask
   for different things: a conflict needs a decision, a discrepancy needs a
   number checked, a clarification needs someone asked. */
function watchBody(m,all,open,live){
  const settled=all.filter(w=>w.status!=='open');
  const shown=S.wfilter==='all'?open:open.filter(w=>w.type===S.wfilter);
  if(!all.length){
    return `<div class="empty" style="padding-bottom:70px"><span class="ico">${ic('radar',22,1.6)}</span>
      <h2>Nothing to watch out for</h2>
      <p>${live?'The assistant is reading this call against everything said before it. Anything that contradicts an earlier decision, a number or an open question will appear here — and on the floating pill — as it comes up.'
        :'Nothing in this call contradicted an earlier decision, disagreed with a number already agreed, or left a question hanging.'}</p></div>`;
  }
  return `${live&&open.length?`<div class="notice ${hasConflict(open)?'dg':'warn'}"
      style="margin-bottom:var(--s5);flex:0 0 auto">
      ${ic(hasConflict(open)?'alertc':'alert',16)}
      <span><b>${open.length} watchout${open.length>1?'s':''} while you are still on the call.</b>
      ${db.settings.woSpeak?'“Bring this up” has the assistant say it out loud, so it lands in the room and in the transcript.'
        :'Raise it yourself — nothing is spoken unless you turn that on in Settings.'}</span></div>`:''}
    ${actbar(
      `<span class="fchip wf ${S.wfilter==='all'?'on':''}" data-a="wfilter" data-p="all">All${
         open.length?`<span class="b">${open.length}</span>`:''}</span>
       ${WORDER.map(t=>{const n=open.filter(w=>w.type===t).length;
         return `<span class="fchip wf ${S.wfilter===t?'on':''}" data-a="wfilter" data-p="${t}">${
           ic(WT[t].icon,14)}${WT[t].plural}${n?`<span class="b">${n}</span>`:''}</span>`}).join('')}`,
      `${settled.length?`<span class="chk" data-a="wshowdone">
         <span class="cbx ${S.wdone?'on':''}">${ic('check',12,2.6)}</span>Show ${settled.length} settled</span>`:''}
       <span class="link" data-a="settings" data-p="ainotes"
         style="font-weight:500;color:var(--ter)">What it looks for</span>`)}
    <div class="wscroll">
    ${shown.length?`<div class="list wlistcard">${shown.map(w=>watchRow(w)).join('')}</div>`
      :`<div class="hint" style="padding:24px 2px">
        ${open.length?`No open ${WT[S.wfilter]?WT[S.wfilter].plural.toLowerCase():'watchouts'} in this call.`
          :'Everything here has been settled.'}</div>`}
    ${S.wdone&&settled.length?`<div class="ghd" style="margin:var(--s6) 0 var(--s3)">Settled
        <span class="n">· ${settled.length}</span></div>
      <div class="list wlistcard">${settled.map(w=>watchRow(w)).join('')}</div>`:''}
    <div class="wfoot2">${ic('radar',14)}Read against ${db.meetings.length} recorded meetings and
      this project's history.</div>
    </div>`;
}
/* ── detail panel ─────────────────────────────────────────────────────────
   The comparison is the whole content, so it gets the top of the panel and the
   full width: what was said in this meeting, what it collides with, and the
   relation between them named in words rather than implied by colour. */
function watchPanel(){
  const w=watchout(S.wid);if(!w)return '';
  const t=WT[w.type],m=meeting(w.mid),rm=w.ref.mid?meeting(w.ref.mid):null;
  const live=S.rec&&S.rec.mid===w.mid;
  const settled=w.status!=='open';
  return `<div class="panel wo w-${w.type}"><div class="ph">
    <span class="wi" style="width:26px;height:26px;border-radius:var(--r1);background:var(--wcT);
      color:var(--wcI);display:flex;align-items:center;
      justify-content:center;flex:0 0 auto">${ic(t.icon,14)}</span>
    <b>${t.label}</b>
    <span style="margin-left:auto;display:flex;gap:4px">
      <span class="tbtn" data-a="menu" data-p="wmenu:${w.id}" title="Watchout options">${ic('dots',17)}</span>
      <span class="tbtn" data-a="wclose" title="Close">${ic('x',17)}</span></span></div>
   <div class="pb2">
    <div>
      <div style="font-family:var(--f-head);font-size:16px;font-weight:600;line-height:1.42">${esc(w.title)}</div>
      <div style="margin-top:var(--s2);display:flex;gap:var(--s2);flex-wrap:wrap;align-items:center;
        font-size:12px;color:var(--ter)">
        ${settled?`<span>${w.status==='resolved'?(w.raised?'Raised in the call':'Resolved')
            :'Dismissed'}</span>`:`<span style="color:var(--sec);font-weight:600">Open</span>`}
        <span class="sp" style="width:3px;height:3px;border-radius:50%;background:var(--line2)"></span>
        <span>${esc(w.age)}</span></div>
    </div>

    <div>
      <div class="ghd" style="margin-bottom:10px">What collides</div>
      <div class="wcmp">
        <div>
          <div class="hd">${ic('mic',12)}${live?'In this call':'In this meeting'}</div>
          <div class="q">“${esc(w.now.tx)}”</div>
          <div class="who"><b>${esc(w.now.who)}</b><span>·</span><span>${w.now.at}</span></div>
          <div class="lk" data-a="jump" data-p="${w.now.at}">${ic('play',12)}Jump to ${w.now.at}</div>
        </div>
        <div>
          <div class="hd">${w.ref.mid===w.mid?ic('clock',12)+'Earlier in this call'
            :w.ref.mid?ic('users',12)+'Another meeting':ic('history',12)+'Project history'}</div>
          <div class="q">“${esc(w.ref.tx)}”</div>
          <div class="who"><b>${esc(w.ref.who)}</b>${w.ref.mt?`<span>·</span><span>${esc(w.ref.mt)}</span>`:''}
            ${w.ref.date?`<span>·</span><span>${esc(w.ref.date)}</span>`:''}</div>
          ${w.ref.mid===w.mid?`<div class="lk" data-a="jump" data-p="${w.ref.at}">${
              ic('play',12)}Jump to ${w.ref.at}</div>`
            :rm?`<div class="lk" data-a="open" data-p="${w.ref.mid}">${ic('chev',12)}Open ${esc(rm.title)}</div>`
            :`<div class="lk" data-a="demo" data-p="open the source note this came from">${
              ic('file',12)}Open the source note</div>`}
        </div>
      </div>
      <div class="wrel">${t.rel}</div>
    </div>

    <div>
      <div class="ghd">Why it matters</div>
      <p style="font-size:13.5px;line-height:1.65;color:var(--ink2)">${esc(w.why)}</p>
    </div>

    <div class="wsay">
      <div class="hd">${ic('speak',14)}If you want it said out loud</div>
      <p>“${esc(w.say)}”</p>
      <div class="a">
        ${live&&db.settings.woSpeak?`<button class="btn p sm" data-a="wsay" data-p="${w.id}">${
            ic('speak',14)}Bring this up</button>`:''}
        <button class="btn s sm" data-a="wcopy" data-p="${w.id}">${ic('copy',14)}Copy wording</button>
        ${!live?`<button class="btn s sm" data-a="demo" data-p="draft a follow-up email raising this">${
          ic('send',14)}Draft a follow-up</button>`:''}</div>
    </div>

    <div style="border-top:1px solid var(--line);padding-top:16px;display:flex;flex-direction:column;gap:12px">
      <div class="frow"><span class="lb">Status</span>
        <span class="sel" data-a="menu" data-p="wstatus:${w.id}">${
          ic(w.status==='open'?'alertc':w.status==='resolved'?'check':'eyeoff',14)}${
          w.status==='open'?'Open':w.status==='resolved'?'Resolved':'Dismissed'} ${ic('chevd',12)}</span></div>
      <div class="frow"><span class="lb">Found in</span>
        <span class="sel" data-a="open" data-p="${w.mid}">${ic('users',14)}${
          esc(m?m.title:'meeting')} ${ic('chev',12)}</span></div>
      <div class="frow"><span class="lb">Project</span>
        <span class="sel" data-a="view" data-p="${m&&m.folder?'f:'+m.folder:'unfiled'}">${
          ic('folder',14)}${esc(m?folderPath(m.folder):'Unfiled')} ${ic('chev',12)}</span></div>
    </div>

    <div style="border-top:1px solid var(--line);padding-top:16px;display:flex;gap:8px;flex-wrap:wrap">
      ${settled?`<button class="btn s sm" data-a="wreopen" data-p="${w.id}">${ic('undo',14)}Reopen</button>`
        :`<button class="btn s sm" data-a="wtask" data-p="${w.id}">${ic('list',14)}Turn into a task</button>
          <button class="btn s sm" data-a="wresolve" data-p="${w.id}">${ic('check',14)}Resolve</button>
          <button class="btn s sm" data-a="wdismiss" data-p="${w.id}"
            style="color:var(--sec)">${ic('eyeoff',14)}Not an issue</button>`}</div>
   </div></div>`;
}

