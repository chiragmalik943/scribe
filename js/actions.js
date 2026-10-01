// User action handlers (mutate state, e.g. create/delete items). 

/* ══════════════════════════════════ actions ══════════════════════════════════ */
/* ── the scripted call ────────────────────────────────────────────────────
   There is no microphone here, so a recording plays a short scripted call. Each
   line is spoken at a fixed second on the recording clock, which keeps the demo
   repeatable and lets the notes the assistant makes be tied to the second they
   came from. A line only reaches the transcript if the source that carries it
   is switched on: "You" comes through the microphone, everyone else through
   system audio. Mute one and that side of the call goes missing, exactly as it
   would for real. */
const LN=(s,who,tx)=>[fmtClock(s),who,tx];
const LINES=[
 LN(2,'Jennifer Walsh','Thanks for making the time — let us start with where the pricing landed.'),
 LN(6,'You','Sure. I have the revised sheet, I just need to confirm the seat count with you.'),
 LN(10,'Tom Ellis','Before we go too far, I want to flag the data-processing addendum again.'),
 LN(14,'Jennifer Walsh','Noted. Let us take pricing first and come back to Legal.'),
 LN(18,'You','Understood — I will send the revised sheet through by Thursday the twentieth.'),
 LN(22,'Tom Ellis','And can we get the platform team into the deep-dive this time?'),
 LN(26,'Jennifer Walsh','Yes. Procurement alone was not enough last round.'),
 LN(30,'You','On environments — I will get the GCP project set up for you this week so it is ready for the deep-dive.'),
 LN(34,'Tom Ellis','And we are still holding the eighteenth for the deep-dive itself.')];
/* What the assistant writes down as the call runs, and the second it does it.
   `ref` is the line it came from — an event is dropped if that line was never
   captured, because the assistant cannot note what it did not hear. `plain` is
   the same note without markup, which is what ends up in the finished notes. */
const AIEV=[
 {at:3,k:'chapter',t0:2,title:'Pricing and the DPA',tx:'New chapter: <b>Pricing and the DPA</b>.',ref:2},
 {at:4,k:'agenda',plain:'Where the pricing landed',tx:'Added to the agenda: <b>Where the pricing landed</b>.',ref:2},
 {at:7,k:'question',plain:'What seat count does the revised sheet assume?',
  tx:'Question noted: <b>What seat count does the revised sheet assume?</b>',ref:6},
 {at:11,k:'agenda',plain:'Data-processing addendum (DPA)',tx:'Added to the agenda: <b>Data-processing addendum (DPA)</b>.',ref:10},
 {at:12,k:'task',plain:'Get Legal to review the data-processing addendum',due:'Fri 14 Aug',pri:'hi',
  tx:'Task noted: <b>Get Legal to review the data-processing addendum</b>.',ref:10},
 {at:15,k:'decision',plain:'Pricing is taken first and Legal comes after.',
  tx:'Decision noted: <b>pricing first, Legal after</b>.',ref:14},
 {at:19,k:'task',plain:'Send the revised pricing sheet on Thursday',due:'Thu 20 Aug',pri:'hi',
  tx:'Task noted — you committed to this: <b>Send the revised pricing sheet</b>, due <b>Thu 20 Aug</b>.',ref:18},
 {at:23,k:'chapter',t0:22,title:'Technical deep-dive',tx:'New chapter: <b>Technical deep-dive</b>.',ref:22},
 {at:24,k:'task',plain:"Invite Acme's platform team to the deep-dive",due:'Tue 18 Aug',pri:'',
  tx:"Task noted: <b>Invite Acme's platform team to the deep-dive</b>.",ref:22},
 {at:27,k:'decision',plain:"Acme's platform team attends the deep-dive.",
  tx:"Decision noted: <b>Acme's platform team attends the deep-dive</b>.",ref:26},
 {at:31,k:'chapter',t0:30,title:'Environments and timing',tx:'New chapter: <b>Environments and timing</b>.',ref:30},
 {at:35,k:'agenda',plain:'Holding 18 Aug for the deep-dive',tx:'Added to the agenda: <b>Holding 18 Aug for the deep-dive</b>.',ref:34}];
/* What the assistant catches as the call runs. `at` is the fixed second on
   the recording clock it fires at, so the demo is repeatable rather than landing
   at a slightly different moment on every run. Each fires only if the line that
   triggers it was captured. */
const LIVEW=[
 {at:31,type:'conflict',
  title:'GCP is being set up, but the client called AWS a security requirement',
  why:'On the kickoff Jennifer said everything runs in their AWS account and called it a security requirement rather than a preference. A GCP environment would not clear their security review, and the work is being committed to now.',
  now:{tx:'On environments — I will get the GCP project set up for you this week so it is ready for the deep-dive.',who:'You',at:'00:30'},
  ref:{tx:'One thing to be clear on — everything runs in our AWS account. That is a security requirement, not a preference.',who:'Jennifer Walsh',mid:'m1',mt:'Acme kickoff',date:'11 Aug 2026',at:'25:30'},
  say:'Just a quick heads up before I set anything up — on the kickoff Jennifer said everything has to run in your AWS account. Should I be standing up AWS rather than GCP?',
  age:'just now'},
 {at:36,type:'discrepancy',
  title:'The deep-dive is on the eighteenth, but pricing is not due until Thursday the twentieth',
  why:'Jennifer needs the revised sheet before her internal review, and the deep-dive was meant to follow that conversation, not precede it. One of the two dates has to move.',
  now:{tx:'And we are still holding the eighteenth for the deep-dive itself.',who:'Tom Ellis',at:'00:34'},
  ref:{tx:'Understood — I will send the revised sheet through by Thursday the twentieth.',who:'You',mid:null,mt:'Earlier in this call',date:'',at:'00:18'},
  say:'One sequencing thing — the pricing sheet lands Thursday the twentieth, which is after the eighteenth. Do we want the deep-dive after that conversation instead?',
  age:'just now'}];

/* where the call goes by the second; also the only place the page is told a
   second has passed, so nothing re-renders on a tick */
function liveTick(){
  const r=S.rec;if(!r)return;
  if(!r.paused){
    r.secs++;
    while(r.lnext<LINES.length&&parseClock(LINES[r.lnext][0])<=r.secs){
      const l=LINES[r.lnext++];
      if(spkKey(l[1])==='you'?r.mic:r.sys)r.lines.push(l);else r.missed++;
    }
    while(r.enext<AIEV.length&&AIEV[r.enext].at<=r.secs){
      const e=AIEV[r.enext++];
      if(e.ref!=null&&!lineAt(r,e.ref))continue;
      r.ai.push(Object.assign({},e,{secs:r.secs}));
    }
    const w=LIVEW[r.wnext];
    if(w&&r.secs>=w.at){
      r.wnext++;
      const on={conflict:db.settings.woConflict,discrepancy:db.settings.woDiscrepancy,
                clarification:db.settings.woClarify}[w.type];
      if(db.settings.woOn&&on&&lineAt(r,parseClock(w.now.at))){
        wFire(Object.assign({id:'w'+Date.now(),mid:r.mid,status:'open'},w));return;}
    }
  }
  liveSync();renderBubble();
}
const liveRec=(mid,secs)=>({mid,secs,paused:false,mic:true,sys:db.settings.hearOthers!==false,
  scr:!!db.settings.recScreen,lines:[],ai:[],lnext:0,enext:0,wnext:0,missed:0});
function startRecording(){
  if(S.rec){golive();return}
  if(S.bub&&S.bub.rec){S.bub.rec=false;S.bub.secs=0;S.rec2=null;}
  const id='m'+(Date.now()%100000);
  const m={id,title:'New recording',people:[F('Jennifer Walsh','J','jennifer.walsh@acme.com'),F('Tom Ellis','T','t.ellis@acme.com'),F('you','M')],
    group:'Today',day:'11 Aug 2026',time:'3:20 pm',
    dur:'00:00',folder:'client',fups:0,mynotes:'',transcript:[],
    notes:{summary:'',decisions:[],questions:[]}};
  db.meetings.unshift(m);
  S.rec=liveRec(id,0);
  const r=S.rec,heard=[r.mic?'your microphone':'',r.sys?'the other participants':'',r.scr?'the screen':''].filter(Boolean);
  r.ai.push({k:'note',secs:0,tx:`Recording. I am listening to <b>${heard.join(', ').replace(/, ([^,]*)$/,' and $1')||'nothing yet'}</b>. `+
    `I will write down agenda items, questions, tasks and decisions here as they come up.`});
  S.route='meeting';S.mid=id;S.tab='live';S.menu=null;S.panel=false;S.mpanel=false;
  S.live={stickA:true,stickT:true};
  S.wpeek=null;S.wopen=false;S.walert=false;S.wsay=null;S.wfilter='all';
  clearTimers();
  timers.push(setInterval(liveTick,1000));
  render();
  toast(`<b>Recording started.</b> The timer and Stop are in the top bar; the pill floats over other apps.`,3600);
}
function golive(){
  if(!S.rec)return;
  pkDismiss();
  S.route='meeting';S.mid=S.rec.mid;S.tab='live';S.menu=null;S.panel=false;S.mpanel=false;S.fid=null;
  S.wpanel=false;render();
}
function stopRecording(){
  const r=S.rec;if(!r)return;const m=meeting(r.mid);
  clearTimers();clearTimeout(SAYT);
  S.rec=null;S.busy=true;S.wpeek=null;S.wopen=false;S.walert=false;S.wsay=null;
  /* a recording stopped from some other page is shown where its notes will be */
  S.route='meeting';S.mid=m.id;S.mpanel=false;S.wpanel=false;S.tab='notes';
  m.dur=fmtClock(r.secs);m.title='Acme follow-up call';
  m.transcript=r.lines.map(l=>[l[0],l[1],l[2],'']);
  render();
  setTimeout(()=>{
    const ev=k=>r.ai.filter(a=>a.k===k);
    const clock=a=>a.ref!=null?fmtClock(a.ref):fmtClock(a.secs);
    const tasks=ev('task');
    m.chapters=ev('chapter').map((a,i)=>[i===0?0:a.t0,a.title]);
    m.notes={
      summary:r.lines.length>2
        ?'A short follow-up with Acme. Pricing is close to final and the revised sheet goes out on Thursday the twentieth; Tom re-raised the data-processing addendum as the open item for Legal, and both sides agreed the platform team joins the technical deep-dive rather than procurement alone.'
        :'Not much was captured — only a few lines made it into the transcript, so there is little to summarise.',
      decisions:ev('decision').map(a=>[a.plain,clock(a)]),
      questions:ev('question').map(a=>[a.plain,clock(a)])};
    m.genAt='3:26 pm';
    const stamp=Date.now();
    const nt=tasks.map((a,i)=>{
      const row=m.transcript.find(t=>t[0]===clock(a));
      if(row)row[3]='Source of task '+(i+1);
      return {id:'n'+(stamp+i),title:a.plain,mid:m.id,due:a.due,late:false,pri:a.pri,done:false,grp:'Upcoming',
        quote:row?row[2]:'',who:row?row[1]:'',at:clock(a)};});
    db.tasks.push(...nt);m.fups=nt.length;
    S.busy=false;S.tab='notes';render();
    const w=mWatchOpen(m.id);
    toast(nt.length?`<b>Notes ready.</b> ${nt.length} task${nt.length>1?'s were':' was'} added to Tasks.`:'<b>Notes ready.</b>',3600);
    if(w.length)setTimeout(()=>toast(`${ic('radar',15)}<span><b>${w.length} watchout${
      w.length>1?'s':''} still open</b> on this call — they are on the Watchouts tab.</span>`,
      4000,hasConflict(w)?'dg':'warn'),900);
  },2600);
}
function holdStart(){
  if(S.rec2)return;
  if(S.bub&&S.bub.rec)bubStop();
  S.rec2={secs:0};clearTimers();
  timers.push(setInterval(()=>{S.rec2.secs++;render();
    if(S.rec2.secs>=4)holdStop();},1000));
  render();
}
function holdStop(){
  clearTimers();const s=S.rec2;S.rec2=null;
  const samples=['Send Karen the revised statement of work before Thursday',
    'Remember to confirm the seat count with Jennifer',
    'Draft the scorecard for the backend candidate this afternoon',
    'Ask Legal how long the addendum review usually takes'];
  const tx=samples[Math.floor(Date.now()/1000)%samples.length];
  db.transcripts.unshift({id:'s'+Date.now(),tx,
    time:'just now',
    dest:'pasted at your cursor',when:'today'});
  render();toast(`<b>Pasted.</b> “${esc(tx.slice(0,42))}…” went to your cursor.`);
}
const ANSWERS={
 'what can you do?':["I can search everything you have recorded and answer from it. Try asking me what you committed to on a call, who raised an objection, or to draft a recap email. I only see what is in AIT-Scribe — I cannot reach your inbox or files.",null],
 'summarize my last call':["Your last call was <b>Acme kickoff</b> (11 Aug, 34:02) with Jennifer Walsh and Tom Ellis. Jennifer confirmed 400 seats with a March go-live, contingent on revised pricing landing before Friday. Tom flagged the data-processing addendum as the blocker for signature. Both sides agreed a technical deep-dive is needed before scoping the migration.",['m1','Acme kickoff · 11 Aug · 34:02']],
 'what did i commit to this week?':["Five things, three of them from the Acme kickoff:<br>&nbsp;&nbsp;1.&nbsp; Send the revised pricing sheet to Jennifer — <b>2 days late</b>.<br>&nbsp;&nbsp;2.&nbsp; Loop in Legal on the DPA — <b>overdue</b>.<br>&nbsp;&nbsp;3.&nbsp; Book the technical deep-dive for the week of the 25th.<br>&nbsp;&nbsp;4.&nbsp; Confirm the renewal figure with Robert.<br>&nbsp;&nbsp;5.&nbsp; Send Q3 headcount numbers to Ashley.",['m1','Acme kickoff · 11 Aug']]
};
function askAssistant(q){
  q=q.trim();if(!q)return;
  let c=db.convos.find(x=>x.id===S.cid);
  if(!c||S.cid==='new'){c={id:'c'+Date.now(),title:q.length>40?q.slice(0,40)+'…':q,when:'Just now',msgs:[]};
    db.convos.unshift(c);S.cid=c.id;}
  c.msgs.push({r:'u',tx:esc(q)});
  S.typing=true;render();
  setTimeout(()=>{
    const key=q.toLowerCase().replace(/\s+/g,' ').trim();
    const hit=ANSWERS[key];
    const ans=hit?hit[0]:`I looked across your ${db.meetings.length} recorded meetings for that. Here is what stands out: the Acme rollout is the live thread — pricing is due Friday and the DPA is blocking signature. Northwind is agreed at a 4% uplift on a two-year term pending written confirmation.`;
    const src=hit?hit[1]:['m1','Acme kickoff · 11 Aug'];
    c.msgs.push({r:'a',tx:ans,src});
    S.typing=false;render();
  },1200);
}
function resetDemo(hard){
  clearTimers();const mode=db.settings.theme,bub=db.settings.bubble;
  db=freshDb();db.settings.theme=mode;db.settings.bubble=bub;
  if(hard){db.meetings=[];db.tasks=[];db.transcripts=[];db.convos=[];db.setupDone=0;
    db.settings.detect=false;db.settings.calendar=false;S.firstRun=true;}
  clearTimeout(SAYT);
  Object.assign(S,{route:'meetings',view:'all',mid:null,tab:'notes',tid:null,cid:hard?'new':'c1',
    setBack:null,sq:'',share:false,menu:null,panel:false,q:'',tq:'',vq:'',taskFilter:'all',
    showDone:false,speakers:'All speakers',range:'week',
    rec:null,rec2:null,busy:false,typing:false,addPerson:false,
    wid:null,wpanel:false,wfilter:'all',wdone:false,wpeek:null,wopen:false,walert:false,wsay:null,wseen:[],
    peek:null});
  pkStop();
  if(hard)db.watchouts=[];
  render();
  toast(hard?`<b>Reset.</b> You are now looking at a brand-new install.`:`<b>Sample data restored.</b>`);
}

