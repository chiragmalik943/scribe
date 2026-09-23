// Renders the assistant panel. 

/* ══════════════════════════════════ assistant ══════════════════════════════════ */
function viewAssistant(){
  const c=db.convos.find(x=>x.id===S.cid);
  const off=!db.settings.convo;
  if(!c||!db.convos.length||S.cid==='new'){
    return `<div class="body"><div class="empty">
      <span class="ico">${ic('spark',22,1.6)}</span><h2>Ask about your meetings</h2>
      <p>The assistant searches your transcripts, summarises calls and drafts your tasks.
        It only sees what you have recorded in AIT&#8209;Scribe.</p>
      <div class="chips">
        <span class="chip" data-a="ask" data-p="What can you do?">${ic('help',15)}What can you do?</span>
        <span class="chip" data-a="ask" data-p="Summarize my last call">${ic('spark',15)}Summarize my last call</span>
        <span class="chip" data-a="ask" data-p="What did I commit to this week?">${ic('list',15)}What did I commit to this week?</span>
      </div>
      <div class="scope">Every answer cites the meeting it came from.</div></div>
      ${composer(off)}</div>`;
  }
  return `<div class="body">
    <div style="flex:1;overflow-y:auto">${c.msgs.map(m=>`
      <div class="msg ${m.r}"><span class="who">${m.r==='u'?db.user.initial:ic('spark',15,2)}</span>
        <span class="tx">${m.tx}${m.src?`<br><span class="src" data-a="open" data-p="${m.src[0]}">${
          ic('users',13)}${m.src[1]}</span>`:''}</span></div>`).join('')}
      ${S.typing?`<div class="msg a"><span class="who">${ic('spark',15,2)}</span>
        <span class="tx typing"><i></i><i></i><i></i></span></div>`:''}</div>
    ${composer(off)}</div>`;
}
function composer(off){
  return `<div class="comp">
    ${off?`<div class="notice quiet" style="margin-bottom:var(--s3);padding:0 2px">${ic('alert',14)}
      <span>Conversation mode is off, so the assistant cannot reply out loud yet — text chat works.
      <span class="link" data-a="settings" data-p="conv" style="margin-left:4px">Turn it on</span></span></div>`:''}
    <div class="compbox"><span class="ic" data-a="demo" data-p="attach a file" title="Attach a file">${ic('clip',17)}</span>
      <span class="ic" data-a="demo" data-p="dictate your question" title="Dictate your question">${ic('mic',17)}</span>
      <input placeholder="Ask about your meetings…" data-a="ask" id="askbox">
      <span class="sendb" data-a="asksend" title="Send">${ic('send',15,2)}</span></div></div>`;
}
