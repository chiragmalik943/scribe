# AIT‑Scribe — navigation, calendar and colour pass

A second pass over `index.html`, on top of the UI/UX work described in `UI_UX_CHANGES.md`.
Everything here is **implemented**, not proposed.

- +669 / −124 lines in `index.html`
- Previous state saved alongside as `.before-nav.html` for diffing
- Verified in Chromium at 1600, 1160, 900 and 620 px wide, light and dark
- 0 console errors; every route, chip, folder card, calendar event and the
  record → stop → notes flow re‑tested by click, not by eye

---

## 1 · Meetings has a home screen, and it has no list column

The old Meetings screen put the folder tree in the left column *and* nothing but a flat
list of calls in the main area — so the first thing the app showed you was a list of every
meeting in reverse order, with your actual organising structure pushed into a 272px
sidebar.

The home screen now leads with the folders as cards, and carries no list column at all.
That is the point: **on this screen the folders are the navigation**, and a second copy of
them down the left would be the same list twice. Below the folders, two columns — recent
calls on the left, what is coming up on the right.

The list column comes back the moment you open a folder, because that is the first moment
you might want to move between folders without going home first. The flat list of every
call is still there — it is now a destination (`All meetings` in the column, or from the
Folders heading) rather than the landing page.

**Route change**: `meetings` is the home screen; the flat list became a new route, `mlist`.
`folder` and `meeting` are unchanged and keep their column. Breadcrumbs that used to point
"back" at the home screen now point at the list the user actually came through.

## 2 · Default folders have a glyph and a colour

Client Calls is a briefcase, Interviews a person being added, Projects a stack, Internal a
house. Anything you create is hashed onto one of the same six colour slots, so it is stable
across sessions rather than depending on the order folders happen to sit in. Sub‑folders
inherit the family colour and take the plain folder glyph, so the parent stays the thing
that names the category.

The slot is a **class** (`fc-3`), never a hex, because each of the six is hand‑tuned for
dark mode rather than inverted — the same discipline the five themes already follow. One
palette now serves folder icons, the tag on a meeting row, events in the calendar and the
series in the Insights charts, which is why the same green means "Projects" in four
different places.

## 3 · A Calendar, as a week of time slots

New primary entry. Monday‑first week grid, 8am–7pm, hour hairlines, today's column tinted
and a red line at the current time.

Recorded calls are read **straight off `meetings`** — parsed from the day, time and duration
already in the data — so the calendar can never disagree with the notes. Only what has not
happened yet is stored separately, in a new `events` table. Record a call and it appears on
the grid at the time it was recorded; click a recorded event and it opens its notes.

Scheduled calls are drawn as outlines, recorded ones as fills, and anything under about
45 minutes switches to a single‑line form rather than clipping its second line. Overlapping
calls pack into side‑by‑side lanes.

Making the week real exposed some seed data that was not: 8 Aug 2026 is a Saturday, not the
"Monday" the data claimed, and four task due dates named the wrong weekday. Those are
corrected.

## 4 · AI notes and Watchouts no longer scroll sideways

`overflow-y:auto` on a box whose `overflow-x` is `visible` **computes `overflow-x` to
`auto`** — so `.notesgrid` and `.wscroll` both offered a horizontal scrollbar. What it had
to scroll was 10px: rows in this app carry a hover well that reaches past the text column
(`.list`, `.sidebox .trk` and friends all sit at `margin:0 -10px`). Inside `.body` that
overhang lands in the page's own 28px padding and costs nothing; a scroll container between
the two has no padding of its own, so it became overflow.

Fixed at both ends — the containers name their axis, and they are given the same 10px back
as padding and taken off again as margin, so every column stays exactly where it was and
the wells have room to sit in. Confirmed by measurement before and after, not by looking.

## 5 · Speech to Text keeps two sections, not five

Vocabulary and Insights used to hang off the primary rail as a sub‑tree, which put three
levels of navigation on screen at once. The rail is flat again. The list column beside
Speech to Text now holds **Transcripts** and **Vocabulary** — two different bodies of
content, which is what a column is for.

Today / This week / All transcripts are a *range over one of them*, not a section, so they
moved to filter chips directly above the list they filter — which is where the eye already
is when it wants to change one. Vocabulary's own three filters got the same treatment.

## 6 · Insights is its own menu

It was a view about the whole workspace buried inside dictation. It is a primary entry now,
with no list column of its own; the range (week / month / all time) is a chip row on the
page, matching Speech.

## 7 · Colour, threaded deliberately

The previous pass took colour out because the same fact was being said four times. This one
puts it back where it **identifies** something rather than decorating it:

- folder glyphs, on the home cards, in the list column and on a folder's own page
- one small coloured dot on the folder tag of a meeting row — the name stays neutral, so a
  list of eight calls groups by eye without printing four accent colours of type
- calendar events, which is the only colour on that page besides the now‑line
- Insights: the two charts take different slots, the corrected‑terms bars cycle three, and
  each stat's colour rides on the small glyph under the number rather than on the number —
  three 29px figures in three colours would be a chart, not a stat row
- Vocabulary's source pill now separates "Added by you" from "Learned"
- the account avatar picks up the user's own slot

Attendee avatars were already coloured and are untouched.

---

## Also corrected on the way past

- `All transcripts` claimed 48 while the list showed 6 — a demo‑data inconsistency listed
  as known in `UI_UX_CHANGES.md`. It now counts the list.
- `railOpen()` became unused when the rail sub‑tree went, and is removed.
- The flat meeting list duplicated `meetingRow()` inline with a different sub‑line. It uses
  the shared row now, with a flag for which sub‑line it wants.
- The setup checklist was a template literal wedged into the meeting list; it is a function,
  and it lives on the home screen where a first run actually lands.

## Deliberately not done

1. **The floating pill still overlaps page content at rest**, including the "See all" link
   on the home screen at narrow widths. Same reasoning as before: it is conceptually an
   always‑on‑top OS control and it is draggable.
2. **Overlap packing is per day, not per cluster.** Two calls that overlap put *every* event
   in that day into lanes. No day in the seed data overlaps, and fixing it properly means
   interval clustering — worth doing when the calendar takes real data.
3. **The calendar is week‑only.** No day or month view, no drag‑to‑create, no timezone
   handling. The week was the view asked for and the one that carries the product idea.
4. **`This week` in Insights still charts a full Mon–Sun** while the prototype's "today" is
   a Tuesday. Zeroing the future days would leave the chart looking broken; the data is
   seed data, not UI.

---

# Follow-up pass — calendar cards, panels, bubble, focus ring

A second round on top of the above, against a supplied week-view reference.

- Previous state saved alongside as `.before-cal.html`
- Re-verified at 1600, 1160, 900 and 620 px, light and dark, all five themes
- 0 console errors; no container overflows its box at any width

## The calendar event is a card now

The old event was a coloured sliver with a label crammed into it. Against the
reference it was the wrong object entirely — a calendar event is a card, and a
card needs height to be one. So:

- **The hour is 124px**, not 58. That is the trade the reference makes and it is
  the right one: you see about five hours at a time and scroll for the rest, and
  in exchange a 90-minute call carries its attendees and its join button the way
  it would in a list.
- **Three densities, measured rather than guessed.** `xs` is one row (dot, name,
  start time) under 56px; `sm` is a title line and a time line under 92px; `md`
  adds the folder tile above them. Avatars appear at 140px, the action button at
  172px. The first version of this shipped with thresholds that were roughly
  right and a flex row that let items shrink, so a 48px card rendered a
  timestamp and *no title*. Everything inside a card is `flex:0 0 auto` now: a
  card that is a few pixels short clips its own tail instead of eating its most
  important line.
- **Recorded vs scheduled is fill vs outline** — a filled tile for a call that
  exists, an outlined one on the page surface for a call that is only booked.
  Both are cards; the difference is which one already happened.
- **One action per card, and it names itself.** You join something upcoming
  (Zoom blue, Meet orange, as in the reference) and you open the notes of
  something past.
- **Attendees are real faces.** A name written on a scheduled call is matched
  against everyone AIT‑Scribe has already seen, so Jennifer Walsh is the same
  initial in the same colour on Friday's deep-dive as on Tuesday's kickoff.

Around the grid: a timezone pill showing the **viewer's own** offset, an all-day
row that carries an actual all-day item, and the date leading each header column
with today marked by a rule under its own cell rather than by tinting a whole
column top to bottom.

## Sections are bounded

The earlier pass took boxes off almost everything, on the grounds that a label
and whitespace group a list perfectly well. That holds for a list sitting alone
in a column. It stops holding when two unlike things sit side by side — a list
of calls next to a schedule, two charts next to each other — because then the
only thing saying where one ends and the other begins is the gap, and a gap
reads as alignment, not as a boundary.

A new `.pnl` — hairline, radius, header strip — now bounds Recent meetings and
Upcoming on the home screen, and the summary, both charts and the two term
blocks in Insights. It is used where sections sit beside each other, not as a
default wrapper for everything: the folder cards on the home screen already
carry their own border and are left alone.

## The bubble parks in the corner

`bubHome()` put it 232px up from the bottom, to stay clear of the Ask dock. That
read as "somewhere down the right-hand side" rather than as parked. It is 24px
from the bottom and 24px from the right now — the same inset on both axes, which
is what makes a corner read as a corner. The clamp that keeps it on screen moved
to match.

## The ring inside the text field

Typing into any search box drew a second rounded outline *inside* the well. A
text field is the one control a browser always treats as `:focus-visible`, even
on a mouse click, so the app-wide focus ring landed on the `<input>` itself —
inside `.srch`, which was already lighting up via `:focus-within`. Two rings,
one focus. The field inside a well no longer takes its own; the well is the
indicator. Keyboard focus is unaffected everywhere else.

---

# Third pass — panel focus, calendar alignment, and the colour system

- Previous state saved alongside as `.before-color.html`
- Re-verified across 11 routes × 4 widths × light/dark, and the calendar across
  all 5 themes × both modes; 0 console errors, no container overflow, no
  misalignment
- Every text/background pair in the new system measured for contrast

## A right-hand panel folds the left ones away

Opening a watchout, the meeting assistant or a task detail put a fourth column
on screen and squeezed the one you were actually reading. Any of those three
now collapses both left sidebars to their icon rails, and closing it gives back
**exactly** what you had — if you had already collapsed the rail yourself, it
stays collapsed; if `fit()` has since decided the window is too narrow for them,
that wins.

It runs from `render()` rather than from each of the six actions that can open a
panel, so nothing can open one and forget to make room.

## The all-day row and the grid agreed to disagree by one scrollbar

The time grid scrolls and the two header rows above it do not, so the scrollbar
took its 10px out of the grid alone — and every column below the all-day row sat
10px left of the one above it. The gutter is reserved permanently now
(`scrollbar-gutter:stable`) and the header rows carry the same 10px back as
padding, so all three grids compute their seven tracks over an identical width.
Verified by comparing the measured left edge of all 21 cells in every theme.

## The colour system, rebuilt from the supplied spec

**A new default theme, Indigo.** `#525298` as the brand, `#F3F3F8` / `#FFFFFF`
light and `#1F1D2B` / `#252836` dark, `#E2E2F0` / `#2F3142` as borders. The
nine-step ramp exists because the app needs the brand at six weights — fill,
hover, an ink that passes on white, two tints and a focus ring — and the spec
gives three; the rest are interpolated along the same hue. `#525298` lands on
`o600` because a fill is `o600` by this file's convention, which is why
light-mode hover *brightens* to the spec's `#5C5CA2` rather than darkening.
Ocean, Citrus, Harbor, Violet and Ember all still work and are still selectable.

**Semantic colours are shared, as the spec says.** Error `#FF5C70`, success
`#22B07D`, warning `#FFBF47`, info `#08A0F7`, across every theme and both modes.
Each is a family rather than one value, because one hex cannot do both jobs: the
spec's colour is the *mark* — the dot, the badge, the recording light — while
`*Ink` is the same hue darkened until text clears 4.5:1, and `*Tint`/`*Line` are
the surface it prints on.

**The six identity slots are the brand and the accents** — indigo, purple,
success green, orange, error rose, cyan — each pulled to the weight that carries
an 11px label on its own tint. Avatars, the two join buttons and the floating
pill come from the same set.

**Where the spec was adjusted, and why.** Two values could not be used as
literals without dropping below AA:

- Text / Secondary `#9293A3` is 3.0:1 on white. Fine for a 14px description,
  not for the 11px uppercase micro-labels this app runs on. The ramp keeps the
  hue and steps it down twice — `--sec` at 6.4:1 for anything read as a
  sentence, `--ter` at 4.5:1 for labels and counts.
- Error `#FF5C70` under white button text is 2.9:1, so the destructive *fill* is
  pulled one step to `#EF4358` (4.1:1). The dot, the badge and the dark-mode
  value stay exactly `#FF5C70`.

Measured afterwards, light and dark: body ink 14.6:1, secondary 6.4 / 6.2,
tertiary 4.5 / 4.9, brand ink 8.7 / 5.4, every semantic ink ≥ 5.1, white on the
brand fill 7.0 / 5.8, and all six identity slots ≥ 4.9 on their own tint.
