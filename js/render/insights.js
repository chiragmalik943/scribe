// Renders the insights panel. 

/* ══════════════════════════════════ insights ══════════════════════════════════ */
const RANGES={week:{days:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],mins:[95,40,130,75,160,20,0],
  words:[320,180,540,410,620,90,0],label:'This week · 10–16 Aug',t1:'8h 40m',t2:'2,160',t3:'96%',
  d1:'1h 15m more than last week',d2:'About 43 minutes of typing saved',d3:'Up 3 points since you added 6 terms'},
 month:{days:['W1','W2','W3','W4','W5','W6','W7'],mins:[420,510,380,620,540,300,160],
  words:[1400,1900,1650,2400,2160,980,620],label:'This month · August',t1:'32h 10m',t2:'11,110',t3:'94%',
  d1:'4h 05m more than July',d2:'About 3.7 hours of typing saved',d3:'Steady across the month'},
 all:{days:['Mar','Apr','May','Jun','Jul','Aug','Sep'],mins:[1200,1450,1310,1620,1580,1930,0],
  words:[4100,5200,4800,6100,5900,7300,0],label:'All time',t1:'151h 30m',t2:'33,400',t3:'93%',
  d1:'Since March 2026',d2:'About 11 hours of typing saved',d3:'Improving ~1 point a month'}};
function chart(vals,days,tipIdx,tipA,tipB,slot){
  const max=Math.max(...vals)||1,H=120;
  const cols=vals.map((val,i)=>{
    const h=val?Math.max(3,Math.round(val/max*H)):3;
    const tip=i===tipIdx?`<span class="ttip" style="bottom:${Math.max(8,h-46)}px;left:50%;transform:translateX(-50%)">
      <b>${tipA}</b>${tipB}</span>`:'';
    return `<span class="col">${tip}<span class="bar ${val?'':'mute'}" style="height:${h}px"></span></span>`;}).join('');
  const grid=[0.5,1].map(f=>`<span class="gridl" style="bottom:${Math.round(f*H)+9}px">
    <span>${Math.round(max*f)}</span></span>`).join('');
  return `<div style="padding-left:38px"><div class="chart ${slot||'fc-1'}">${grid}${cols}</div>
    <div class="xax">${days.map(d=>`<span>${d}</span>`).join('')}</div></div>`;
}
function viewInsights(){
  const R=RANGES[S.range];
  const terms=db.vocab.slice(0,3);const mx=terms[0]?terms[0].n:1;
  const per=S.range==='week'?'day':S.range==='month'?'week':'month';
  return `<div class="body">
   ${chiprow([['week','This week'],['month','This month'],['all','All time']],'range',S.range,
     `<span class="hint">Computed on this Mac from your own activity. Nothing is uploaded.</span>`)}
   ${pnl('Summary',R.label,'',`<div class="statrow">
     <div class="stat fcs fc-1"><div class="lb">Time in meetings</div><div class="big h">${R.t1}</div>
       <div class="dl">${ic('chart',13)}${R.d1}</div></div>
     <div class="stat fcs fc-2"><div class="lb">Words dictated</div><div class="big h">${R.t2}</div>
       <div class="dl">${ic('clock',13)}${R.d2}</div></div>
     <div class="stat fcs fc-3"><div class="lb">Kept after editing</div><div class="big h">${R.t3}</div>
       <div class="dl">${ic('check',13)}${R.d3}</div></div></div>`)}
   <div class="g2 pnls" style="margin-top:var(--s4)">
     ${pnl('Time in meetings','minutes per '+per,'',
       chart(R.mins,R.days,4,S.range==='week'?'2h 40m':'9h 00m','Busiest in this range','fc-1'))}
     ${pnl('Words dictated','per '+per,'',chart(R.words,R.days,-1,'','','fc-2'))}</div>
   <div class="g2 pnls" style="margin-top:var(--s4)">
     ${pnl('Most corrected terms',terms.length,
       `<span data-a="go" data-p="vocabulary">Open Vocabulary ${ic('chev',12)}</span>`,
       terms.map((t,i)=>`<div class="hbar fc-${3+(i%3)}"><span class="lb">${esc(t.t)}</span>
         <span class="tr"><i style="width:${Math.round(t.n/mx*100)}%"></i></span>
         <span class="vv">${t.n}&times;</span></div>`).join(''))}
     ${pnl('Worth adding',null,'',
       `<div style="font-size:13.5px;line-height:1.7;color:var(--ink2)">Adding the three terms
         beside this to your vocabulary would have saved <b>${
         terms.reduce((a,b)=>a+b.n,0)} corrections</b> in this range — AIT&#8209;Scribe applies them
         to dictation and meeting transcripts alike.</div>
        <div style="margin-top:var(--s4)"><button class="btn s sm" data-a="go" data-p="vocabulary">${
          ic('book',14)}Open Vocabulary</button></div>`)}
   </div></div>`;
}

