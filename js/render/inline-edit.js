// Inline editing: renaming in place, and naming a new folder where its card will sit.

/* ══════════════════════════════════ inline editing ══════════════════════════════════ */
/* Nothing in AIT-Scribe opens a browser prompt to ask for a name. The text that
   is already on screen turns into a text field instead, in the same place and
   at the same size, and turns back into text when the edit ends.

     Enter or clicking away   keep what was typed
     Esc                      put the old name back

   `S.edit` says what is being edited and WHERE ON THE PAGE. The same folder can
   be named by a page heading, a card or a sidebar row, and only one of them may
   become a field, so each place passes its own `surf` and `ename()` renders the
   field only where the two agree. Everything else keeps rendering plain text.

   Because render() replaces #app wholesale, the field's value and caret are
   parked on S.edit just before the replacement and put back just after, so a
   recording tick or a toast cannot take the name out from under the typist. */
let EDLOCK=false,EDUSED=false,EDDIRTY=false;
const isEd=(kind,id,surf)=>!!S.edit&&S.edit.kind===kind&&S.edit.id===id&&S.edit.surf===surf;
const ED_PH={folder:'Folder name',meeting:'Meeting title',newfolder:'Folder name',name:'A name'};

/* The field itself. `text` is what the label said a moment ago. */
function edField(kind,id,text,cls){
  EDUSED=true;
  const v=S.edit.val!=null?S.edit.val:text;
  return `<input class="ied ${cls||''}" data-ied="${kind}" value="${esc(v)}" maxlength="80"
    placeholder="${ED_PH[kind]||''}" spellcheck="false" autocomplete="off"
    aria-label="${ED_PH[kind]||'Name'}">`;
}
/* The text, or — if this is the place being edited — the field. */
function ename(kind,id,surf,text,cls){
  if(!EDUSED&&isEd(kind,id,surf))return edField(kind,id,text,cls);
  return `<span class="en" data-surf="${surf}:${kind}:${esc(id)}">${esc(text)}</span>`;
}
/* the click target that starts the edit goes away while it is happening */
const edAct=(kind,id,surf,act)=>isEd(kind,id,surf)&&!EDUSED?'':`data-a="${act}" data-p="${esc(id)}"`;

/* ── the temporary card for a folder that does not exist yet ───────────────
   It sits exactly where the finished card will, wearing the colour it will
   have, so naming it feels like filling in a card rather than answering a
   question. `edNewHere` says whether a given place is the one that should show
   it; `newFolderTemp` draws it in that place's own shape. */
const edNewHere=(surf,parent)=>!!S.edit&&S.edit.kind==='newfolder'&&!EDUSED&&
  S.edit.surf===surf&&(S.edit.id||'')===(parent||'');
function newFolderTemp(surf,parent){
  const c=parent?fcls(parent):'fc-1',fld=edField('newfolder',parent||'','','newin');
  const well=px=>`<span class="fwell ${c}" style="width:${px}px;height:${px}px">${ic('folderplus',Math.round(px*.5))}</span>`;
  if(surf==='card')return `<div class="fcd ${c} tmp"><div class="top">${well(36)}
      <span class="nm">${fld}</span></div>
      <div class="ds">Name it, then press Enter. Esc cancels.</div></div>`;
  if(surf==='small')return `<div class="fcdsm ${c} tmp"><div class="top">${well(30)}</div>
      <span class="nm">${fld}</span>
      <span class="mt">Enter to create · Esc to cancel</span></div>`;
  if(surf==='frow')return `<div class="frow ${c} tmp"><span class="fi">${ic('folderplus',17)}</span>
      <span class="bd"><span class="nm">${fld}</span>
        <span class="s">Enter to create · Esc to cancel</span></span></div>`;
  if(surf==='row')return `<a class="fdr ${c}${parent?' sub':''} tmp">${parent?'':'<span class="tw sp"></span>'}${
      ic(parent?'folder':'folderplus',parent?15:16)}<span class="lbl">${fld}</span></a>`;
  return `<div class="medit">${ic('folderplus',15)}${fld}</div>`;     /* menu */
}

/* ── beginning an edit ──────────────────────────────────────────────────── */
function editStart(kind,id,surf,extra){
  S.edit=Object.assign({kind,id,surf,val:null,sel:null,fresh:true},extra||{});
  S.menu=extra&&extra.keepMenu?S.menu:null;
  render();
}
const hasEl=sel=>!!document.querySelector(sel);
function edSurfFolder(id){
  if(S.route==='folder'&&S.fid===id)return 'h1';
  if(hasEl(`[data-surf="card:folder:${id}"]`))return 'card';
  if(hasEl(`[data-surf="row:folder:${id}"]`))return 'row';
  /* not on screen anywhere: go to the folder, whose heading is always there */
  S.route='folder';S.fid=id;S.view='f:'+id;S.mid=null;S.mpanel=false;
  return 'h1';
}
function edSurfMeeting(id){
  if(S.route==='meeting'&&S.mid===id)return 'h1';
  if(hasEl(`[data-surf="row:meeting:${id}"]`))return 'row';
  S.route='meeting';S.mid=id;S.tab='notes';S.mpanel=false;
  return 'h1';
}
function renameFolder(id){
  if(!folder(id))return;
  editStart('folder',id,edSurfFolder(id));
}
function renameMeeting(id){
  if(!meeting(id))return;
  editStart('meeting',id,edSurfMeeting(id));
}
/* Where does the new folder's card go? Into the grid, sidebar or menu the user
   was looking at when they asked for it. `parent` is '' for a top-level folder;
   `moveMid` is set when it was asked for from a move-to-folder menu, which then
   keeps the field inside the menu. */
function edNewSurf(parent,moveMid,el){
  if(moveMid)return 'menu';
  if(el&&el.closest&&el.closest('.listcol'))return 'row';
  if(S.route==='meetings')return S.folderView==='list'?'frow':'small';
  if(S.route==='folder'&&parent&&S.fid===parent)return 'card';
  if(el&&el.closest&&el.closest('.fgrid'))return 'card';
  if(parent&&hasEl('.listcol')){return 'row';}
  if(parent){S.route='folder';S.fid=parent;S.view='f:'+parent;S.mid=null;S.mpanel=false;return 'card';}
  S.route='meetings';return S.folderView==='list'?'frow':'small';
}
function newFolderStart(p,el){
  let parent=p,moveMid='';
  if(p.indexOf('|')>=0){[parent,moveMid]=p.split('|');}
  const surf=edNewSurf(parent,moveMid,el);
  if(parent)S.openF[parent]=true;
  editStart('newfolder',parent||'',surf,{moveMid,keepMenu:surf==='menu'});
}
function addNameStart(){editStart('name','','chip');}

/* ── ending one ─────────────────────────────────────────────────────────── */
const sameName=(a,b)=>a.trim().toLowerCase()===b.trim().toLowerCase();
/* Returns false when the name cannot be kept, in which case the field stays. */
function edApply(ed,val){
  if(ed.kind==='folder'){
    const f=folder(ed.id);if(!f||!val||val===f.name)return true;
    if(db.folders.some(x=>x.id!==f.id&&(x.parent||'')===(f.parent||'')&&sameName(x.name,val))){
      toast(`A folder called <b>${esc(val)}</b> is already there.`,3000,'warn');return false;}
    f.name=val;toast('Folder renamed.');return true;}
  if(ed.kind==='meeting'){
    const m=meeting(ed.id);if(!m||!val||val===m.title)return true;
    m.title=val;toast('Renamed.');return true;}
  if(ed.kind==='newfolder'){
    if(!val)return true;
    const parent=ed.id;
    if(db.folders.some(f=>(f.parent||'')===(parent||'')&&sameName(f.name,val))){
      toast(`A folder called <b>${esc(val)}</b> is already there.`,3000,'warn');return false;}
    const id=newFolderId();const f={id,name:val};if(parent)f.parent=parent;
    /* keep sub-folders grouped directly under their parent in the list */
    if(parent){const last=db.folders.map(x=>x.id).lastIndexOf(
        (subFolders(parent).slice(-1)[0]||{id:parent}).id);
      db.folders.splice(last+1,0,f);S.openF[parent]=true;}
    else db.folders.push(f);
    if(ed.moveMid&&meeting(ed.moveMid))meeting(ed.moveMid).folder=id;
    if(ed.surf==='menu')S.menu=null;
    toast(ed.moveMid?`<b>${esc(val)}</b> created — the meeting moved into it.`
      :`<b>${esc(val)}</b> created.`,2800,'ok');
    return true;}
  if(ed.kind==='name'){
    if(!val)return true;
    if(db.settings.names.some(n=>sameName(n,val))){
      toast(`<b>${esc(val)}</b> is already in the list.`,2600,'warn');return false;}
    db.settings.names.push(val);return true;}
  return true;
}
/* `soft` is the click-away path. A full render there would replace the very
   button the user was heading for between mousedown and mouseup and lose the
   click, so the field is swapped for its text in place and the render that
   makes every other copy of the name agree waits a beat. */
function edCommit(soft){
  const ed=S.edit;if(!ed)return;
  const el=document.querySelector('.ied');
  const val=((el?el.value:ed.val)||'').trim();
  S.edit=null;
  if(!edApply(ed,val)){S.edit=ed;ed.val=val;ed.fresh=false;
    if(!soft)render();else if(el)el.focus();return;}
  if(!soft){render();return;}
  if(el&&el.isConnected){
    const sp=document.createElement('span');sp.className='en';
    sp.textContent=val||el.defaultValue;el.replaceWith(sp);}
  EDDIRTY=true;
  setTimeout(()=>{if(EDDIRTY&&!S.edit)render()},240);
}
function edCancel(){
  if(!S.edit)return;
  S.edit=null;render();
}

/* ── render() hooks ─────────────────────────────────────────────────────── */
function edBefore(){
  EDUSED=false;EDDIRTY=false;
  const el=document.querySelector('.ied');
  if(el&&S.edit){S.edit.val=el.value;S.edit.sel=[el.selectionStart,el.selectionEnd];
    S.edit.had=document.activeElement===el;}
  EDLOCK=true;
}
function edAfter(){
  EDLOCK=false;
  const el=document.querySelector('.ied');
  if(!el||!S.edit)return;
  const ed=S.edit;
  if(document.activeElement!==el)el.focus({preventScroll:!ed.fresh});
  if(ed.fresh){
    el.select();ed.fresh=false;
    try{el.scrollIntoView({block:'nearest'})}catch(e){}
  }else if(ed.sel){try{el.setSelectionRange(ed.sel[0],ed.sel[1])}catch(e){}}
}

/* ── listeners ──────────────────────────────────────────────────────────── */
/* Capture phase, so these run before the app's own keydown handler and can keep
   Esc from also closing whatever is under the field. */
document.addEventListener('keydown',e=>{
  const el=e.target;
  if(!el||!el.classList||!el.classList.contains('ied'))return;
  if(e.key==='Enter'&&!e.isComposing){e.preventDefault();e.stopImmediatePropagation();edCommit(false);}
  else if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();edCancel();}
  else e.stopPropagation();       /* typing is never a shortcut */
},true);
document.addEventListener('input',e=>{
  const el=e.target;
  if(!el||!el.classList||!el.classList.contains('ied')||!S.edit)return;
  S.edit.val=el.value;
  e.stopPropagation();
},true);
document.addEventListener('focusout',e=>{
  const el=e.target;
  if(EDLOCK||!el||!el.classList||!el.classList.contains('ied')||!S.edit)return;
  /* a field removed by a render is not a field the user left */
  if(!el.isConnected)return;
  edCommit(true);
},true);
