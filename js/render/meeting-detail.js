// Renders the meeting detail view. 

/* ══════════════════════════════════ meeting detail ══════════════════════════════════ */
/* Avatars only, capped so a twelve-person all-hands does not push the meta row
   onto a second line — the remainder becomes a +N chip. Names live in the
   attendee popover now. Takes a plain people array rather than a meeting, so
   the same stack does a meeting's own attendees and a project's rolled-up
   members. */
function faces(people,max=6){
  const shown=people.slice(0,max),rest=people.length-shown.length;
  return `<span class="faces">${shown.map(p=>
    `<i style="background:${p.c}" title="${esc(p.n)}">${p.i}</i>`).join('')}${
    rest>0?`<i class="more" title="${esc(people.slice(max).map(x=>x.n).join(', '))}">+${rest}</i>`:''}</span>`;
}
/* `dur` is the running time, or '' while the call is still being recorded and
   there is not one yet. */
function titleBlock(m,dur){
  return `<div class="titleblk">
    <h1 class="h" data-a="rename" data-p="${m.id}" style="cursor:text">${esc(m.title)}
      <span class="edit">${ic('edit',15)}</span></h1>
    <div class="metarow">
      <span class="mi people" data-a="menu" data-p="people:${m.id}" title="Attendees">${faces(m.people,5)}
        <span><b>${m.people.length}</b> attendee${m.people.length===1?'':'s'}</span>${ic('chevd',11)}</span>
      <span class="sp"></span>
      <span class="mi">${ic('cal',13)}<span><b>${m.day}</b>, ${m.time}</span></span>
      ${dur?`<span class="sp"></span><span class="mi">${ic('clock',13)}<b>${dur}</b></span>`:''}
      <span class="sp"></span>
      <span class="mi fchipx ${fcls(m.folder)}" data-a="menu" data-p="folder:${m.id}"
        title="Move to folder"><i class="fd"></i>${esc(folderPath(m.folder))} ${ic('chevd',11)}</span>
    </div></div>`;
}
function viewMeeting(){
  const m=meeting(S.mid);if(!m)return `<div class="body"><div class="empty"><h2>Meeting not found</h2></div></div>`;
  const rec=S.rec&&S.rec.mid===m.id;
  const wo=mWatch(m.id),woOpen=mWatchOpen(m.id),woHot=hasConflict(woOpen);
  const wTab=`<a class="${S.tab==='watch'?'on':''}" data-a="tab" data-p="watch">${ic('radar',14)}Watchouts${
    woOpen.length?`<span class="cnt${woHot?' hot':''}">${woOpen.length}</span>`:''}</a>`;
  const tabs=`<div class="tabs">
    ${rec?`<a class="${S.tab==='mynotes'?'on':''}" data-a="tab" data-p="mynotes">My notes</a>
      ${wTab}
      <a class="off">${ic('spark',14)}AI notes <span class="cnt">after you stop</span></a>
      <a class="${S.tab==='transcript'?'on':''}" data-a="tab" data-p="transcript">Transcript <span class="cnt">live</span></a>`
     :`<a class="${S.tab==='notes'?'on':''}" data-a="tab" data-p="notes">${ic('spark',14)}AI notes</a>
      ${wTab}
      <a class="${S.tab==='mynotes'?'on':''}" data-a="tab" data-p="mynotes">My notes</a>
      <a class="${S.tab==='transcript'?'on':''}" data-a="tab" data-p="transcript">Transcript</a>`}</div>`;
  let body='';
  if(rec){
    const r=S.rec,mm=String(Math.floor(r.secs/60)).padStart(2,'0'),ss=String(r.secs%60).padStart(2,'0');
    body=`<div class="recbar ${r.paused?'pause':''}"><span class="rdot"></span>
      <b>${r.paused?'Paused':'Recording'}</b><span class="t">${mm}:${ss}</span>
      <span class="s">· ${r.paused?'nothing is being captured':'both sides captured'}</span>
      <span class="a">
        ${woOpen.length?`<span class="wdot w-${woHot?'conflict':woOpen[0].type}" data-a="tab" data-p="watch"
          style="cursor:pointer">${ic('radar',12)}${woOpen.length} watchout${woOpen.length>1?'s':''}</span>`:''}
        <button class="btn s sm" data-a="stopRec">${ic('stop',14)}Stop &amp; generate notes</button></span></div>
     <div style="margin:var(--s4) 0 var(--s6);display:flex;align-items:center;gap:var(--s4)">
      ${meterBars(74,!r.paused,r.secs)}
      <span class="hint" style="margin-left:auto;display:flex;align-items:center;
        gap:6px;flex:0 0 auto">${ic('spark',13)}Pause, stop and watchouts are on the floating pill</span></div>${tabs}`;
    if(S.tab==='watch'){body+=watchBody(m,wo,woOpen,true);}
    else if(S.tab==='transcript'){
      body+=`<div style="flex:1;overflow-y:auto">${r.lines.map(l=>
        `<div class="trs ${l[3]==='spoken'?'said':''}"><span class="tm">${l[0]}</span>
          <span><span class="spk">${l[1]}${l[3]==='spoken'?`<span class="badge" style="margin:0 0 0 8px">${
            ic('speak',11)}raised by the assistant</span>`:''}</span>
          <span class="tx">${esc(l[2])}</span></span></div>`).join('')||
        `<div class="hint" style="padding:var(--s5) 2px">Listening… lines appear here as people speak.</div>`}</div>`;
    }else{
      body+=`<div class="notebox"><div class="ln" contenteditable="true" data-a="noop">${
        esc(m.mynotes).replace(/\n/g,'<br>')}</div>
        <div class="hint" style="margin-top:10px">Jot key points as they come up — AI notes expand them into
        a summary, decisions and tasks when you stop.</div></div>`;
    }
    return `<div class="body">${titleBlock(m,'')}${body}
      ${S.mpanel?'':askDock('Ask anything about this call so far…')}</div>`;
  }
  if(S.busy){
    return `<div class="body">${titleBlock(m,m.dur)}
      <div class="empty"><span class="ico">${ic('spark',22,1.6)}</span>
      <h2>Generating notes…</h2><p>Reading your notes and the transcript together. This usually takes a few seconds.</p>
      <div class="a typing"><i></i><i></i><i></i></div></div></div>`;
  }
  const mytasks=db.tasks.filter(t=>t.mid===m.id);
  if(S.tab==='notes'){
    const recRow=d=>`<li><span>${esc(d[0])}</span>
      <span class="jump" data-a="jump" data-p="${d[1]}">${d[1]}</span></li>`;
    /* Two columns, one for reading and one for doing. The left carries the
       narrative — what was said, what got decided, what's still open — with
       real typographic hierarchy between them (a lead paragraph, then two
       record-style lists). The right is the same width and shape as the
       project page's own side column: the other calls this one sits beside,
       then what's still open from it, so neither page has to be relearned
       once you know the other. */
    const openMy=mytasks.filter(t=>!t.done);
    const mf=m.folder,related=folderMeetings(mf).filter(x=>x.id!==m.id);
    const {shown:rrows,more:rmore}=capList('meeting:'+m.id+':related',related.map(x=>meetingRow(x)),5);
    const {shown:orows,more:omore}=capList('meeting:'+m.id+':tasks',openMy.map(t=>taskRow(t,true)),5);
    body=`${tabs}${actbar(
      `${ic('spark',14)}Generated ${m.genAt||'2:49 pm'} from your notes and the transcript.`,
      `<button class="btn q sm ico" data-a="copymd" data-p="${m.id}"
         title="Copy as Markdown">${ic('copy',15)}</button>
       <button class="btn q sm ico" data-a="dlmd" data-p="${m.id}"
         title="Download .md">${ic('md',15)}</button>
       <button class="btn q sm ico" data-a="menu" data-p="meeting:${m.id}"
         title="Regenerate, export, delete">${ic('dots',15)}</button>`)}
      <div class="notesgrid"><div class="dcols">
        <div class="dmain">
          ${summaryBlock(m.notes.summary)}
          ${secBlock({key:'notes:'+m.id+':dec',title:'Decisions',
            rows:m.notes.decisions.map(recRow),tag:'bul',hideIfEmpty:true})}
          ${secBlock({key:'notes:'+m.id+':q',title:'Open questions',
            rows:m.notes.questions.map(recRow),tag:'bul',hideIfEmpty:true})}
        </div>
        <div class="dside">
          ${pnl('Meetings',related.length,
            related.length?`<span data-a="view" data-p="${mf===''?'unfiled':'f:'+mf}">${
              esc(folderName(mf))} ${ic('chev',12)}</span>`:'',
            related.length?`<div class="list">${rrows.join('')}</div>${rmore}`
              :cardEmpty('users','No other calls are filed alongside this one yet.'),true)}
          ${pnl('Open tasks',openMy.length,'',
            openMy.length?`<div class="list">${orows.join('')}</div>${omore}`
              :cardEmpty('checkc','Nothing came out of this call — no task was assigned.'),true)}
        </div>
      </div></div>`;
  } else if(S.tab==='watch'){
    body=`${tabs}${watchBody(m,wo,woOpen,false)}`;
  } else if(S.tab==='mynotes'){
    body=`${tabs}${actbar(`${ic('clipb',14)}Only you see these. They are read alongside the transcript
      when AI notes are generated.`,
      `<button class="btn s sm" data-a="regen" data-p="${m.id}">${ic('spark',14)}Regenerate AI notes</button>`)}
      <div class="notebox" style="flex:1"><div class="ln" contenteditable="true">${
      esc(m.mynotes).replace(/\n/g,'<br>')}</div></div>`;
  } else {
    const spk=['All speakers',...new Set(m.transcript.map(t=>t[1]))];
    const q=S.tq.toLowerCase();
    const rows=m.transcript.filter(t=>(S.speakers==='All speakers'||t[1]===S.speakers)&&
      (!q||t[2].toLowerCase().includes(q)));
    body=`${tabs}${actbar(
      `<span class="srch" style="margin:0;width:230px">${ic('search',15)}
        <input placeholder="Search this transcript" data-a="tq" value="${esc(S.tq)}"></span>
       ${spk.map(x=>`<span class="fchip ${S.speakers===x?'on':''}" data-a="spk" data-p="${esc(x)}">${esc(x)}</span>`).join('')}`,
      `<button class="btn q sm ico" data-a="demo" data-p="copy the transcript to your clipboard"
         title="Copy the transcript">${ic('copy',15)}</button>
       <button class="btn q sm ico" data-a="demo" data-p="export the transcript"
         title="Export the transcript">${ic('down',15)}</button>`)}
      <div style="flex:1;overflow-y:auto">${rows.length?rows.map(t=>{
        let tx=esc(t[2]);
        if(q)tx=tx.replace(new RegExp('('+q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','ig'),'<mark>$1</mark>');
        return `<div class="trs ${t[3]?'hl':''}"><span class="tm" data-a="jump" data-p="${t[0]}">${t[0]}</span>
          <span><span class="spk">${esc(t[1])}</span><span class="tx">${tx}</span>
          ${t[3]?`<span class="badge">${ic('list',12)}${t[3]}</span>`:''}</span></div>`}).join('')
        :`<div class="hint" style="padding:24px 4px">Nothing in this transcript matches.</div>`}</div>
      ${player(m)}`;
  }
  return `<div class="body">${titleBlock(m,m.dur)}
    ${woOpen.length&&S.tab==='notes'&&!m.woAck?`<div class="notice ${woHot?'dg':'warn'}"
      style="margin-bottom:var(--s5)">${ic('radar',16)}
      <span><b>${woOpen.length} watchout${woOpen.length>1?'s':''} from this call</b> —
      ${esc(woOpen[0].title)}${woOpen.length>1?`, and ${woOpen.length-1} more`:''}.</span>
      <span class="act">
        <button class="btn q sm" data-a="tab" data-p="watch">Review ${ic('chev',13)}</button>
        <span class="tbtn" data-a="ackWatch" data-p="${m.id}" title="Hide this until something new comes up"
          style="width:26px;height:26px">${ic('x',14)}</span></span></div>`:''}
    ${body}
    ${S.mpanel?'':askDock('Ask anything about this meeting…')}</div>`;
}
function player(m){
  const bars=[];for(let i=0;i<80;i++)bars.push(6+Math.round(18*Math.abs(Math.sin(i*0.55))*Math.abs(Math.cos(i*0.23))));
  return `<div class="player"><span class="pb" data-a="playpause" title="Play the recording">${ic(S.playing?'pause':'play',15,2)}</span>
    <span class="tm">${fmtPos(m)}</span>
    <span class="scrub" data-a="seek">${bars.map((h,i)=>
      `<i class="${i<S.playPos?'p':''}" style="height:${h}px"></i>`).join('')}</span>
    <span class="tm">${m.dur}</span>
    <button class="btn q sm" data-a="demo" data-p="change playback speed"
      title="Playback speed">1&times;</button></div>`;
}
function fmtPos(m){
  const total=parseInt(m.dur.split(':')[0])*60+parseInt(m.dur.split(':')[1]);
  const s=Math.round(total*S.playPos/80);
  return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');
}
function taskRow(t,compact){
  const m=meeting(t.mid);
  return `<div class="trk ${t.done?'done':''} ${S.tid===t.id&&S.panel?'on':''}" data-a="opentask" data-p="${t.id}">
    <span class="cbx ${t.done?'on':''}" data-a="toggletask" data-p="${t.id}"
      title="${t.done?'Mark not done':'Mark done'}">${ic('check',12,2.6)}</span>
    <span style="flex:1"><span class="t">${esc(t.title)}</span>
      <span class="m">${compact
        ?`<span class="${t.late&&!t.done?'late':''}">${t.done?'Done':t.due}</span>`
        :`${t.pri==='hi'?`<span class="pri hi">High</span>`:''}${
          ic('users',12)}${m?esc(m.title):'Added by you'}`}</span></span>
    ${compact?'':`<span class="due ${t.late&&!t.done?'dg':''}">${t.done?'Done':t.due}</span>`}
    ${compact?'':`<span class="kb2" data-a="menu" data-p="task:${t.id}" title="Task options">${ic('dots',16)}</span>`}</div>`;
}

