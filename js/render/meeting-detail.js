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
    <h1 class="h${isEd('meeting',m.id,'h1')?' editing':''}" ${edAct('meeting',m.id,'h1','rename')} style="cursor:text">${
      ename('meeting',m.id,'h1',m.title)}${isEd('meeting',m.id,'h1')?'':`
      <span class="edit">${ic('edit',15)}</span>`}</h1>
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
    <a class="${S.tab==='notes'?'on':''}" data-a="tab" data-p="notes">${ic('spark',14)}AI notes</a>
    ${wTab}
    <a class="${S.tab==='mynotes'?'on':''}" data-a="tab" data-p="mynotes">My notes</a>
    <a class="${S.tab==='transcript'?'on':''}" data-a="tab" data-p="transcript">Transcript</a></div>`;
  let body='';
  /* a call that is still being recorded is the live page, not a finished meeting */
  if(rec)return viewLive(m);
  if(S.busy){
    return `<div class="body">${titleBlock(m,m.dur)}
      <div class="empty"><span class="ico">${ic('spark',22)}</span>
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
          ${whoSpokeBlock(m)}
        </div>
        <div class="dside">
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
    body=transcriptTab(m,tabs);
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
function taskRow(t,compact){
  const m=meeting(t.mid);
  return `<div class="trk ${t.done?'done':''} ${S.tid===t.id&&S.panel?'on':''}" data-a="opentask" data-p="${t.id}">
    <span class="cbx ${t.done?'on':''}" data-a="toggletask" data-p="${t.id}"
      title="${t.done?'Mark not done':'Mark done'}">${ic('check',12,2)}</span>
    <span style="flex:1"><span class="t">${esc(t.title)}</span>
      <span class="m">${compact
        ?`<span class="${t.late&&!t.done?'late':''}">${t.done?'Done':t.due}</span>`
        :`${t.pri==='hi'?`<span class="pri hi">High</span>`:''}${
          ic('users',12)}${m?esc(m.title):'Added by you'}`}</span></span>
    ${compact?'':`<span class="due ${t.late&&!t.done?'dg':''}">${t.done?'Done':t.due}</span>`}
    ${compact?'':`<span class="kb2" data-a="menu" data-p="task:${t.id}" title="Task options">${ic('dots',16)}</span>`}</div>`;
}

