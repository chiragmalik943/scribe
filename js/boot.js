// App boot/sizing logic; runs on load. 

/* ══════════════════════════════════ boot / sizing ══════════════════════════════════ */
let SCALE=1,FILL=false,BOOTED=false;
const FW=()=>{const f=$('#frame');return f?f.clientWidth:1440};
const FH=()=>{const f=$('#frame');return f?f.clientHeight:900};
const clampX=(x,w)=>Math.max(8,Math.min(x,FW()-w-12));
const clampY=(y,h)=>Math.max(74,Math.min(y,FH()-h-12));

/* Two jobs:
   1. Shrink-to-fit the 1440×900 mock while there is room for it. Once the
      browser gets small enough that the mock would be scaled below FILL_AT,
      drop the window chrome and let the app fill the whole viewport instead.
   2. Auto-collapse the sidebars, in order (list column first, then the rail),
      so the main content area keeps a usable width all the way down. */
const FILL_AT=0.88, LIST_AT=1180, RAIL_AT=960;
const AUTO={list:null,rail:null};
function fit(){
  const f=$('#frame');if(!f)return;
  const vw=window.innerWidth,vh=window.innerHeight;
  const need=Math.min((vw-40)/1440,(vh-40)/900);
  FILL=S.zoom||need<FILL_AT;
  f.classList.toggle('fill',FILL);
  if(FILL){SCALE=1;f.style.transform='';}
  else{SCALE=Math.min(1,need);f.style.transform=`scale(${SCALE})`;}
  const w=FILL?vw:1440;
  f.classList.toggle('w3',w<1320);
  f.classList.toggle('w2',w<1080);
  f.classList.toggle('w1',w<840);
  let ch=false;
  const wantList=w<LIST_AT,wantRail=w<RAIL_AT;
  if(wantList!==AUTO.list){AUTO.list=wantList;S.listmin=wantList;ch=true}
  if(wantRail!==AUTO.rail){AUTO.rail=wantRail;S.railmin=wantRail;ch=true}
  if(ch&&S.peek){pkStop();S.peek=null;}
  if(ch&&BOOTED)render();
  else if(BOOTED)renderBubble();
}
window.addEventListener('resize',fit);
fit();render();BOOTED=true;
