// Inline SVG path data for all icons, keyed by name. 

/* ══════════════════════════════════ icons ══════════════════════════════════ */
const P={
cal:'<rect x="2.2" y="3.4" width="11.6" height="10.4" rx="2.2"/><path d="M2.2 6.6h11.6M5.5 2v2.6M10.5 2v2.6"/>',
mic:'<rect x="5.9" y="1.7" width="4.2" height="7.6" rx="2.1"/><path d="M3.4 7.6a4.6 4.6 0 0 0 9.2 0"/><path d="M8 12.2v2.1"/>',
checkc:'<circle cx="8" cy="8" r="6.2"/><path d="M5.3 8.2l1.9 1.9 3.6-4.2"/>',
spark:'<path d="M6.6 2.2l1.3 3.4 3.4 1.3-3.4 1.3-1.3 3.4-1.3-3.4L1.9 6.9l3.4-1.3z"/><path d="M12 9.6l.6 1.6 1.6.6-1.6.6-.6 1.6-.6-1.6-1.6-.6 1.6-.6z"/>',
wave:'<path d="M2 6.6v2.8M4.6 4.4v7.2M7.2 2.4v11.2M9.8 5v6M12.4 3.4v9.2"/>',
panelL:'<rect x="1.8" y="2.6" width="12.4" height="10.8" rx="2"/><path d="M6.2 2.6v10.8"/><path d="M9.1 6.4L11.3 8l-2.2 1.6z" fill="currentColor" stroke="none"/>',
panelR:'<rect x="1.8" y="2.6" width="12.4" height="10.8" rx="2"/><path d="M9.8 2.6v10.8"/><path d="M6.9 6.4L4.7 8l2.2 1.6z" fill="currentColor" stroke="none"/>',
people:'<circle cx="5.9" cy="5" r="2.35"/><path d="M1.7 14.1a4.2 4.2 0 0 1 8.4 0"/><path d="M10.8 2.65a2.35 2.35 0 0 1 0 4.7"/><path d="M10.07 9.96A4.2 4.2 0 0 1 15 14.1"/>',
wave2:'<path d="M2 8h1.1l1.3-4.2L6.2 12l1.7-7.6L9.5 10l1.1-2h1.4"/>',
clipb:'<rect x="5.1" y="1.7" width="5.8" height="2.8" rx="1.2"/><path d="M5.1 3.1H4.4a1.6 1.6 0 0 0-1.6 1.6v7.9A1.6 1.6 0 0 0 4.4 14.2h7.2a1.6 1.6 0 0 0 1.6-1.6V4.7a1.6 1.6 0 0 0-1.6-1.6h-.7"/><path d="M5.9 7.7h4.2M5.9 10.3h2.8"/>',
gear:'<path d="M6.71 2.81L6.94 1.33A6.75 6.75 0 0 1 9.06 1.33L9.29 2.81A5.35 5.35 0 0 1 10.76 3.41L11.97 2.54A6.75 6.75 0 0 1 13.46 4.03L12.59 5.24A5.35 5.35 0 0 1 13.19 6.71L14.67 6.94A6.75 6.75 0 0 1 14.67 9.06L13.19 9.29A5.35 5.35 0 0 1 12.59 10.76L13.46 11.97A6.75 6.75 0 0 1 11.97 13.46L10.76 12.59A5.35 5.35 0 0 1 9.29 13.19L9.06 14.67A6.75 6.75 0 0 1 6.94 14.67L6.71 13.19A5.35 5.35 0 0 1 5.24 12.59L4.03 13.46A6.75 6.75 0 0 1 2.54 11.97L3.41 10.76A5.35 5.35 0 0 1 2.81 9.29L1.33 9.06A6.75 6.75 0 0 1 1.33 6.94L2.81 6.71A5.35 5.35 0 0 1 3.41 5.24L2.54 4.03A6.75 6.75 0 0 1 4.03 2.54L5.24 3.41A5.35 5.35 0 0 1 6.71 2.81z"/><circle cx="8" cy="8" r="2.15"/>',
help:'<circle cx="8" cy="8" r="6.3"/><path d="M6.3 6.3a1.8 1.8 0 1 1 2.4 1.7c-.5.2-.7.6-.7 1.1v.4"/><circle cx="8" cy="11.7" r=".55" fill="currentColor" stroke="none"/>',
kbd:'<rect x="1.4" y="4" width="13.2" height="8" rx="1.8"/><path d="M4 6.6h.01M6.4 6.6h.01M8.8 6.6h.01M11.2 6.6h.01M4.6 9.4h6.8"/>',
bell:'<path d="M4.2 7a3.8 3.8 0 0 1 7.6 0c0 3 1 4.2 1 4.2H3.2S4.2 10 4.2 7z"/><path d="M6.6 13.2a1.6 1.6 0 0 0 2.8 0"/>',
search:'<circle cx="7.2" cy="7.2" r="4.4"/><path d="M10.6 10.6L14 14"/>',
plus:'<path d="M8 3.4v9.2M3.4 8h9.2"/>',
home:'<path d="M2.4 7.2L8 2.6l5.6 4.6v6a1 1 0 0 1-1 1H3.4a1 1 0 0 1-1-1z"/>',
clock:'<circle cx="8" cy="8" r="6"/><path d="M8 4.6V8l2.4 1.6"/>',
folder:'<path d="M1.9 5.1a1.6 1.6 0 0 1 1.6-1.6h2.3l1.3 1.6h4.4a1.6 1.6 0 0 1 1.6 1.6v4.8a1.6 1.6 0 0 1-1.6 1.6H3.5a1.6 1.6 0 0 1-1.6-1.6z"/>',
folderplus:'<path d="M1.9 5.1a1.6 1.6 0 0 1 1.6-1.6h2.3l1.3 1.6h4.4a1.6 1.6 0 0 1 1.6 1.6v4.8a1.6 1.6 0 0 1-1.6 1.6H3.5a1.6 1.6 0 0 1-1.6-1.6z"/><path d="M8 7.6v3.2M6.4 9.2h3.2"/>',
users:'<circle cx="5.9" cy="5" r="2.35"/><path d="M1.7 14.1a4.2 4.2 0 0 1 8.4 0"/><path d="M10.8 2.65a2.35 2.35 0 0 1 0 4.7"/><path d="M10.07 9.96A4.2 4.2 0 0 1 15 14.1"/>',
file:'<path d="M9 1.9H4.6a1.6 1.6 0 0 0-1.6 1.6v9a1.6 1.6 0 0 0 1.6 1.6h6.8a1.6 1.6 0 0 0 1.6-1.6V5.8z"/><path d="M9 1.9v3.9h4"/>',
copy:'<rect x="5.4" y="5.4" width="8.2" height="8.2" rx="1.8"/><path d="M10.6 5.4V4.1a1.7 1.7 0 0 0-1.7-1.7H4.1A1.7 1.7 0 0 0 2.4 4.1v4.8a1.7 1.7 0 0 0 1.7 1.7h1.3"/>',
edit:'<path d="M11.1 2.6l2.3 2.3-7.5 7.5-3 .7.7-3z"/>',
trash:'<path d="M2.8 4.4h10.4M6.3 4.4V3.1a1 1 0 0 1 1-1h1.4a1 1 0 0 1 1 1v1.3M4.2 4.4l.6 8.3a1.2 1.2 0 0 0 1.2 1.1h4a1.2 1.2 0 0 0 1.2-1.1l.6-8.3"/>',
play:'<path d="M5.4 3.4l7 4.6-7 4.6z"/>',
pause:'<path d="M5.8 3.4v9.2M10.2 3.4v9.2"/>',
stop:'<rect x="4.2" y="4.2" width="7.6" height="7.6" rx="1.6"/>',
link:'<path d="M6.6 9.4a2.6 2.6 0 0 0 3.9.3l2-2a2.7 2.7 0 0 0-3.8-3.8l-1.1 1.1"/><path d="M9.4 6.6a2.6 2.6 0 0 0-3.9-.3l-2 2a2.7 2.7 0 0 0 3.8 3.8l1.1-1.1"/>',
dots:'<circle cx="3.4" cy="8" r="1.15" fill="currentColor" stroke="none"/><circle cx="8" cy="8" r="1.15" fill="currentColor" stroke="none"/><circle cx="12.6" cy="8" r="1.15" fill="currentColor" stroke="none"/>',
back:'<path d="M10 3.6L5.6 8l4.4 4.4"/>',
chev:'<path d="M6.2 3.6L10.6 8l-4.4 4.4"/>',
chevd:'<path d="M3.6 6L8 10.4 12.4 6"/>',
x:'<path d="M4 4l8 8M12 4l-8 8"/>',
alert:'<path d="M8 2.4l6 10.4H2z"/><path d="M8 6.6v3"/><circle cx="8" cy="11.2" r=".55" fill="currentColor" stroke="none"/>',
alertc:'<circle cx="8" cy="8" r="6.2"/><path d="M8 4.8v3.6"/><circle cx="8" cy="11.2" r=".6" fill="currentColor" stroke="none"/>',
info:'<circle cx="8" cy="8" r="6.2"/><path d="M8 7.4v4"/><circle cx="8" cy="4.9" r=".6" fill="currentColor" stroke="none"/>',
check:'<path d="M2.8 8.4l3.4 3.4 7-7.6"/>',
eye:'<path d="M1.4 8s2.5-4.4 6.6-4.4S14.6 8 14.6 8s-2.5 4.4-6.6 4.4S1.4 8 1.4 8z"/><circle cx="8" cy="8" r="2"/>',
book:'<path d="M2.6 3.4a1.4 1.4 0 0 1 1.4-1.4H12a1.4 1.4 0 0 1 1.4 1.4v9.2A1.4 1.4 0 0 1 12 14H4a1.4 1.4 0 0 1-1.4-1.4z"/><path d="M5.4 5.2h5.2M5.4 8h5.2M5.4 10.8h3"/>',
chart:'<path d="M2.6 13.4V9.2M6.8 13.4V4.4M11 13.4V7"/>',
share:'<circle cx="12" cy="4" r="1.9"/><circle cx="4" cy="8" r="1.9"/><circle cx="12" cy="12" r="1.9"/><path d="M5.7 7.1l4.6-2.2M5.7 8.9l4.6 2.2"/>',
cloud:'<path d="M4.4 12.4a3 3 0 0 1-.3-6 4.2 4.2 0 0 1 8 1 2.5 2.5 0 0 1-.4 5z"/>',
chip:'<rect x="4.4" y="4.4" width="7.2" height="7.2" rx="1.6"/><path d="M6.6 1.8v2.6M9.4 1.8v2.6M6.6 11.6v2.6M9.4 11.6v2.6M1.8 6.6h2.6M1.8 9.4h2.6M11.6 6.6h2.6M11.6 9.4h2.6"/>',
shield:'<path d="M8 1.8l5.2 2v4c0 3.2-2.2 5.4-5.2 6.4-3-1-5.2-3.2-5.2-6.4v-4z"/><path d="M5.8 7.9l1.6 1.6 3-3.2"/>',
flag:'<path d="M3.6 14V2.4h7.2l-1.2 2.6 1.2 2.6H3.6"/>',
list:'<path d="M5.6 4.2h8.2M5.6 8h8.2M5.6 11.8h8.2"/><circle cx="2.6" cy="4.2" r=".9" fill="currentColor" stroke="none"/><circle cx="2.6" cy="8" r=".9" fill="currentColor" stroke="none"/><circle cx="2.6" cy="11.8" r=".9" fill="currentColor" stroke="none"/>',
rec:'<circle cx="8" cy="8" r="3"/><path d="M3.6 3.6a6.2 6.2 0 0 0 0 8.8M12.4 3.6a6.2 6.2 0 0 1 0 8.8"/>',
down:'<path d="M8 2.6v8M4.6 7.4L8 10.8l3.4-3.4M2.8 13.4h10.4"/>',
key:'<circle cx="5.4" cy="10.6" r="2.8"/><path d="M7.4 8.6l5.4-5.4M10.4 5.6l1.6 1.6M12 4l1.4 1.4"/>',
plug:'<path d="M6 2.2v3.4M10 2.2v3.4M4.2 5.6h7.6v2.6a3.8 3.8 0 0 1-7.6 0z"/><path d="M8 12v2.2"/>',
send:'<path d="M8 13.2V3.4M4 7.2L8 3.2l4 4"/>',
clip:'<path d="M12.6 7.4l-5 5a2.9 2.9 0 0 1-4.1-4.1l5.4-5.4a1.9 1.9 0 0 1 2.7 2.7l-5.3 5.3a.9.9 0 0 1-1.3-1.3l4.8-4.8"/>',
sliders:'<path d="M3.4 13V9.4M3.4 6.6V3M8 13V8M8 5.2V3M12.6 13v-2.2M12.6 8V3"/><circle cx="3.4" cy="8" r="1.5"/><circle cx="8" cy="6.6" r="1.5"/><circle cx="12.6" cy="9.4" r="1.5"/>',
sun:'<circle cx="8" cy="8" r="3.2"/><path d="M8 1.4v1.8M8 12.8v1.8M1.4 8h1.8M12.8 8h1.8M3.3 3.3l1.3 1.3M11.4 11.4l1.3 1.3M12.7 3.3l-1.3 1.3M4.6 11.4l-1.3 1.3"/>',
moon:'<path d="M13.2 9.4A5.6 5.6 0 0 1 6.6 2.8a5.8 5.8 0 1 0 6.6 6.6z"/>',
reset:'<path d="M3.52 11.02A5.4 5.4 0 1 0 3.23 5.46"/><path d="M6.07 4.49L3.23 5.46L2.46 2.57"/>',
minus:'<path d="M3.4 8h9.2"/>',
expand:'<path d="M3.2 3.2h5.6L3.2 8.8z" fill="currentColor" stroke="none"/><path d="M12.8 12.8H7.2l5.6-5.6z" fill="currentColor" stroke="none"/>',
md:'<rect x="1.6" y="3.4" width="12.8" height="9.2" rx="1.8"/><path d="M4.2 10.4V5.6l2 2.4 2-2.4v4.8M11 5.6v4.8M9.4 8.8L11 10.4l1.6-1.6"/>',
userplus:'<circle cx="6.4" cy="5.6" r="2.7"/><path d="M1.9 13.6a4.5 4.5 0 0 1 9 0"/><path d="M12.6 5.2v4M14.6 7.2h-4"/>',
/* ── folder identity ───────────────────────────────────────────────────────
   The four folders AIT-Scribe creates for you get a glyph of their own, so a
   grid of folders reads as four kinds of work rather than four folders. */
brief:'<rect x="1.9" y="4.9" width="12.2" height="8.6" rx="1.9"/><path d="M5.6 4.9V3.6a1.3 1.3 0 0 1 1.3-1.3h2.2a1.3 1.3 0 0 1 1.3 1.3v1.3"/><path d="M1.9 8.4h12.2"/>',
layers:'<path d="M8 1.9l6.1 3.1L8 8.1 1.9 5z"/><path d="M2.4 8.2L8 11l5.6-2.8"/><path d="M2.4 11.1L8 13.9l5.6-2.8"/>',
grid:'<rect x="2.1" y="2.1" width="5" height="5" rx="1.4"/><rect x="8.9" y="2.1" width="5" height="5" rx="1.4"/><rect x="2.1" y="8.9" width="5" height="5" rx="1.4"/><rect x="8.9" y="8.9" width="5" height="5" rx="1.4"/>',
chevl:'<path d="M9.8 3.6L5.4 8l4.4 4.4"/>',
calday:'<rect x="2.2" y="3.4" width="11.6" height="10.4" rx="2.2"/><path d="M2.2 6.6h11.6M5.5 2v2.6M10.5 2v2.6"/><path d="M5.2 9.6h5.6M5.2 11.6h3.2"/>',
cam:'<rect x="1.5" y="4.2" width="9.2" height="7.6" rx="1.8"/><path d="M10.7 7.6l3.8-2.3v5.4l-3.8-2.3z"/>',
/* ── watchouts ─────────────────────────────────────────────────────────────
   One glyph per classification, readable at 13px: two arrows meeting head-on
   for a conflict, a not-equals for a discrepancy, a question for a
   clarification, and a radar sweep for the set as a whole. */
radar:'<path d="M8 8L12.6 5.4"/><path d="M8 2.4a5.6 5.6 0 1 1-5.35 3.9"/><path d="M8 5.2a2.8 2.8 0 1 1-2.6 1.8"/><circle cx="8" cy="8" r=".95" fill="currentColor" stroke="none"/>',
conflict:'<path d="M1.9 5.4h4.1M4.3 3.5L6.2 5.4 4.3 7.3"/><path d="M14.1 10.6H10M11.7 8.7L9.8 10.6l1.9 1.9"/><path d="M8 2.2v3M8 10.8v3"/>',
delta:'<path d="M3 5.6h10M3 10.4h10"/><path d="M11.4 3.2L4.6 12.8"/>',
speak:'<path d="M3 6.2h1.9L8.4 3.4v9.2L4.9 9.8H3z"/><path d="M11 5.9a3 3 0 0 1 0 4.2"/><path d="M13 4.1a5.6 5.6 0 0 1 0 7.8"/>',
eyeoff:'<path d="M9.32 12.25C8.9 12.34 8.46 12.4 8 12.4C3.9 12.4 1.4 8 1.4 8C1.4 8 1.98 6.98 3.04 5.92"/><path d="M6.68 3.75C7.1 3.66 7.54 3.6 8 3.6C12.1 3.6 14.6 8 14.6 8C14.6 8 14.02 9.02 12.96 10.08"/><path d="M9.52 9.52A2.15 2.15 0 0 1 6.48 6.48"/><path d="M2.6 2.6l10.8 10.8"/>',
undo:'<path d="M12.48 11.02A5.4 5.4 0 1 1 12.77 5.46"/><path d="M9.93 4.49L12.77 5.46L13.54 2.57"/>',
history:'<path d="M3.52 11.02A5.4 5.4 0 1 0 3.23 5.46"/><path d="M6.07 4.49L3.23 5.46L2.46 2.57"/><path d="M8 5.4V8l1.9 1.3"/>',
/* capture sources: a microphone, the other side of the call (system audio), and
   the screen, each with a struck-through twin for when it is switched off */
micoff:'<path d="M10 4.2V3.8a2.1 2.1 0 0 0-4.1-.7"/><path d="M5.9 6.2v1.5a2.1 2.1 0 0 0 3.2 1.8"/><path d="M3.4 7.6a4.6 4.6 0 0 0 7.2 3.8M12.6 7.6c0 .5-.1 1-.3 1.4"/><path d="M8 12.2v2.1"/><path d="M2 2l12 12"/>',
monitor:'<rect x="1.8" y="2.6" width="12.4" height="8.4" rx="1.8"/><path d="M5.6 13.6h4.8M8 11v2.6"/>',
monitoroff:'<path d="M5.2 2.6h7.2a1.8 1.8 0 0 1 1.8 1.8v4.4M11 11H3.6a1.8 1.8 0 0 1-1.8-1.8V4.4"/><path d="M5.6 13.6h4.8M8 11v2.6"/><path d="M2 2l12 12"/>',
voloff:'<path d="M3 6.2h1.9L8.4 3.4v9.2L4.9 9.8H3z"/><path d="M11.2 6.2l3 3.6M14.2 6.2l-3 3.6"/>',
pencil:'<path d="M10.6 2.6l2.8 2.8-7.7 7.7-3.4.6.6-3.4z"/>',
target:'<circle cx="8" cy="8" r="5.6"/><circle cx="8" cy="8" r="2.4"/>',
milestone:'<path d="M3.4 14V2.4"/><path d="M3.4 3h8.2l-1.9 2.8 1.9 2.8H3.4"/>'
};
/* Optical stroke. An SVG scales its stroke together with its viewBox, so a fixed
   1.7-unit stroke is 1.2px at 11px and 3.4px at 32px: hairline when small, heavy
   when large. Instead of a fixed grid stroke, ic() picks the stroke it wants on
   screen (in px) and converts it back to grid units for the viewBox:
       px = 1.7 x sqrt(size / 16)   ->  11: 1.4 | 14: 1.6 | 16: 1.7 | 22: 2.0 | 32: 2.4 | 48: 2.9
   The optional third argument is a rendered stroke in px, for glyphs that need
   emphasis (a check inside a checkbox, a glyph sitting on a brand fill). */
const strokePx=s=>1.7*Math.sqrt(s/16);
const ic=(n,s=16,px)=>{const w=Math.round((px==null?strokePx(s):px)*16/s*1000)/1000;
  return `<svg class="ic" width="${s}" height="${s}" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${P[n]||''}</svg>`};
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

