// Renders the tasks panel. 

/* ══════════════════════════════════ tasks ══════════════════════════════════ */
function viewTasks(){
  let list=db.tasks.slice();
  if(S.view==='overdue')list=list.filter(t=>t.late&&!t.done);
  else if(S.view==='upcoming')list=list.filter(t=>t.grp==='Upcoming'&&!t.done);
  else if(S.view==='done')list=list.filter(t=>t.done);
  else if(S.view.startsWith('m:'))list=list.filter(t=>t.mid===S.view.slice(2));
  if(S.view!=='done'&&!S.showDone)list=list.filter(t=>!t.done);
  if(S.taskFilter==='overdue')list=list.filter(t=>t.late);
  if(S.taskFilter==='today')list=list.filter(t=>t.grp==='Today');
  if(S.taskFilter==='upcoming')list=list.filter(t=>t.grp==='Upcoming');
  if(S.q)list=list.filter(t=>t.title.toLowerCase().includes(S.q.toLowerCase()));
  const o=openTasks().length,od=overdue().length;
  const toolbar=db.tasks.length?`<div class="toolrow">
    <span class="srch" style="margin:0;width:230px">${ic('search',15)}
      <input placeholder="Search tasks" data-a="q" value="${esc(S.q)}"></span>
    <span class="r">
      <span class="chk" data-a="showdone"><span class="cbx ${S.showDone?'on':''}">${
        ic('check',12,2.6)}</span>Show completed</span>
      <button class="btn q sm" data-a="demo" data-p="switch to a calendar view"
        title="Switch to a calendar view">${ic('cal',15)}Calendar</button>
    </span></div>`:'';
  const add=`<div class="addrow">${ic('plus',17)}
    <input placeholder="Add a task…" data-a="addtask"></div>`;
  if(!list.length) return `<div class="body">${toolbar}${add}
    <div class="empty" style="padding-bottom:60px"><span class="ico">${ic('checkc',22,1.6)}</span>
    <h2>${db.tasks.length?'Nothing here':'No tasks yet'}</h2>
    <p>${db.tasks.length?'No tasks match this view. Try another filter.':
      'Tasks appear here automatically after each meeting is summarised — or add one in the field above.'}</p>
    ${db.tasks.length?`<div class="a"><button class="btn s sm" data-a="view" data-p="all">All tasks</button></div>`:''}
    </div></div>`;
  const order=['Overdue','Today','Upcoming','Done'];
  const groups=order.map(g=>({g,items:list.filter(t=>(t.done?'Done':t.grp)===g)})).filter(x=>x.items.length);
  return `<div class="body">${toolbar}${add}
    ${groups.map(g=>`<div class="ghd ${g.g==='Overdue'?'dg':''}">${g.g}
        <span class="n">· ${g.items.length}</span></div>
      <div class="list">${g.items.map(t=>taskRow(t)).join('')}</div>`).join('')}</div>`;
}
