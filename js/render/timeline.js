// A project's timeline: the major things that happened to it, newest first.

/* ══════════════════════════════════ project timeline ══════════════════════════════════ */
/* The Overview tab says where a project stands; this one says how it got there.
   It is not a log of everything — a call, the decisions that came out of it, the
   watchouts it raised, the tasks that are overdue or high priority, and the
   things already on the calendar — and every entry opens the thing it came from.

   Nothing here is stored. The timeline is read off the meetings, notes,
   watchouts, tasks and events the project already has, so it cannot drift from
   them: file a call into the project and it appears; resolve a watchout and its
   entry updates. */
const TLF=[['all','All'],['meeting','Calls'],['decision','Decisions'],['watch','Watchouts'],['task','Tasks & dates']];
const TLICON={meeting:'people',decision:'check',task:'checkc',event:'cal'};
/* a task's due text → a day, or null when it does not name one */
function dueDate(t){
  const v=String(t.due||'').trim();
  if(v==='Today')return TODAY;
  if(v==='Tomorrow')return addDays(TODAY,1);
  if(v==='Yesterday')return addDays(TODAY,-1);
  let m=/^(\d+)\s+days?\s+late$/i.exec(v);if(m)return addDays(TODAY,-(+m[1]));
  m=/^(?:[A-Za-z]{3}\s)?(\d{1,2})\s([A-Za-z]{3})$/.exec(v);
  if(m){const mo=MONS.indexOf(m[2]);if(mo>=0)return new Date(2026,mo,+m[1]);}
  if(/^\d{1,2}:\d{2}\s*(am|pm)?$/i.test(v))return TODAY;
  return null;
}
/* the opening of a summary: whole sentences, as many as fit in about n characters */
const firstSentence=(s,n=190)=>{
  const t=String(s||'').replace(/\s+/g,' ').trim();if(!t)return '';
  const parts=t.split(/(?<=[.!?])\s/);let out=parts[0];
  for(let i=1;i<parts.length&&(out+' '+parts[i]).length<=n;i++)out+=' '+parts[i];
  return out.length>n?out.slice(0,n-1).trim()+'…':out;
};
function projectTimeline(fid){
  const now=TODAY.getTime()+NOWH*3600e3,out=[];
  const ms=folderMeetings(fid),ids=ms.map(m=>m.id);
  ms.forEach(m=>{
    const d=parseDay(m.day);if(!d)return;
    const ts=d.getTime()+parseTime(m.time)*3600e3;
    out.push({k:'meeting',ts,d,m});
    /* what came out of a call sits directly beneath it */
    ((m.notes&&m.notes.decisions)||[]).forEach((x,i)=>
      out.push({k:'decision',ts:ts-(i+1)*1000,d,m,tx:x[0],at:x[1]}));
    db.watchouts.filter(w=>w.mid===m.id).forEach((w,i)=>
      out.push({k:'watch',ts:ts-(100+i)*1000,d,m,w}));
  });
  db.tasks.filter(t=>ids.includes(t.mid)&&!t.done&&(t.pri==='hi'||t.late)).forEach(t=>{
    const d=dueDate(t);if(!d)return;
    out.push({k:'task',ts:d.getTime()+17*3600e3,d,t,m:meeting(t.mid)});
  });
  allEvents().filter(e=>e.up&&e.f===fid).forEach(e=>{
    const ts=e.date.getTime()+e.s*3600e3;if(ts>now)out.push({k:'event',ts,d:e.date,e});
  });
  const future=out.filter(x=>x.ts>now).sort((a,b)=>a.ts-b.ts);
  const past=out.filter(x=>x.ts<=now).sort((a,b)=>b.ts-a.ts);
  return {future,past};
}
const tlKind=x=>x.k==='event'?'task':x.k;

function tlEntry(x,up){
  const m=x.m,late=x.k==='task'&&x.t.late;
  let icon=TLICON[x.k],title='',meta='',sub='',act='';
  if(x.k==='meeting'){
    title=esc(m.title);act=`data-a="open" data-p="${m.id}"`;
    meta=`<span class="tk">Call</span>${esc(m.time)} · ${esc(m.dur)} · ${m.people.length} attendee${m.people.length===1?'':'s'}`;
    sub=firstSentence(m.notes&&m.notes.summary);
  }else if(x.k==='decision'){
    title=esc(x.tx);act=`data-a="openat" data-p="${m.id}|${x.at}"`;
    meta=`<span class="tk">Decision</span>${esc(m.title)} · ${esc(x.at)}`;
  }else if(x.k==='watch'){
    const w=x.w,t=WT[w.type];icon=t.icon;
    title=esc(w.title);act=`data-a="wdetail" data-p="${w.id}"`;
    const st=w.status==='open'?'Open':w.status==='resolved'?(w.raised?'Raised in the call':'Resolved'):'Dismissed';
    meta=`<span class="tk">${t.label}</span>${st} · ${esc(m.title)}`;
  }else if(x.k==='task'){
    title=esc(x.t.title);act=`data-a="opentask" data-p="${x.t.id}"`;
    meta=`<span class="tk">${late?'Overdue':'Task due'}</span>${esc(x.t.due)}${x.t.pri==='hi'?' · High priority':''}${
      m?' · '+esc(m.title):''}`;
    icon=late?'alertc':'checkc';
  }else{
    const e=x.e;title=esc(e.title);act=`data-a="upcoming" data-p="${e.id}"`;
    meta=`<span class="tk">Scheduled</span>${esc(dayLabel(e.date))} · ${clockLabel(e.s)}–${clockLabel(e.e)}${
      e.who?' · '+esc(e.who):''}`;
  }
  return `<div class="tle k-${tlKind(x)}${x.k==='watch'?' w-'+x.w.type:''}${late?' late':''}${up?' up':''}">
    <span class="tln">${ic(icon,15)}</span>
    <div class="tlc" ${act}><div class="tlt">${title}</div>
      <div class="tlm">${meta}</div>${sub?`<div class="tls">${esc(sub)}</div>`:''}</div></div>`;
}
function timelineView(fid){
  const {future,past}=projectTimeline(fid);
  const all=future.concat(past);
  const n=k=>all.filter(x=>tlKind(x)===k).length;
  const keep=x=>S.tlf==='all'||tlKind(x)===S.tlf;
  const chips=TLF.map(([k,l])=>`<span class="fchip ${S.tlf===k?'on':''}" data-a="tlf" data-p="${k}">${l}<span class="b">${
    k==='all'?all.length:n(k)}</span></span>`).join('');
  const fu=future.filter(keep),pa=past.filter(keep);
  let html='';
  if(fu.length)html+=`<section class="tlg up"><div class="tlh"><b>Coming up</b><span>${fu.length} on the calendar or due</span></div>${
    fu.map(x=>tlEntry(x,true)).join('')}</section>`;
  /* past entries grouped by day */
  const days=[];
  pa.forEach(x=>{const k=isod(x.d);let g=days[days.length-1];
    if(!g||g.k!==k){g={k,d:x.d,items:[]};days.push(g);}g.items.push(x);});
  days.forEach(g=>{
    const rel=relDay(g.d),relative=['Today','Yesterday'].includes(rel);
    html+=`<section class="tlg"><div class="tlh"><b>${esc(rel)}</b>${
      relative?`<span>${esc(dayLabel(g.d))}</span>`:g.d.getFullYear()!==TODAY.getFullYear()?`<span>${g.d.getFullYear()}</span>`:''}</div>${
      g.items.map(x=>tlEntry(x,false)).join('')}</section>`;
  });
  if(!html)html=all.length?`<div class="hint" style="padding:24px 2px">Nothing of this kind has happened in this project.</div>`
    :`<div class="empty" style="padding-bottom:60px"><span class="ico">${ic('milestone',22)}</span>
      <h2>Nothing on the timeline yet</h2><p>Calls filed in this project, and what comes out of them, appear here.</p></div>`;
  return `${actbar(chips,`<span class="tlcount">${all.length} update${all.length===1?'':'s'}</span>`)}
    <div class="tl">${html}</div>`;
}
