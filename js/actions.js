// User action handlers (mutate state, e.g. create/delete items). 

/* ══════════════════════════════════ actions ══════════════════════════════════ */
const LINES=[['00:04','Jennifer Walsh','Thanks for making the time — let us start with where the pricing landed.'],
 ['00:12','You','Sure. I have the revised sheet, I just need to confirm the seat count with you.'],
 ['00:21','Tom Ellis','Before we go too far, I want to flag the data-processing addendum again.'],
 ['00:29','Jennifer Walsh','Noted. Let us take pricing first and come back to Legal.'],
 ['00:38','You','Understood — I will send the revised sheet through by Thursday.'],
 ['00:47','Tom Ellis','And can we get the platform team into the deep-dive this time?'],
 ['00:55','Jennifer Walsh','Yes. Procurement alone was not enough last round.'],
 ['01:04','You','On environments — I will get the GCP project set up for you this week so it is ready for the deep-dive.'],
 ['01:13','Tom Ellis','Good. And we are still holding the eighteenth for the deep-dive itself.']];
/* What the assistant catches as the call runs. `at` is the fixed second on
   the recording clock it fires at — 15s and 30s — so the demo is repeatable
   rather than landing at a slightly different moment (tied to transcript-line
   timing) on every run. */
const LIVEW=[
 {at:15,type:'conflict',
  title:'GCP is being set up, but the client called AWS a security requirement',
  why:'On the kickoff Jennifer said everything runs in their AWS account and called it a security requirement rather than a preference. A GCP environment would not clear their security review, and the work is being committed to now.',
  now:{tx:'On environments — I will get the GCP project set up for you this week so it is ready for the deep-dive.',who:'You',at:'01:04'},
  ref:{tx:'One thing to be clear on — everything runs in our AWS account. That is a security requirement, not a preference.',who:'Jennifer Walsh',mid:'m1',mt:'Acme kickoff',date:'11 Aug 2026',at:'25:30'},
  say:'Just a quick heads up before I set anything up — on the kickoff Jennifer said everything has to run in your AWS account. Should I be standing up AWS rather than GCP?',
  age:'just now'},
 {at:30,type:'discrepancy',
  title:'The deep-dive is on the eighteenth, but pricing is not due until Thursday the twentieth',
  why:'Jennifer needs the revised sheet before her internal review, and the deep-dive was meant to follow that conversation, not precede it. One of the two dates has to move.',
  now:{tx:'And we are still holding the eighteenth for the deep-dive itself.',who:'Tom Ellis',at:'01:13'},
  ref:{tx:'Understood — I will send the revised sheet through by Thursday.',who:'You',mid:null,mt:'Earlier in this call',date:'',at:'00:38'},
  say:'One sequencing thing — the pricing sheet lands Thursday, which is after the eighteenth. Do we want the deep-dive after that conversation instead?',
  age:'just now'}];

function startRecording(){
  if(S.bub&&S.bub.rec){S.bub.rec=false;S.bub.secs=0;S.rec2=null;}
  const id='m'+(Date.now()%100000);
  const m={id,title:'New recording',people:[F('Jennifer Walsh','J','jennifer.walsh@acme.com'),F('Tom Ellis','T','t.ellis@acme.com'),F('you','M')],
    group:'Today',day:'11 Aug 2026',time:'3:20 pm',
    dur:'00:00',folder:'client',fups:0,mynotes:'',transcript:[],
    notes:{summary:'',decisions:[],questions:[]}};
  db.meetings.unshift(m);
  S.rec={mid:id,secs:0,paused:false,lines:[],next:0,wnext:0};
  S.route='meeting';S.mid=id;S.tab='mynotes';
  S.wpeek=null;S.wopen=false;S.walert=false;S.wsay=null;S.wfilter='all';
  clearTimers();
  timers.push(setInterval(()=>{
    if(!S.rec)return;
    if(!S.rec.paused){
      S.rec.secs++;
      if(S.rec.next<LINES.length&&S.rec.secs>=(S.rec.next+1)*3){
        S.rec.lines.push(LINES[S.rec.next]);S.rec.next++;}
      /* fixed to the recording clock rather than to how far the transcript has
         gotten, so the watchout always lands on the same second instead of
         drifting with render/tick timing */
      const w=LIVEW[S.rec.wnext];
      if(w&&db.settings.woOn&&S.rec.secs>=w.at){
        S.rec.wnext++;
        const on={conflict:db.settings.woConflict,discrepancy:db.settings.woDiscrepancy,
                  clarification:db.settings.woClarify}[w.type];
        if(on){wFire(Object.assign({id:'w'+Date.now(),mid:S.rec.mid,status:'open'},w));return}
      }
    }
    if(S.route==='meeting'&&S.mid===S.rec.mid)render();
    else renderBubble();
  },1000));
  render();
  toast(`<b>Recording started.</b> The pill carries the controls — watch for watchouts on its badge.`,3600);
}
function stopRecording(){
  const r=S.rec;if(!r)return;const m=meeting(r.mid);
  clearTimers();clearTimeout(SAYT);
  S.rec=null;S.busy=true;S.wpeek=null;S.wopen=false;S.walert=false;S.wsay=null;
  const mm=String(Math.floor(r.secs/60)).padStart(2,'0'),ss=String(r.secs%60).padStart(2,'0');
  m.dur=`${mm}:${ss}`;m.title='Acme follow-up call';
  m.transcript=r.lines.map(l=>[l[0],l[1],l[2],'']);
  render();
  setTimeout(()=>{
    m.notes={summary:'A short follow-up with Acme. Pricing is close to final and will be sent on Thursday; Tom re-raised the data-processing addendum as the outstanding blocker, and both sides agreed the platform team joins the technical deep-dive rather than procurement alone.',
      decisions:[['Revised pricing sheet goes out on Thursday.','00:38'],
                 ["Acme's platform team attends the deep-dive.",'00:55']],
      questions:[['Who signs off the DPA on Acme\'s side?','00:21']]};
    m.genAt='3:26 pm';
    if(m.transcript[4])m.transcript[4][3]='Source of task 1';
    const nt=[{id:'n'+Date.now(),title:'Send the revised pricing sheet on Thursday',mid:m.id,due:'Fri 14 Aug',
      late:false,pri:'hi',done:false,grp:'Upcoming',quote:'I will send the revised sheet through by Thursday.',who:'You',at:'00:38'},
     {id:'n'+(Date.now()+1),title:'Get Legal to review the data-processing addendum',mid:m.id,due:'Fri 14 Aug',
      late:false,pri:'hi',done:false,grp:'Upcoming',quote:'I want to flag the data-processing addendum again.',who:'Tom Ellis',at:'00:21'},
     {id:'n'+(Date.now()+2),title:"Invite Acme's platform team to the deep-dive",mid:m.id,due:'Tue 18 Aug',
      late:false,pri:'',done:false,grp:'Upcoming',quote:'Can we get the platform team into the deep-dive this time?',who:'Tom Ellis',at:'00:47'}];
    db.tasks.push(...nt);m.fups=3;
    S.busy=false;S.tab='notes';render();
    const w=mWatchOpen(m.id);
    toast(`<b>Notes ready.</b> 3 tasks were added to Tasks.`,3600);
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
  clearTimers();const mode=db.settings.theme,th=db.settings.th,bub=db.settings.bubble;
  db=freshDb();db.settings.theme=mode;db.settings.th=th;db.settings.bubble=bub;
  if(hard){db.meetings=[];db.tasks=[];db.transcripts=[];db.convos=[];db.setupDone=0;
    db.settings.detect=false;db.settings.calendar=false;S.firstRun=true;}
  clearTimeout(SAYT);
  Object.assign(S,{route:'meetings',view:'all',mid:null,tab:'notes',tid:null,cid:hard?'new':'c1',
    settings:false,share:false,menu:null,panel:false,q:'',tq:'',vq:'',taskFilter:'all',
    showDone:false,speakers:'All speakers',range:'week',
    rec:null,rec2:null,busy:false,typing:false,addPerson:false,
    wid:null,wpanel:false,wfilter:'all',wdone:false,wpeek:null,wopen:false,walert:false,wsay:null,wseen:[],
    peek:null});
  pkStop();
  if(hard)db.watchouts=[];
  render();
  toast(hard?`<b>Reset.</b> You are now looking at a brand-new install.`:`<b>Sample data restored.</b>`);
}

