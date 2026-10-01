// Chapters, the transcript divided by them, and the player that plays through both.

/* ══════════════════════════════════ chapters ══════════════════════════════════ */
/* A chapter is a stretch of the call about one thing: a start second and a title.
   The transcript is cut at those seconds, the player's ribbon is cut at the same
   ones, and the audio therefore has the same demarcation as the text.

   m1 carries hand-written chapters. For every other call they are derived from
   what the notes already know: each decision or open question marks a moment the
   conversation turned a corner, so a chapter opens shortly before it and takes
   its title from it. */
const DEMO_RATE=10;     /* seconds of recording that pass per real second at 1× */
function shortTitle(s){
  let t=String(s||'').replace(/[“”"]/g,'').split(/\s[—–-]\s|[.:;,?]/)[0].trim();
  const w=t.split(/\s+/).slice(0,5);
  /* never end on a dangling little word */
  while(w.length>2&&/^(a|an|the|to|of|for|in|on|and|by|with|is|be|at|as|it|or|are|was|that)$/i.test(w[w.length-1]))w.pop();
  t=w.join(' ');
  return t.charAt(0).toUpperCase()+t.slice(1);
}
const CHCACHE={};
function mChapters(m){
  const sig=[m.id,m.dur,m.notes.decisions.length,m.notes.questions.length,(m.chapters||[]).length].join('|');
  if(CHCACHE[m.id]&&CHCACHE[m.id].sig===sig)return CHCACHE[m.id].list;
  const total=mTotal(m);let list=[];
  if(m.chapters&&m.chapters.length)list=m.chapters.map(([t0,title])=>({t0,title}));
  else{
    const minGap=Math.max(150,total*.09);
    list=[{t0:0,title:total<300?'The conversation':'Opening and context'}];
    if(total>=300){
      const anchors=[...m.notes.decisions,...m.notes.questions]
        .map(d=>({t:parseClock(d[1]),title:shortTitle(d[0])})).sort((a,b)=>a.t-b.t);
      anchors.forEach(a=>{
        const st=Math.max(0,a.t-45),last=list[list.length-1];
        if(st-last.t0>=minGap&&st<total-minGap*.6)list.push({t0:Math.round(st),title:a.title});
      });
      if(list.length<3){            /* nothing to anchor on: three even thirds */
        list=[{t0:0,title:'Opening and context'},{t0:Math.round(total*.34),title:'Main discussion'},
              {t0:Math.round(total*.72),title:'Wrap-up and next steps'}];
      }else if(total-list[list.length-1].t0>total*.28){
        list.push({t0:Math.round(total-Math.max(150,total*.1)),title:'Wrap-up and next steps'});
      }
    }
  }
  list.forEach((c,i)=>{c.i=i;c.t1=list[i+1]?list[i+1].t0:total;});
  CHCACHE[m.id]={sig,list};
  return list;
}
const chapterAt=(list,t)=>{let k=0;list.forEach(c=>{if(t>=c.t0)k=c.i;});return k;};
/* the last transcript line spoken at or before second t; -1 before the first */
function rowAt(m,t){let k=-1;m.transcript.forEach((r,i)=>{if(parseClock(r[0])<=t+.4)k=i;});return k;}

/* ── the transcript tab ─────────────────────────────────────────────────── */
function trRow(m,r,i,q,now){
  let tx=esc(r[2]);
  if(q)tx=tx.replace(new RegExp('('+q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','ig'),'<mark>$1</mark>');
  const k=spkKey(r[1]);
  return `<div class="trs ${r[3]?'hl':''} ${i===now?'now':''}" data-row="${i}" data-s="${parseClock(r[0])}">
    <span class="tm" data-a="at" data-p="${parseClock(r[0])}" title="Play from ${r[0]}">${r[0]}</span>
    <span><span class="spk"><i class="sdot ${spkCls(m,k)}"></i>${esc(r[1])}</span><span class="tx">${tx}</span>
    ${r[3]?`<span class="badge">${ic('list',12)}${r[3]}</span>`:''}</span></div>`;
}
function chapterHead(c,n,now){
  const len=c.t1-c.t0;
  return `<div class="chh ${c.i===now?'now':''}" data-ch="${c.i}">
    <span class="chn">${c.i+1}</span>
    <span class="cht"><b>${esc(c.title)}</b>
      <span>${fmtClock(c.t0)} – ${fmtClock(c.t1)} · ${fmtClock(len)}${n!=null?` · ${n} line${n===1?'':'s'}`:''}</span></span>
    <span class="chp" data-a="chapter" data-p="${c.i}" title="Play this chapter">${ic('play',12,2)}Play</span></div>`;
}
function transcriptTab(m,tabs){
  const spk=['All speakers',...new Set(m.transcript.map(t=>t[1]))];
  const q=S.tq.toLowerCase(),ch=mChapters(m),filtered=!!q||S.speakers!=='All speakers';
  const now=rowAt(m,S.playT),nowCh=chapterAt(ch,S.playT);
  const idx=m.transcript.map((r,i)=>({r,i,s:parseClock(r[0])}));
  const vis=idx.filter(x=>(S.speakers==='All speakers'||x.r[1]===S.speakers)&&
    (!q||x.r[2].toLowerCase().includes(q)));
  let html='';
  ch.forEach(c=>{
    const inCh=vis.filter(x=>x.s>=c.t0&&(x.s<c.t1||c.i===ch.length-1));
    if(filtered&&!inCh.length)return;
    html+=chapterHead(c,idx.filter(x=>x.s>=c.t0&&(x.s<c.t1||c.i===ch.length-1)).length,nowCh)+
      (inCh.length?inCh.map(x=>trRow(m,x.r,x.i,q,now)).join('')
        :`<div class="chempty">No key lines in this chapter — play it to hear the discussion.</div>`);
  });
  if(!html)html=`<div class="hint" style="padding:24px 4px">Nothing in this transcript matches.</div>`;
  return `${tabs}${actbar(
    `<span class="srch" style="margin:0;width:230px">${ic('search',15)}
      <input placeholder="Search this transcript" data-a="tq" value="${esc(S.tq)}"></span>
     ${spk.map(x=>`<span class="fchip ${S.speakers===x?'on':''}" data-a="spk" data-p="${esc(x)}">${
       x==='All speakers'?'':`<i class="sdot ${spkCls(m,spkKey(x))}"></i>`}${esc(x)}</span>`).join('')}`,
    `<button class="btn q sm ico" data-a="demo" data-p="copy the transcript to your clipboard"
       title="Copy the transcript">${ic('copy',15)}</button>
     <button class="btn q sm ico" data-a="demo" data-p="export the transcript"
       title="Export the transcript">${ic('down',15)}</button>`)}
    <div class="trwrap"><div class="trscroll">${html}</div>
      <span class="followchip ${S.playing&&!S.follow?'on':''}" data-a="follow">${ic('chevd',13)}Jump to what is playing</span></div>
    ${playerDock(m)}`;
}

/* ── the player ─────────────────────────────────────────────────────────────
   Three tracks on one time axis and one playhead through all of them: the
   chapters, who spoke (optional), and the audio. */
function dockNow(m){
  const ch=mChapters(m),c=ch[chapterAt(ch,S.playT)];
  const k=spokenAt(m,S.playT);
  return `<span class="dk-ch">${c.i+1}</span><b>${esc(c.title)}</b>
    ${k?`<span class="dk-sp"><i class="sdot ${spkCls(m,k)}"></i>${esc(spkLabel(k))} speaking</span>`:''}`;
}
function playerDock(m){
  const tl=mTL(m),ch=mChapters(m),T=tl.total,nowCh=chapterAt(ch,S.playT);
  const bars=tl.wave.map(a=>`<i style="height:${Math.round(3+a*25)}px"></i>`).join('');
  const lanes=S.lanes?laneRows(m):'';
  return `<div class="dock ${S.lanes?'':'nolanes'}" data-dock>
    <div class="dk-top">
      <span class="dk-now">${dockNow(m)}</span>
      <span class="dk-r">
        <span class="dk-time"><b>${fmtClock(S.playT)}</b> / ${fmtClock(T)}</span>
        <span class="dk-btn" data-a="speed" title="Playback speed">${S.speed}&times;</span>
        <span class="dk-btn ${S.lanes?'on':''}" data-a="lanes"
          title="${S.lanes?'Hide':'Show'} who spoke when">${ic('users',13)}Who spoke when</span></span></div>
    <div class="dk-main">
      <div class="dk-l">
        <div class="ll cl">Chapters</div>
        ${S.lanes?laneLabels(m):''}
        <div class="ll pl"><span class="pb" data-a="playpause" title="${S.playing?'Pause':'Play'} — playback runs ahead of real time in this prototype">${
          ic(S.playing?'pause':'play',15,2)}</span></div></div>
      <div class="dk-tracks" data-a="seek" style="--pp:${(S.playT/T*100).toFixed(3)}%">
        <div class="ribbon">${ch.map(c=>`<span class="cseg ${c.i===nowCh?'now':''}" data-a="chapter" data-p="${c.i}"
          data-ch="${c.i}" style="left:${(c.t0/T*100).toFixed(3)}%;width:${((c.t1-c.t0)/T*100).toFixed(3)}%"
          title="${c.i+1}. ${esc(c.title)} · ${fmtClock(c.t0)}–${fmtClock(c.t1)}"><b>${c.i+1}</b><span>${esc(c.title)}</span></span>`).join('')}</div>
        ${S.lanes?`<div class="lanes">${lanes}</div>`:''}
        <div class="wv">${bars}</div>
        <div class="wv on">${bars}</div>
        <i class="dk-ph"></i></div></div></div>`;
}

/* ── playback ───────────────────────────────────────────────────────────────
   Nothing here re-renders the page. A tick moves the playhead by setting one CSS
   variable, and moves the highlight by toggling a class on at most two rows, so
   a transcript can be read, selected and scrolled while it plays. */
let PLT=null,PLLAST=0,PLROW=-9,PLCH=-9;
function playStart(){
  PLLAST=performance.now();clearInterval(PLT);
  PLT=setInterval(()=>{
    const m=meeting(S.mid);
    if(!$('.dock')||!m){S.playing=false;playStop();return}
    const now=performance.now(),dt=(now-PLLAST)/1000;PLLAST=now;
    const T=mTL(m).total;
    S.playT=Math.min(T,S.playT+dt*DEMO_RATE*S.speed);
    if(S.playT>=T){S.playing=false;playStop();playIcon();}
    syncPlay(false);
  },160);
}
function playStop(){clearInterval(PLT);PLT=null;}
function playIcon(){
  const b=$('.dock .pb');
  if(b)b.innerHTML=ic(S.playing?'pause':'play',15,2);
  const f=$('.followchip');if(f)f.classList.toggle('on',S.playing&&!S.follow);
}
function playToggle(){
  const m=meeting(S.mid);if(!m)return;
  if(!S.playing&&S.playT>=mTL(m).total-.5)S.playT=0;
  S.playing=!S.playing;S.playing?playStart():playStop();
  if(S.playing){S.follow=true;PLROW=-9;}
  playIcon();syncPlay(true);
}
function seekTo(sec,instant){
  const m=meeting(S.mid);if(!m)return;
  S.playT=Math.max(0,Math.min(mTL(m).total,sec));S.follow=true;PLROW=-9;
  playIcon();syncPlay(true,instant);
}
function scrollToRow(el,smooth,force){
  const sc=$('.trscroll');if(!sc||!el)return;
  const r=el.getBoundingClientRect(),s=sc.getBoundingClientRect();
  const top=(r.top-s.top)/SCALE,bot=(r.bottom-s.top)/SCALE,h=sc.clientHeight;
  /* leave it alone while it is comfortably in view — the sticky chapter bar
     takes the top 48px — so the page glides a row at a time rather than jittering */
  if(!force&&top>64&&bot<h-70)return;
  sc.scrollTo({top:Math.max(0,sc.scrollTop+top-h*.3),behavior:smooth?'smooth':'auto'});
}
function syncPlay(force,instant){
  const dock=$('.dock');if(!dock)return;
  const m=meeting(S.mid);if(!m)return;
  const T=mTL(m).total,ch=mChapters(m);
  const tr=dock.querySelector('.dk-tracks');
  if(tr)tr.style.setProperty('--pp',(S.playT/T*100).toFixed(3)+'%');
  const tm=dock.querySelector('.dk-time b');if(tm)tm.textContent=fmtClock(S.playT);
  const c=chapterAt(ch,S.playT),row=rowAt(m,S.playT);
  const nowEl=dock.querySelector('.dk-now');
  /* the label changes when the chapter or the voice does, not every tick */
  const sig=c+'|'+spokenAt(m,S.playT);
  if(nowEl&&(force||nowEl.dataset.sig!==sig)){nowEl.innerHTML=dockNow(m);nowEl.dataset.sig=sig;}
  if(force||c!==PLCH){
    PLCH=c;
    document.querySelectorAll('.cseg,.chh').forEach(e=>e.classList.toggle('now',+e.dataset.ch===c));
  }
  if(force||row!==PLROW){
    PLROW=row;
    document.querySelectorAll('.trs.now').forEach(e=>e.classList.remove('now'));
    const el=row>=0?document.querySelector(`.trs[data-row="${row}"]`):null;
    if(el){el.classList.add('now');if(S.follow||force)scrollToRow(el,!instant&&!force,!!force);}
  }
}
/* A person scrolling the transcript by hand has taken the wheel: stop following
   until they ask to be taken back. */
['wheel','touchmove'].forEach(ev=>document.addEventListener(ev,e=>{
  if(!S.playing||!e.target.closest||!e.target.closest('.trscroll'))return;
  if(S.follow){S.follow=false;playIcon();}
},{passive:true,capture:true}));
document.addEventListener('mousedown',e=>{
  /* the scrollbar belongs to the scroller itself, not to anything inside it */
  if(!S.playing||!e.target.classList||!e.target.classList.contains('trscroll'))return;
  if(e.offsetX>=e.target.clientWidth&&S.follow){S.follow=false;playIcon();}
},true);
/* dragging across the tracks scrubs */
let SCRUB=null;
document.addEventListener('mousedown',e=>{
  const tr=e.target.closest&&e.target.closest('.dk-tracks');
  if(!tr||e.button!==0)return;
  SCRUB={tr,moved:false};
},true);
document.addEventListener('mousemove',e=>{
  if(!SCRUB)return;
  SCRUB.moved=true;
  const r=SCRUB.tr.getBoundingClientRect(),m=meeting(S.mid);if(!m)return;
  const f=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width));
  S.playT=f*mTL(m).total;S.follow=true;syncPlay(false);
});
document.addEventListener('mouseup',()=>{
  if(SCRUB&&SCRUB.moved){const m=meeting(S.mid);if(m){PLROW=-9;syncPlay(true,true);}}
  setTimeout(()=>{SCRUB=null},0);
});
