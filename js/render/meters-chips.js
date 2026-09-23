// Renders meters and chip components. 

/* ══════════════════════════════════ meters ══════════════════════════════════ */
function meterBars(n,live,seedv=0){
  let out='';
  for(let i=0;i<n;i++){
    const h=live?Math.max(4,Math.round(6+30*Math.abs(Math.sin(i*0.7+seedv))*Math.abs(Math.cos(i*0.31+seedv*0.6))))
                :4+((i*7)%4);
    out+=`<i style="height:${h}px"></i>`;}
  return `<span class="meter ${live?'live':'idle'}">${out}</span>`;
}

/* ══════════════════════════════════ chips ══════════════════════════════════ */
/* A scope that used to sit in the list column. `cur` is whatever piece of state
   the chips are switching, so the same row serves a view, a range or a filter. */
const chiprow=(items,act,cur,right)=>`<div class="chiprow">${items.map(([k,l,n])=>
  `<span class="fchip ${cur===k?'on':''}" data-a="${act}" data-p="${k}">${esc(l)}${
    n!=null?`<span class="b">${n}</span>`:''}</span>`).join('')}${
  right?`<span class="r">${right}</span>`:''}</div>`;

/* A bordered section with a header strip. `rows` tightens the body padding for
   a list that already carries its own hover overhang. */
const pnl=(title,meta,action,body,rows)=>`<div class="pnl">
  <div class="ph"><span class="t">${title}</span>${
    (meta||meta===0)?`<span class="n">· ${meta}</span>`:''}${
    action?`<span class="go">${action}</span>`:''}</div>
  <div class="pb ${rows?'rows':''}">${body}</div></div>`;

/* ══════════════════════════════════ scannable sections ══════════════════════════════════ */
/* A detail page (a meeting, a project) reads as one column of sections —
   Summary, Decisions, Open questions, Tasks — each a plain heading over its
   own content, rather than a grid of boxes competing for attention. Every
   list on these pages goes through the same cap: `capList` shows the first
   `cap` rows and turns the rest into a single "View all N" control that
   expands the section in place, on one click, without navigating away.
   `key` scopes that expanded/collapsed flag to this exact list so two
   sections on the same page never share one toggle. */
function capList(key,rows,cap){
  cap=cap||5;
  const n=rows.length,open=!!S.expand[key],over=n>cap;
  const shown=open||!over?rows:rows.slice(0,cap);
  const more=over?`<div class="secmore${open?' open':''}" data-a="secmore" data-p="${esc(key)}">
    <span>${open?'Show less':`View all ${n}`}</span>${ic('chevd',11)}</div>`:'';
  return {shown,more,over,open};
}
/* One section: heading (title, a count pill once there is anything to count,
   an optional right-aligned link) then either an empty-state line or the
   capped list. `tag:'bul'` renders the compact record-row style used for
   decisions and open questions; anything else renders `.list`, the row
   style tasks and meetings already use, so each kind of content keeps its
   own format under a shared heading. `hideIfEmpty` drops the whole section
   (heading included) when there is nothing to show — for content that is
   only worth naming when it exists, like Decisions on a call that had none. */
function secBlock(o){
  const rows=o.rows||[],n=rows.length;
  if(!n&&o.hideIfEmpty)return '';
  const head=`${o.title}${n?`<span class="n">${n}</span>`:''}${
    o.action?`<span class="go">${o.action}</span>`:''}`;
  if(!n)return `<div class="sec"><h3>${head}</h3><div class="sbe">${o.empty||'Nothing here yet.'}</div></div>`;
  const {shown,more}=capList(o.key,rows,o.cap);
  const wrap=o.tag==='bul'?'ul':'div';
  return `<div class="sec"><h3>${head}</h3>
    <${wrap} class="${o.tag==='bul'?'bul':'list'}">${shown.join('')}</${wrap}>${more}
    ${o.hint?`<div class="hint" style="margin-top:var(--s3)">${o.hint}</div>`:''}</div>`;
}

