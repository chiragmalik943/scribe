// Renders the live speech-to-text view. 

/* ══════════════════════════════════ speech to text ══════════════════════════════════ */
function viewSpeech(){
  const live=!!S.rec2;
  let list=db.transcripts.filter(t=>S.view==='today'?t.when==='today':true);
  if(S.q)list=list.filter(t=>t.tx.toLowerCase().includes(S.q.toLowerCase()));
  const secs=live?S.rec2.secs:0;
  /* One card, two states. The hold button and the ready line lead — that is
     the thing to notice and the thing to do next — and the level meter is
     demoted into its own well beneath them: evidence you can glance at, not
     a second thing competing for the eye. Idle explains itself with a link
     under a label rather than a paragraph of instructions; live swaps that
     label for the timer, since there is nothing left to try. */
  const card=live?`<div class="card dictcard">
      <div class="dichead">
        <span class="holdbtn live">${ic('mic',19,2)}Listening…</span>
        <span class="dicstat">
          <span class="statusline"><span class="d" style="background:var(--danger)"></span>
            Recording · MacBook Air Microphone · release <span class="kbd">${db.settings.hotkey}</span> to paste</span>
          <span class="sub">On device · audio never leaves your Mac</span></span>
        <span class="dictime">0:${String(secs).padStart(2,'0')}</span></div>
      <div class="dicmeter live">${meterBars(64,true,secs)}</div></div>`
    :`<div class="card dictcard">
      <div class="dichead">
        <span class="holdbtn" data-a="holdstart">${ic('mic',18,2)}Hold <span class="kb">${
          db.settings.hotkey}</span> to talk</span>
        <span class="dicstat">
          <span class="statusline"><span class="d" style="background:var(--ok)"></span>
            Ready · MacBook Air Microphone · text pastes at your cursor</span>
          <span class="sub">On device · audio never leaves your Mac</span></span></div>
      <div class="dicmeter">
        <div class="dmhead"><span class="ghd" style="margin:0">Input level</span>
          <span class="link" data-a="holdstart" title="Hold ${db.settings.hotkey} and speak — the bars respond to your voice">
            Try it ${ic('chev',11)}</span></div>
        ${meterBars(64,false)}</div></div>`;
  const warn=db.settings.hotkey==='Fn'?`<div class="notice quiet" style="margin:0 0 var(--s6)">${
    ic('alert',15)}<span><b>macOS also uses Fn</b> for the emoji picker — dictation still works, but you
    may see both. <span class="link" data-a="settings" data-p="hotkey"
    style="margin-left:4px">Change key</span></span></div>`:'';
  const rows=list.length?`<div class="list">${list.map(t=>`<div class="trow">
      <span style="flex:1"><span class="tx" contenteditable="true">${esc(t.tx)}</span>
        <span class="tm">${t.time} · ${t.dest}</span></span>
      <span class="acts">
        <span data-a="demo" data-p="focus the line for editing" title="Edit">${ic('edit',14)}</span>
        <span data-a="copytx" data-p="${t.id}" title="Copy">${ic('copy',14)}</span>
        <span data-a="demo" data-p="replay the original audio" title="Play">${ic('play',14)}</span>
        <span class="dg" data-a="deltx" data-p="${t.id}" title="Delete">${ic('trash',14)}</span></span></div>`).join('')}</div>`
    :`<div class="hint" style="padding:var(--s6) 0">Nothing dictated yet ${
      S.view==='today'?'today':'in this range'}.<br>
      Hold <span class="kbd">${db.settings.hotkey}</span> anywhere on your Mac and your words land
      where the cursor is.</div>`;
  const metrics=db.transcripts.length?`<div class="metrics"><span><b>96%</b> kept after editing</span>
    <span><b>1.2s</b> average hold to paste</span>
    <span><b>${db.vocab.filter(v=>v.s==='ai').length}</b> terms learned from your corrections</span></div>`:'';
  return `<div class="body">${card}${warn}
    ${chiprow([['today','Today',db.transcripts.filter(x=>x.when==='today').length],
               ['week','This week',db.transcripts.length],
               ['all','All transcripts',db.transcripts.length]],'view',S.view,
      `<span class="hint">${list.length} shown · nothing leaves this Mac</span>`)}
    ${rows}${metrics}</div>`;
}

