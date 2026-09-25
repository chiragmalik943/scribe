// Renders the list column (sidebar 2) contents. 

/* ══════════════════════════════════ list columns ══════════════════════════════════ */
/* A folder row and, when expanded, its sub-folder rows beneath it. The twisty
   and the ⋯ button are nested hit targets: the click handler walks up from the
   event target with closest('[data-a]'), so the innermost one wins and the row
   itself only navigates when neither was hit. */
function folderRow(f,sub){
  const kids=sub?[]:subFolders(f.id);
  const open=!!S.openF[f.id];
  const tw=kids.length
    ? `<span class="tw ${open?'o':''}" data-a="foldtoggle" data-p="${f.id}"
        title="${open?'Collapse':'Expand'}">${ic('chev',11,2.4)}</span>`
    : (sub?'':`<span class="tw sp"></span>`);
  return `<a class="fdr ${fcls(f.id)} ${S.view==='f:'+f.id?'on':''}${sub?' sub':''}"
     data-a="view" data-p="f:${f.id}"
     title="${esc(sub?folderPath(f.id):f.name)}">${tw}${ic(sub?'folder':ficon(f.id),sub?15:16)}
    <span class="lbl">${esc(f.name)}</span>
    <span class="fm" data-a="menu" data-p="fmenu:${f.id}" title="Folder options">${ic('dots',14)}</span>
    ${cnt(folderCount(f.id))}</a>`;
}
function folderRows(f){
  const kids=subFolders(f.id);
  if(!kids.length||!S.openF[f.id])return folderRow(f,false);
  return folderRow(f,false)+kids.map(k=>folderRow(k,true)).join('');
}
function listMeetings(){
  const all=db.meetings.length;
  return `<div class="listcol">
   <div class="srch" data-a="expandlist" title="Search meetings and transcripts">${ic('search',15)}<input placeholder="Search meetings and transcripts" data-a="q" value="${esc(S.q)}"></div>
   <div class="lbody">
    <div class="views">
     ${v(false,'grid','Meetings home','','go','meetings')}
     ${v(S.view==='all'||S.view==='recent','list','All meetings',cnt(all),'view','all')}
    </div>
    ${db.meetings.length?`<div class="slabel">Folders</div>
    <div class="views">
     ${topFolders().map(f=>folderRows(f)).join('')}
     ${folderCount('')?v(S.view==='unfiled','folder','Unfiled',
        cnt(folderCount('')),'view','unfiled'):''}
     <a data-a="newfolder" data-p="" style="color:var(--ter)" title="Create a new folder">${
        ic('folderplus',16)}<span class="lbl">New folder</span></a>
    </div>`:`<div class="note">Folders appear here once AIT&#8209;Scribe files your first call.</div>`}
    </div></div>`;
}
/* Speech to Text has two sections, not five. Transcripts and Vocabulary are
   different bodies of content and belong in the column; Today / This week /
   All transcripts are a *range over one of them* and belong above the list
   they filter, which is where they are now. */
function listSpeechNav(){
  const voc=S.route==='vocabulary';
  return `<div class="listcol">
   <div class="srch" data-a="expandlist" title="${voc?'Search vocabulary':'Search transcripts'}">${
      ic('search',15)}<input placeholder="${voc?'Search terms':'Search transcripts'}"
      data-a="${voc?'vq':'q'}" value="${esc(voc?S.vq:S.q)}"></div>
   <div class="lbody"><div class="views">
     ${v(S.route==='speech','wave2','Transcripts',cnt(db.transcripts.length),'go','speech')}
     ${v(voc,'book','Vocabulary',cnt(db.vocab.length),'go','vocabulary')}
   </div><div class="note">${voc
     ?'Terms apply to dictation and meeting transcripts alike.'
     :'Transcripts stay on this Mac until you delete them.'}</div></div></div>`;
}
function listTasks(){
  const o=openTasks().length,od=overdue().length,
        up=db.tasks.filter(t=>!t.done&&t.grp==='Upcoming').length,
        dn=db.tasks.filter(t=>t.done).length+(db.meetings.length?23:0);
  const byM=db.meetings.filter(m=>db.tasks.some(t=>t.mid===m.id&&!t.done)).slice(0,4);
  return `<div class="listcol"><div class="lbody" style="padding-top:20px">
   <div class="views">
    ${v(S.view==='all','list','All tasks',cnt(o),'view','all')}
    ${v(S.view==='overdue','alertc','Overdue',od?pill(od):cnt(0),'view','overdue')}
    ${v(S.view==='upcoming','clock','Upcoming',cnt(up),'view','upcoming')}
    ${v(S.view==='done','checkc','Completed',cnt(dn),'view','done')}
   </div>
   <div class="slabel">By meeting</div>
   <div class="views">${byM.map(m=>v(S.view==='m:'+m.id,'users',m.title,
      cnt(db.tasks.filter(t=>t.mid===m.id&&!t.done).length),'view','m:'+m.id)).join('')}</div>
  </div></div>`;
}
function listConvos(){
  const rows=db.convos.length?db.convos.map(c=>`<div class="convrow ${S.cid===c.id?'on':''}" data-a="convo" data-p="${c.id}">
      <span class="t">${esc(c.title)}</span><span class="d">${c.when}</span></div>`).join('')
    :`<div class="emptylist"><b>No conversations yet</b>Your chats appear here once you send a message.</div>`;
  return `<div class="listcol"><div class="lhead"><b>Conversations</b>
    <span class="act" data-a="newchat" style="cursor:pointer" title="New conversation">${
      ic('plus',15)}<span class="lbl">New</span></span></div>
    <div class="lbody">${rows}</div></div>`;
}

