// Theme metadata (names, swatches) used by the theme picker. 

/* ══════════════════════════════════ themes ══════════════════════════════════ */
/* Each entry mirrors one [data-th=…] pair in the stylesheet. `sw` is the palette
   shown on the card: [brand fill, accent, tinted surface, dark surface]. `pv`
   is the four-band strip above it: [rail, surface, brand, tint] for light and
   for dark, so a card previews both modes at a glance. */
const THEMES=[
 {id:'indigo',name:'Indigo',ds:'Muted indigo on soft grey. The default.',
  sw:['#525298','#8A8AC4','#EEEEFF','#252836'],
  pv:{light:['#F8F8FC','#FFFFFF','#525298','#EEEEFF'],dark:['#1F1D2B','#252836','#7A7ABF','#343458']}},
 {id:'ocean',name:'Ocean',ds:'Cool blue on white. High contrast.',
  sw:['#0548CF','#4B8BF0','#E4EFFE','#0D192B'],
  pv:{light:['#F9FBFE','#FFFFFF','#0548CF','#E4EFFE'],dark:['#101C2E','#0D192B','#4C8DF5','#1C3A5E']}},
 {id:'citrus',name:'Citrus',ds:'Warm neutrals with a pale lime accent.',
  sw:['#E1FA79','#86A31C','#F0F8C2','#18261D'],
  pv:{light:['#F9F9F4','#FFFFFF','#E1FA79','#F0F8C2'],dark:['#141C11','#18261D','#E1FA79','#3E4D2A']}},
 {id:'harbor',name:'Harbor',ds:'Muted steel blue. The lowest glare of the five.',
  sw:['#365B90','#6E8CB4','#CFD9E9','#141E2A'],
  pv:{light:['#F2F3F6','#FFFFFF','#365B90','#CFD9E9'],dark:['#182332','#141E2A','#5A85BE','#345078']}},
 {id:'violet',name:'Violet',ds:'Deep indigo with a vivid violet accent.',
  sw:['#5323E3','#8B72F2','#DCD7FD','#10142E'],
  pv:{light:['#F2EFFE','#FFFFFF','#5323E3','#DCD7FD'],dark:['#191A3F','#10142E','#7C5CF5','#32217D']}},
 {id:'ember',name:'Ember',ds:'The original orange. Warm greys throughout.',
  sw:['#FF5D00','#FF7A33','#FFEADF','#1E1712'],
  pv:{light:['#FFF7F2','#FFFFFF','#FF5D00','#FFEADF'],dark:['#17110C','#1E1712','#FF6A1A','#3B1C0B']}},
];
const theme=id=>THEMES.find(t=>t.id===id)||THEMES[0];

