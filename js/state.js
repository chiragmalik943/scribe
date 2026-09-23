// Global application state. 

/* ══════════════════════════════════ state ══════════════════════════════════ */
/* The seed is written in narrative order; the app reads it in date order, so
   a day group is never split by a call that was typed in later. */
const MONIX={Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11};
function mKey(m){
  const p=String(m.day||'').split(' ');
  const t=String(m.time||'').match(/^(\d{1,2}):(\d{2})\s*(am|pm)?$/i)||[0,9,0,''];
  let hh=+t[1];const ap=(t[3]||'').toLowerCase();
  if(ap==='pm'&&hh!==12)hh+=12; if(ap==='am'&&hh===12)hh=0;
  return (+p[2]||0)*1e8+((MONIX[p[1]]||0)+1)*1e6+(+p[0]||0)*1e4+hh*100+(+t[2]||0);
}
const freshDb=()=>{const x=seed();x.meetings.sort((a,b)=>mKey(b)-mKey(a));return x;};
let db=freshDb();
const S={route:'meetings',view:'all',mid:null,fid:null,tab:'notes',tid:null,cid:'c1',
  settings:false,spane:'appearance',share:false,menu:null,panel:false,
  /* twelve top-level folders with eighty-odd children between them: the tree
     opens closed and the page you are on expands its own branch */
  openF:{client:true},
  mpanel:false,mtyping:false,
  bub:{x:null,y:null,rec:false,secs:0},
  /* what the sidebars were doing before a right-hand panel pushed them shut */
  asideWas:null,
  /* a hover peek is temporary and never touches railmin/listmin, so letting go
     of the pointer always puts the sidebar back the way the user left it */
  peek:null,
  /* watchouts. wid+wpanel are the app-side detail panel; wpeek/wopen/walert are
     the pill's popover, and wsay is an interjection in progress. Kept apart
     because the pill and the panel can be open at the same time. */
  wid:null,wpanel:false,wfilter:'all',wdone:false,
  wpeek:null,wopen:false,walert:false,wsay:null,wseen:[],
  railmin:false,listmin:false,q:'',tq:'',vq:'',taskFilter:'all',showDone:false,
  speakers:'All speakers',range:'week',
  rec:null,playing:false,playPos:44,busy:false,typing:false,firstRun:false,
  addPerson:false,menuXY:null,zoom:false,
  /* per-section "view all" state on a detail page, keyed by a string unique
     to that one list (e.g. 'notes:m1:dec') so expanding one section never
     touches another. Grid vs. list for the folders panel on the home page. */
  expand:{},folderView:'grid'};
let timers=[];
const clearTimers=()=>{timers.forEach(t=>clearInterval(t));timers=[]};
const $=s=>document.querySelector(s);
/* kind is '' (neutral), 'ok', 'warn', 'dg' or 'info' */
function toast(msg,ms=2600,kind=''){const w=$('#toasts');const d=document.createElement('div');
  d.className='toast'+(kind?' '+kind:'');d.innerHTML=msg;w.appendChild(d);
  setTimeout(()=>{d.style.transition='opacity .3s';d.style.opacity='0';setTimeout(()=>d.remove(),320)},ms);}

/* ── system notifications ─────────────────────────────────────────────────
   The banners AIT-Scribe posts outside its own window. They live in #osnotifs,
   a sibling of #app, so render() never clears one mid-life. Buttons inside them
   use ordinary data-a actions and are picked up by the document click handler. */
const OSN={
 detect:{k:'',ic:'rec',ti:'Zoom call started',
   bo:'Acme kickoff · Jennifer Walsh and Tom Ellis. Take notes for this one?',
   ac:[['Take notes','p','record',''],['Not this time','s','osnclose','']]},
 ready:{k:'ok',ic:'spark',ti:'Notes are ready',
   bo:'Acme kickoff · a summary, 3 decisions and 3 tasks came out of it.',
   ac:[['Open notes','p','open','m1'],['Later','s','osnclose','']]},
 daily:{k:'',ic:'bell',ti:'5 tasks still open',
   bo:'Two of them are overdue. This is your 6:00 PM summary — one notice, not one per meeting.',
   ac:[['Open Tasks','p','go','tasks'],['Snooze','s','osnclose','']]},
 overdue:{k:'dg',ic:'alertc',ti:'2 tasks are past their date',
   bo:'Send the revised pricing sheet to Jennifer · Loop in Legal on the addendum.',
   ac:[['Review them','p','go','tasks'],['Dismiss','s','osnclose','']]},
 pasted:{k:'ok',ic:'mic',ti:'Pasted at your cursor',
   bo:'“Send Karen the revised statement of work before Thursday”',
   ac:[['Undo','s','demo','undo the paste'],['Copy again','s','copytx','']]},
 hotkey:{k:'',ic:'kbd',ti:'Fn is also the emoji picker',
   bo:'macOS claims this key too. Dictation still works, but you may see both.',
   ac:[['Pick another key','p','settings','hotkey'],['Keep Fn','s','osnclose','']]},
};
function osNotif(kind){
  const n=OSN[kind];if(!n)return;
  const w=$('#osnotifs');const d=document.createElement('div');
  d.className='osn '+(n.k||'');
  d.innerHTML=`<span class="ai">${ic(n.ic,17)}</span>
    <span class="bd"><span class="ap">AIT-Scribe<span class="w">now</span></span>
      <span class="ti">${n.ti}</span><span class="bo">${n.bo}</span>
      <span class="ac">${n.ac.map(([l,st,a,pp])=>
        `<button class="btn ${st} sm" data-a="${a}" data-p="${esc(pp)}">${l}</button>`).join('')}</span></span>
    <span class="x" data-a="osnclose" title="Dismiss">${ic('x',14)}</span>`;
  /* any button in the banner also closes it, whatever else it does */
  d.addEventListener('click',()=>setTimeout(()=>d.remove(),40));
  w.appendChild(d);
  /* keep the pile to four so a burst cannot run off the bottom of the window */
  while(w.children.length>4)w.firstChild.remove();
  setTimeout(()=>{if(!d.parentNode)return;d.style.transition='opacity .3s';d.style.opacity='0';
    setTimeout(()=>d.remove(),320)},7000);
}
const osnClear=()=>{const w=$('#osnotifs');if(w)w.innerHTML='';};
const demo=w=>toast(`<b>Demo</b> — this would ${w}.`);
const meeting=id=>db.meetings.find(m=>m.id===id);
const task=id=>db.tasks.find(t=>t.id===id);
/* ── folders ──────────────────────────────────────────────────────────────
   One level of nesting. `parent` is a top-level folder id, or absent. A folder
   view shows its own meetings plus everything in its sub-folders, so selecting
   "Client Calls" still shows the Acme and Northwind calls. */
const folder=id=>db.folders.find(f=>f.id===id);
const folderName=id=>(folder(id)||{name:'Unfiled'}).name;
const subFolders=id=>db.folders.filter(f=>f.parent===id);
const topFolders=()=>db.folders.filter(f=>!f.parent);
const rootOf=id=>{const f=folder(id);return f&&f.parent?f.parent:id;};
/* "Client Calls / Acme" for a sub-folder, plain name for a top-level one */
const folderPath=id=>{const f=folder(id);if(!f)return 'Unfiled';
  return f.parent?folderName(f.parent)+' / '+f.name:f.name;};
const inFolder=(m,id)=>m.folder===id||subFolders(id).some(sf=>sf.id===m.folder);
const folderCount=id=>db.meetings.filter(m=>inFolder(m,id)).length;
/* ── folder identity ──────────────────────────────────────────────────────
   A folder gets a glyph and one of six colour slots, and both are inherited
   from the top-level folder, so a sub-folder reads as part of its parent
   rather than as a new category. The four folders AIT-Scribe ships with are
   named explicitly — Client Calls is a briefcase, Interviews is a person being
   added, Projects is a stack, Internal is a house — and anything the user
   creates is hashed onto a slot so it is stable across sessions rather than
   depending on the order folders happen to be in.

   The slot is a class (`fc-3`), not a colour value, because each slot is
   redefined for dark mode in the stylesheet. Nothing in JS knows a hex. */
const FMETA={
  client:{ic:'brief',c:1},      interviews:{ic:'userplus',c:2},
  projects:{ic:'layers',c:3},   internal:{ic:'home',c:4},
  partners:{ic:'link',c:6},     vendors:{ic:'plug',c:5},
  support:{ic:'alertc',c:5},    design:{ic:'edit',c:2},
  research:{ic:'search',c:6},   board:{ic:'chart',c:1},
  marketing:{ic:'flag',c:4},    compliance:{ic:'shield',c:3}};
function folderMeta(id){
  const root=rootOf(id);
  if(FMETA[root])return FMETA[root];
  const k=String(root||'');
  let h=0;for(let i=0;i<k.length;i++)h=(h*31+k.charCodeAt(i))>>>0;
  return {ic:'folder',c:(h%6)+1};
}
/* the class that carries the colour, safe to drop on anything */
const fcls=id=>'fc-'+folderMeta(id).c;
/* a sub-folder keeps the family colour but takes the plain folder glyph, so
   the parent stays the one that names the category */
const ficon=id=>{const f=folder(id);return f&&f.parent?'folder':folderMeta(id).ic;};
/* a folder glyph at tile size, wherever one is needed */
const fwell=(id,px,gl)=>`<span class="fwell ${fcls(id)}" style="width:${px}px;height:${px}px">${
  ic(gl||ficon(id),Math.round(px*.5))}</span>`;

/* ── dates ────────────────────────────────────────────────────────────────
   The prototype is pinned to a single day so every relative label in the seed
   ("Today", "2 days late") stays true. The calendar is the first screen that
   has to agree with those labels on a real grid, so the parsing lives here and
   everything else keeps using the written strings it already had. */
const MONS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DOWS=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const TODAY=new Date(2026,7,11);        /* Tue 11 Aug 2026 */
const NOWH=15.2;                         /* a little after 3pm */
const isod=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+
  String(d.getDate()).padStart(2,'0');
const addDays=(d,n)=>{const x=new Date(d.getFullYear(),d.getMonth(),d.getDate());
  x.setDate(x.getDate()+n);return x;};
/* '11 Aug 2026' → Date */
function parseDay(v){
  const m=/^(\d{1,2})\s+([A-Za-z]{3})[a-z]*\s+(\d{4})$/.exec(String(v||'').trim());
  if(!m)return null;
  const mo=MONS.indexOf(m[2].slice(0,1).toUpperCase()+m[2].slice(1,3).toLowerCase());
  return mo<0?null:new Date(+m[3],mo,+m[1]);
}
/* '2:14 pm' or '14:30' → 14.233 */
function parseTime(v){
  const m=/^(\d{1,2}):(\d{2})\s*(am|pm)?$/i.exec(String(v||'').trim());
  if(!m)return 9;
  let h=+m[1];const ap=(m[3]||'').toLowerCase();
  if(ap==='pm'&&h!==12)h+=12;
  if(ap==='am'&&h===12)h=0;
  return h+(+m[2])/60;
}
/* 'mm:ss' → hours */
const durHours=v=>{const a=String(v||'0:00').split(':');
  return ((+a[0]||0)+(+a[1]||0)/60)/60;};
const clockLabel=h=>{const H=Math.floor(h),M=Math.round((h-H)*60);
  const ap=H<12?'am':'pm',hh=H%12===0?12:H%12;
  return hh+':'+String(M).padStart(2,'0')+' '+ap;};
const dayLabel=d=>DOWS[d.getDay()]+' '+d.getDate()+' '+MONS[d.getMonth()];
/* Today / Tomorrow / Thu 13 Aug */
function relDay(d){
  const k=isod(d);
  if(k===isod(TODAY))return 'Today';
  if(k===isod(addDays(TODAY,1)))return 'Tomorrow';
  if(k===isod(addDays(TODAY,-1)))return 'Yesterday';
  return dayLabel(d);
}
/* Everything with a time on it, in one shape. Recorded calls come straight off
   `meetings` so the calendar can never disagree with the notes; `events` holds
   only what has not happened yet. */
function allEvents(){
  const out=[];
  db.meetings.forEach(m=>{
    const d=parseDay(m.day);if(!d)return;
    const s=parseTime(m.time);
    out.push({id:'m-'+m.id,iso:isod(d),date:d,s,e:s+durHours(m.dur),title:m.title,
      f:m.folder,mid:m.id,up:false,
      who:m.people.filter(x=>x.n!=='you').map(x=>x.n).join(', ')});
  });
  (db.events||[]).forEach(x=>{
    const parts=String(x.d).split('-');
    const dd=new Date(+parts[0],+parts[1]-1,+parts[2]);
    out.push({id:x.id,iso:x.d,date:dd,s:parseTime(x.s),e:parseTime(x.e),title:x.title,
      f:x.f,mid:null,up:true,who:x.who||''});
  });
  return out;
}
/* what has not happened yet, soonest first */
function upcoming(n){
  const k=isod(TODAY);
  return allEvents().filter(e=>e.up&&(e.iso>k||(e.iso===k&&e.e>NOWH)))
    .sort((a,b)=>a.iso<b.iso?-1:a.iso>b.iso?1:a.s-b.s).slice(0,n||8);
}
const newFolderId=()=>'f'+Math.random().toString(36).slice(2,8);
/* A sub-folder control is named after the folder it will sit in — "Add Client
   Calls Folder" — so the destination is unambiguous wherever the button appears.
   Passing no id gives the top-level wording. */
const addFolderLabel=id=>id?`Add ${folderName(id)} Folder`:'Add Folder';
const folderMeetings=id=>db.meetings.filter(m=>inFolder(m,id));
/* Decisions and open questions are rolled up from the member meetings, each line
   keeping a link back to the call it was said on. */
const folderLines=(id,key)=>folderMeetings(id).flatMap(m=>
  (m.notes&&m.notes[key]||[]).map(d=>({tx:d[0],at:d[1],mid:m.id,mt:m.title})));
const folderTasks=id=>{const ids=folderMeetings(id).map(m=>m.id);
  return db.tasks.filter(t=>ids.includes(t.mid)&&!t.done);};
/* ── the project brief ────────────────────────────────────────────────────
   A folder's `sum` is four sections rather than one paragraph, because the four
   questions a reader actually arrives with are different questions: what is the
   state of this, who is carrying which piece, what is going wrong, and what
   would fix it. Rolled-up notes answer the first; nothing on the page answered
   the other three.

   folderSummary() returns just the first section, for the places that have room
   for a sentence and not a brief — a folder card, the lead line on the page. */
const folderBrief=id=>{const f=folder(id);
  return f&&f.sum&&typeof f.sum==='object'?f.sum:null;};
function folderSummary(id){
  const f=folder(id);
  if(f&&f.sum)return typeof f.sum==='object'?f.sum.stand:f.sum;
  const ms=folderMeetings(id),n=ms.length;
  if(!n)return id===''?'Nothing is waiting to be filed — every meeting has a folder.'
    :'Nothing has been filed here yet. Move a meeting in and AIT-Scribe will roll its notes up on this page.';
  const who=[...new Set(ms.flatMap(m=>m.people.map(x=>x.n)).filter(x=>x!=='you'))];
  return `${n} meeting${n>1?'s':''} filed here, with ${who.slice(0,3).join(', ')}${
    who.length>3?` and ${who.length-3} other${who.length-3>1?'s':''}`:''}. `+
    `A written summary appears once AIT-Scribe has read across all of them.`;
}
/* ── watchouts ────────────────────────────────────────────────────────────
   Kept in one flat table keyed by meeting, exactly like tasks, so a project
   can roll them up without walking meetings twice. `open` is the only count
   that ever reaches a badge — resolved and dismissed ones stay readable but
   never nag. */
const WT={conflict:{label:'Conflict',plural:'Conflicts',icon:'conflict',
            rel:'conflicts with',verb:'Conflicts with'},
          discrepancy:{label:'Discrepancy',plural:'Discrepancies',icon:'delta',
            rel:'does not match',verb:'Does not match'},
          clarification:{label:'Clarification',plural:'Clarifications',icon:'help',
            rel:'still open since',verb:'Still open since'}};
const WORDER=['conflict','discrepancy','clarification'];
const watchout=id=>db.watchouts.find(w=>w.id===id);
const mWatch=id=>db.watchouts.filter(w=>w.mid===id);
const mWatchOpen=id=>db.watchouts.filter(w=>w.mid===id&&w.status==='open');
const fWatch=id=>{const ids=folderMeetings(id).map(m=>m.id);
  return db.watchouts.filter(w=>ids.includes(w.mid));};
const fWatchOpen=id=>fWatch(id).filter(w=>w.status==='open');
/* a conflict is the only classification that earns an interruption */
const hasConflict=list=>list.some(w=>w.type==='conflict');
const wCounts=list=>WORDER.map(t=>[t,list.filter(w=>w.type===t).length]).filter(x=>x[1]);
/* Twelve names on an all-hands wrapped the row onto a second line, so the
   list lost its rhythm on exactly the meetings that were hardest to scan.
   Two names and a remainder; the full list is a click away in the meeting. */
const peopleLine=(m,max=2)=>{
  const ns=m.people.map(x=>x.n);
  return ns.length<=max+1?ns.join(', ')
    :ns.slice(0,max).join(', ')+' +'+(ns.length-max);
};
const openTasks=()=>db.tasks.filter(t=>!t.done);
const taskCount=id=>db.tasks.filter(t=>t.mid===id).length;
const overdue=()=>db.tasks.filter(t=>!t.done&&t.late);
