// Renders the vocabulary panel. 

/* ══════════════════════════════════ vocabulary ══════════════════════════════════ */
function viewVocab(){
  let list=db.vocab.slice();
  if(S.view==='you')list=list.filter(v=>v.s==='you');
  if(S.view==='ai')list=list.filter(v=>v.s==='ai');
  if(S.vq)list=list.filter(v=>(v.t+' '+v.h).toLowerCase().includes(S.vq.toLowerCase()));
  return `<div class="body">
   <div style="font-size:13.5px;color:var(--sec);line-height:1.65;max-width:600px;
     margin-bottom:var(--s6)">Words AIT&#8209;Scribe should get right — names, products and acronyms.
     These apply to both dictation and meeting transcripts.</div>
   ${chiprow([['all','All terms',db.vocab.length],
               ['you','Added by you',db.vocab.filter(x=>x.s==='you').length],
               ['ai','Learned from corrections',db.vocab.filter(x=>x.s==='ai').length]],'view',S.view)}
   <div class="toolrow"><button class="btn q sm" data-a="demo" data-p="import a term list from a file">${
      ic('down',15)}Import</button>
     <button class="btn q sm" data-a="demo" data-p="export your vocabulary">${ic('copy',15)}Export</button>
     <span class="r hint">Sorted by how often you corrected them</span></div>
   <div class="addrow" style="margin-bottom:var(--s5)">${ic('plus',17)}
     <input placeholder="Add a term AIT-Scribe keeps getting wrong…" data-a="addterm"></div>
   <div>
    <table class="vtable"><thead><tr><th>Term</th><th>Often heard as</th><th>Corrected</th><th>Source</th><th></th></tr></thead>
     <tbody>${list.length?list.map((v,i)=>`<tr>
       <td class="tm">${esc(v.t)}</td><td>${esc(v.h)}</td><td>${v.n}&times;</td>
       <td><span class="pillx ${v.s==='ai'?'ai':'you'}">${v.s==='ai'?'Learned':'Added by you'}</span></td>
       <td style="text-align:right"><span class="kb2" style="opacity:1;display:inline-flex;cursor:pointer"
         data-a="delterm" data-p="${esc(v.t)}">${ic('trash',15)}</span></td></tr>`).join('')
       :`<tr><td colspan="5" style="padding:var(--s6) 2px;color:var(--ter);font-size:12.5px">No terms match.</td></tr>`}
     </tbody></table></div>
   <div class="notice quiet" style="margin-top:var(--s5)">${ic('info',14)}<span>Terms marked
     <span class="pillx ai">Learned</span> were added automatically when you edited a transcript.
     You can remove any of them.</span></div></div>`;
}

