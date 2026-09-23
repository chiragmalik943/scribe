// Renders the meetings list. 

/* ══════════════════════════════════ meetings ══════════════════════════════════ */
/* Lives on the home screen now, so it is a function rather than a literal
   wedged into the meeting list. */
function setupCard(){
  return `<div class="card setupcard" style="margin-bottom:var(--s7)">
    <div class="setuphd"><b>Finish setting up</b><span class="step">${3-db.setupDone} steps left</span>
      <span class="x" data-a="dismissSetup" title="Hide the setup checklist">${ic('x',15)}</span></div>
    <div class="setuprow"><span class="si">${ic('rec',17)}</span>
      <span><span class="t">Never miss a call</span><span class="s">Spot Zoom, Meet, Teams calls and Slack
      huddles, and offer to take notes. Without this, nothing is recorded or filed automatically.</span></span>
      <span class="a"><button class="btn ${db.settings.detect?'s':'p'} sm" data-a="toggleDetect">${
        db.settings.detect?ic('check',14)+'Call detection on':'Turn on call detection'}</button></span></div>
    <div class="setuprow"><span class="si">${ic('cal',17)}</span>
      <span><span class="t">See what's coming up</span><span class="s">Connect Google Calendar for your
      schedule and a nudge before each call. Optional.</span></span>
      <span class="a"><button class="btn s sm" data-a="connectCal">${
        db.settings.calendar?ic('check',14)+'Connected':'Connect calendar'}</button></span></div></div>`;
}
/* The flat list of every call, reached from the home screen or from the list
   column beside it. The setup checklist belongs on the home screen and is not
   repeated here. */
function viewMeetings(){
  let list=db.meetings.slice();
  if(S.view==='recent')list=list.filter(m=>['Today','Yesterday'].includes(m.group));
  if(S.q)list=list.filter(m=>(m.title+' '+m.people.map(p=>p.n).join(' ')+' '+
    m.transcript.map(t=>t[2]).join(' ')).toLowerCase().includes(S.q.toLowerCase()));
  if(!list.length) return `<div class="body">
    <div class="empty">
      <span class="ico">${ic('cal',22,1.6)}</span>
      <h2>${S.q?'No meetings match':'No meetings yet'}</h2>
      <p>${S.q?'Try a different search, or clear it to see everything.':
        'Turn on call detection and AIT-Scribe will take the notes, work out which folder the call belongs in, and file it for you.'}</p>
      <div class="a">${S.q?'<button class="btn s sm" data-a="clearq">Clear search</button>'
        :'<button class="btn s sm" data-a="record">'+ic('rec',15)+'Record one now</button>'}</div>
    </div></div>`;
  const groups=[];
  list.forEach(m=>{let g=groups.find(x=>x.g===m.group);if(!g){g={g:m.group,items:[]};groups.push(g)}g.items.push(m)});
  return `<div class="body">${groups.map(g=>`
    <div class="ghd">${g.g} <span class="n">· ${g.items.length} meeting${g.items.length>1?'s':''}</span></div>
    <div class="list">${g.items.map(m=>meetingRow(m,false,true)).join('')}
    </div>`).join('')}</div>`;
}
/* ── shared page furniture ────────────────────────────────────────────────
   actbar is the row under the tabs and askDock is the composer at the foot of
   a page. Both exist so the meeting page and the project page are laid out the
   same way; the column beside the notes is a .pnl, the same section box the
   home screen and Insights use. */
const actbar=(left,right)=>`<div class="actbar"><span class="l">${left||''}</span>${
  right?`<span class="r">${right}</span>`:''}</div>`;
const askDock=(ph,stick)=>`<div class="comp${stick?' stick':''}">
  <div class="compbox dock" data-a="mchat">${ic('spark',17)}
    <span class="ph">${esc(ph)}</span>
    <span class="sendb" title="Open the assistant">${ic('send',15,2)}</span></div></div>`;

