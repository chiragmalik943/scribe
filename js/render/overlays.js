// Renders modals, menus, and other overlays. 

/* ══════════════════════════════════ overlays ══════════════════════════════════ */
function shareModal(){
  const m=meeting(S.share)||db.meetings[0];const sh=S.shareOpts;
  return `<div class="scrim" data-a="closeShare"></div>
  <div class="modal" style="width:536px;flex-direction:column">
    <div class="mtop" style="padding:22px 24px 18px">
      <span style="width:32px;height:32px;border-radius:var(--r2);background:var(--sunk);
        color:var(--sec);display:flex;align-items:center;justify-content:center;flex:0 0 auto;
        margin-top:2px">${ic('link',16)}</span>
      <span><h2 class="h">Share this meeting</h2><p>${esc(m.title)} · ${m.day}</p></span>
      <span class="x" data-a="closeShare" title="Close">${ic('x',15)}</span></div>
    <div class="mcont" style="gap:var(--s6);padding:var(--s5) var(--s6) var(--s6)">
      <div><div class="ghd" style="margin-bottom:9px">Who can open it</div>
        <div style="display:flex;flex-direction:column;gap:9px">
          <div class="opt ${sh.who==='link'?'on':''}" style="flex:none" data-a="sharewho" data-p="link">
            <span class="rdo ${sh.who==='link'?'on':''}"></span>
            <span><span class="t">Anyone with the link</span><span class="s">No account needed. Read only.</span></span></div>
          <div class="opt ${sh.who==='invite'?'on':''}" style="flex:none" data-a="sharewho" data-p="invite">
            <span class="rdo ${sh.who==='invite'?'on':''}"></span>
            <span><span class="t">Only people you invite</span>
              <span class="s">Requires an AIT-Scribe account — available on Team plans.</span></span></div></div></div>
      <div><div class="ghd" style="margin-bottom:9px">What the link includes</div>
        <div style="border:1px solid var(--line);border-radius:var(--r3)">
          <div class="srow" style="padding:12px 14px" data-a="shareinc" data-p="notes">
            <span class="cbx ${sh.notes?'on':''}">${ic('check',12,2.6)}</span>
            <span><span class="t">AI notes</span><span class="s">Summary, decisions and tasks.</span></span></div>
          <div class="srow" style="padding:12px 14px" data-a="shareinc" data-p="fups">
            <span class="cbx ${sh.fups?'on':''}">${ic('check',12,2.6)}</span>
            <span><span class="t">Tasks</span><span class="s">With owners and dates.</span></span></div>
          <div class="srow" style="padding:12px 14px" data-a="shareinc" data-p="tx">
            <span class="cbx ${sh.tx?'on':''}">${ic('check',12,2.6)}</span>
            <span><span class="t">Full transcript</span>
            <span class="s" style="color:var(--warnInk)">${ic('alert',12)} Everything that was said, word for word — including anything off-topic.</span></span></div>
        </div></div>
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
        <span class="ghd" style="margin:0">Link expires</span>
        <span style="display:flex;gap:7px;margin-left:auto">${['7 days','30 days','90 days','Never'].map(x=>
          `<span class="fchip ${sh.exp===x?'on':''}" data-a="shareexp" data-p="${x}">${x}</span>`).join('')}</span></div>
      ${sh.link?`<div class="notice ok">${ic('check',17)}
          <span style="min-width:0"><b>Link created.</b> <span style="font-family:monospace;font-size:12px">${sh.link}</span></span>
          <span class="act"><button class="btn s sm" data-a="copylink">${ic('copy',14)}Copy</button>
            <button class="btn t sm" data-a="revoke">Revoke</button></span></div>`
        :`<div style="display:flex;align-items:center;gap:12px;padding-top:4px;border-top:1px solid var(--line)">
          <span style="font-size:12.5px;color:var(--sec);line-height:1.45">Nothing is shared until you create
            the link. You can revoke it at any time.</span>
          <button class="btn p" style="margin-left:auto" data-a="createlink">${ic('link',15)}Create link</button></div>`}
    </div></div>`;
}
function addPersonModal(){
  const m=meeting(S.addPerson);if(!m)return '';
  return `<div class="scrim" data-a="closeperson"></div>
  <div class="modal" style="width:460px;flex-direction:column">
    <div class="mtop"><span style="width:32px;height:32px;border-radius:var(--r2);background:var(--sunk);
      color:var(--sec);display:flex;align-items:center;justify-content:center;flex:0 0 auto">${ic('userplus',18)}</span>
      <span><h2 class="h">Add someone to this meeting</h2><p>${esc(m.title)}</p></span>
      <span class="x" data-a="closeperson" title="Close">${ic('x',15)}</span></div>
    <div class="mcont" style="gap:14px">
      <div><div class="ghd" style="margin-bottom:7px">Name</div>
        <div class="inp"><input id="pname" placeholder="e.g. Rachel Levine" autofocus></div></div>
      <div><div class="ghd" style="margin-bottom:7px">Email <span class="n" style="text-transform:none;
        letter-spacing:0;font-weight:500">· optional</span></div>
        <div class="inp"><input id="pmail" placeholder="rachel@example.com"></div>
        <div class="hint" style="margin-top:7px">Only needed if you want to share the notes with them.
          Speaker labels in the transcript update either way.</div></div>
      <div style="display:flex;gap:9px;margin-top:4px">
        <button class="btn s" data-a="closeperson" style="flex:1;justify-content:center">Cancel</button>
        <button class="btn p" data-a="saveperson" data-p="${m.id}" style="flex:1;justify-content:center">Add person</button>
      </div></div></div>`;
}
function menuEl(){
  if(!S.menu)return '';
  const [kind,id]=S.menu.split(':');
  if(kind==='meeting')return `<div class="scrim" style="background:transparent" data-a="closemenu"></div>
   <div class="menu" style="right:16px;top:70px;width:264px">
    <a data-a="rename" data-p="${id}">${ic('edit',15)}Rename meeting<span class="k">⌘R</span></a>
    <a data-a="menu" data-p="folder:${id}">${ic('folder',15)}Move to folder…</a>
    <a data-a="regen" data-p="${id}">${ic('spark',15)}Regenerate AI notes</a><hr>
    <div class="mh">Export</div>
    <a data-a="copymd" data-p="${id}">${ic('copy',15)}Copy notes as Markdown</a>
    <a data-a="dlmd" data-p="${id}">${ic('md',15)}Download notes as .md</a>
    <a data-a="demo" data-p="save notes and transcript as a PDF">${ic('down',15)}Notes and transcript as PDF</a>
    <a data-a="demo" data-p="download the original audio">${ic('mic',15)}Download audio<span class="k">18.4 MB</span></a><hr>
    <a class="dg" data-a="confirmDelete" data-p="${id}">${ic('trash',15)}Delete meeting</a>
    <div class="fn">Goes to Recently deleted for 30 days. Audio is removed straight away.</div></div>`;
  if(kind==='folder'){const m=meeting(id);const pos=S.menuXY||{x:560,y:210};
   return `<div class="scrim" style="background:transparent" data-a="closemenu"></div>
   <div class="menu" style="left:${clampX(pos.x,220)}px;top:${clampY(pos.y,300)}px;width:220px">
    <div class="mh">Move to folder</div>
    ${topFolders().map(f=>[f,...subFolders(f.id)].map((x,i)=>
      `<a data-a="movefolder" data-p="${id}|${x.id}" ${i?'style="padding-left:26px"':''}>${
        ic('folder',15)}${esc(x.name)}
      ${m.folder===x.id?`<span class="k">${ic('check',13)}</span>`:''}</a>`).join('')).join('')}
    <hr><a data-a="newfolder" data-p="|${id}">${ic('folderplus',15)}Add Folder…</a></div>`;}
  if(kind==='fmenu'){const f=folder(id);if(!f)return '';const pos=S.menuXY||{x:300,y:240};
   const kids=subFolders(id);
   return `<div class="scrim" style="background:transparent" data-a="closemenu"></div>
   <div class="menu" style="left:${clampX(pos.x,246)}px;top:${clampY(pos.y,260)}px;width:246px">
    <div class="mh">${esc(folderPath(id))}</div>
    <a data-a="view" data-p="f:${id}">${ic('folder',15)}Open folder<span class="k">${folderCount(id)}</span></a>
    ${f.parent?'':`<a data-a="newfolder" data-p="${id}">${ic('folderplus',15)}${
      esc(addFolderLabel(id))}…</a>`}
    <a data-a="renamefolder" data-p="${id}">${ic('edit',15)}Rename…</a><hr>
    <a class="dg" data-a="delfolder" data-p="${id}">${ic('trash',15)}Delete folder</a>
    <div class="fn">${kids.length?`Its ${kids.length} sub-folder${kids.length>1?'s':''} go too. `:''}${
      folderCount(id)?`${folderCount(id)} meeting${folderCount(id)>1?'s':''} move to Unfiled — nothing is deleted.`
      :'Empty, so nothing moves.'}</div></div>`;}
  if(kind==='task'){const t=task(id);const pos=S.menuXY||{x:1000,y:300};
   return `<div class="scrim" style="background:transparent" data-a="closemenu"></div>
   <div class="menu" style="left:${clampX(pos.x,238)}px;top:${clampY(pos.y,430)}px;width:238px">
    <a data-a="toggletask" data-p="${id}">${ic('checkc',15)}${t.done?'Mark not done':'Mark done'}<span class="k">⌘⏎</span></a>
    <a data-a="opentask" data-p="${id}">${ic('edit',15)}Edit task</a>
    <div class="mh">Priority</div>
    ${[['hi','High'],['md','Medium'],['','None']].map(([k,l])=>
      `<a data-a="setpri" data-p="${id}|${k}">${ic('flag',15)}${l}${t.pri===k?`<span class="k">${ic('check',13)}</span>`:''}</a>`).join('')}
    <hr>
    <a data-a="open" data-p="${t.mid}">${ic('users',15)}Open ${esc(meeting(t.mid)?meeting(t.mid).title:'meeting')}</a>
    <a data-a="demo" data-p="play the moment this was said">${ic('play',15)}Play what was said</a>
    <a data-a="demo" data-p="copy a link to this task">${ic('link',15)}Copy link</a><hr>
    <a class="dg" data-a="deltask" data-p="${id}">${ic('trash',15)}Delete</a></div>`;}
  if(kind==='notifs')return `<div class="scrim" style="background:transparent" data-a="closemenu"></div>
   <div class="menu" style="right:70px;top:70px;width:300px"><div class="mh">Notifications</div>
    ${overdue().length?overdue().map(t=>`<a class="nrow" data-a="opentask" data-p="${t.id}">
      <span class="ic" style="color:var(--dangerInk)">${ic('alertc',15)}</span>
      <span class="bd"><span class="t">${esc(t.title)}</span><span class="d">${esc(t.due)}</span></span></a>`).join('')
      :`<div class="fn">Nothing needs you right now.</div>`}
    <hr><a data-a="settings" data-p="tasks">${ic('sliders',15)}Reminder settings</a></div>`;
  if(kind==='shortcuts')return `<div class="scrim" data-a="closemenu"></div>
   <div class="modal" style="width:460px;flex-direction:column">
    <div class="mtop"><span><h2 class="h">Keyboard shortcuts</h2><p>Demo reference</p></span>
      <span class="x" data-a="closemenu">${ic('x',15)}</span></div>
    <div class="mcont" style="gap:0">
      ${[['Hold '+db.settings.hotkey,'Dictate anywhere'],['⌘K','Search meetings'],['⌘N','New recording'],
         ['⌘⏎','Mark task done'],['⌘,','Settings'],['⌘R','Rename meeting'],['Esc','Close this']]
        .map(([k,l])=>`<div class="srow" style="padding:11px 2px"><span class="t">${l}</span>
          <span class="a"><span class="keycap">${k}</span></span></div>`).join('')}
    </div></div>`;
  if(kind==='people'){const m=meeting(id);if(!m)return '';const pos=S.menuXY||{x:300,y:200};
   return `<div class="scrim" style="background:transparent" data-a="closemenu"></div>
   <div class="menu" style="left:${clampX(pos.x,276)}px;top:${clampY(pos.y,340)}px;width:276px">
    <div class="mh">${m.people.length} attendee${m.people.length===1?'':'s'}</div>
    <div style="max-height:246px;overflow-y:auto">${m.people.map((x,i)=>{
      const me=x.n==='you';
      return `<div class="prow">
        <span class="av" style="background:${x.c}">${x.i}</span>
        <span class="nm">${esc(me?db.user.name:x.n)}${x.e?`<span>${esc(x.e)}</span>`
          :me?`<span>${esc(db.user.email||'you')}</span>`:'<span>No email</span>'}</span>
        ${me?`<span class="me">You</span>`
          :`<span class="rm" data-a="delperson" data-p="${id}|${i}" title="Remove ${esc(x.n)}">${ic('x',13)}</span>`}
      </div>`}).join('')}</div>
    <hr><a data-a="addperson" data-p="${id}">${ic('userplus',15)}Add person…</a>
    <div class="fn">Only people with an email can be sent the notes.</div></div>`;}
  if(kind==='fpeople'){const f=folder(id);if(!f)return '';const pos=S.menuXY||{x:300,y:200};
   const mem=folderMembers(id),n=folderMeetings(id).length;
   return `<div class="scrim" style="background:transparent" data-a="closemenu"></div>
   <div class="menu" style="left:${clampX(pos.x,276)}px;top:${clampY(pos.y,340)}px;width:276px">
    <div class="mh">${mem.length} member${mem.length===1?'':'s'}</div>
    <div style="max-height:246px;overflow-y:auto">${mem.map(x=>
      `<div class="prow"><span class="av" style="background:${x.c}">${x.i}</span>
        <span class="nm">${esc(x.n)}${x.e?`<span>${esc(x.e)}</span>`:'<span>No email</span>'}</span></div>`).join('')}</div>
    <hr><div class="fn">Rolled up from the ${n} call${n===1?'':'s'} filed in this project — not
      editable here, since no one is added to a project directly.</div></div>`;}
  if(kind==='bubmore'){const pos=S.menuXY||{x:FW()-280,y:FH()-320};const g=db.settings;
   return `<div class="scrim" style="background:transparent" data-a="closemenu"></div>
   <div class="menu" style="left:${clampX(pos.x,252)}px;top:${clampY(pos.y,300)}px;width:252px">
    <div class="mh">Engine</div>
    <a data-a="engine" data-p="local">${ic('chip',15)}On this Mac
      ${g.engine==='local'?`<span class="k">${ic('check',13)}</span>`:''}</a>
    <a data-a="engine" data-p="cloud">${ic('cloud',15)}In the cloud
      ${g.engine==='cloud'?`<span class="k">${ic('check',13)}</span>`:''}</a><hr>
    <a data-a="bubreset">${ic('reset',15)}Reset bubble position</a>
    <a data-a="settings" data-p="hotkey">${ic('sliders',15)}Bubble &amp; hotkey settings<span class="k">⌘,</span></a><hr>
    <a data-a="bubhide">${ic('x',15)}Hide the bubble</a>
    <div class="fn">Bring it back from Settings &rsaquo; Hotkey, or the demo page.</div></div>`;}
  if(kind==='wstatus'){const pos=S.menuXY||{x:FW()-300,y:260};
   return `<div class="scrim" style="background:transparent" data-a="closemenu"></div>
   <div class="menu" style="left:${clampX(pos.x,236)}px;top:${clampY(pos.y,200)}px;width:236px">
    <div class="mh">Status</div>
    <a data-a="wstat" data-p="${id}|open">${ic('alertc',15)}Open</a>
    <a data-a="wstat" data-p="${id}|resolved">${ic('check',15)}Resolved</a>
    <a data-a="wstat" data-p="${id}|dismissed">${ic('eyeoff',15)}Not an issue</a>
    <div class="fn">Dismissing tells the assistant not to raise this pairing again.</div></div>`;}
  if(kind==='wmenu'){const w=watchout(id);if(!w)return '';
   return `<div class="scrim" style="background:transparent" data-a="closemenu"></div>
   <div class="menu" style="right:16px;top:70px;width:256px">
    <a data-a="wtask" data-p="${id}">${ic('list',15)}Turn into a task</a>
    <a data-a="wcopy" data-p="${id}">${ic('copy',15)}Copy the suggested wording</a>
    <a data-a="jump" data-p="${w.now.at}">${ic('play',15)}Jump to ${w.now.at}</a>
    ${w.ref.mid&&w.ref.mid!==w.mid?`<a data-a="open" data-p="${w.ref.mid}">${
      ic('users',15)}Open ${esc(w.ref.mt)}</a>`:''}<hr>
    <a data-a="wresolve" data-p="${id}">${ic('check',15)}Mark resolved</a>
    <a data-a="wdismiss" data-p="${id}">${ic('eyeoff',15)}Not an issue</a><hr>
    <a data-a="settings" data-p="ainotes">${ic('sliders',15)}What the assistant looks for</a></div>`;}
  if(kind==='infodlg')return `<div class="scrim" data-a="closemenu"></div>
   <div class="modal" style="width:412px;flex-direction:column">
    <div class="mtop"><span style="width:32px;height:32px;border-radius:var(--r2);background:var(--infoTint);
      color:var(--info);display:flex;align-items:center;justify-content:center;flex:0 0 auto">${ic('info',18)}</span>
      <span><h2 class="h">Screen Recording is needed</h2><p>macOS permission</p></span></div>
    <div class="mcont"><div style="font-size:13.5px;line-height:1.6;color:var(--ink2)">
      AIT-Scribe uses this permission to <b>see call windows</b> — to notice that a Zoom or Meet call
      has started. It does not record your screen unless you turn that on separately.</div>
      <div style="display:flex;gap:9px;margin-top:6px">
        <button class="btn s" data-a="closemenu" style="flex:1;justify-content:center">Not now</button>
        <button class="btn p" data-a="demo" data-p="open macOS System Settings" style="flex:1;justify-content:center">
          Open System Settings</button></div></div></div>`;
  if(kind==='dangerdlg')return `<div class="scrim" data-a="closemenu"></div>
   <div class="modal" style="width:436px;flex-direction:column">
    <div class="mtop"><span style="width:32px;height:32px;border-radius:var(--r2);background:var(--dangerTint);
      color:var(--dangerInk);display:flex;align-items:center;justify-content:center;flex:0 0 auto">${ic('alertc',18)}</span>
      <span><h2 class="h">Delete all local data?</h2><p>18 meetings · 48 transcripts · 2.1 GB</p></span></div>
    <div class="mcont"><div style="font-size:13.5px;line-height:1.6;color:var(--ink2)">
      Every recording, transcript, note and task is removed from this Mac. There is no copy anywhere
      else, so this <b>cannot be undone</b>.</div>
      <div><div class="ghd" style="margin-bottom:8px">Type DELETE to confirm</div>
        <span class="inp"><input placeholder="DELETE" data-a="noop"></span></div>
      <div style="display:flex;gap:9px;margin-top:2px">
        <button class="btn s" data-a="closemenu" style="flex:1;justify-content:center">Cancel</button>
        <button class="btn d dis" data-a="demo" data-p="erase everything once DELETE is typed"
          style="flex:1;justify-content:center">Delete everything</button></div></div></div>`;
  if(kind==='progressdlg')return `<div class="scrim" data-a="closemenu"></div>
   <div class="modal" style="width:400px;flex-direction:column">
    <div class="mtop"><span style="width:32px;height:32px;border-radius:var(--r2);background:var(--sunk);
      color:var(--sec);display:flex;align-items:center;justify-content:center;flex:0 0 auto">${ic('spark',18)}</span>
      <span><h2 class="h">Generating notes…</h2><p>Acme kickoff · 34:02</p></span></div>
    <div class="mcont"><div style="font-size:13.5px;line-height:1.6;color:var(--sec)">
      Reading your notes and the transcript together. You can close this — it carries on in the
      background and notifies you when it is done.</div>
      <div>${meterBars(60,true,7)}</div>
      <div style="display:flex;gap:9px">
        <button class="btn s" data-a="closemenu" style="flex:1;justify-content:center">Close</button>
        <button class="btn s" data-a="closemenu" style="flex:1;justify-content:center;
          color:var(--dangerInk);border-color:var(--dangerLine)">Cancel</button></div></div></div>`;
  if(kind==='crumbmenu'){
   /* reads the same crumbData() the top bar itself just built from, so the
      dropdown can never list a folder the trail does not agree it passed
      through */
   const d=crumbData();if(!d||!d.mids.length)return '';const pos=S.menuXY||{x:100,y:60};
   return `<div class="scrim" style="background:transparent" data-a="closemenu"></div>
   <div class="menu" style="left:${clampX(pos.x,224)}px;top:${clampY(pos.y,200)}px;width:224px">
    <div class="mh">In between</div>
    ${d.mids.map(m=>`<a data-a="view" data-p="${esc(m.par)}">${ic('folder',15)}${esc(m.label)}</a>`).join('')}</div>`;}
  if(kind==='confirm'){const m=meeting(id);
   return `<div class="scrim" data-a="closemenu"></div>
   <div class="modal" style="width:400px;flex-direction:column">
    <div class="mtop"><span style="width:32px;height:32px;border-radius:var(--r2);background:var(--dangerTint);
      color:var(--dangerInk);display:flex;align-items:center;justify-content:center;flex:0 0 auto">${ic('trash',18)}</span>
      <span><h2 class="h">Delete this meeting?</h2><p>${esc(m?m.title:'')}</p></span></div>
    <div class="mcont"><div style="font-size:13.5px;line-height:1.6;color:var(--ink2)">
      The notes, transcript and ${db.tasks.filter(t=>t.mid===id).length} task(s) go to
      <b>Recently deleted</b> for 30 days. The audio is removed straight away and cannot be recovered.</div>
      <div style="display:flex;gap:9px;margin-top:6px">
        <button class="btn s" data-a="closemenu" style="flex:1;justify-content:center">Keep it</button>
        <button class="btn d" data-a="delmeeting" data-p="${id}" style="flex:1;justify-content:center">Delete meeting</button>
      </div></div></div>`;}
  return '';
}
function taskPanel(){
  const t=task(S.tid);if(!t)return '';const m=meeting(t.mid);
  return `<div class="panel"><div class="ph">${ic('list',17)}<b>Task</b>
    <span style="margin-left:auto;display:flex;gap:4px">
      <span class="tbtn" data-a="menu" data-p="task:${t.id}" title="Task options">${ic('dots',17)}</span>
      <span class="tbtn" data-a="closepanel" title="Close">${ic('x',17)}</span></span></div>
   <div class="pb2">
    <div><div style="font-family:var(--f-head);font-size:16px;font-weight:600;line-height:1.4"
        contenteditable="true">${esc(t.title)}</div>
      <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap">
        ${t.pri?`<span class="pri ${t.pri}">${ic('flag',12)}${t.pri==='hi'?'High':'Medium'}</span>`:''}
        ${t.done?`<span class="pri ok">${ic('check',12)}Done</span>`
          :t.late?`<span class="pri hi">${t.due}</span>`:`<span class="pri">${t.due}</span>`}</div></div>
    <div style="display:flex;flex-direction:column;gap:12px">
      <div class="frow"><span class="lb">Status</span>
        <span class="sel" data-a="toggletask" data-p="${t.id}">${ic('list',14)}${t.done?'Done':'Open'} ${ic('chevd',12)}</span></div>
      <div class="frow"><span class="lb">Due</span>
        <span class="sel" data-a="demo" data-p="open a date picker">${ic('cal',14)}${t.due} ${ic('chevd',12)}</span></div>
      <div class="frow"><span class="lb">Owner</span>
        <span class="sel" data-a="demo" data-p="reassign this task">
          <span class="avat" style="width:20px;height:20px;font-size:10px">${db.user.initial}</span>You ${ic('chevd',12)}</span></div>
      <div class="frow"><span class="lb">Priority</span>
        <span class="sel" data-a="cyclepri" data-p="${t.id}">${ic('flag',14)}${
          t.pri==='hi'?'High':t.pri==='md'?'Medium':'None'} ${ic('chevd',12)}</span></div></div>
    ${t.quote?`<div style="border-top:1px solid var(--line);padding-top:16px">
      <div class="ghd" style="margin-bottom:10px">Where this came from</div>
      <div class="quote">“${esc(t.quote)}”</div>
      <div style="display:flex;align-items:center;gap:10px;margin-top:12px;flex-wrap:wrap">
        <button class="btn s sm" data-a="demo" data-p="play the audio from ${t.at}">${ic('play',14)}Play ${t.at}</button>
        <button class="btn s sm" data-a="open" data-p="${t.mid}">${ic('users',14)}Open ${esc(m?m.title:'meeting')}</button>
        <span style="font-size:12px;color:var(--sec);margin-left:auto">${esc(t.who||'')}</span></div></div>`:''}
    <div style="border-top:1px solid var(--line);padding-top:16px">
      <div class="ghd" style="margin-bottom:10px">Notes</div>
      <div class="inp" style="min-height:70px;align-items:flex-start">
        <input placeholder="Add a note for yourself…" data-a="noop"></div></div>
   </div></div>`;
}

