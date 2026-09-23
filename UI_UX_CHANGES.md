# AIT‑Scribe — UI/UX review and implementation

A senior product-design and front-end pass over the whole prototype (`index.html`, single file).
Everything described here is **implemented in the codebase**, not proposed.

- 1,132 insertions / 759 deletions in `index.html`
- Original saved alongside as `.before-uiux.html` for diffing
- Verified in Chromium at 1480, 1000 and 560 px wide, in all 5 themes × light/dark
- 0 console errors; all interaction paths re-tested after the changes

---

## Design direction

The prototype was already thoughtful — a real design system, hand-tuned dark modes, good
copy. What made it feel heavy was **redundancy of signal**: the same fact was often said
three or four times, in three or four different visual registers, on one screen.

A project page announced its watchouts with a pink-tinted band, a coloured icon well, a
coloured rail on every row, three coloured count labels *and* a coloured count in the page
header. A meeting opened with a red banner and a green banner stacked above the content.
The watchouts tab carried its counts on the tab, on the filter chips, and again on a
separate coloured line underneath. Tasks had its filters in the sidebar and, simultaneously,
as chips in the toolbar. Adding a folder was offered in three places at once.

So the work was mostly **subtraction**, applied at the system level:

**Cleaner** — 18 different corner radii collapsed to a 5-step scale; ad-hoc shadows to 3
steps; spacing onto a 4px scale. Borders became the exception rather than the default:
day-groups, task groups, folder contents, transcripts, stat rows, settings groups and side
columns all lost their boxes and are now grouped by a label, a hairline and whitespace.

**Calmer** — colour is now reserved for one job per screen. Folder names in a meeting list
were printed in each folder's own accent colour; they are neutral now. Charts moved from
saturated brand to a muted step, with full brand kept for the hovered bar. Toasts stopped
being full-bleed slabs of green or red and became one dark surface with a coloured glyph.
Priority chips only colour "High".

**Less intimidating** — the watchout band is a neutral card with a heading and evidence,
not an alarm. The two stacked banners on a meeting became one. Section headings lost their
decorative blue glyphs.

**More approachable** — every screen's primary action is now the only filled button on it.
Export, copy and help became quiet icon buttons and text links. The empty state offers its
action as a button instead of describing it in prose.

**Easier to understand** — attendee lists truncate ("Ashley Nguyen, Daniel Brooks +10")
so rows keep a constant height and the list keeps its rhythm. Duplicated controls were
removed so there is one place to do each thing.

**More consistent** — one micro-label style (was three), one row pattern (`.list`), one
icon-button treatment, one notice treatment, one set of interaction timings.

**Typography: the font-families are unchanged.** `Sentient` (serif) still carries display
type and `Onest` (grotesque) still carries body and UI chrome, and no component was moved
from one family to the other. Only sizes, weights, line-heights, letter-spacing and colour
changed.

---

## Areas reviewed

**Screens** — Meetings list (populated, empty, searched, first-run setup, recording);
Meeting detail (AI notes, Watchouts, My notes, Transcript, generating, live-recording
variant); Watchout detail panel; Project/folder page (top-level and sub-folder rollup);
Unfiled; Tasks (grouped list, detail panel, empty); Speech to Text (idle and dictating);
Vocabulary; Insights; AI Assistant (empty and in conversation); Meeting assistant panel.

**Overlays** — Settings (all 12 panes), Share, Add attendee, Screen-recording permission,
Delete-data and Delete-meeting confirmations, Generating dialog, context menus, attendee
popover, toasts, macOS-style system notifications, tooltips.

**Chrome** — window title bar, navigation rail, list column, both collapsed strips, the
sidebar hover-peek, breadcrumbs, the floating recording pill (idle / dictating / recording
/ watchout popover).

**System** — tokens for all 5 themes × light/dark, buttons, chips, badges, inputs,
toggles, checkboxes, radios, tabs, cards, list rows, section headers, empty states,
tables, charts, meters, the audio player.

---

## Major UX changes

**Problem → Change implemented → Reason** format is used throughout the change log below;
these are the ones that materially change how the product works.

### Duplicated controls removed

- **Tasks had two filter systems.** All / Overdue / Today / Upcoming existed as chips in
  the toolbar *and* as rows in the list column, backed by two separate pieces of state
  (`S.taskFilter` and `S.view`) that could disagree. The toolbar chips are gone; the list
  column drives filtering. The toolbar keeps search, "Show completed" and the calendar
  switch.
- **Insights had two range pickers.** The list column is the range picker for that route;
  the top bar repeated it as a button that opened a "pick a custom range" demo toast.
  Removed from the top bar.
- **Adding a folder was offered three times** on a project page — a filled primary button
  in the header, an "Add <Name> Folder" row under every expanded folder in the tree, and a
  dashed tile in the card grid. Only the dashed tile survives (it sits exactly where the
  new folder will appear); the tree keeps one "New folder" at its foot.
- **Both sidebars said "Collapse"** at the bottom of the window. The control is icon-only
  now, named by its tooltip.

### Redundant emphasis removed

- **A meeting opened with two stacked banners** — a red watchouts block and a green
  "3 tasks added" block — before any content. The tab already carries the watchout count
  and the side column already carries the task count. The green banner is gone; its one
  piece of real information ("owners and dates were taken from what was said") is now a
  caption under the task list it describes.
- **The watchouts tab had three rows of controls.** Filter chips with counts, then a
  checkbox and a help button, then a separate coloured line repeating all three counts.
  One row now: chips on the left, "Show N settled" and a "What it looks for" link on the
  right.
- **A project page led with an alarm.** The watchout band filled itself with the conflict
  tint whenever a conflict existed, so the first thing the page did was turn pink. It is
  now one neutral surface with a hairline; the counts are small dotted labels and the only
  colour is a 5px dot per type.
- **The project header meta line carried five facts and a red count.** "Top-level folder ·
  2 folders · 3 meetings · 5 open tasks · ● 4 watchouts" → "3 meetings · 2 folders · 5 open
  tasks". "Top-level folder" said nothing the breadcrumb did not, and the band directly
  below counts the watchouts.
- **A watchout said its type four times** — a coloured rail on the row, a tinted-and-
  outlined icon well, a coloured chip and a coloured count above. Now: one small tinted
  glyph, and a dot in the counts.
- **The watchout detail panel titled itself "Conflict" and then repeated "Conflict" as a
  chip** with "Open" drawn as a red priority pill. The body now shows plain status text
  and the age.

### Primary actions made obvious

- Every screen has at most one filled button. Secondary actions are outlined, tertiary
  actions are quiet (transparent until hover) and now include: Copy as Markdown, Download
  .md, the overflow menu, transcript Copy/Export, playback speed, Import/Export in
  Vocabulary, and the Calendar switch in Tasks.
- The empty Meetings state described "You can also record one now" with no button. It now
  ends in a **Record one now** button, in the shared `.empty .a` action slot that the other
  empty states also use.
- The assistant's "Conversation mode is off" warning was a tinted block with a filled blue
  button sitting directly above the composer. It is a single quiet line with a text link.

### Information hierarchy

- **Section headings** (Summary / Decisions / Open questions) were 14px serif with a blue
  glyph each. They are now 11px uppercase micro-labels in tertiary ink with an optional
  count — they label the prose without competing with it, and the body copy went up to 14px
  with a 1.68 line-height because it is the thing being read.
- **Timestamp jump links** (`12:04 ›`) were bold brand-coloured and right-aligned on every
  bullet — four blue links beside four sentences. They are now quiet tabular numerals that
  turn brand-coloured on hover.
- **Attendee lists** printed every name, so a 12-person all-hands wrapped its row onto a
  second line — the rows hardest to scan were the ones that broke the rhythm. Truncated to
  two names plus a remainder; the full list is already one click away in the meeting.
- **The folder a call was filed into** was printed in that folder's own accent colour, so a
  list of eight calls carried four accent colours that encoded nothing but taxonomy.
  Neutral now.

---

## Visual design changes

### Spacing

A 4px scale on `:root` — `--s1:4px` through `--s8:40px` — replaced roughly forty ad-hoc
values. Notable measurements:

| | before | after |
|---|---|---|
| page padding | 24px (20/16/12 responsive) | 28px (22/18/14) |
| title bar / list header height | 64px | 56px (both, so they align) |
| nav row height | 40px, 6px gaps | 36px, 2px gaps |
| list row padding | 14px 16px | 11px 10px, hairline-separated |
| section gap | 18px | 24px |
| group gap | 22px | 32px |
| settings group gap | 14px | 32px |
| tab bar bottom margin | 18px | 20px, top margin removed |

The net effect is more air *between* groups and less *inside* rows — density went down
where it mattered (whitespace around blocks) without making everything bigger.

### Layout

- **`.list`** is the new grouping primitive and replaced most cards: a flex column of rows
  separated by `--hair`, with a hover well that reaches 10px past the text column. Used by
  the meetings list, task groups, folder contents, watchout lists, the Unfiled list and the
  dictation history.
- **`.statrow`** — the three Insights numbers lost their boxes; a 32px gap and a hairline
  between them does the grouping.
- **`.sidebox`** — the task side column lost its card and gained a left hairline, so the
  two columns still read as two columns. At narrow widths (and whenever an assistant panel
  is open) it flips to a top hairline instead.
- **Settings groups** lost their bordered boxes, tinted header strips and brand-tinted icon
  wells. A label, a hairline and 32px of space do the same job.
- **`.notesgrid`** uses `minmax(0, …)` tracks so long unbroken strings can no longer push
  the grid wider than its container.

### Colours

- **New `--hair` token per theme (10 values).** `--line` was doing two jobs — the edge of a
  card and the divider between two rows inside it — and one value cannot be right for both:
  strong enough to find a card edge is too strong repeated forty times down a list.
- **`--ter` retuned in all 10 theme/mode combinations** (see Accessibility).
- **`--sec` darkened in Ocean and Harbor light** so meta text still clears 4.5:1 once a
  hover or selection tint is behind it.
- **`--chipWell`** added: a count inside an already-tinted chip darkens (light) or lightens
  (dark) the tint rather than introducing a third colour.
- **Charts** moved from `--o500` (full brand) to `--o300`, with `--brand` on hover; the
  horizontal bars went from 14px to 8px and rounded fully. Grid lines use `--hair`.
- **Toasts**: the four status variants were full-bleed blocks of the status colour. They
  now share one dark surface and carry the status in the glyph.
- **Notices**: had a tint *and* a matching border — two signals for one message. Tint only,
  plus a new `.notice.quiet` (transparent, one line, coloured glyph) for the several that
  were never really alerts: the Fn-key note, the vocabulary footnote, the Insights tip, the
  Unfiled explainer, the assistant's conversation-mode note.
- **Priority**: `.pri.md` and `.pri.ok` are now plain tertiary text. When medium was amber
  and low was green, a list of ten tasks carried ten coloured chips and none of them meant
  anything.
- **Avatar initials**: two of the eight disc colours measured below 4.5:1 against white
  10.5px initials; both moved to a darker step of the same hue.
- **Ember's primary fill** moved one step down its ramp (`--o600` → `--o700`) — white on
  the mid orange measured 3.7:1, under the floor for 12–13px button text.
- **Ember dark's `--onChip`** flipped from a black overlay to a white one, because that
  theme puts dark ink on a bright orange fill, so a chip inside the fill has to lighten it.

### Borders

- Removed entirely from: day-group and task-group containers, the stat row, settings
  groups, the side column, row action buttons, the folder chip in the meta row, the audio
  player, the `.note` asides in the list column, the transcript's highlighted lines (now a
  2px left rule), the recording bar, the "if you want it said out loud" block, notices,
  `.kbd` (lost its fake 3D bottom edge), and the account block in the rail.
- Row action clusters were three outlined buttons that appeared the moment the pointer
  landed on a row. They are icon wells now — background on hover, no outline.
- Kept where a container earns its keep: the setup checklist, the dictation panel, the
  watchout band, folder cards, theme cards, `.opt` radio cards, the note box, modals,
  menus, popovers and system notifications.

### Radius

Eighteen distinct values collapsed to five steps plus a pill:
`--r1:6px` (chips, small wells, keycaps) · `--r2:8px` (buttons, inputs, icon buttons, menu
items, rows) · `--r3:10px` (nav rows, notices, comparison blocks) · `--r4:14px` (cards,
panels, popovers) · `--r5:18px` (modals) · `--rF:999px` (capsules, avatars, badges).
Only the 2–3px waveform bars sit off the scale, deliberately.

### Shadows

Three steps replaced a dozen ad-hoc stacks: `--e1` (1px raise), `--e2` (menus, popovers,
notifications), `--e3` (modals). The two legacy names `--shadow`/`--shadow2` now alias
`--e3`/`--e2`, so every existing use softened with them. Dark mode gets its own three
values rather than reusing the light ones at higher opacity. Cards no longer take a shadow
on hover — a shadow now means "this floats above the page", which makes it informative
again.

### Typography (font-families unchanged)

- Half-pixel sizes removed; the scale is 11 / 11.5 / 12 / 12.5 / 13 / 13.5 / 14 / 16 /
  19 / 24 / 25 / 29.
- Page title 22 → 19px, tighter tracking. Meeting title 26 → 25px with `-0.018em` and
  `line-height:1.22`. Folder title 24px.
- Body prose 13.5 → **14px at 1.68 line-height** — the one place type got bigger, because
  it is the thing being read.
- Micro-labels unified at 11px / 600 / `.07em` in `--ter`. `.ghd`, `.slab` and `.slabel`
  were three near-identical rules at 11, 11.5 and 11px with three different tracking values.
- Weights lowered where boldness was doing emphasis work that hierarchy should do: tab
  labels 600 → 500 (600 only when active), `.npill` and `.fchip .b` 700 → 600, overdue
  dates 700 → 600, `.mrow .rt .tg` 600 → 500.
- `font-variant-numeric: tabular-nums` added to timers, counts, timestamps, big stats and
  axis labels so digits stop jittering as they change.
- Row titles got `line-height:1.35` and `-0.005em`; meta lines 1.4–1.55.

### Components

| Component | Change |
|---|---|
| `.btn` | Explicit heights (32 / 28) instead of implied padding — three buttons in one row used to measure 33, 31 and 30px. Radius `--r2`, `:active` press, `--e1` on primary only, new `.btn.q` (quiet) and `.btn.ico` (square) variants |
| `.fchip` | Fixed 30px height, hairline border, selection is a tint only (was tint + weight + border change) |
| `.pri` | Colour only for "High" |
| `.tog` | 44×25 → 40×22, softer thumb shadow |
| `.inp` / `.srch` / `.addrow` | Filled wells (`--sunk`) rather than outlined boxes; they turn white on focus. One less line in a column that already has borders on both sides |
| `.sel` | Fixed 32px height, neutral ink, hairline |
| `.cbx` | 18 → 17px, `--r1`, 1.5px border, hover state |
| `.tabs` | 13.5px / 500, count chips neutral by default (`--sunk`), brand tint when the tab is active, danger tint only for conflicts |
| `.card` | Softer border; new `.card.flat`; inner dividers use `--hair` |
| `.empty` | Brand-tinted 60px circle → neutral 44px rounded well; 20 → 19px heading; shared `.a` action slot |
| `.mrow` / `.trk` / `.trow` / `.wrow` | One row pattern: 11px vertical padding, hairline separators, hover well, `:active` state, icon-well actions |
| `.trs` | Tinted-and-outlined "source of task" lines → a 2px left rule, so a transcript reads as a column again instead of stripes |
| `.player` | Outlined box → filled well; waveform clips instead of overflowing |
| `.meter` | 38 → 26px, 0.8 opacity — the live level meter was a block of saturated red across the page |
| `.menu` / `.modal` | Softer shadows, tighter radii, 32px rows, entrance animations, danger items tint on hover |
| `.msg` | Chat bubbles lost their borders; radius `--r4` with a `--r1` tail |
| `.toast` | One surface, coloured glyph |
| Dialog header tiles | Five copies of a brand-filled 38px tile → a neutral 32px well |

---

## Component / system changes

Recurring problems were fixed once, at the source:

1. **`--hair`** — a divider token distinct from the card-edge token, per theme.
2. **`.list`** — one row-group primitive, replacing per-screen card wrappers.
3. **`.btn.q` / `.btn.ico`** — a real "available but not advertised" button, so tertiary
   actions stopped being outlined.
4. **`.notice.quiet`** — a one-line inline notice, so informational text stopped being
   drawn as an alert.
5. **`.empty .a`** — a shared action slot, so every empty state offers its action the same
   way.
6. **One micro-label rule** instead of three.
7. **`--tr`** — one duration and curve for every state change, replacing 0.12s / 0.13s /
   0.14s / 0.16s / 0.18s scattered across the file.
8. **Inline-glyph rule** — `svg { display: block }` is right for an icon in a flex row and
   wrong for one in the middle of a sentence, where it forced a line break. A scoped rule
   now makes those inline; it fixed the Share modal's transcript warning and the Unfiled
   explainer.

### Two real bugs found and fixed along the way

- **`.trk.sel` collided with `.sel`.** `.sel` is the small dropdown chip ("Open ⌄"); a
  selected task row also carried `sel`, so `.trk.sel` inherited the chip's fixed 32px
  height and the row's second line was drawn on top of the row beneath it. The row's
  modifier is now `.on`, matching every other selected thing in the app. (This became
  visible only once `.sel` gained an explicit height in this pass — a latent collision.)
- **Flex children shrinking below their content.** `.body` is a scrolling flex column, and
  a flex child of it shrinks below its own content by default. The old bordered cards hid
  this because their rows were block children; once a group became a flex column, the first
  row of a long list was squashed. `.body > *`, `.list > *` and `.wscroll > *` are now
  `flex: 0 0 auto`, with the two containers that should absorb the leftover room opted back
  in explicitly.

---

## Accessibility and usability

### Keyboard

Almost every control in this prototype is a `<span>` with a `data-a` attribute and a single
delegated click handler. That worked with a mouse and **did not exist for a keyboard**: no
tab stop, no focus indicator, no Enter key.

`tips()` already walked every element after each render to rewrite `title` into a tooltip,
so it was the right place to also:

- give each non-input `[data-a]` element `tabindex="0"` and a role (`button`, or `link` for
  nav rows and menu items), excluding contenteditable regions and the inputs, which are
  focusable already;
- set `role="switch"` + `aria-checked` on `.tog`, `role="checkbox"` + `aria-checked` on
  `.cbx`, `role="tab"` + `aria-selected` on tabs, and `aria-current` on the active nav row.

A capturing `keydown` handler maps **Enter** and **Space** on those elements to a click,
swallowing Space so the page does not scroll out from under the control. Verified: Space
toggles a task's checkbox, Enter switches tabs and navigates. 71 controls are reachable on
the meeting page.

### Focus

`:focus-visible` gives a 2px `--brand` outline at 2px offset (inset on list rows so it does
not clip), using `:focus-visible` rather than `:focus` so a mouse click never leaves a ring
behind. **Hover-revealed row actions now also appear on `:focus-within`** — previously they
were simply not there for anyone not holding a mouse.

### Contrast

`--ter` is the colour of every micro-label, count, hint and timestamp in the app, and in
light mode it measured **2.84–3.53:1** against the surfaces it sits on — well below the
4.5:1 floor for text that size. This pass moved *more* text onto `--ter`, so it had to be
fixed rather than worked around.

Each theme's `--ter` was re-tuned to clear 4.6:1 against its own darkest light surface
(and, in dark mode, against the hovered-row surface), keeping its hue. Meta text that can
end up on a *tinted* row — `.trk .m`, `.wrow .wm`, `.wrow .age`, `.convrow .d`,
`.wcmp .hd`, `.wcmp .who` — moved to `--sec`, which is tuned for exactly that. Ocean's and
Harbor's `--sec` were themselves darkened. Ember's primary fill and Ember-dark's chip well
were corrected, and two avatar colours darkened.

**Result:** an automated sweep of 21 screens × 5 themes × light/dark, with hover and
selection surfaces forced onto every row type, reports **zero text below WCAG AA** —
composited through semi-transparent backgrounds, not just naive colour pairs.

### Target sizes and interaction

- Icon buttons standardised at 28–32px; row action wells 28px (up from irregular 24/29/30).
- `.colbtn` is a 30×30 target.
- Toggles, checkboxes and radios kept their hit areas while shrinking visually.
- `prefers-reduced-motion: reduce` now disables *all* animation and transition globally —
  previously only the sidebar-peek slide and the tooltip honoured it, while the recording
  halo, the pulsing dot, the toast entrance, the meter and the typing indicator did not.
- Scrollbar thumbs are pill-shaped with a transparent inset border and a hover state.

### Feedback and states

Loading (generating-notes), empty (8 variants), error (delete confirmations, permission
dialogs), success (setup complete, link created), hover, focus-visible, active, disabled
and selected were each checked and given a consistent treatment. `.btn.dis` also responds
to `[aria-disabled="true"]` and drops its press transform.

### Copy

- The Unfiled explainer went from three lines to one.
- "Add Client Calls Folder" → "New folder" on the tile (the long form stays in the tooltip).
- "Tasks / Action Items" → "Tasks".
- "Meetings in this folder · 1, 2 more in its folders" → "In this folder · 1 here · 2 in
  its sub-folders".
- "What the assistant looks for" → "What it looks for".
- "Collapse" labels removed from both sidebars.
- "Turn on conversation mode" button → "Turn it on" link.

---

## Responsive improvements

The three breakpoints (`w3` < 1320, `w2` < 1080, `w1` < 840) are driven from the mock
window's width rather than the viewport's, and were kept.

- **Phone width (`w1`) meeting rows were unusable.** A title, a people line, three
  hover-only actions and a right-hand metadata column were competing for ~430px. The
  metadata now drops to its own line; the hover actions — which a touch pointer cannot
  reveal anyway — give up their space; the row menu is still on the meeting itself. Task
  rows stack their due date the same way.
- **The audio player pushed the page sideways at phone width.** Its waveform is 80
  fixed-width bars (~400px). `.scrub` now clips instead of overflowing, and the level meter
  is hidden at `w1`.
- **The collapsed list strip was a column of eleven identical folder glyphs** with no
  labels. Sub-folder rows are hidden in the strip; top level only, with the rest one hover
  away.
- **Stat rows** flip from a row with vertical hairlines, to a tighter row, to a stacked
  column with horizontal hairlines.
- Notes and rollup grids, folder card grids, action bars and tool rows all reflow at `w2`
  and `w1`; the side column flips its hairline from left to top.
- Automated check: at 1480 / 1000 / 560 px across 21 screens there is no horizontal
  overflow and nothing renders outside the window.
- The floating pill's resting position moved from a third of the way up the window (where
  it sat on top of a list row) to the lower-right, clear of the composer and the audio
  player.

---

## Detailed change log

Format: **Problem → Change implemented → Reason.**

### System

1. **Eighteen corner radii, twelve shadow stacks, ~40 ad-hoc spacing values** → three
   scales on `:root` (`--s1…--s8`, `--r1…--r5`+`--rF`, `--e1…--e3`) plus one motion token
   `--tr` → two cards sitting next to each other never quite agreed, and nothing told the
   next person which value to pick.
2. **`--line` used as both card edge and row divider** → added `--hair` (10 theme values)
   → strong enough to find a card edge is too strong repeated forty times down a list.
3. **`--ter` at 2.8–3.5:1 in light mode** → re-tuned per theme to ≥4.6:1 on its darkest
   light surface; dark-mode values raised to clear the hover surface → it is the colour of
   every label and count in the app, and this pass gave it more work.
4. **No focus styling and no keyboard reach on `[data-a]` spans** → roles, tab stops,
   ARIA state and an Enter/Space handler added in `tips()`; `:focus-visible` ring;
   `:focus-within` reveals row actions → the entire control surface was mouse-only.
5. **`prefers-reduced-motion` honoured by 2 of ~12 animations** → global override →
   pulsing dots and haloes are exactly what that setting is for.
6. **`svg { display: block }` breaking icons used mid-sentence** → scoped inline rule →
   the Share modal's warning and the Unfiled explainer each wrapped onto an extra line.
7. **Flex children shrinking below content in `.body`** → `flex: 0 0 auto` on page-level
   children, with scroll containers opted back in → squashed the first row of long lists.
8. **`.sel` (dropdown chip) colliding with `.trk.sel` (selected row)** → row modifier
   renamed to `.on` → the row inherited the chip's fixed height and overlapped its
   neighbour.

### Meetings

9. **One bordered card per day group, each with internal hairlines** → `.list`: day label,
   hairline-separated rows, hover well → four groups drew four boxes and twenty lines.
10. **Folder path printed in the folder's own accent colour** → neutral tertiary →
    four accent colours encoding taxonomy, not priority.
11. **Full attendee lists** → two names + remainder → a 12-person all-hands wrapped and
    broke the list's rhythm.
12. **Outlined row action buttons on hover** → icon wells → three more boxes appeared the
    moment the pointer landed on a row.
13. **Empty state described its action in prose** → **Record one now** button in the shared
    action slot → an empty screen's job is to offer the next step.
14. **"Add <Name> Folder" under every expanded folder in the tree** → removed; one "New
    folder" at the foot → three affordances for one action.

### Meeting detail

15. **Two stacked banners above the content** → one; the green banner's information became
    a caption on the task list → both duplicated counts the tabs and side column already
    showed.
16. **Three outlined export buttons in the notes toolbar** → three quiet icon buttons →
    export is available, not advertised.
17. **Blue glyphs beside Summary / Decisions / Open questions** → removed; headings became
    micro-labels; body copy up to 14px/1.68 → decoration above prose.
18. **Bold brand-coloured timestamp links on every bullet** → quiet tabular numerals,
    brand on hover → four blue links beside four sentences.
19. **Tinted-and-outlined transcript lines** → 2px left rule → two in six lines tinted
    turned a readable column into stripes.
20. **"High" priority chips repeated in the 300px side column** → hidden there; the due
    date carries urgency → the same signal twice in a narrow space.
21. **Compact task rows fought the due date for the same 300px** → due date moved to the
    meta line in compact mode → titles were wrapping unnecessarily.
22. **The outlined folder chip in the meta row** read as the one clickable thing on a line
    of plain metadata → hairline removed, hover well added.
23. **The live level meter was a 38px block of saturated red** → 26px at 0.8 opacity, with
    a proper gap above the tabs → a level meter, not an alarm.

### Watchouts

24. **Three rows of controls on the tab** → one → the counts were on screen three times.
25. **Type said four times per row** (rail, outlined well, chip, coloured count) → one
    tinted glyph plus a dot in the counts.
26. **The project band filled itself with the conflict tint** → neutral surface, hairline,
    dotted counts → a project page opened by turning pink.
27. **Bare icon button for "What the assistant looks for"** → text link → an icon-only
    help affordance is undiscoverable.
28. **The detail panel repeated its own title as a chip, with "Open" as a red pill** →
    plain status text and age.
29. **Comparison block used `--line2` borders and a tinted second column** → `--hair` and
    `--sunk` → the pair is one statement, not two panels.

### Project / folder

30. **Five facts and a red count in the header meta line** → three facts.
31. **Filled primary "Add <Name> Folder" in the header** → removed (the dashed tile
    remains) → adding a sub-folder is not a project page's primary action.
32. **44px brand-filled folder glyph beside a 24px title** → 36px neutral well → the icon
    was the loudest thing on the page.
33. **The sticky Ask dock let the row behind it show through the composer** → the fade is
    opaque by the time it reaches the box, with a taller gap above it.
34. **Folder cards lifted with a shadow and a brand border on hover** → hairline + rail
    background + `--e1` → a hover state should not look like a click.

### Tasks

35. **Filters duplicated between toolbar and sidebar** → toolbar chips removed.
36. **Red group heading, red heading icon and red dates inside it** → heading neutral,
    dates red → one red per row.
37. **Colour on High, Medium and Low** → High only.
38. **Two icons per meta line** (flag + people) → flag dropped with the chip; people icon
    kept for the source meeting.
39. **Outlined add-task field** → filled well matching the search fields, focus turns it
    white.

### Speech to Text / Vocabulary / Insights

40. **A file glyph on every row of a list of files** → removed → six identical icons
    carrying no information.
41. **Amber Fn-key banner with an outlined button** → quiet line with a text link.
42. **Bordered empty-state and metrics blocks** → hint text and a hairline-topped metrics
    row.
43. **Vocabulary's table wrapped in a card with 16px cell padding** → borderless table,
    hairline rows, first column flush with the page.
44. **Insights: saturated brand bars, 34px wide, two grid lines** → `--o300` at 26px with
    brand on hover, hairline axis.
45. **Boxed stat cards** → borderless numbers separated by a gap and a hairline.
46. **Green tinted panel with an outlined button beside a bar chart** → quiet line with a
    text link → it out-shouted the data it was describing.
47. **Range picker in both the sidebar and the top bar** → sidebar only.

### Settings and overlays

48. **Every group: bordered box + tinted header strip + brand-tinted icon well** → label,
    hairline, 32px gap → four devices to say "these belong together".
49. **Group headers rendered on three lines** after the restyle (a selector matched the
    wrapper as well as the caption) → fixed to one line.
50. **1120px modal with 560px+ prose lines** → 1000px.
51. **An unknown pane id rendered a blank white modal with no heading** → falls back to the
    first pane.
52. **Five copies of a brand-filled 38px dialog tile** → one neutral 32px well.
53. **Full-bleed coloured toasts** → one surface, coloured glyph.
54. **Theme cards: uneven swatch-row baselines** → description flexes so the swatches sit
    at the foot of every card.

---

## Remaining issues, intentionally not changed

1. **Font-families, and the two-typeface role split.** A hard constraint. `Sentient` still
   carries display type, `Onest` still carries body and UI chrome, and no component was
   moved between them — even where a 13.5px serif control label is arguable, because
   reassigning families is a font-family change in substance.
2. **The floating pill still overlaps page content at rest.** It is conceptually an
   always-on-top OS control floating over other applications, and it is draggable. Its
   default position moved to where it covers least; removing or docking it would change the
   product concept.
3. **ARIA is improved but not complete.** Tabs have `role="tab"` and `aria-selected` but no
   `aria-controls`/`tabpanel` wiring; modals do not trap focus or restore it to the trigger
   on close; menus are not `role="menu"` with arrow-key navigation; there are no live
   regions for toasts. Each needs JS restructuring beyond a design pass, and half-done
   ARIA can read worse than none.
4. **Tab order is document order.** With 71 controls on a meeting page, a real
   implementation would use roving `tabindex` inside lists and skip-links between regions.
   Reachable is a large improvement over unreachable; efficient is the next step.
5. **`S.taskFilter` is now unused** (the sidebar drives filtering). Left in state so
   nothing depends on its removal.
6. **Prose measure.** The meeting summary can still run to ~95 characters on a very wide
   window. Capping it would misalign it from the lists and headings above it; the right fix
   is a page-level content measure, which is a layout decision worth making deliberately.
7. **Demo-data inconsistency**: the sidebar reads "All transcripts 48" while the list shows
   6 rows. Seed data, not UI.
8. **The plan row states "8 of 10 this month" as text** where a small meter would read
   faster. That is feature design, not polish.
9. **The watchout comparison's relation label** ("conflicts with") sits below the pair
   rather than between the two columns. Placing it in the gutter needs a grid change that
   also has to work when the pair stacks at narrow widths.
10. **`--sunk` hover on a `--sunk` search field** makes the field invisible on hover in one
    or two placements. Marginal, and fixing it properly means a third surface token.
11. **The `title` → tooltip rewrite** is kept as-is; it exists because Chromium will not
    render a native `title` tooltip on a `span`, and it is still the right workaround.
