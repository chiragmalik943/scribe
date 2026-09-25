// Renders the app chrome: title bar, sidebar rail, list column headers. 

/* ══════════════════════════════════ chrome ══════════════════════════════════ */
/* Six destinations, each one a place rather than a mode. Speech to Text used
   to carry Vocabulary and Insights as a sub-tree hanging off the rail, which
   put three levels of navigation on screen at once and buried Insights — a
   view about the whole workspace — inside dictation. Insights and Calendar are
   their own entries now, and Speech's own sections moved to the list column
   beside it, where every other section of the app keeps them. */
const NAV=[['meetings','Meetings','people'],['speech','Speech to Text','wave2'],
           ['insights','Insights','chart'],['tasks','Tasks','clipb'],
           ['assistant','AI Assistant','spark']];
const isSpeech=r=>['speech','vocabulary'].includes(r);
/* the meetings family: the home screen, the list behind it, a folder, a call */
const isMeet=r=>['meetings','mlist','folder','meeting'].includes(r);

function rail(){
  const items=NAV.map(([k,label,icon])=>{
    const on=(k===S.route)||(k==='speech'&&isSpeech(S.route))||
             (k==='meetings'&&isMeet(S.route));
    return `<a class="${on?'on':''}" data-a="go" data-p="${k}" title="${label}">${
      ic(icon,18)}<span class="lbl">${label}</span></a>`;}).join('');
  return `<div class="rail">
    <div class="slab">Workspace</div>
    <div class="nav">${items}</div><div class="spacer"></div>
    ${colbtn('rail')}
    <div class="acct" data-a="settings" data-p="acct" title="Account & plan"><span class="top"><span class="avat fc-${db.user.fc||1}">${db.user.initial}</span>
      <span class="who"><span class="nm">${db.user.name}</span><span class="pl">${db.user.plan} plan</span></span>
      <button class="upg" data-a="demo" data-p="open the upgrade flow">Upgrade</button></span></div></div>`;
}
function tools(extra=''){
  const n=overdue().length;
  return `${extra}<span class="tbtn" data-a="settings" data-p="appearance" title="Settings">${ic('sliders',18)}</span>
    <span class="tbtn" data-a="shortcuts" title="Keyboard shortcuts">${ic('help',18)}</span>
    <span class="tbtn ${n?'hasbadge':''}" data-a="notifs" title="Notifications">${ic('bell',18)}</span>`;
}
/* Each route still declares its own title / state / actions through mhead(),
   but the chrome is now one window-wide title bar above both sidebars, so the
   call just parks the values and topbar() renders them. */
let TOP={title:'',state:'',actions:'',crumb:null};
function mhead(title,state,actions='',crumb=null){TOP={title,state,actions,crumb};return '';}
function topbar(){
  const t=TOP;
  const head=t.crumb?`<div class="crumb">${t.crumb}</div>`
    :`<div class="ttl"><h1 class="h">${t.title}</h1>${t.state?`<span class="state">${t.state}</span>`:''}</div>`;
  return `<div class="topbar">
    <span class="lights">
      <i class="r" data-a="win" data-p="close" title="Close">${ic('x',8,3)}</i>
      <i class="y" data-a="win" data-p="min" title="Minimize">${ic('minus',8,3)}</i>
      <i class="g" data-a="win" data-p="zoom" title="Fill the screen">${ic('expand',8,3)}</i></span>
    ${head}<span class="r">${tools()}${t.actions}</span></div>`;
}
/* the collapse control that sits at the foot of the list column */
function lfoot(){return `<div class="lfoot">${colbtn('list')}</div>`;}
/* One control, three jobs. While a sidebar is only being peeked it offers to
   keep it open rather than to collapse something that is not really open. */
function colbtn(k){
  const min=k==='rail'?S.railmin:S.listmin, pk=S.peek===k;
  const what=k==='rail'?'sidebar':'list';
  return `<div class="colbtn ${pk?'pin':''}" data-a="${pk?k+'pin':k+'min'}" title="${
    pk?'Keep the '+what+' open':(min?'Expand ':'Collapse ')+what}">${
    ic(min?'panelR':'panelL',17)}<b>${pk?'Pin open':'Collapse'}</b></div>`;
}
const v=(on,icon,label,right,act,par)=>`<a class="${on?'on':''}" data-a="${act}" data-p="${par}" title="${
  esc(label)}">${ic(icon,16)}<span class="lbl">${label}</span>${right||''}</a>`;
const cnt=n=>`<span class="n">${n}</span>`;
const pill=n=>`<span class="npill">${n}</span>`;

/* ── breadcrumb trail ─────────────────────────────────────────────────────
   One shape for every route that carries a crumb: a `root` that is always
   there and always a link, zero or more `mids` — the folders standing
   between the root and wherever the user is now — and a `current` label,
   which is the page itself and never a link. Built once, here, so the top
   bar and the "···" dropdown that opens when the trail is collapsed are
   reading the exact same list and can never disagree about what's hidden. */
function crumbData(){
  if(S.route==='mlist')
    return {root:{label:'Meetings',act:'go',par:'meetings'},mids:[],
      current:S.view==='recent'?'Recent':'All meetings'};
  if(S.route==='folder'){
    const unf=S.fid==='',f=folder(S.fid);
    const mids=[];
    if(!unf&&f&&f.parent)mids.push({label:folderName(f.parent),par:'f:'+f.parent});
    return {root:{label:'All meetings',act:'view',par:'all'},mids,
      current:unf?'Unfiled':(f?f.name:'Folder')};
  }
  if(S.route==='meeting'){
    const m=meeting(S.mid),mf=m?m.folder:'',mfo=folder(mf);
    const mids=[];
    if(mfo&&mfo.parent)mids.push({label:folderName(mfo.parent),par:'f:'+mfo.parent});
    mids.push({label:mf===''?'Unfiled':folderName(mf),par:mf===''?'unfiled':'f:'+mf});
    return {root:{label:'All meetings',act:'view',par:'all'},mids,current:m?m.title:''};
  }
  return null;
}
/* The dots button and the folders it can stand in for are both always in the
   markup — CSS shows one or the other off a single `.collapsed` class on
   `.crumb`, so collapsing never re-renders anything, just toggles which half
   is visible. See fitCrumb() for when that class gets set. */
function crumbTrail(){
  const d=crumbData();if(!d)return null;
  const chev=()=>`<span>${ic('chev',13)}</span>`;
  const root=`<span class="bk" data-a="${d.root.act}" data-p="${d.root.par}">${
    ic('back',15)}${esc(d.root.label)}</span>`;
  const mids=d.mids.map(m=>`<span class="bk" data-a="view" data-p="${esc(m.par)}">${
    esc(m.label)}</span>${chev()}`).join('');
  const ell=d.mids.length?`<span class="ell" data-a="menu" data-p="crumbmenu:"
    title="Show the ${d.mids.length} folder${d.mids.length>1?'s':''} in between">${ic('dots',13)}</span>${chev()}`:'';
  return `${root}${chev()}${ell}<span class="mids">${mids}</span><b>${esc(d.current)}</b>`;
}
/* Whether the full trail fits is a question about live pixel widths — the
   name of whatever folder or meeting the user is looking at, and however
   wide the window currently is — so it's answered after layout rather than
   guessed at while the HTML above is being strung together. Collapsing only
   ever removes width from the row, so one measurement is enough: there is no
   case where doing it again would want to re-expand. */
function fitCrumb(){
  const el=$('.crumb');if(!el)return;
  el.classList.remove('collapsed');
  if(el.scrollWidth>el.clientWidth)el.classList.add('collapsed');
}

