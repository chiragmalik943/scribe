// Who spoke: the speaking timeline behind a recording, the share bar, and the lanes.

/* ══════════════════════════════════ who spoke ══════════════════════════════════ */
/* A recording is a run of turns. The seed only carries a handful of transcript
   lines per call, which is a sample of the conversation rather than all of it,
   so the full run of turns is derived: every transcript line is honoured exactly
   (that person is speaking at that second) and the stretches between them are
   filled with plausible turns, weighted by who talks most. It is seeded from the
   meeting's id, so a call looks the same every time it is opened.

   Everything that draws speakers — the share bar on the notes, the lanes under
   the transcript, the "speaking now" label in the player — reads this one
   timeline, so they cannot disagree. */
const hash32=str=>{let h=2166136261;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);
  h=Math.imul(h,16777619);}return h>>>0;};
function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);
  t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
/* 'mm:ss' (or 'h:mm:ss') → seconds, and back */
function parseClock(v){
  const a=String(v||'0').split(':').map(x=>+x||0);
  return a.length===3?a[0]*3600+a[1]*60+a[2]:(a[0]||0)*60+(a[1]||0);
}
function fmtClock(sec){
  sec=Math.max(0,Math.round(sec));
  const h=Math.floor(sec/3600),m=Math.floor(sec/60)%60,s=sec%60;
  return (h?h+':'+String(m).padStart(2,'0'):String(m).padStart(2,'0'))+':'+String(s).padStart(2,'0');
}
const mTotal=m=>Math.max(60,parseClock(m.dur));
/* the transcript says "You"; the attendee list says "you" */
const spkKey=n=>String(n||'').toLowerCase()==='you'?'you':String(n||'');
const spkLabel=k=>k==='you'?'You':k;
const spkFirst=k=>k==='you'?'You':String(k).split(' ')[0];
/* "You" is always slot 1 so the same hue means the same person on every page;
   everyone else takes the next slot in attendee order. A ninth voice shares
   the neutral. */
function spkSlot(m,k){
  if(k==='you')return 1;
  const others=m.people.map(p=>p.n).filter(n=>n!=='you');
  const i=others.indexOf(k);
  return i<0||i>6?'O':i+2;
}
const spkCls=(m,k)=>'s'+spkSlot(m,k);

const TLCACHE={};
function mTL(m){
  const sig=[m.id,m.dur,m.people.length,m.transcript.length].join('|');
  if(TLCACHE[m.id]&&TLCACHE[m.id].sig===sig)return TLCACHE[m.id];
  const total=mTotal(m),R=rng(hash32(m.id));
  const names=m.people.map(p=>spkKey(p.n));
  if(!names.includes('you'))names.unshift('you');
  /* talk-time weights: explicit when the seed says so, otherwise "you" holds
     a third and the rest share the remainder unevenly */
  const w={};
  if(m.spkw)names.forEach(n=>w[n]=m.spkw[n]||.1);
  else{const others=names.filter(n=>n!=='you');
    names.forEach(n=>w[n]=n==='you'?(others.length?.34:1):(.66/Math.max(1,others.length))*(.65+.7*R()));}
  const pick=prev=>{
    const cand=names.filter(n=>n!==prev);if(!cand.length)return prev;
    const sum=cand.reduce((a,n)=>a+w[n],0);let r=R()*sum;
    for(const n of cand){r-=w[n];if(r<=0)return n;}return cand[cand.length-1];};
  let segs=[],t=1+R()*3,prev=null;
  while(t<total-2){
    const k=pick(prev);
    /* turns are mostly short with the occasional long run */
    const len=Math.min(total-t,7+Math.pow(R(),1.9)*60*(.3+w[k]*2.6));
    segs.push({s:t,e:t+len,k});
    prev=k;t+=len+.4+R()*2.4;
  }
  /* every transcript line is a fact: that person is speaking from that second */
  const carve=(s,e)=>{
    const out=[];
    segs.forEach(g=>{
      if(g.e<=s||g.s>=e){out.push(g);return}
      if(g.s<s)out.push({s:g.s,e:s,k:g.k});
      if(g.e>e)out.push({s:e,e:g.e,k:g.k});
    });segs=out;};
  m.transcript.forEach(r=>{
    const k=spkKey(r[1]);if(!names.includes(k))return;
    const s=parseClock(r[0]),words=String(r[2]).split(/\s+/).length;
    const e=Math.min(total,s+Math.max(4,Math.min(24,words*.4)));
    carve(s-.2,e);segs.push({s,e,k});
  });
  segs=segs.filter(g=>g.e-g.s>.6).sort((a,b)=>a.s-b.s);
  const by={};names.forEach(n=>by[n]=0);
  segs.forEach(g=>by[g.k]=(by[g.k]||0)+(g.e-g.s));
  const talk=Object.values(by).reduce((a,x)=>a+x,0)||1;
  const rows=names.map(k=>({k,secs:by[k]||0,pct:(by[k]||0)/talk*100}))
    .filter(x=>x.secs>0).sort((a,b)=>b.secs-a.secs);
  /* the waveform follows the same turns: loud where someone speaks, near-flat in
     the gaps, so the audio and the lanes visibly agree */
  const N=140,wave=[],W=rng(hash32(m.id+'w'));
  for(let i=0;i<N;i++){
    const a=i*total/N,b=(i+1)*total/N;
    let on=0;segs.forEach(g=>{const o=Math.min(b,g.e)-Math.max(a,g.s);if(o>0)on+=o;});
    const live=on/(b-a);
    wave.push(live>.45?.45+.55*Math.abs(Math.sin(i*.9+W()*3))*(.6+.4*W()):.06+.1*W());
  }
  return (TLCACHE[m.id]={sig,total,segs,by,rows,wave,names});
}
/* who is talking at second t. In the short gap after someone finishes it is
   still them — a label that flickered blank between every sentence would be
   worse than one that lags by a breath. '' before anyone has spoken. */
function spokenAt(m,t){
  const g=mTL(m).segs;let lo=0,hi=g.length-1,last=-1;
  while(lo<=hi){const mid=(lo+hi)>>1;
    if(t<g[mid].s)hi=mid-1;else{last=mid;if(t<=g[mid].e)return g[mid].k;lo=mid+1;}}
  return last>=0&&t-g[last].e<4?g[last].k:'';
}

/* ── the share bar ──────────────────────────────────────────────────────────
   One stacked bar, one legend. The segments are separated by the surface
   colour rather than a stroke, and every colour is paired with a name and a
   percentage in the legend, so none of it depends on telling hues apart. */
function whoSpokeBlock(m){
  const tl=mTL(m);
  if(!m.transcript.length&&!m.people.length)return '';
  const rows=tl.rows;if(!rows.length)return '';
  const pct=x=>x>=10?Math.round(x):Math.round(x*10)/10;
  const aria=rows.map(r=>`${spkLabel(r.k)} ${Math.round(r.pct)}%`).join(', ');
  return `<div class="sec who" id="who-spoke"><h3>Who spoke<span class="n">${rows.length}</span>
      <span class="go"><span data-a="whenspoke">Who spoke when ${ic('chev',12)}</span></span></h3>
    <div class="wsbar" role="img" aria-label="Share of talk time: ${esc(aria)}">${rows.map(r=>
      `<i class="${spkCls(m,r.k)}" style="flex:${r.secs.toFixed(1)} 1 0"
        title="${esc(spkLabel(r.k))} · ${pct(r.pct)}% · ${fmtClock(r.secs)}"></i>`).join('')}</div>
    <div class="wsleg">${rows.map(r=>
      `<div class="wsi"><i class="sdot ${spkCls(m,r.k)}"></i>
        <span class="nm">${esc(spkLabel(r.k))}</span>
        <span class="pc">${pct(r.pct)}%</span>
        <span class="tm">${fmtClock(r.secs)}</span></div>`).join('')}</div></div>`;
}

/* ── the lanes ──────────────────────────────────────────────────────────────
   One lane per speaker on the player's own time axis, so the same x position
   means the same second in the chapters above, the lanes and the waveform
   below. More than five voices and the quietest fold into one "Others" lane. */
const LANE_MAX=5;
function laneSet(m){
  const tl=mTL(m);
  const top=tl.rows.slice(0,tl.rows.length>LANE_MAX?LANE_MAX-1:LANE_MAX).map(r=>r.k);
  const lanes=top.map(k=>({k,label:spkFirst(k),segs:tl.segs.filter(g=>g.k===k)}));
  if(tl.rows.length>LANE_MAX)lanes.push({k:'other',label:'Others',
    segs:tl.segs.filter(g=>!top.includes(g.k))});
  return lanes;
}
function laneRows(m){
  const tl=mTL(m),T=tl.total;
  return laneSet(m).map(l=>`<div class="ln ${l.k==='other'?'sO':spkCls(m,l.k)}" data-lane="${esc(l.k)}">${
    l.segs.map(g=>`<i style="left:${(g.s/T*100).toFixed(3)}%;width:${Math.max(.18,(g.e-g.s)/T*100).toFixed(3)}%"></i>`).join('')}</div>`).join('');
}
function laneLabels(m){
  const tl=mTL(m);
  return laneSet(m).map(l=>{
    const r=tl.rows.find(x=>x.k===l.k);
    return `<div class="ll" title="${esc(l.k==='other'?'Everyone else':spkLabel(l.k))}${r?' · '+Math.round(r.pct)+'%':''}">
      <i class="sdot ${l.k==='other'?'sO':spkCls(m,l.k)}"></i><span>${esc(l.label)}</span></div>`;}).join('');
}
