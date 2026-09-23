// Renders the settings screens. 

/* ══════════════════════════════════ settings ══════════════════════════════════ */
const SNAV=[['MEETINGS',[['meet','Detection & capture','cal'],['ainotes','AI notes','spark']]],
 ['SPEECH TO TEXT',[['hotkey','Hotkey','kbd'],['engine','Engine','chip'],['svocab','Vocabulary','book']]],
 ['ASSISTANT',[['conv','Conversation','spark'],['agent','Actions & connectors','plug']]],
 ['TASKS',[['tasks','Capture & reminders','checkc']]],
 ['GENERAL',[['appearance','Appearance','sun'],['acct','Account & plan','users'],['priv','Privacy & data','shield']]],
 ['DEMO',[['components','Notifications & dialogs','chip']]]];
const tog=(k,on,dis)=>`<span class="tog ${on?'on':''} ${dis?'dis':''}" data-a="${dis?'togdis':'tog'}" data-p="${k}"><i></i></span>`;
const sgroup=(icon,t,s,rows)=>`<div class="sgroup"><div class="sghd"><span class="si">${ic(icon,16)}</span>
  <span><b>${t}</b><span>${s}</span></span></div>${rows}</div>`;
const srow=(t,s,a)=>`<div class="srow"><span><span class="t">${t}</span><span class="s">${s}</span></span>
  <span class="a">${a}</span></div>`;
const st=db=>db.settings;

function settingsPane(){
  const g=db.settings;
  switch(S.spane){
  case 'appearance':return ['Appearance','How AIT-Scribe looks on this Mac',
    sgroup('sun','Light or dark','Applies immediately, on this Mac only',
      `<div class="srow"><span><span class="t">Mode</span>
        <span class="s">Every theme ships a hand-tuned dark set rather than an inversion of its
        light one, so contrast holds in both.</span></span>
        <span class="a"><span class="fchip ${g.theme==='light'&&!g.sysTheme?'on':''}" data-a="theme" data-p="light">${ic('sun',14)}Light</span>
          <span class="fchip ${g.theme==='dark'&&!g.sysTheme?'on':''}" data-a="theme" data-p="dark">${ic('moon',14)}Dark</span></span></div>`+
      srow('Match my system','Follow macOS appearance and switch automatically.',tog('sysTheme',g.sysTheme)))+
    sgroup('sliders','Theme',`${THEMES.length} themes · currently ${theme(g.th).name}, ${g.theme} mode`,
      `<div class="thgrid">${THEMES.map(t=>{
        const on=g.th===t.id, pv=t.pv[g.theme==='dark'?'dark':'light'];
        return `<div class="thcard ${on?'on':''}" data-a="setth" data-p="${t.id}" title="Use the ${t.name} theme">
          <div class="prev">
            <i class="a" style="background:${pv[0]}"></i>
            <i style="background:${pv[1]}"></i>
            <i class="b" style="background:${pv[3]}"></i>
            <i class="b" style="background:${pv[2]}"></i></div>
          <div class="nm">${esc(t.name)}<span class="tick">${ic('check',11,3)}</span></div>
          <div class="ds">${esc(t.ds)}</div>
          <div class="dots">${t.sw.map(c=>`<i style="background:${c}"></i>`).join('')}
            <span class="modes">LIGHT · DARK</span></div></div>`}).join('')}</div>`)+
    sgroup('reset','Demo controls','Not part of the real product',
      srow('Reset to first run','Clears all meetings, tasks and transcripts and replays the empty first-run state with setup incomplete.',
        `<button class="btn s sm" data-a="resetDemo">${ic('reset',14)}Reset demo</button>`)+
      srow('Reload sample data','Puts the 8 meetings, 9 tasks and 6 transcripts back.',
        `<button class="btn s sm" data-a="reloadDemo">Reload data</button>`))];
  case 'meet':return ['Detection & capture','How AIT-Scribe notices calls and what it listens to',
    sgroup('rec','Detection','Spot calls automatically and offer to take notes',
      srow('Detect meetings','Zoom, Google Meet, Teams, Webex and Slack huddles.',tog('detect',g.detect))+
      srow('Screen Recording permission','macOS requires this to see call windows. AIT-Scribe never records the screen unless you ask it to.',
        (g.screenRec?`<span class="pri ok">${ic('check',12)}Granted</span>`:`<span class="pri">Not granted</span>`)+
        `<button class="btn s sm" data-a="demo" data-p="open macOS System Settings">Review in System Settings</button>`))+
    sgroup('users','Capture','What is listened to during a meeting',
      srow('Hear the other participants','Transcribes both sides via system audio. Without it, only your microphone is captured.',
        tog('hearOthers',g.hearOthers,!g.detect)+(g.detect?'':`<span class="pri">Needs detection</span>`))+
      srow('Record the meeting screen','Captures shared slides and docs for richer notes and a rewatchable video. Off by default. The recording stays on this Mac and is never uploaded.',
        tog('recScreen',g.recScreen)))+
    sgroup('cal','Calendar','Upcoming meetings and reminders',
      srow('Google Calendar','See your schedule and get a nudge 10 minutes and 1 minute before each call.',
        g.calendar?`<span class="pri ok">${ic('check',12)}Connected</span>`:`<button class="btn p sm" data-a="connectCal">Connect</button>`))];
  case 'ainotes':return ['AI notes','What the summary contains and where meetings are filed',
    sgroup('spark','Notes','Generated when a recording stops',
      srow('Summary, decisions and open questions','The standard structure for every meeting.',tog('nSummary',true))+
      srow('Extract tasks','Owners and dates taken from what was said.',tog('extract',g.extract))+
      srow('Note length','Longer notes keep more detail from the transcript.',
        `<span class="sel" data-a="demo" data-p="change note length">Balanced ${ic('chevd',12)}</span>`))+
    sgroup('radar','Meeting watchouts','Read a live call against everything said before it',
      srow('Watch for watchouts','Compares what is being said now against earlier calls, decisions and the numbers already agreed.',tog('woOn',g.woOn))+
      srow('Conflicts','Something said now contradicts a decision or a stated requirement.',
        tog('woConflict',g.woConflict,!g.woOn))+
      srow('Discrepancies','Two numbers, dates or terms that do not agree.',
        tog('woDiscrepancy',g.woDiscrepancy,!g.woOn))+
      srow('Clarifications','A question that was asked in the call and never answered.',
        tog('woClarify',g.woClarify,!g.woOn))+
      srow('Interrupt me for','Everything else waits behind the badge on the pill until you ask for it.',
        `<span class="fchip ${g.woPeek==='conflict'?'on':''}" data-a="wopeek" data-p="conflict">Conflicts only</span>
         <span class="fchip ${g.woPeek==='all'?'on':''}" data-a="wopeek" data-p="all">Anything</span>
         <span class="fchip ${g.woPeek==='none'?'on':''}" data-a="wopeek" data-p="none">Nothing</span>`)+
      srow('Let the assistant speak','“Bring this up” says the suggested wording into the call and puts it in the transcript. Off means it only ever suggests.',
        tog('woSpeak',g.woSpeak,!g.woOn)))+
    sgroup('folder','Filing','Where finished meetings end up',
      srow('File meetings into folders automatically','AIT-Scribe matches the call to a folder from the participants and what was said.',tog('autoFile',g.autoFile))+
      srow('If it cannot tell','Unmatched calls go to a folder you choose.',
        `<span class="sel" data-a="demo" data-p="pick a fallback folder">${ic('folder',14)}Unfiled ${ic('chevd',12)}</span>`))];
  case 'hotkey':return ['Hotkey','The key you hold to dictate',
    sgroup('kbd','Push to talk','Hold a key to record, release to transcribe',
      srow('Dictation key','Hold anywhere on your Mac. Your words land where the cursor is.',
        `<span class="keycap">${g.hotkey}</span><button class="btn s sm" data-a="cyclekey">Change key</button>`)+
      srow('Mode','Hold to talk is safer — nothing is captured when the key is up.',
        `<span class="sel" data-a="demo" data-p="switch to press-once-to-start mode">${g.mode} ${ic('chevd',12)}</span>`))+
    (g.hotkey==='Fn'?`<div class="notice warn">${ic('alert',17)}
      <span><b>macOS also uses Fn</b> for the emoji picker, so you may see both when you dictate. Dictation still works.</span>
      <span class="act"><button class="btn s sm" data-a="cyclekey">Pick another key</button></span></div>`
      :`<div class="notice ok">${ic('check',17)}<span><b>${g.hotkey} is free.</b> Nothing else on this Mac claims it.</span></div>`)+
    sgroup('mic','Floating bubble','A draggable control that sits over your other windows',
      srow('Show the floating bubble','Click it to dictate. Hover for record, ask and more. Drag it anywhere.',
        tog('bubble',g.bubble))+
      srow('While a meeting is recording','It stretches into a pill — timer, pause, stop and a badge for anything the assistant notices. It goes back to a circle when you stop.',
        `<span class="pri ok">${ic('check',12)}Always</span>`)+
      srow('Position','Drag the bubble to move it, or put it back where it started.',
        `<button class="btn s sm" data-a="bubreset">${ic('reset',14)}Reset position</button>`))+
    sgroup('info','What works best','Checked against your other apps as you type a shortcut',
      `<div class="tips">
        <div><span style="color:var(--okInk)">${ic('check',14)}</span><span><b>Modifier combos</b> such as Control+Option are safest — nothing else claims them.</span></div>
        <div><span style="color:var(--okInk)">${ic('check',14)}</span><span><b>Single modifiers</b> such as Right Control work well for hold-to-record.</span></div>
        <div><span style="color:var(--warnInk)">${ic('alertc',14)}</span><span><b>Avoid letter keys on their own</b> — they type characters while held.</span></div>
        <div><span style="color:var(--info)">${ic('info',14)}</span><span>Use at most three keys, for example Control+Option+M.</span></div>
      </div>`)];
  case 'engine':return ['Engine','Where your speech is turned into text',
    `<div class="wrapflex">
      <div class="opt ${g.engine==='local'?'on':''}" data-a="engine" data-p="local"><span class="rdo ${g.engine==='local'?'on':''}"></span>
        <span><span class="t">On this Mac</span><span class="s">Runs locally using the Parakeet model.</span>
        <ul><li><span style="color:var(--okInk)">${ic('check',13)}</span>Audio never leaves your Mac</li>
          <li><span style="color:var(--okInk)">${ic('check',13)}</span>Works with no internet</li>
          <li><span style="color:var(--okInk)">${ic('check',13)}</span>About 1.2s from release to paste</li>
          <li><span style="color:var(--warnInk)">${ic('alertc',13)}</span>Less accurate on strong accents and noisy rooms</li></ul></span></div>
      <div class="opt ${g.engine==='cloud'?'on':''}" data-a="engine" data-p="cloud"><span class="rdo ${g.engine==='cloud'?'on':''}"></span>
        <span><span class="t">In the cloud</span><span class="s">Sends audio to AIT-Scribe's servers for transcription.</span>
        <ul><li><span style="color:var(--okInk)">${ic('check',13)}</span>Noticeably better on accents and background noise</li>
          <li><span style="color:var(--okInk)">${ic('check',13)}</span>Handles 30+ languages</li>
          <li><span style="color:var(--warnInk)">${ic('alertc',13)}</span>Needs internet; adds around 0.8s</li>
          <li><span style="color:var(--warnInk)">${ic('alertc',13)}</span>Audio leaves your Mac and is deleted after transcription</li></ul></span></div></div>`+
    sgroup('sliders','Language and accuracy','Applies to dictation and meeting transcripts',
      srow('Spoken language','Set this rather than leaving it on auto — it measurably improves accuracy.',
        `<span class="sel" data-a="cyclelang">${g.lang} ${ic('chevd',12)}</span>`)+
      srow('Use my vocabulary',`Names, products and acronyms you have taught it. ${db.vocab.length} terms.`,
        tog('useVocab',g.useVocab)+`<button class="btn s sm" data-a="govocab">Manage</button>`))];
  case 'svocab':return ['Vocabulary','Words AIT-Scribe should get right',
    sgroup('book','Your terms',`${db.vocab.length} terms across dictation and meetings`,
      srow('Open the vocabulary manager','Add, edit and remove terms, and see how often each one was corrected.',
        `<button class="btn p sm" data-a="govocab">${ic('book',14)}Open Vocabulary</button>`)+
      srow('Learn from my corrections','When you edit a transcript, add the corrected word automatically.',tog('learnVocab',true)))];
  case 'conv':return ['Conversation','Talk to the assistant out loud, using your own API keys',
    (g.convo?`<div class="notice ok">${ic('check',17)}<span><b>Conversation mode is on.</b> Hold ${g.convoHotkey} anywhere to talk to the assistant.</span></div>`
     :`<div class="notice warn">${ic('alert',17)}<span>Conversation mode is <b>off</b> until step 1 is done.
       Text chat over your meetings already works without any keys.</span></div>`)+
    `<div class="sgroup"><div class="sghd"><span class="si">${ic('key',16)}</span>
      <span><b>What you need</b><span>Two of the three are optional — the assistant tells you which</span></span></div>
      <div class="step"><span class="num ${g.anthropicKey?'done':''}">${g.anthropicKey?ic('check',13,2.6):'1'}</span>
        <span style="flex:1"><span class="t">Anthropic API key <span class="pillx">Required</span></span>
          <span class="s">Generates the assistant's replies. Charged to your Anthropic account, not ours.</span>
          <div style="display:flex;gap:9px;margin-top:10px;align-items:center;flex-wrap:wrap">
            <span class="inp" style="flex:1;max-width:400px"><input placeholder="sk-ant-…" value="${esc(g.anthropicKey)}" data-a="key">
              ${ic('eye',15)}</span>
            <button class="btn s sm" data-a="pastekey">Paste</button>
            <span class="link" data-a="demo" data-p="open console.anthropic.com in your browser">Where do I get one? ↗</span></div></span></div>
      <div class="step"><span class="num ${g.spoken?'done':'wait'}">${g.spoken?ic('check',13,2.6):'2'}</span>
        <span style="flex:1"><span class="t">Spoken replies <span class="pillx">Optional</span></span>
          <span class="s">Reads answers aloud with an ElevenLabs voice. Leave this off for a normal text-only chat — no second key needed.</span></span>
        <span class="a">${tog('spoken',g.spoken)}</span></div>
      <div class="step"><span class="num wait">3</span>
        <span style="flex:1"><span class="t">Conversation hotkey <span class="pillx">Optional</span></span>
          <span class="s">Hold to talk to the assistant from anywhere, like dictation.</span></span>
        <span class="a"><span class="keycap">${g.convoHotkey}</span>
          <button class="btn s sm" data-a="demo" data-p="record a new shortcut">Change</button></span></div></div>`+
    sgroup('spark','Conversation mode','Available once step 1 is complete',
      srow('Enable conversation mode',g.anthropicKey?'Ready to go. Hold your hotkey anywhere to talk.':
        'Add an Anthropic key above to turn this on. Nothing is sent anywhere until you do.',
        (g.anthropicKey?'':`<span class="pri">Needs a key</span>`)+tog('convo',g.convo,!g.anthropicKey)))];
  case 'agent':return ['Actions & connectors','Let the assistant do things, not just answer questions',
    sgroup('shield','Safety','How much the assistant may do on its own',
      srow('Always ask before acting','Every action is shown to you with exactly what it will do, and waits for your confirmation. Turning this off is not recommended.',
        tog('askFirst',g.askFirst)))+
    `<div class="sgroup"><div class="sghd"><span class="si">${ic('plug',16)}</span>
      <span><b>What it may do</b><span>Each action needs the connector beside it</span></span></div>
      ${srow('Create and update tasks','In AIT-Scribe. No connector needed.',tog('actFollowups',g.actFollowups))}
      ${srow('Draft emails','Writes a draft in Gmail. Never sends without you pressing send.',
        g.gmail?`<span class="pri ok">${ic('check',12)}Connected</span>`:`<span class="pri">Not connected</span>
        <button class="btn s sm" data-a="connect" data-p="gmail">Connect Gmail</button>`)}
      ${srow('Add calendar events','Creates events on your Google Calendar.',
        g.gcal?`<span class="pri ok">${ic('check',12)}Connected</span>`:`<span class="pri">Not connected</span>
        <button class="btn s sm" data-a="connect" data-p="gcal">Connect Calendar</button>`)}
      ${srow('Post a recap to Slack','Posts to a channel you pick, as you.',
        g.slack?`<span class="pri ok">${ic('check',12)}Connected</span>`:`<span class="pri">Not connected</span>
        <button class="btn s sm" data-a="connect" data-p="slack">Connect Slack</button>`)}</div>`+
    sgroup('list','Activity','A record of everything the assistant did',
      srow('Action log','Every action, when it ran, and whether you approved it. Kept for 90 days.',
        `<button class="btn s sm" data-a="demo" data-p="open the action log">Open log</button>`))];
  case 'tasks':return ['Capture & reminders','Where tasks come from and when you hear about them',
    sgroup('checkc','Capture','How tasks are found',
      srow('Extract tasks automatically','After each meeting is summarised, from your live notes and the transcript together.',tog('extract',g.extract))+
      srow('Only when I am named','Off means you also get commitments where nobody was named — useful, but noisier.',tog('onlyNamed',g.onlyNamed)))+
    sgroup('users','Who you are','So the assistant knows which commitments are yours',
      srow('Names people call you','Beyond your account name — nicknames and shortenings used in meetings.',
        g.names.map(n=>`<span class="pillx">${esc(n)}</span>`).join('')+
        `<button class="btn s sm" data-a="addname">${ic('plus',13)}Add</button>`))+
    sgroup('bell','Reminders','Quiet by design — a daily summary, not a ping per meeting',
      srow('Daily summary','One notification with everything still open.',
        tog('daily',g.daily)+`<span class="sel" data-a="cycletime" data-p="dailyAt">${g.dailyAt} ${ic('chevd',12)}</span>`)+
      srow('Overdue nudge','A single morning notice for anything past its date.',
        tog('overdue',g.overdue)+`<span class="sel" data-a="cycletime" data-p="overdueAt">${g.overdueAt} ${ic('chevd',12)}</span>`)+
      srow('Never interrupt me during a call','Reminders wait until the meeting ends.',tog('noInterrupt',g.noInterrupt)))];
  case 'acct':return ['Account & plan','Signed in as '+db.user.name,
    sgroup('users','Account','This Mac',
      srow(db.user.name,'michael.carter@example.com · signed in since March 2026',
        `<button class="btn s sm" data-a="demo" data-p="sign you out">Sign out</button>`))+
    sgroup('spark','Plan','What you get today',
      srow('Free plan','Unlimited local dictation, 10 recorded meetings a month, 1 seat. You have used 8 of 10 this month.',
        `<button class="btn p sm" data-a="demo" data-p="open the upgrade flow">See plans</button>`))];
  /* ── Temporary demo page. Not part of the product: it exists so every
        transient piece of UI can be triggered on demand instead of having to
        reproduce the situation that normally causes it. Delete this case and
        its SNAV entry to remove it. ───────────────────────────────────── */
  case 'components':return ['Notifications & dialogs','Fire each transient component on demand',
    `<div class="notice info">${ic('info',17)}
      <span><b>This page is a harness, not a feature.</b> Nothing here changes any setting —
      each button just shows the component so it can be checked in the current theme.</span></div>`+
    sgroup('bell','Toasts','Bottom centre. Auto-dismiss, no action needed',
      `<div class="dwrap"><div class="dbtns">
        ${[['','Neutral'],['ok','Success'],['warn','Warning'],['dg','Error'],['info','Info']].map(([k,l])=>
          `<button class="btn s sm" data-a="dtoast" data-p="${k}">${l}</button>`).join('')}
        <button class="btn s sm" data-a="dtoast" data-p="long">Long, with markup</button>
        <button class="btn s sm" data-a="dtoast" data-p="stack">Three at once</button></div>
      <div class="dnote">Neutral is the everyday one. The four coloured variants are for outcomes
        the user did not ask for — a sync failing, a key being claimed.</div></div>`)+
    sgroup('rec','System notifications','Top right. What macOS shows when the app is in the background',
      `<div class="dwrap"><div class="dbtns">
        ${[['detect','Call detected'],['ready','Notes ready'],['daily','Daily summary'],
           ['overdue','Overdue nudge'],['pasted','Dictation pasted'],['hotkey','Hotkey conflict']].map(([k,l])=>
          `<button class="btn s sm" data-a="dosn" data-p="${k}">${l}</button>`).join('')}
        <button class="btn s sm" data-a="dosn" data-p="all">Post all six</button>
        <button class="btn t sm" data-a="dosn" data-p="clear">Clear</button></div>
      <div class="dnote">These are the only six the product sends. Each carries its own actions and
        clears itself after seven seconds, or when a button is pressed.</div></div>`)+
    sgroup('alert','Inline notices','Rendered in place, above the content they concern',
      `<div class="dwrap">
        <div class="notice ok">${ic('check',17)}<span><b>Setup complete.</b> Call detection is on.</span>
          <span class="act"><button class="btn t sm" data-a="noop">Dismiss</button></span></div>
        <div class="notice warn">${ic('alert',17)}<span><b>macOS also uses Fn</b> for the emoji picker.</span>
          <span class="act"><button class="btn s sm" data-a="noop">Change key</button></span></div>
        <div class="notice dg">${ic('alertc',17)}<span><b>Cloud transcription failed.</b> The last three
          clips are still on this Mac.</span>
          <span class="act"><button class="btn s sm" data-a="noop">Retry</button></span></div>
        <div class="notice info">${ic('info',17)}<span>Transcripts stay on this Mac until you delete them.</span></div>
      </div>`)+
    sgroup('chip','Dialogs','Centred, with a scrim. Everything behind them is inert',
      `<div class="dwrap"><div class="dbtns">
        <button class="btn s sm" data-a="confirmDelete" data-p="${(db.meetings[0]||{}).id||''}">Destructive confirm</button>
        <button class="btn s sm" data-a="menu" data-p="infodlg:">Informational</button>
        <button class="btn s sm" data-a="menu" data-p="dangerdlg:">Danger, typed confirm</button>
        <button class="btn s sm" data-a="menu" data-p="progressdlg:">In progress</button>
        <button class="btn s sm" data-a="share" data-p="${(db.meetings[0]||{}).id||''}">Share sheet</button>
        <button class="btn s sm" data-a="addperson" data-p="${(db.meetings[0]||{}).id||''}">Add person</button>
        <button class="btn s sm" data-a="shortcuts">Keyboard shortcuts</button></div>
      <div class="dnote">Opening one closes this Settings window, which is the real behaviour —
        two scrims never stack. Press <span class="kbd">Esc</span> to come back.</div></div>`)+
    sgroup('list','Menus and popovers','Anchored to whatever was clicked',
      `<div class="dwrap"><div class="dbtns">
        <button class="btn s sm" data-a="notifs">Notification tray</button>
        <button class="btn s sm" data-a="menu" data-p="meeting:${(db.meetings[0]||{}).id||''}">Meeting actions</button>
        <button class="btn s sm" data-a="menu" data-p="task:${(db.tasks[0]||{}).id||''}">Task actions</button>
        <button class="btn s sm" data-a="menu" data-p="folder:${(db.meetings[0]||{}).id||''}">Move to folder</button>
        <button class="btn s sm" data-a="menu" data-p="fmenu:${(topFolders()[0]||{}).id||''}">Folder options</button>
        <button class="btn s sm" data-a="menu" data-p="bubmore:">Bubble menu</button></div>
      <div class="dnote">Menus position themselves from the button that opened them and are clamped
        to the window, so one opened near an edge flips rather than clipping.</div></div>`)+
    sgroup('radar','Watchouts and the recording pill','The floating control in each of its shapes',
      `<div class="dwrap"><div class="dbtns">
        <button class="btn s sm" data-a="bubdemo" data-p="idle">Idle bubble</button>
        <button class="btn s sm" data-a="bubdemo" data-p="dict">Dictating capsule</button>
        <button class="btn s sm" data-a="bubdemo" data-p="rec">Recording pill</button>
        <button class="btn s sm" data-a="bubdemo" data-p="paused">Paused</button>
        <button class="btn s sm" data-a="bubdemo" data-p="peek">Conflict peek</button>
        <button class="btn s sm" data-a="bubdemo" data-p="list">Watchout list</button>
        <button class="btn s sm" data-a="bubdemo" data-p="say">Speaking into the call</button></div>
      <div class="dgrid dchips w-conflict"><span class="wchip">${ic('conflict',12)}Conflict</span>
        <span class="wchip brand">${ic('speak',12)}Speaking</span>
        <span class="wdot">${ic('radar',11)}3</span></div>
      <div class="dgrid dchips w-discrepancy"><span class="wchip">${ic('delta',12)}Discrepancy</span>
        <span class="wstat"><i></i>1 discrepancy</span></div>
      <div class="dgrid dchips w-clarification"><span class="wchip">${ic('help',12)}Clarification</span>
        <span class="wstat"><i></i>2 clarifications</span></div>
      <div class="dnote">The pill only interrupts for a conflict — everything else waits on the badge.
        Close this window to see it; the states above are set on the real control, not a mock.</div></div>`)+
    sgroup('sliders','Native prompts','Browser prompts stand in for the real macOS sheets',
      `<div class="dwrap"><div class="dbtns">
        <button class="btn s sm" data-a="rename" data-p="${(db.meetings[0]||{}).id||''}">Rename a meeting</button>
        <button class="btn s sm" data-a="newfolder" data-p="">New folder</button>
        <button class="btn s sm" data-a="addname">Add a name</button></div></div>`)+
    sgroup('spark','Inline states','Not transient — the vocabulary the components above are built from',
      `<div class="dwrap">
        <div class="dgrid dchips"><span class="pri hi">${ic('flag',12)}High</span>
          <span class="pri md">${ic('flag',12)}Medium</span>
          <span class="pri ok">${ic('check',12)}Granted</span>
          <span class="pri">Not granted</span>
          <span class="pillx">Optional</span>
          <span class="live">${ic('rec',12)}Recording</span></div>
        <div class="dgrid dchips"><span class="kbd">Fn</span><span class="keycap">⌃⌥Space</span>
          ${tog('demoTogA',g.demoTogA!==false)}${tog('demoTogB',!!g.demoTogB)}${tog('demoTogC',false,true)}
          <span class="cbx on">${ic('check',12,2.6)}</span><span class="cbx"></span>
          <span class="rdo on"></span><span class="rdo"></span></div>
        <div class="dgrid dchips"><span class="fchip on">Selected</span><span class="fchip">Unselected</span>
          <span class="fchip">Overdue<span class="b">2</span></span>
          <span class="sel">${ic('cal',14)}A picker ${ic('chevd',12)}</span>
          <span class="badge">${ic('list',12)}Source of task 1</span></div>
        <div class="dgrid" style="gap:26px;align-items:flex-end">
          <span style="display:block">${meterBars(30,false)}<span class="dnote">meter · idle</span></span>
          <span style="display:block">${meterBars(30,true,3)}<span class="dnote">meter · live</span></span>
          <span style="display:block"><span class="typing"><i></i><i></i><i></i></span>
            <span class="dnote">thinking</span></span></div>
      </div>`)+
    sgroup('mic','Floating bubble','The always-on control that sits over other apps',
      srow('Show the floating bubble','Click it to dictate; hover for record, ask and more.',
        tog('bubble',g.bubble))+
      srow('Reset its position','Puts it back at the bottom right of the window.',
        `<button class="btn s sm" data-a="bubreset">${ic('reset',14)}Reset position</button>`))];
  case 'priv':return ['Privacy & data','What is stored, and where',
    sgroup('shield','On this Mac','Nothing here is uploaded',
      srow('Recordings and transcripts','Stored on this Mac only. 48 transcripts, 18 meetings, 2.1 GB.',
        `<button class="btn s sm" data-a="demo" data-p="reveal the folder in Finder">Show in Finder</button>`)+
      srow('Delete everything','Removes all meetings, transcripts and tasks from this Mac. Cannot be undone.',
        `<button class="btn s sm" data-a="demo" data-p="ask you to confirm, then erase local data">Delete all data</button>`))+
    sgroup('cloud','What leaves this Mac','Only what you turn on',
      srow('Cloud transcription',g.engine==='cloud'?'On — audio is sent for transcription and deleted afterwards.':'Off — dictation runs entirely on this Mac.',
        `<span class="pri ${g.engine==='cloud'?'md':'ok'}">${g.engine==='cloud'?'On':'Off'}</span>`)+
      srow('Assistant replies',g.anthropicKey?'On — your questions and the relevant transcript go to Anthropic.':'Off — no API key is set.',
        `<span class="pri ${g.anthropicKey?'md':'ok'}">${g.anthropicKey?'On':'Off'}</span>`))];
  }
  return ['','',''];
}
function settingsModal(){
  /* a pane id that no longer exists used to render an empty white modal with
     no heading and no way to tell what had happened */
  if(!SNAV.some(([,items])=>items.some(([k])=>k===S.spane)))S.spane=SNAV[0][1][0][0];
  const [t,s,c]=settingsPane();
  const nav=SNAV.map(([grp,items])=>`<div class="gl">${grp}</div>`+
    items.map(([k,l,i])=>`<a class="${S.spane===k?'on':''}" data-a="spane" data-p="${k}" title="${l}">${
      ic(i,15)}<span class="lbl">${l}</span></a>`).join('')).join('');
  return `<div class="scrim" data-a="closeSettings"></div>
    <div class="modal" style="width:1000px;height:700px">
      <div class="mnav"><h3 class="h">Settings</h3>${nav}</div>
      <div class="mbody"><div class="mtop"><span><h2 class="h">${t}</h2><p>${s}</p></span>
        <span class="x" data-a="closeSettings" title="Close settings">${ic('x',15)}</span></div>
        <div class="mcont">${c}</div></div></div>`;
}
