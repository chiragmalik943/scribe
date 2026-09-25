// Renders the folder detail view. 

/* ══════════════════════════════════ folder detail ══════════════════════════════════ */
/* One row per meeting, shared by the folder page and the Unfiled page. `showFolder`
   forces the move-to-folder control visible, which is the whole point of Unfiled. */
/* `people` swaps the sub-line from a count to the names, which is what the
   flat meeting list wants and a folder page does not. The folder tag carries
   one coloured dot — enough to group a list of calls by eye without printing
   four accent colours of type, which is what the last pass took out. */
function meetingRow(m,showFolder,people){
  const live=S.rec&&S.rec.mid===m.id;
  return `<div class="mrow" data-a="open" data-p="${m.id}">
    <span><span class="t">${esc(m.title)}${live?'':mwDot(m.id)}</span>
      <span class="s">${people?peopleLine(m):m.people.length+' attendee'+
        (m.people.length===1?'':'s')} · ${live?'recording now':m.dur}</span></span>
    ${live?'':`<span class="macts" ${showFolder?'style="opacity:1;pointer-events:auto"':''}>
      <span data-a="menu" data-p="folder:${m.id}" title="Move to folder">${ic('folder',14)}</span>
      <span data-a="share" data-p="${m.id}" title="Share">${ic('share',14)}</span>
      <span class="dg" data-a="confirmDelete" data-p="${m.id}" title="Delete">${ic('trash',14)}</span></span>`}
    <span class="rt">${live?`<span class="live">${ic('rec',12)}Recording</span>`:
      `<span class="tg ${m.folder?fcls(m.folder):''}">${m.folder?'<i></i>':''}${
         esc(folderPath(m.folder))}</span>
       <span class="mt">${m.time} · ${taskCount(m.id)} task${taskCount(m.id)===1?'':'s'}</span>`}</span></div>`;
}
function mwDot(id){
  const w=mWatchOpen(id);if(!w.length)return '';
  const t=hasConflict(w)?'conflict':w[0].type;
  return `<span class="wdot w-${t}" title="${w.length} watchout${w.length>1?'s':''}">${
    ic('radar',11)}${w.length}</span>`;
}
function viewFolder(){
  const id=S.fid,unfiled=id==='';
  const f=folder(id);
  if(!unfiled&&!f)return `<div class="body"><div class="empty"><h2>Folder not found</h2>
    <p>It may have been deleted.</p>
    <div class="a"><button class="btn s sm" data-a="go" data-p="meetings">Meetings home</button></div></div></div>`;
  const kids=unfiled?[]:subFolders(id);
  const isTop=!unfiled&&!f.parent;
  const all=folderMeetings(id);
  const tasks=folderTasks(id);

  /* A top-level folder is a category — Client Calls, Projects — not a place
     calls are filed directly, so it carries no analytics of its own: just its
     name and the sub-folders inside it. The count beside its name says how
     many of those there are rather than a meeting/task tally that would
     always read "0 meetings" here. A project (a sub-folder) gets the same
     four facts a meeting's own header carries — who, filed where, and the
     two tallies — reusing .metarow so the layout is identical, not just
     similar, to the attendee row on a meeting. */
  const mem=(unfiled||isTop)?[]:folderMembers(id);
  const fs=unfiled?'<span>Not in a folder yet</span>'
    :isTop?`<span><b>${kids.length}</b> folder${kids.length===1?'':'s'}</span>`
    :`<span class="mi"><b>${all.length}</b> meeting${all.length===1?'':'s'}</span>${
        tasks.length?`<span class="sp"></span><span class="mi"><b>${tasks.length}</b> open task${
          tasks.length===1?'':'s'}</span>`:''}${
        mem.length?`<span class="sp"></span><span class="mi people" data-a="menu" data-p="fpeople:${id}"
          title="Members">${faces(mem,5)}<span><b>${mem.length}</b> member${mem.length===1?'':'s'}</span>${
          ic('chevd',11)}</span>`:''}
      <span class="sp"></span>
      <span class="mi fchipx ${fcls(f.parent)}" data-a="view" data-p="f:${f.parent}" title="Category">
        <i class="fd"></i>${esc(folderName(f.parent))}</span>`;

  const head=`<div class="fhead">
    <span class="fi ${unfiled?'':'fw '+fcls(id)}">${
      ic(unfiled?'file':folderMeta(id).ic,21)}</span>
    <span class="ft"><h1 class="h" ${unfiled?'':`data-a="renamefolder" data-p="${id}" style="cursor:text"`}>${
        esc(unfiled?'Unfiled':f.name)}${unfiled?'':`<span class="edit">${ic('edit',15)}</span>`}</h1>
      <span class="fs metarow">${fs}</span></span>
    <span class="fa">
      ${unfiled?'':`<button class="btn q sm ico" data-a="menu" data-p="fmenu:${id}"
        title="Folder options">${ic('dots',15)}</button>`}
    </span></div>`;

  /* Unfiled is the one page whose job is to get meetings out of it */
  if(unfiled){
    return `<div class="body">${head}
      <div class="notice quiet" style="margin-bottom:var(--s6)">${ic('info',15)}
        <span>AIT&#8209;Scribe could not tell where these belonged. Use ${ic('folder',13)} on a row
        to file one — you can create a folder from the same menu.</span></div>
      ${all.length?`<div class="list">${all.map(m=>meetingRow(m,true)).join('')}</div>`
        :`<div class="empty" style="padding-bottom:60px"><span class="ico">${ic('check',22,1.6)}</span>
          <h2>Everything is filed</h2><p>Nothing is waiting for a folder.</p></div>`}</div>`;
  }

  /* A top-level folder is pure navigation — its name and what's inside it,
     nothing rolled up or synthesised, because nothing is filed here directly. */
  if(isTop){
    const cards=`<div class="ghd">Folders <span class="n">· ${kids.length}</span>
        <span class="go" data-a="newfolder" data-p="${id}" style="margin-left:auto"
          title="${esc(addFolderLabel(id))}">${ic('folderplus',13)}New folder</span></div>
      <div class="fgrid">${kids.map(folderCard).join('')}</div>`;
    return `<div class="body">${head}${cards}</div>`;
  }

  /* A sub-folder leads with the notes rolled up across the calls filed in it,
     in the same two-column shape a meeting's own notes use: a wide reading
     column — the brief, decisions, open questions — beside a narrow one for
     what's actionable right now — open tasks, then the meetings themselves. */
  const band=watchBand(id);
  const cols=dcols(id);

  return `<div class="body${S.mpanel?'':' docked'}">${head}${band}${cols}
    ${S.mpanel?'':askDock('Ask anything about '+(f?f.name:'this project')+'…',true)}</div>`;
}
/* The wide column: the project's own brief (its "summary" — see folderBrief's
   comment on why that's four short sections rather than one paragraph),
   then decisions and open questions rolled up from every call filed here,
   each still carrying a link back to the call it came from. */
function dcolMain(id){
  const dec=folderLines(id,'decisions'),qs=folderLines(id,'questions');
  const src=l=>`<span class="from" data-a="open" data-p="${l.mid}" title="${
    esc(l.mt)} · ${l.at}">${esc(l.mt.length>22?l.mt.slice(0,21)+'…':l.mt)} &rsaquo;</span>`;
  const recRow=l=>`<li><span>${esc(l.tx)}</span>${src(l)}</li>`;
  return `<div class="dmain">${briefBlock(id)}
    ${secBlock({key:'roll:'+id+':dec',title:'Decisions',rows:dec.map(recRow),tag:'bul',hideIfEmpty:true})}
    ${secBlock({key:'roll:'+id+':q',title:'Open questions',rows:qs.map(recRow),tag:'bul',hideIfEmpty:true})}
    </div>`;
}
/* The narrow column: what's still open from this project, and the calls it's
   built from. Both are capped lists that already know how to become "View
   all N" — see capList()/secBlock() — so a project with forty calls in it
   degrades the same way a meeting with forty decisions does. */
function dcolSide(id){
  const tasks=folderTasks(id),all=folderMeetings(id);
  const {shown:mrows,more:mmore}=capList('folder:'+id+':meetings',all.map(m=>meetingRow(m)),6);
  return `<div class="dside">
    ${pnl('Open tasks',tasks.length,
      tasks.length?`<span data-a="go" data-p="tasks">View all ${ic('chev',12)}</span>`:'',
      tasks.length?`<div class="list">${tasks.map(t=>taskRow(t,true)).join('')}</div>`
        :cardEmpty('checkc','Nothing open from this project.'),true)}
    ${pnl('Meetings',`${all.length} here`,'',
      all.length?`<div class="list">${mrows.join('')}</div>${mmore}`
        :cardEmpty('users','Nothing filed here yet.'),true)}
    </div>`;
}
const dcols=id=>`<div class="dcols">${dcolMain(id)}${dcolSide(id)}</div>`;
/* Watchouts across every call filed in a project. This is the view where they
   earn their place: a conflict between two meetings is invisible from inside
   either one of them. Capped at three so the band stays a heading with
   evidence rather than a second list. */
function watchBand(id,limit){
  const open=fWatchOpen(id);if(!open.length)return '';
  const hot=hasConflict(open),shown=open.slice(0,limit||3),rest=open.length-shown.length;
  return `<div class="wband ${hot?'hot':''}">
    <div class="bh"><span class="bi">${ic('radar',15)}</span>
      <span><b>Watchouts</b>
        <span class="s">Read across ${folderMeetings(id).length} call${
          folderMeetings(id).length===1?'':'s'} in this project</span></span>
      <span class="r">${wCounts(open).map(([t,n])=>`<span class="wstat w-${t}"><i></i><b>${n}</b> ${
        n===1?WT[t].label.toLowerCase():WT[t].plural.toLowerCase()}</span>`).join('')}</span></div>
    ${shown.map(w=>watchRow(w,true)).join('')}
    ${rest?`<div class="bf"><span>${rest} more open in this project.</span>
      <span style="margin-left:auto"><span class="link" data-a="open" data-p="${
        open[shown.length].mid}">Open the next one ${ic('chev',12)}</span></span></div>`
      :`<div class="bf">${ic('info',13)}<span>Each one is a pair — what was said in the call, and what
        it collides with. Open one to see both sides.</span></div>`}</div>`;
}
/* ── the brief ────────────────────────────────────────────────────────────
   Four questions a reader arrives with, answered in the order they arrive in:
   where things stand, who is carrying which piece, what is going wrong, what
   would fix it. "Where things stand" is the lead paragraph and reads as prose;
   the other three are lists, because they are lists. */
function briefBlock(id){
  const b=folderBrief(id);
  if(!b)return `<p class="flead">${esc(folderSummary(id))}</p>`;
  const list=(items,cls)=>`<ul class="blist ${cls||''}">${
    items.map(x=>`<li><i></i><span>${esc(x)}</span></li>`).join('')}</ul>`;
  const standParas=String(b.stand||'').split(/\n{2,}/).map(p=>p.trim()).filter(Boolean);
  return `<div class="brief">
    <div class="bsec lead"><h4>Where things stand</h4>
      ${standParas.map(p=>`<p class="flead">${esc(p)}</p>`).join('')}</div>
    <div class="bgrid">
      <div class="bsec"><h4>Who's doing what</h4>
        <ul class="blist who">${b.who.map(([n,w])=>{
          const p=personChipLite(n);
          return `<li><i class="av" style="background:${p.c}">${p.i}</i>
            <span><b>${esc(n)}</b>${esc(w)}</span></li>`;}).join('')}</ul></div>
      <div class="bsec"><h4>What's not working</h4>${list(b.broken,'bad')}</div>
      <div class="bsec"><h4>Recommended fixes</h4>${list(b.fixes,'fix')}</div>
    </div></div>`;
}
/* the same face a person carries everywhere else, without needing a meeting */
function personChipLite(name){
  const idx={};db.meetings.forEach(m=>m.people.forEach(x=>{if(!idx[x.n])idx[x.n]=x;}));
  if(idx[name])return idx[name];
  const keys=Object.keys(AV);let h=0;
  for(let i=0;i<name.length;i++)h=(h*31+name.charCodeAt(i))>>>0;
  return {n:name,i:name.trim().charAt(0).toUpperCase(),c:AV[keys[h%keys.length]]};
}

