# AIT-Scribe (prototype)

This is a static, no-build front-end prototype. Open `index.html` directly in
a browser (double-click it, or `file://.../index.html`) and the full app
runs — no server, bundler, or `npm install` required.

## Structure

```
index.html                 Entry point: page shell + <link>/<script> includes
css/
  tokens.css                Design tokens & the six theme palettes (light+dark)
  base/                     App shell chrome and shared primitives
    window-chrome.css         Window frame, title bar, rail, list column, main
    buttons.css                Buttons
    generic.css                 Shared/generic utility styles
    responsive.css               Responsive breakpoints for the app shell
    utilities.css                 Section panel, filter chips, scroll containment, misc tweaks
  components/                Reusable UI widgets used across pages
    overlays.css               Modals, menus, toasts
    folder-tree.css             Sidebar folder tree + theme picker
    notifications.css            Toast variants + system notification banners
    panel-controls.css            Tab action bar, hover-peek, panel motion, tooltips
    bubble.css                     Floating recording bubble
  pages/                      Feature/screen-specific styles
    meetings.css                Meetings list + meeting detail
    capture-tasks.css            Speech capture, tasks, assistant snippets
    vocab-insights.css            Vocabulary + insights panels
    watchouts.css                  Watchouts panel
    folder-detail.css               Demo page, folder detail, attendees, meeting-assistant panel
    meetings-home.css                Folder/data palette + meetings home screen
js/
  icons.js                   Inline SVG icon path data
  themes.js                  Theme metadata for the theme picker
  data.js                    Seed/mock data (meetings, folders, tasks, vocab, ...)
  state.js                   Global application state
  render/                    One file per screen/section's render function
    chrome.js, list-columns.js, meters-chips.js, meetings-home.js,
    meetings.js, folder-detail.js, meeting-detail.js, watchouts.js,
    tasks.js, speech.js, vocabulary.js, insights.js, assistant.js,
    settings.js, overlays.js, meeting-assistant.js
    dispatch.js               Top-level render() that calls the page renderers
  actions.js                 State-mutating action handlers
  events.js                  DOM event listener wiring
  boot.js                    Boot/sizing logic that runs on load
```

## Why plain `<script>`/`<link>` tags, not ES modules or a bundler

The app has to keep working when `index.html` is opened directly as a local
file (`file://...`). Browsers block `type="module"` scripts (and any
`fetch`/`import` of local files) under the `file://` origin's CORS rules, so
ES modules and bundler-based imports would break that workflow. Plain classic
scripts don't have that restriction, and — like the original single inline
`<script>` — they all share one global scope, so `state.js`, the `render/*`
files, `actions.js`, etc. can freely reference each other's top-level
functions and variables exactly as before.

## Load order matters

Both `css/**` and `js/**` are split at the same section boundaries the
original single file already had (each file keeps that section's original
banner comment). The `<link>`/`<script>` tags in `index.html` include them in
the *exact same order* they appeared in the original file. This was
preserved deliberately: a few CSS rules rely on cascade/source order (e.g.
dark-theme overrides that come after their base rules), and JS files were
kept in their original relative order for the same reason. If you reorganize
folders, keep the tag order in `index.html` unchanged, or re-verify the
affected screens before shipping.

## Verification

This split was verified against the original single-file `index.html`:

- Every CSS/JS file's content, concatenated back in include order, is
  byte-for-byte identical to the original `<style>`/`<script>` blocks.
- Each JS file passes `node --check` individually (no statement was cut
  mid-expression at a section boundary).
- Loaded headlessly (Chromium via Playwright): identical page title, identical
  `#app` rendered HTML length, and a pixel-diff of full-page screenshots
  against the original shows **zero** differing pixels.
- Clicking through the list and settings produced identical rendered HTML
  length and a pixel-diff with no structural differences (the only few pixels
  that ever differ are timing noise reproducible even reloading the original
  file twice — e.g. a blinking cursor).
