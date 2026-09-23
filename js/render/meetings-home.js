// Renders the meetings home screen. 

/* ══════════════════════════════════ meetings home ══════════════════════════════════ */
/* The landing screen. It carries no list column on purpose: the folders on the
   page ARE the navigation, and a second copy of them down the left would be
   the same list twice — which is exactly what the old screen did. Opening a
   folder is what brings the column in, because that is the first moment you
   might want to move between folders without coming back here. */
function folderCard(f){
  const ms=folderMeetings(f.id),kids=subFolders(f.id),
        ts=folderTasks(f.id),ws=fWatchOpen(f.id);
  return `<div class="fcd ${fcls(f.id)}" data-a="view" data-p="f:${f.id}"
      title="${esc(f.name)}">
    <div class="top">${fwell(f.id,36)}<span class="nm">${esc(f.name)}</span>
      <span class="fm" data-a="menu" data-p="fmenu:${f.id}" title="Folder options">${ic('dots',14)}</span></div>
    ${kids.length
      ?`<div class="subs">${kids.slice(0,3).map(k=>`<span>${esc(k.name)}</span>`).join('')}${
         kids.length>3?`<span class="plain">+${kids.length-3} more</span>`:''}</div>`
      :`<div class="ds">${esc(folderSummary(f.id))}</div>`}
    <div class="mt"><b>${ms.length}</b> meeting${ms.length===1?'':'s'}
      ${ts.length?`<span>·</span><b>${ts.length}</b> open task${ts.length===1?'':'s'}`:''}
      ${ws.length?`<span>·</span><span class="wstat w-${
        hasConflict(ws)?'conflict':ws[0].type}"><i></i><b>${ws.length}</b> watchout${
        ws.length===1?'':'s'}</span>`:''}</div></div>`;
}
/* ── a folder tile on the home screen, grid view ──────────────────────────
   Deliberately smaller than folderCard() above: this is the entry point to
   a folder, not a summary of it, so it keeps only what is needed to
   recognise and pick one — glyph, name, a meeting count — and stays small
   enough that three or four sit in a row. */
function folderCardSmall(f){
  const ms=folderMeetings(f.id),ts=folderTasks(f.id);
  return `<div class="fcdsm ${fcls(f.id)}" data-a="view" data-p="f:${f.id}" title="${esc(f.name)}">
    <div class="top">${fwell(f.id,30)}
      <span class="fm" data-a="menu" data-p="fmenu:${f.id}" title="Folder options">${ic('dots',13)}</span></div>
    <span class="nm">${esc(f.name)}</span>
    <span class="mt"><b>${ms.length}</b> meeting${ms.length===1?'':'s'}${
      ts.length?`<span class="dotc"></span><b>${ts.length}</b> task${ts.length===1?'':'s'}`:''}</span>
  </div>`;
}
const unfiledCardSmall=n=>`<div class="fcdsm unf" data-a="view" data-p="unfiled" title="Unfiled">
  <div class="top"><span class="fwell" style="width:30px;height:30px;background:var(--sunk);
    color:var(--ter)">${ic('file',15)}</span></div>
  <span class="nm">Unfiled</span>
  <span class="mt"><b>${n}</b> meeting${n===1?'':'s'}</span></div>`;
/* the Folders panel header: a grid/list switch plus "New folder", and the
   body it switches between. Grid is the default. */
function folderPanel(tops,unf){
  const grid=S.folderView!=='list';
  const toggle=`<span class="viewseg">
    <span class="${grid?'on':''}" data-a="folderview" data-p="grid" title="Grid view">${ic('grid',13)}</span>
    <span class="${grid?'':'on'}" data-a="folderview" data-p="list" title="List view">${ic('list',13)}</span>
  </span>`;
  const action=`${toggle}<span data-a="newfolder" data-p="">${ic('folderplus',13)}New folder</span>`;
  const body=grid
    ?`<div class="fgridsm">${tops.map(folderCardSmall).join('')}${unf?unfiledCardSmall(unf):''}</div>`
    :`<div class="flist">${tops.map(folderRowHome).join('')}</div>${
        unf?`<div class="flist"><div class="frow unf" data-a="view" data-p="unfiled">
          <span class="fi">${ic('file',16)}</span>
          <span class="bd"><span class="nm">Unfiled</span>
            <span class="s">Could not be filed automatically</span></span>
          <span class="ct">${unf}</span>${ic('chev',14)}</div></div>`:''}`;
  return pnl('Folders',tops.length,action,body,!grid);
}
/* Grouped by day, because "Thursday" is how anyone reads a schedule. */
function upcomingList(n){
  const up=upcoming(n);
  if(!up.length)return `<div class="hint" style="padding:var(--s4) 2px">Nothing scheduled.
    Connect your calendar in Settings and AIT&#8209;Scribe will show what is coming
    and offer to take notes when each call starts.</div>`;
  let last='';
  return `<div class="uplist">${up.map(e=>{
    const head=e.iso!==last?`<div class="upday">${relDay(e.date)}</div>`:'';
    last=e.iso;
    const mins=Math.round((e.e-e.s)*60);
    return head+`<div class="uprow ${fcls(e.f)}" data-a="upcoming" data-p="${e.id}"
        title="${esc(e.title)} · ${clockLabel(e.s)}">
      <span class="tmc">${clockLabel(e.s)}<span>${mins} min</span></span>
      <span class="rule"></span>
      <span class="bd"><span class="t">${esc(e.title)}</span>
        <span class="s">${esc(e.who||'No attendees yet')} · ${esc(folderPath(e.f))}</span></span>
      <span class="go">${ic('chev',14)}</span></div>`;}).join('')}</div>`;
}
function viewHome(){
  const tops=topFolders(),unf=folderCount('');
  const recent=db.meetings.filter(m=>['Today','Yesterday'].includes(m.group)).slice(0,6);
  const setup=db.setupDone<3?setupCard():'';
  const done=db.setupDone>=3&&!db.dismissedOk?`<div class="notice ok" style="margin-bottom:var(--s6)">${ic('check',16)}
    <span><b>Setup complete.</b> Call detection is on — AIT-Scribe will offer to take notes when your next call starts.</span>
    <span class="act"><button class="btn t sm" data-a="dismissOk">Dismiss</button></span></div>`:'';
  if(!db.meetings.length&&!tops.length)return `<div class="body">${setup}
    <div class="empty" style="${setup?'justify-content:flex-start;padding-top:64px':''}">
      <span class="ico">${ic('cal',22,1.6)}</span>
      <h2>No meetings yet</h2>
      <p>Turn on call detection and AIT-Scribe will take the notes, work out which
        folder the call belongs in, and file it for you.</p>
      <div class="a"><button class="btn s sm" data-a="record">${ic('rec',15)}Record one now</button></div>
    </div></div>`;
  return `<div class="body">${setup}${done}
   <div class="homegrid">
    ${folderPanel(tops,unf)}
    <div class="homecol">
      ${pnl('Recent meetings',recent.length,
        `<span data-a="view" data-p="recent">See all ${ic('chev',12)}</span>`,
        recent.length?`<div class="list">${recent.map(m=>meetingRow(m)).join('')}</div>`
          :`<div class="hint" style="padding:var(--s4) 2px">Nothing recorded in the last two days.</div>`,
        true)}
      ${pnl('Upcoming',null,'',upcomingList(6),true)}
    </div></div></div>`;
}
/* ── a folder on the home screen ──────────────────────────────────────────
   Twelve top-level folders with eighty-odd children between them is a list,
   not a grid of cards: a card gives every folder the same weight and a screen
   of twelve identical cards is harder to scan than twelve rows. The row keeps
   the glyph and the colour, names its children, and counts what is inside. */
function folderRowHome(f){
  const ms=folderMeetings(f.id),kids=subFolders(f.id),
        ts=folderTasks(f.id),ws=fWatchOpen(f.id);
  return `<div class="frow ${fcls(f.id)}" data-a="view" data-p="f:${f.id}" title="${esc(f.name)}">
    <span class="fi">${ic(folderMeta(f.id).ic,17)}</span>
    <span class="bd"><span class="nm">${esc(f.name)}</span>
      <span class="s">${kids.length
        ?esc(kids.slice(0,4).map(k=>k.name).join(' · '))+(kids.length>4?` +${kids.length-4}`:'')
        :'No sub-folders yet'}</span></span>
    <span class="mt"><b>${ms.length}</b> meeting${ms.length===1?'':'s'}${
      ts.length?`<span class="sp2"></span><b>${ts.length}</b> task${ts.length===1?'':'s'}`:''}${
      ws.length?`<span class="sp2"></span><span class="wstat w-${
        hasConflict(ws)?'conflict':ws[0].type}"><i></i><b>${ws.length}</b></span>`:''}</span>
    ${ic('chev',14)}</div>`;
}

