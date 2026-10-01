# Aithinkers Design System

**Version 1.0 · September 2026**

A calm, hairline-first interface system for dense, capable product tools: one typeface, colour only where it means something, and six hand-tuned themes whose body text clears WCAG AA in both light and dark.

This file is the **specification**. It ships with an HTML **visual reference** that renders every token, component and layout described here, live, in all six themes. When the two disagree, the CSS in this file wins.

---

## 0. How to use this document

This document is written so a coding agent (or a person) can build a new product that is indistinguishable in look and behaviour from existing Aithinkers products.

**Rules of precedence**

1. **Tokens are copied, never recreated.** Paste the token block in §2.2 into the root stylesheet unchanged. Every colour, space, radius, shadow, font and duration in product code MUST come from a variable defined there.
2. **Components are copied, never re-derived.** Paste the component stylesheet in Appendix B unchanged. Build screens by composing the documented class names. The tables in §10 explain that stylesheet; they do not replace it.
3. **Use roles, not ramp steps.** Components reference `--brandFill`, `--ink2`, `--tint`… — never `--o600` or a literal hex. The theme decides which step a role takes.
4. **Compose from documented patterns.** If a screen needs something that is not here, build it from existing tokens and the closest documented component, following the principles in §1. Do not add new radii, shadows, font sizes, font families or colours.
5. **Every screen works in all 12 theme/mode combinations** (`data-th` × `data-theme`) from the first commit.
6. **Before you finish, run the review checklist in §15** and fix every item that fails.

Language: **MUST** = required; **SHOULD** = expected unless there is a stated reason; **MAY** = optional.

**Starter prompt for an agent**

```text
You are building the UI for a new product. Match the Aithinkers Design System exactly.
1. Read the design-system Markdown spec in full before writing any UI code. It is the source of truth.
2. Paste the token block (§2.2) into the root stylesheet unchanged, and the component
   stylesheet (Appendix B) after it. Use only these variables and classes.
3. Build the shell first: 56px title bar, 248px rail, optional 272px list column,
   main column, optional 384px right aside. Apply the collapse rules in §9.
4. Compose screens from the documented components. If something is missing, build it
   from existing tokens and the closest documented pattern — no new values.
5. Support all six themes (data-th) in light and dark (data-theme) from day one.
6. Run the review checklist (§15) and fix every failing item. Compare visually
   against the HTML reference.
```

---

## 1. Principles

Eight rules that decide most design questions before they are asked.

| # | Principle | What it means in practice |
|---|---|---|
| 1 | **Colour identifies, it does not decorate** | A colour is tied to one meaning and kept there. Identity slots name an entity; status families name a state. Nothing is coloured to look lively. Only the item that needs attention is tinted (e.g. only *high* priority). |
| 2 | **A hairline before a box** | Group with a heading and whitespace. A card is a hairline and a radius, nothing more. A shadow means *this floats* — menus, popovers, modals, a hovered tile. |
| 3 | **One typeface, two roles** | Onest carries everything. Hierarchy comes from size, weight and ink — never from a second family and never from uppercase headings. |
| 4 | **Quiet until asked** | Row actions, "⋯" options and edit affordances appear on hover **and** `:focus-within`. The resting screen shows content, not controls. |
| 5 | **Status is a family** | Every status colour is a mark, an ink, a tint and a line, and always ships with a glyph and a word — never colour alone. |
| 6 | **The eye learns one place** | A view's controls live in the same spot on every page: the action bar directly under the tabs; the primary action in the title bar. |
| 7 | **Dark is designed, not inverted** | Each theme ships a hand-tuned dark set; body text clears AA in both modes. Known exceptions are listed in §12. |
| 8 | **Motion is feedback** | One curve for state changes, one for things that travel. Nothing moves on its own except a live indicator. |

**Reviewer questions** — before adding a colour, name what it means; before adding a box, try a heading; before adding a shadow, ask whether it floats; before adding a control, ask whether it belongs in the action bar or on hover; before adding a size, pick a step from the scale.

---
## 2. Tokens

### 2.1 Setup

```html
<!doctype html>
<html lang="en" data-th="indigo" data-theme="light">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Onest:wght@100..900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="tokens.css">      <!-- §2.2, verbatim -->
  <link rel="stylesheet" href="components.css">  <!-- Appendix B, verbatim -->
</head>
```

- **Two axes.** `data-th` picks the theme: `indigo` (default) · `ocean` · `citrus` · `harbor` · `violet` · `ember`. `data-theme` picks `light` or `dark` within it.
- **Scopes.** Any element carrying **both** attributes opens its own themed scope (used for previews). An element carrying only one does not.
- **Persist** the user's choice (e.g. `localStorage`) and default the mode to `prefers-color-scheme`.

### 2.2 Token stylesheet (copy verbatim)

```css
/* ═══════════════════════════════════════════════════════════════════════════
   AITHINKERS DESIGN SYSTEM · TOKENS
   Two axes. `data-th` picks the THEME (its own nine-step brand ramp and its own
   neutrals); `data-theme` picks LIGHT or DARK within that theme. Every theme
   ships a hand-tuned dark set — never an inversion of its light one.
   Any element can carry BOTH attributes to open a themed scope of its own.
   ═══════════════════════════════════════════════════════════════════════════ */
:root{
  /* type — one family, two roles */
  --f-head:'Onest','Liberation Sans',Arial,sans-serif;
  --f-body:'Onest','Liberation Sans',Arial,sans-serif;
  --f-mono:ui-monospace,'SF Mono','JetBrains Mono',Menlo,Consolas,monospace;
  /* space — 4px base */
  --s1:4px;  --s2:8px;  --s3:12px; --s4:16px;
  --s5:20px; --s6:24px; --s7:32px; --s8:40px;
  /* radius — r1 chips · r2 controls · r3 rows · r4 cards/panels · r5 modals */
  --r1:6px; --r2:8px; --r3:10px; --r4:14px; --r5:18px; --rF:999px;
  /* motion */
  --tr:.13s cubic-bezier(.2,.7,.4,1);      /* every state change */
  --sbT:.26s cubic-bezier(.32,.72,0,1);    /* panels opening/closing */
  --pop:cubic-bezier(.2,.9,.3,1);          /* things arriving: modal, popover, pill */
}
/* ── mode-level tokens (shared by every theme) ─────────────────────────── */
:root,[data-theme="light"]{
  --danger:#EF4358; --dangerOn:#FFFFFF; --dangerInk:#C92A40; --dangerTint:#FFF0F2; --dangerLine:#FFD9DF;
  --warn:#E9A21F; --warnInk:#8A6208; --warnTint:#FFF7E6; --warnLine:#FAE3B4;
  --ok:#1A9E70; --okInk:#0E7C55; --okTint:#E8F8F1; --okLine:#BFE9D8;
  --info:#08A0F7; --infoInk:#0A72B8; --infoTint:#E6F5FE; --infoLine:#BCE3FB;
  --e1:0 1px 2px rgba(16,24,40,.05);
  --e2:0 8px 24px -8px rgba(16,24,40,.16),0 1px 3px rgba(16,24,40,.05);
  --e3:0 28px 70px -18px rgba(16,24,40,.26),0 4px 14px rgba(16,24,40,.07);
  --peekShadow:20px 0 44px -14px rgba(16,24,38,.30);
  --chipWell:rgba(0,0,0,.055);
  /* the floating surface: dark in both modes, identical in every theme */
  --pill:#1F1D2B; --pillInk:#FFFFFF; --pillSec:rgba(255,255,255,.62);
  --pillLine:rgba(255,255,255,.13); --pillWell:rgba(255,255,255,.09);
  --pillShadow:0 18px 44px rgba(12,18,28,.38),0 2px 6px rgba(12,18,28,.24),0 0 0 1px rgba(255,255,255,.06);
  /* identity palette — six slots, ink (--cNI) and tint (--cNT) */
  --c1I:#525298; --c1T:#EEEEFF;  --c2I:#A03BB0; --c2T:#FAECFC;
  --c3I:#0A7856; --c3T:#E6F7F0;  --c4I:#A84F00; --c4T:#FFF0DF;
  --c5I:#C22843; --c5T:#FFECEF;  --c6I:#0A757D; --c6T:#E0F8FA;
  --lightR:#FF5F57; --lightY:#FEBC2E; --lightG:#28C840;
}
[data-theme="dark"]{
  --danger:#FF5C70; --dangerOn:#2A0E14; --dangerInk:#FF97A5; --dangerTint:#3A1A21; --dangerLine:#55262F;
  --warn:#FFBF47; --warnInk:#FFD37A; --warnTint:#33270C; --warnLine:#4C3A14;
  --ok:#22B07D; --okInk:#5FD6A8; --okTint:#113025; --okLine:#1F4A39;
  --info:#08A0F7; --infoInk:#6BC2FB; --infoTint:#0F2739; --infoLine:#1C4560;
  --e1:0 1px 2px rgba(0,0,0,.30);
  --e2:0 8px 24px -8px rgba(0,0,0,.52),0 1px 3px rgba(0,0,0,.34);
  --e3:0 28px 70px -18px rgba(0,0,0,.62),0 4px 14px rgba(0,0,0,.38);
  --peekShadow:22px 0 48px -12px rgba(0,0,0,.62);
  --chipWell:rgba(255,255,255,.10);
  --pill:#2B2940; --pillInk:#FFFFFF; --pillSec:rgba(255,255,255,.62);
  --pillLine:rgba(255,255,255,.11); --pillWell:rgba(255,255,255,.08);
  --pillShadow:0 18px 44px rgba(0,0,0,.62),0 2px 6px rgba(0,0,0,.44),0 0 0 1px rgba(255,255,255,.09);
  --c1I:#9797D4; --c1T:#2A2A46;  --c2I:#D98BE4; --c2T:#3A1F40;
  --c3I:#4FD3A2; --c3T:#123328;  --c4I:#FFA542; --c4T:#3A2410;
  --c5I:#FF8496; --c5T:#3B1C23;  --c6I:#3FE0EA; --c6T:#0E3438;
  --lightR:#E0443E; --lightY:#DEA123; --lightG:#1AAB29;
}
/* flags — three severities; only the critical one earns a red */
:root,[data-theme]{
  --fcr:var(--danger); --fcrInk:var(--dangerInk); --fcrTint:var(--dangerTint); --fcrLine:var(--dangerLine);
  --fwa:var(--warn);   --fwaInk:var(--warnInk);   --fwaTint:var(--warnTint);   --fwaLine:var(--warnLine);
  --fqu:var(--info);   --fquInk:var(--infoInk);   --fquTint:var(--infoTint);   --fquLine:var(--infoLine);
  --shadow:var(--e3); --shadow2:var(--e2);
}

/* ─────────── Indigo — the default ─────────── */
:root,[data-th="indigo"]{
  --o50:#F4F4FB; --o100:#EEEEFF; --o200:#DCDCF4; --o300:#B9B9E2;
  --o400:#8A8AC4; --o500:#5C5CA2; --o600:#525298; --o700:#45457E; --o800:#33335E;
  --rail:#F8F8FC; --surf:#FFFFFF; --sunk:#F3F3F8; --scrim:rgba(31,29,43,.44);
  --line:#E2E2F0; --hair:#EDEDF7; --line2:#D3D3E6;
  --ink:#252836; --ink2:#3A3D50; --sec:#5B5D75; --ter:#73758C;
  --brand:var(--o600); --brandOn:#FFFFFF; --brandHov:var(--o500); --brandInk:var(--o700);
  --brandFill:var(--o600); --brandFillHov:var(--o500);
  --tint:var(--o100); --tint2:var(--o50); --onChip:rgba(0,0,0,.24);
  --backdrop:#E4E4EF; --meterOff:#D6D6E8; --ring:rgba(82,82,152,.24);
}
[data-th="indigo"][data-theme="dark"]{
  --o50:#23233A; --o100:#2A2A46; --o200:#343458; --o300:#45457E;
  --o400:#5E5EA8; --o500:#7A7ABF; --o600:#9797D4; --o700:#B4B4E4; --o800:#D6D6F2;
  --rail:#1F1D2B; --surf:#252836; --sunk:#2E3143; --scrim:rgba(0,0,0,.62);
  --line:#2F3142; --hair:#2A2C3B; --line2:#3C3F52;
  --ink:#FFFFFF; --ink2:#DCDCE6; --sec:#A7A7B5; --ter:#9494A6;
  --brand:var(--o500); --brandOn:#FFFFFF; --brandHov:var(--o600); --brandInk:var(--o600);
  --brandFill:var(--o400); --brandFillHov:var(--o500);
  --tint:var(--o200); --tint2:var(--o100); --onChip:rgba(0,0,0,.30);
  --backdrop:#16151F; --meterOff:#3C3F52; --ring:rgba(122,122,191,.32);
}
/* ─────────── Ocean — cool blue ─────────── */
[data-th="ocean"]{
  --o50:#F3F8FF; --o100:#E4EFFE; --o200:#C7DDFC; --o300:#8FB8F8;
  --o400:#4B8BF0; --o500:#1A5FE0; --o600:#0548CF; --o700:#0A3AA0; --o800:#0A2C74;
  --rail:#F9FBFE; --surf:#FFFFFF; --sunk:#F4F8FE; --scrim:rgba(12,25,43,.42);
  --line:#E5EDF8; --hair:#EDF3FB; --line2:#D3E0F1;
  --ink:#0F1B2C; --ink2:#2C3D53; --sec:#596C84; --ter:#647282;
  --brand:var(--o500); --brandOn:#FFFFFF; --brandHov:var(--o700); --brandInk:var(--o700);
  --brandFill:var(--o600); --brandFillHov:var(--o700);
  --tint:var(--o100); --tint2:var(--o50); --onChip:rgba(0,0,0,.24);
  --backdrop:#E3EAF3; --meterOff:#CFDDEF; --ring:rgba(26,95,224,.22);
}
[data-th="ocean"][data-theme="dark"]{
  --o50:#0F1E33; --o100:#132842; --o200:#1C3A5E; --o300:#27528A;
  --o400:#215EE0; --o500:#4C8DF5; --o600:#71A6F8; --o700:#9BC1FB; --o800:#C4DBFD;
  --rail:#101C2E; --surf:#0D192B; --sunk:#152438; --scrim:rgba(0,0,0,.62);
  --line:#1D2E46; --hair:#182638; --line2:#2A3E59;
  --ink:#EFF5FD; --ink2:#D3E0EE; --sec:#94A9C0; --ter:#798DA6;
  --brand:var(--o500); --brandOn:#FFFFFF; --brandHov:var(--o600); --brandInk:var(--o600);
  --brandFill:var(--o400); --brandFillHov:var(--o500);
  --tint:var(--o200); --tint2:var(--o100); --onChip:rgba(0,0,0,.28);
  --backdrop:#060C16; --meterOff:#2C4260; --ring:rgba(76,141,245,.30);
}
/* ─────────── Citrus — warm neutrals, pale lime brand ───────────
   The only theme whose brand fill is lighter than its text: brandOn is dark
   ink in both modes and onChip goes white rather than black. */
[data-th="citrus"]{
  --o50:#FAFDEC; --o100:#F0F8C2; --o200:#E1FA79; --o300:#C8E552;
  --o400:#A6C531; --o500:#86A31C; --o600:#6B8415; --o700:#4F6310; --o800:#38470B;
  --rail:#F9F9F4; --surf:#FFFFFF; --sunk:#F6F7EE; --scrim:rgba(28,32,18,.42);
  --line:#EBEDDF; --hair:#F1F3E8; --line2:#DCDFCB;
  --ink:#191C10; --ink2:#353A26; --sec:#6B7059; --ter:#6E725D;
  --brand:var(--o400); --brandOn:#243005; --brandHov:var(--o300); --brandInk:var(--o700);
  --brandFill:var(--o200); --brandFillHov:var(--o300);
  --tint:var(--o100); --tint2:var(--o50); --onChip:rgba(255,255,255,.62);
  --backdrop:#E8E9DC; --meterOff:#D7DBC3; --ring:rgba(166,197,49,.32);
}
[data-th="citrus"][data-theme="dark"]{
  --o50:#1A2413; --o100:#26331A; --o200:#3E4D2A; --o300:#5C7238;
  --o400:#8CB03F; --o500:#BDE55E; --o600:#E1FA79; --o700:#EBFCA3; --o800:#F4FDC9;
  --rail:#141C11; --surf:#18261D; --sunk:#1F2E22; --scrim:rgba(0,0,0,.64);
  --line:#26362A; --hair:#202E24; --line2:#35483A;
  --ink:#F1F7E9; --ink2:#DCE6D2; --sec:#9CAC91; --ter:#87987D;
  --brand:var(--o500); --brandOn:#1B2607; --brandHov:var(--o700); --brandInk:var(--o600);
  --brandFill:var(--o600); --brandFillHov:var(--o700);
  --tint:var(--o200); --tint2:var(--o100); --onChip:rgba(255,255,255,.42);
  --backdrop:#0B1109; --meterOff:#33452F; --ring:rgba(225,250,121,.28);
}
/* ─────────── Harbor — muted steel blue, low glare ─────────── */
[data-th="harbor"]{
  --o50:#F4F7FB; --o100:#E3EAF3; --o200:#CFD9E9; --o300:#A3B6D0;
  --o400:#6E8CB4; --o500:#4A6E9C; --o600:#365B90; --o700:#2A4772; --o800:#1E3455;
  --rail:#F2F3F6; --surf:#FFFFFF; --sunk:#F5F7FA; --scrim:rgba(20,30,42,.44);
  --line:#E6E9EF; --hair:#EEF1F5; --line2:#D5DAE3;
  --ink:#141C26; --ink2:#333E4C; --sec:#545E6C; --ter:#666E7A;
  --brand:var(--o500); --brandOn:#FFFFFF; --brandHov:var(--o700); --brandInk:var(--o700);
  --brandFill:var(--o600); --brandFillHov:var(--o700);
  --tint:var(--o200); --tint2:var(--o100); --onChip:rgba(0,0,0,.24);
  --backdrop:#E4E7ED; --meterOff:#CBD3DF; --ring:rgba(54,91,144,.26);
}
[data-th="harbor"][data-theme="dark"]{
  --o50:#141E2B; --o100:#1B2938; --o200:#26384C; --o300:#345078;
  --o400:#3F6394; --o500:#5A85BE; --o600:#83A8D6; --o700:#A9C4E5; --o800:#CBDCF0;
  --rail:#182332; --surf:#141E2A; --sunk:#1B2836; --scrim:rgba(0,0,0,.64);
  --line:#23303F; --hair:#1D2834; --line2:#324152;
  --ink:#EAEFF5; --ink2:#CFD9E4; --sec:#8E9DAF; --ter:#7F90A8;
  --brand:var(--o500); --brandOn:#FFFFFF; --brandHov:var(--o600); --brandInk:var(--o700);
  --brandFill:#32558A; --brandFillHov:var(--o400);
  --tint:var(--o200); --tint2:var(--o100); --onChip:rgba(0,0,0,.30);
  --backdrop:#0A1017; --meterOff:#2E3E52; --ring:rgba(90,133,190,.30);
}
/* ─────────── Violet — deep indigo, vivid violet accent ─────────── */
[data-th="violet"]{
  --o50:#F6F4FE; --o100:#EAE6FD; --o200:#DCD7FD; --o300:#B7A8FA;
  --o400:#8B72F2; --o500:#6B45EC; --o600:#5323E3; --o700:#4318BE; --o800:#331293;
  --rail:#F2EFFE; --surf:#FFFFFF; --sunk:#F7F5FE; --scrim:rgba(22,16,48,.44);
  --line:#EAE7F7; --hair:#F0EEFA; --line2:#DAD5EE;
  --ink:#16112B; --ink2:#332C4E; --sec:#6A6386; --ter:#6F6982;
  --brand:var(--o500); --brandOn:#FFFFFF; --brandHov:var(--o700); --brandInk:var(--o700);
  --brandFill:var(--o600); --brandFillHov:var(--o700);
  --tint:var(--o100); --tint2:var(--o50); --onChip:rgba(0,0,0,.26);
  --backdrop:#E6E2F3; --meterOff:#D6CFF0; --ring:rgba(107,69,236,.26);
}
[data-th="violet"][data-theme="dark"]{
  --o50:#161A38; --o100:#1E2148; --o200:#282A5E; --o300:#32217D;
  --o400:#5A2AEB; --o500:#7C5CF5; --o600:#9C84F9; --o700:#BCACFC; --o800:#DAD0FE;
  --rail:#191A3F; --surf:#10142E; --sunk:#181B3B; --scrim:rgba(0,0,0,.66);
  --line:#232748; --hair:#1D203C; --line2:#32365C;
  --ink:#F2EFFE; --ink2:#DAD4EE; --sec:#9B95BC; --ter:#8982AC;
  --brand:var(--o500); --brandOn:#FFFFFF; --brandHov:var(--o600); --brandInk:var(--o700);
  --brandFill:var(--o400); --brandFillHov:var(--o500);
  --tint:var(--o200); --tint2:var(--o100); --onChip:rgba(0,0,0,.30);
  --backdrop:#080A1C; --meterOff:#2F3160; --ring:rgba(124,92,245,.32);
}
/* ─────────── Ember — warm orange ─────────── */
[data-th="ember"]{
  --o50:#FFF6F1; --o100:#FFEADF; --o200:#FFD2BC; --o300:#FF9F6D;
  --o400:#FF7A33; --o500:#FF5D00; --o600:#E85200; --o700:#B84300; --o800:#8E3300;
  --rail:#FFF7F2; --surf:#FFFFFF; --sunk:#FDF4EE; --scrim:rgba(36,22,14,.38);
  --line:#F3E4DA; --hair:#F7EDE5; --line2:#E7D4C7;
  --ink:#231710; --ink2:#463730; --sec:#77645A; --ter:#7E6C61;
  --brand:var(--o500); --brandOn:#FFFFFF; --brandHov:var(--o600); --brandInk:var(--o700);
  --brandFill:var(--o700); --brandFillHov:var(--o800);
  --tint:var(--o100); --tint2:var(--o50); --onChip:rgba(0,0,0,.24);
  --backdrop:#EBE2DA; --meterOff:#EBD8CB; --ring:rgba(255,93,0,.22);
}
[data-th="ember"][data-theme="dark"]{
  --o50:#2A1408; --o100:#3B1C0B; --o200:#59290F; --o300:#8C3D12;
  --o400:#D14E00; --o500:#FF6A1A; --o600:#FF8340; --o700:#FF9E6B; --o800:#FFC2A1;
  --rail:#17110C; --surf:#1E1712; --sunk:#292018; --scrim:rgba(0,0,0,.62);
  --line:#33271F; --hair:#2A2019; --line2:#443429;
  --ink:#FAF3ED; --ink2:#E7DAD1; --sec:#B8A497; --ter:#9C8778;
  --brand:var(--o500); --brandOn:#1A1005; --brandHov:var(--o600); --brandInk:var(--o700);
  --brandFill:var(--o500); --brandFillHov:var(--o600);
  --tint:var(--o100); --tint2:var(--o50); --onChip:rgba(255,255,255,.40);
  --backdrop:#0A0705; --meterOff:#4A382B; --ring:rgba(255,106,26,.30);
}
/* identity slot classes: drop on anything to set --cI / --cT */
.c1{--cI:var(--c1I);--cT:var(--c1T)} .c2{--cI:var(--c2I);--cT:var(--c2T)}
.c3{--cI:var(--c3I);--cT:var(--c3T)} .c4{--cI:var(--c4I);--cT:var(--c4T)}
.c5{--cI:var(--c5I);--cT:var(--c5T)} .c6{--cI:var(--c6I);--cT:var(--c6T)}
/* flag severity classes: --fc accent, --fcI ink, --fcT tint, --fcL line */
.f-crit{--fc:var(--fcr);--fcI:var(--fcrInk);--fcT:var(--fcrTint);--fcL:var(--fcrLine)}
.f-warn{--fc:var(--fwa);--fcI:var(--fwaInk);--fcT:var(--fwaTint);--fcL:var(--fwaLine)}
.f-ask{--fc:var(--fqu);--fcI:var(--fquInk);--fcT:var(--fquTint);--fcL:var(--fquLine)}
```

### 2.3 Roles — what each token is for

Components MUST read these roles. The ramp steps `--o50 … --o800` exist only so themes can assign roles.

| Token | Role | Used by |
|---|---|---|
| `--backdrop` | Behind the app window | `body` background |
| `--rail` | Sidebar surface | rail, modal nav, capture card |
| `--surf` | Content surface (lightest in light mode) | main column, cards, panels, fields, menus |
| `--sunk` | Inset well | search/add-row wells, row hover, player, count wells, disabled buttons |
| `--line` | Border at rest | cards, panels, inputs, dividers under headers |
| `--hair` | Divider between siblings of one list | `.list>*+*`, table rows, stat dividers |
| `--line2` | Stronger border | secondary buttons, fields, checkbox/radio outline, toggle off |
| `--ink` | Titles, values, primary text | headings, row titles |
| `--ink2` | Body text, controls | paragraphs, nav items, button text |
| `--sec` | Anything read as a sentence but secondary | descriptions, sub-lines, meta |
| `--ter` | Labels, counts, icons, placeholders | micro-labels, counts, resting icons |
| `--brand` | Brand as a **mark** | focus outline, toggle on, tab underline, checkbox/radio on |
| `--brandFill` / `--brandFillHov` | Brand as a **fill** and its hover | primary button, send well, floating core, player button |
| `--brandOn` | Text/icons on a brand fill | primary button label |
| `--brandInk` | Brand as **text** | active nav, links, selected chip text |
| `--tint` | Selected surface | active nav, selected filter chip, user message bubble |
| `--tint2` | Quiet selected / hover on brand text | sub-nav active, selected row, text-button hover |
| `--ring` | 3px focus halo | `:focus-within` on fields |
| `--onChip` | A chip sitting on a brand fill | key chip inside the hold button |
| `--chipWell` | A count inside a tinted chip | `.fchip.on .b` |
| `--meterOff` | Inactive meter / zero chart bar | `.meter.idle i`, `.chart .bar.mute` |
| `--scrim` | Behind a modal | `.scrim` |
| `--danger` `--warn` `--ok` `--info` | Status **mark** (dot, fill) | live dot, badge fills |
| `--*Ink` | Status **text** (≥ 4.5 : 1) | notice icons, late dates, flag chip text |
| `--*Tint` / `--*Line` | Status **surface** / its border | notices, flag wells, live bar |
| `--dangerOn` | Text on a danger fill | live chip, overdue pill, danger button |
| `--pill*` | The floating control's own dark surface | `.pill`, `.fab`, `.hopt`, `.pbtn` — never themed |
| `--cNI` / `--cNT` (N = 1…6) | Identity ink / tint | via `.c1….c6` → `--cI` / `--cT` |
| `--fcr*` `--fwa*` `--fqu*` | Flag severities (critical / caution / question) | via `.f-crit` `.f-warn` `.f-ask` → `--fc` `--fcI` `--fcT` `--fcL` |
| `--e1` `--e2` `--e3` | Elevation | see §6 |
| `--s1 … --s8` | Space | see §4 |
| `--r1 … --r5`, `--rF` | Radius | see §5 |
| `--tr`, `--sbT`, `--pop` | Motion | see §8 |

**Convention:** brand-as-fill sits around `o500–o600` (Ember: `o700`), brand-as-ink around `o700`. **Citrus is the exception**: its brand is a pale lime, so the fill is light and `--brandOn` is dark ink in both modes, and `--onChip` is white rather than black. Never assume `--brandOn` is white.

### 2.4 Theme matrix — key roles in all twelve combinations

| Theme | Mode | `brandFill` | `brandOn` | `brandInk` | `tint` | `rail` | `surf` | `sunk` | `line` | `ink` | `sec` | `ter` |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Indigo | light | `#525298` | `#FFFFFF` | `#45457E` | `#EEEEFF` | `#F8F8FC` | `#FFFFFF` | `#F3F3F8` | `#E2E2F0` | `#252836` | `#5B5D75` | `#73758C` |
| Indigo | dark | `#5E5EA8` | `#FFFFFF` | `#9797D4` | `#343458` | `#1F1D2B` | `#252836` | `#2E3143` | `#2F3142` | `#FFFFFF` | `#A7A7B5` | `#9494A6` |
| Ocean | light | `#0548CF` | `#FFFFFF` | `#0A3AA0` | `#E4EFFE` | `#F9FBFE` | `#FFFFFF` | `#F4F8FE` | `#E5EDF8` | `#0F1B2C` | `#596C84` | `#647282` |
| Ocean | dark | `#215EE0` | `#FFFFFF` | `#71A6F8` | `#1C3A5E` | `#101C2E` | `#0D192B` | `#152438` | `#1D2E46` | `#EFF5FD` | `#94A9C0` | `#798DA6` |
| Citrus | light | `#E1FA79` | `#243005` | `#4F6310` | `#F0F8C2` | `#F9F9F4` | `#FFFFFF` | `#F6F7EE` | `#EBEDDF` | `#191C10` | `#6B7059` | `#6E725D` |
| Citrus | dark | `#E1FA79` | `#1B2607` | `#E1FA79` | `#3E4D2A` | `#141C11` | `#18261D` | `#1F2E22` | `#26362A` | `#F1F7E9` | `#9CAC91` | `#87987D` |
| Harbor | light | `#365B90` | `#FFFFFF` | `#2A4772` | `#CFD9E9` | `#F2F3F6` | `#FFFFFF` | `#F5F7FA` | `#E6E9EF` | `#141C26` | `#545E6C` | `#666E7A` |
| Harbor | dark | `#32558A` | `#FFFFFF` | `#A9C4E5` | `#26384C` | `#182332` | `#141E2A` | `#1B2836` | `#23303F` | `#EAEFF5` | `#8E9DAF` | `#7F90A8` |
| Violet | light | `#5323E3` | `#FFFFFF` | `#4318BE` | `#EAE6FD` | `#F2EFFE` | `#FFFFFF` | `#F7F5FE` | `#EAE7F7` | `#16112B` | `#6A6386` | `#6F6982` |
| Violet | dark | `#5A2AEB` | `#FFFFFF` | `#BCACFC` | `#282A5E` | `#191A3F` | `#10142E` | `#181B3B` | `#232748` | `#F2EFFE` | `#9B95BC` | `#8982AC` |
| Ember | light | `#B84300` | `#FFFFFF` | `#B84300` | `#FFEADF` | `#FFF7F2` | `#FFFFFF` | `#FDF4EE` | `#F3E4DA` | `#231710` | `#77645A` | `#7E6C61` |
| Ember | dark | `#FF6A1A` | `#1A1005` | `#FF9E6B` | `#3B1C0B` | `#17110C` | `#1E1712` | `#292018` | `#33271F` | `#FAF3ED` | `#B8A497` | `#9C8778` |

### 2.5 Status families (shared by every theme)

| Family | Mode | Mark | Ink | Tint | Line | On |
|---|---|---|---|---|---|---|
| Danger | light | `#EF4358` | `#C92A40` | `#FFF0F2` | `#FFD9DF` | `#FFFFFF` |
| Danger | dark | `#FF5C70` | `#FF97A5` | `#3A1A21` | `#55262F` | `#2A0E14` |
| Warning | light | `#E9A21F` | `#8A6208` | `#FFF7E6` | `#FAE3B4` | — |
| Warning | dark | `#FFBF47` | `#FFD37A` | `#33270C` | `#4C3A14` | — |
| Success | light | `#1A9E70` | `#0E7C55` | `#E8F8F1` | `#BFE9D8` | — |
| Success | dark | `#22B07D` | `#5FD6A8` | `#113025` | `#1F4A39` | — |
| Info | light | `#08A0F7` | `#0A72B8` | `#E6F5FE` | `#BCE3FB` | — |
| Info | dark | `#08A0F7` | `#6BC2FB` | `#0F2739` | `#1C4560` | — |

The **mark** is the dot/fill; **Ink** is the same hue darkened until text passes 4.5 : 1; **Tint**/**Line** are the surface it sits on. White text on the raw danger mark is below AA, so the danger fill is pulled a step down in light mode.

### 2.6 Identity palette

Six slots. **Colour identifies**: a slot is bound to one entity (a collection, a category) and follows it everywhere — its tile, its tree glyph, its row tag dot, its schedule rule, its chart series. Apply with `.c1`…`.c6`, which set `--cI` (ink, also the fill for solid marks) and `--cT` (tint).

| Slot | Light ink | Light tint | Dark ink | Dark tint |
|---|---|---|---|---|
| `.c1` | `#525298` | `#EEEEFF` | `#9797D4` | `#2A2A46` |
| `.c2` | `#A03BB0` | `#FAECFC` | `#D98BE4` | `#3A1F40` |
| `.c3` | `#0A7856` | `#E6F7F0` | `#4FD3A2` | `#123328` |
| `.c4` | `#A84F00` | `#FFF0DF` | `#FFA542` | `#3A2410` |
| `.c5` | `#C22843` | `#FFECEF` | `#FF8496` | `#3B1C23` |
| `.c6` | `#0A757D` | `#E0F8FA` | `#3FE0EA` | `#0E3438` |

> **Identity is not a chart palette.** Slots 4/5 and 1/2 sit close together under colour-vision deficiency. Always pair a slot with its label or glyph; keep charts single-series (one slot per chart); direct-label anything with two or more series.

### 2.7 Avatar fills

Filled circles with white initials (weight 600–700). Every fill clears 3 : 1 behind white. Pick deterministically from the person's name (hash → index).

`#B85F00` `#0A72B8` `#0E8A60` `#8C3A98` `#8A6208` `#0A7D86` `#C2334F` `#525298` `#5C5CA2` `#0E7C8A` `#A03BB0` `#1A7A5C`

### 2.8 Floating surface

`--pill` `#1F1D2B` (dark mode `#2B2940`), `--pillInk` white, `--pillSec` 62% white, `--pillWell` 9% white (8% dark), `--pillLine` 13% white (11% dark). The floating control is dark in both modes and identical in every theme — a control that restyles itself per theme stops being recognisable.

---
## 3. Typography

**Family:** Onest (Google Fonts, variable 100–900). Fallback `'Liberation Sans', Arial, sans-serif`. `--f-head` and `--f-body` are two variables that resolve to the same family — keep using the right one at each call site. Monospace (`--f-mono`) is for code samples only, never product UI.

**Weights:** 400 body · 500 nav items, quiet labels, captions · 600 titles, buttons, values, selected states · 700 only for keycaps, avatar initials, the live chip and badge numbers.

**Rendering:** `-webkit-font-smoothing: antialiased`. Tabular numerals (`font-variant-numeric: tabular-nums`) on every number that changes or aligns: timers, durations, counts, table figures, axis labels, stat figures.

| Role | Selector | Size | Weight | Tracking | Line-height | Ink | Use |
|---|---|---|---|---|---|---|---|
| Stat figure | `.stat .big` | 29 | 600 | −.025em | 1.05 | ink | Numbers only, tabular |
| Record title | `.titlehd h1` | 28 | 600 | −.021em | 1.18 | ink | One per page — the thing itself |
| Page title | `.pagehd h1` | 26 | 600 | −.02em | 1.2 | ink | A collection page |
| Title bar | `.topbar h1` | 19 | 600 | −.012em | 1.2 | ink | Window-level heading |
| Empty-state title | `.empty h2` | 19 | 600 | −.01em | — | ink | |
| Section heading | `.sec h3` | 18 | 600 | −.014em | 1.25 | ink | Sentence case, never uppercase |
| Dialog title | `.mtop h2` | 17 | 600 | −.01em | — | ink | |
| Inspector title | aside title | 16 | 600 | 0 | 1.42 | ink | |
| Panel title | `.pnl>.ph .t` | 15 | 600 | −.01em | — | ink | |
| Tile name | `.tile .nm` | 14.5 | 600 | −.01em | — | ink | |
| Prose | `.sec p`, `.lead` | 14.5 | 400 | 0 | 1.7 | ink2 | Max 66ch (`.lead` 72ch) |
| Row title | `.row .t`, `.trw .nm` | 14 | 600 | −.005em | 1.35 | ink | |
| Body | `.task .t`, `.trs .tx`, messages | 13.5 | 400 | 0 | 1.5–1.65 | ink / ink2 | Default reading size |
| Nav item | `.nav a` | 13.5 | 500 (600 on) | 0 | — | ink2 | |
| Control | `.btn` | 13 (12 small) | 600 | −.005em | 1 | — | |
| List item | `.views a`, `.menu a` | 13 | 400 (600 on) | 0 | — | ink2 | |
| Meta | `.metarow`, `.srow .s` | 12.5 | 400 | 0 | 1.5–1.55 | sec | |
| Small | `.row .s`, `.hint` | 12 | 400 | 0 | 1.4 | sec / ter | |
| Caption | `.mt`, `.age`, `.n` | 11.5 | 400–500 | 0 | 1.35 | ter | |
| Micro-label | `.ghd`, `.slabel`, `.slab`, `th` | 11 | 600 | .07em | — | ter | UPPERCASE. Field names, never headings |
| Badge / count | `.cnt`, `.b`, `.pri` | 11 | 600 | .01em | 1.5 | varies | |
| Tiny | avatar initials, notification app line | 10.5 | 600–700 | .07em (uppercase only) | — | — | |

**Rules**

- Headings are **sentence case**. An 11px uppercase label is a field name; a page of them reads as a form.
- Larger type gets tighter tracking. The only positive tracking is on uppercase micro-labels (`.07em`).
- In a fact line, the **value** is ink2/600 and its label and glyph are sec/ter, so the line can be scanned by jumping between dark words.
- Italic means a **direct quote**. Nothing else is italic.
- Bold inside a notice or toast marks **the fact**, i.e. the first clause.

---

## 4. Spacing & measures

**Scale (4px base).** Anything new picks a step.

| Token | px | Typical use |
|---|---|---|
| `--s1` | 4 | icon↔text in tight chips, gaps between icon buttons |
| `--s2` | 8 | chip gaps, micro-label → content, button groups |
| `--s3` | 12 | icon↔text in rows, row gap, card inner gaps |
| `--s4` | 16 | panel padding, field groups, notice gaps |
| `--s5` | 20 | section rhythm inside panels, modal padding, aside padding |
| `--s6` | 24 | between blocks on a page; tab gap |
| `--s7` | 32 | between sections; detail column gap |
| `--s8` | 40 | before a major new block |

**Shell measures**

| Region | Size |
|---|---|
| Reference window | 1440 × 900 (scales to fit; fills the viewport when it would drop below 88%) |
| Title bar | 56px high · padding `0 12px 0 20px` · gap 16px |
| Rail (sidebar 1) | 248px · padding `12px 12px 8px` · collapsed **72px** (padding `14px 8px`) |
| List column (sidebar 2) | 272px · collapsed **56px** |
| List column header | 56px high · padding `0 16px` |
| Main page padding (`--bp`) | 28px · 22 (w3) · 18 (w2) · 14 (w1) |
| Right aside | 384px · wide 492px · 340px under w3 · floats over the page under w2 |
| Aside header | 56px · padding `0 20px`; body padding 20px, 20px gaps |
| Detail columns | `minmax(0,3fr) minmax(0,2fr)`, gap 32px |
| Dashboard grid | `minmax(0,1fr) 400px`, gap 20px |
| Tile grid | `repeat(auto-fill,minmax(236px,1fr))`, gap 12px · small tiles `minmax(150px,1fr)` |
| Row hover overhang | rows reach 10px past the text column: lists use `margin: 0 -10px` and rows `padding: … 10px` |
| Settings modal | 1000 × 700 · nav 220px |

**Control heights:** 28 small button · 30 filter chip, title-bar tool · 32 button, select, menu item, list view, collapse control · 34 field, search well · 36 rail nav item · 38 add-row well · 44 collapsed rail target · 52 floating pill (46 at w1) · 60 floating core.

**Hit targets:** row actions 28px · aside/title-bar tools 30px · "⋯" options 22–26px · twisty 16px (its own target inside the row).

**Z-order:** peeked sidebar 16 · floating control 18 · scrim 20 · modal 21 · menu 22 · toasts 40 · system notifications 41 · tooltip 60.

---

## 5. Radius

| Token | px | Use |
|---|---|---|
| `--r1` | 6 | chips, tags, badges, small icon wells, menu items, sub-nav items |
| `--r2` | 8 | buttons, fields, nav items, list views, icon buttons, toasts |
| `--r3` | 10 | notices, option cards, menus, small tiles, compare block, player |
| `--r4` | 14 | cards, section panels, tiles, the app window, composer on a page |
| `--r5` | 18 | modals |
| `--rF` | 999 | toggles, pills, avatars, count pills, suggestion chips |

Nested radius = outer − inset (the segmented control's cells use `calc(var(--r2) - 2px)`). A message bubble drops one corner to `--r1` to point at its speaker.

---

## 6. Elevation

| Token | Value (light) | Use |
|---|---|---|
| `--e1` | `0 1px 2px rgba(16,24,40,.05)` | primary button, selected segment |
| `--e2` | `0 8px 24px -8px rgba(16,24,40,.16), 0 1px 3px rgba(16,24,40,.05)` | menus, hovered tiles, notifications, toasts, floating aside (w2) |
| `--e3` | `0 28px 70px -18px rgba(16,24,40,.26), 0 4px 14px rgba(16,24,40,.07)` | modals, popovers, floating wide inspector (w3) |
| `--pillShadow` | see tokens | floating control only |
| `--peekShadow` | `20px 0 44px -14px rgba(16,24,38,.30)` + `1px 0 0 var(--line2)` | a hover-peeked sidebar (sideways — its free edge is the right) |

Dark mode deepens the same shadows (see tokens). **Most surfaces are flat and separated by a hairline.** Hover lift exists only on tiles: `transform: translateY(-1px)` + `--e2`.

---

## 7. Iconography

- 16 × 16 viewBox, `fill: none`, `stroke: currentColor`, **stroke-width 1.7**, round caps and joins. A few dots are filled with `currentColor`.
- Rendered at 11–22px. Raise the stroke for tiny or emphasised glyphs: checkmarks inside checkboxes **2.6**, window lights **3**, send arrow / play / mic on a fill **2–2.2**, twisty chevron **2.4**.
- Class `.ic`; `display:block; flex:0 0 auto`. Inside a sentence use the inline rule (vertical-align −2px, margin-right 3px).
- Colour: icons sit in `--ter` at rest, `--ink2` on hover, `--brandInk` only when their row/tab/nav item is active. Identity glyphs take `--cI`.
- Every icon-only control MUST have an accessible name (`title` → tooltip + `aria-label`).

```js
const ic=(name,size=16,stroke=1.7)=>`<svg class="ic" width="${size}" height="${size}" viewBox="0 0 16 16"
  fill="none" stroke="currentColor" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round"
  aria-hidden="true">${P[name]}</svg>`;
```

The full path set (`P`) is in Appendix C. Names: `cal` `mic` `checkc` `spark` `wave` `panelL` `panelR` `people` `clipb` `gear` `help` `kbd` `bell` `search` `plus` `home` `clock` `folder` `folderplus` `users` `file` `copy` `edit` `trash` `play` `pause` `stop` `link` `dots` `back` `chev` `chevd` `x` `alert` `alertc` `info` `check` `eye` `book` `chart` `share` `cloud` `chip` `shield` `flag` `list` `rec` `down` `key` `plug` `send` `clip` `sliders` `sun` `moon` `reset` `minus` `expand` `md` `userplus` `briefcase` `layers` `grid` `chevl` `calday` `cam` `radar` `clash` `delta` `speak` `eyeoff` `undo` `history` `code` `type` `ruler` `radius` `motion` `contrast` `palette` `window` `table` `bubble` `cursor` `toggle` `tag` `rows` `cards` `bolt` `phone` `desktop` `arrowr` `arrowl` `fullscreen` `star` (95 glyphs).

---

## 8. Motion

| Name | Token / keyframes | Duration | Curve | Use |
|---|---|---|---|---|
| State change | `--tr` | .13s | `cubic-bezier(.2,.7,.4,1)` | every hover, colour, border, opacity change |
| Panel travel | `--sbT` | .26s | `cubic-bezier(.32,.72,0,1)` | sidebar width fold; aside slides in 16px (`asideIn`) |
| Arrival | `--pop` | — | `cubic-bezier(.2,.9,.3,1)` | modal, popover, pill, notifications, peek |
| Dialog in | `mdin` | .18s | `--pop` | from opacity 0, 2% lower, scale .985 |
| Menu in | `mnin` | .12s | ease-out | from −4px |
| Toast in | `tin` | .2s | ease | from +6px |
| System notification in | `osin` | .26s | `--pop` | from +22px x |
| Sidebar peek in | `pkslide` | .17s | `--pop` | from −12px x, opacity .4 |
| Floating pill change | `pgrow` | .22s | `--pop` | from scale .9 |
| Popover in | `wpin` | .17s | `--pop` | from +8px, scale .95 |
| Sidebar contents | `sbIn` | .2s | ease-out | fade while a sidebar changes width |
| Live dot | `pulse` / `pdot` | 1.6s / 1.7s ∞ | ease-in-out | only on a live indicator |
| Alert halo | `phalo` | 2.4s ∞ | ease-in-out | the floating pill, critical flag only |
| Thinking | `bl` | 1.1s ∞ | stagger .18s | three 6px dots |
| Tooltip | opacity + 3px | .12s | — | after a delay (below) |

**Hover-revealed timing:** tooltip delay 340ms, then a 450ms "warm" window with no delay · sidebar peek opens after 350ms dwell **and** pointer slowed below 9px per 100ms sample · peek closes 420ms after the pointer leaves · button press `translateY(.5px)` · tile hover `translateY(-1px)`.

**Rules:** only the render that *opens* a panel animates it (not every re-render). Width folds are real width transitions. Under `prefers-reduced-motion: reduce` every animation and transition collapses to .01ms.

---
## 9. Layout

### 9.1 The shell

One window, up to four columns under a window-wide title bar:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ ● ● ●  Title · state            (or breadcrumb)          tools │ primary     │  56px .topbar
├────────────┬──────────────┬──────────────────────────────────┬───────────────┤
│ .rail      │ .listcol     │ .main > .body                    │ .aside        │
│ 248 / 72   │ 272 / 56     │ flex, padding 28                 │ 384 / 492     │
│ top-level  │ search,      │ page content                     │ inspector or  │
│ destinat-  │ views, tree  │                                  │ assistant     │
│ ions       │ (optional)   │                                  │ (optional)    │
│ ⌄ collapse │ ⌄ collapse   │                                  │               │
│ account    │              │                        (◉) floating control 24/24 │
└────────────┴──────────────┴──────────────────────────────────┴───────────────┘
```

```html
<div class="shell">
  <div class="topbar">
    <span class="lights"><i class="r"></i><i class="y"></i><i class="g"></i></span>   <!-- desktop window chrome only -->
    <div class="ttl"><h1>Title</h1><span class="state">125 items · 7 this week</span></div>
    <!-- or: <div class="crumb">…</div> -->
    <span class="r"><span class="tbtn" title="Settings">…</span>…<button class="btn p sm">Primary</button></span>
  </div>
  <div class="app">                       <!-- .railmin .listmin .pkrail .pklist .hasaside -->
    <div class="pkgap pr"></div>          <!-- placeholder while the rail is peeked -->
    <div class="rail">…</div>
    <div class="pkgap pl"></div>
    <div class="listcol">…</div>          <!-- optional -->
    <div class="main"><div class="body">…</div></div>
    <div class="aside">…</div>            <!-- optional -->
  </div>
</div>
```

**Rail** (`.rail`): micro-label (`.slab`), `.nav` of top-level destinations — each a *place*, not a mode — then `.spacer`, the collapse control (`.colbtn`), and the account block (`.acct`: avatar, name, plan, a text action). No borders or cards inside the rail.

**List column** (`.listcol`): the sections of the current destination — a search well (`.srch`), `.views` (with counts), an optional `.slabel` group and a **one-level** tree, a `.note`, and the collapse control at the foot (`.lfoot`). Alternatively a `.lhead` header (title + action) over two-line `.convrow`s. A screen whose content *is* the navigation (a dashboard of tiles) has **no** list column.

**Main** (`.main > .body`): scrolls vertically; `.body` is a flex column with `--bp` padding; its children do not shrink (`flex: 0 0 auto`); an `.empty` or `.fill` child takes the remaining height.

**Aside** (`.aside`, `.aside.wide`): a second reading column on the right — an inspector for a selected row, or an assistant scoped to the page.

### 9.2 Collapse, peek and the aside

- Both sidebars collapse to icon strips: rail → 72px (44px targets, labels hidden), list column → 56px (36px targets; only top-level rows; sub-rows, counts and notes hidden). Width animates with `--sbT`. The collapse control is icon-only (`panelL` / `panelR`), named by its tooltip.
- **Auto-collapse by window width:** list column under **1180px**, rail under **960px**.
- **Opening an aside folds both sidebars** to their strips; closing it restores exactly what the user had (unless the window is now too narrow).
- **Hover peek:** a collapsed strip opens as an **overlay** (never pushing the page) after ~350ms of dwell with the pointer slowed; it closes 420ms after the pointer leaves. While peeking, a `.pkgap` placeholder of the strip's width holds the layout, the sidebar gets `--peekShadow`, and the collapse control becomes a **pin** (`.colbtn.pin`, brand ink) that keeps it open. Tabbing into a collapsed strip opens it immediately. Coarse pointers never peek.
- The aside slides in 16px on open (`asideIn`, `--sbT`) — only on the render that opens it.

### 9.3 Width classes (measured on the window, not the viewport)

| Class | Window | Changes |
|---|---|---|
| — | ≥ 1320 | full layout |
| `w3` | < 1320 | `--bp` 22px · aside 340px · tab gap 20px · wide aside floats over the page (absolute, `--shadow`) |
| *(auto)* | < 1180 | list column collapses |
| `w2` | < 1080 | `--bp` 18px · every 2-column grid (`.g2`, `.dcols`, `.homegrid`) stacks · asides float (`--shadow2`, `min(370px,90%)`) · title-bar state text hides · modal nav becomes a 60px icon strip · compare block stacks · stat figures 23px · chart 112px |
| *(auto)* | < 960 | rail collapses |
| `w1` | < 840 | `--bp` 14px · record rows wrap their meta under the title and hide hover actions (touch) · task due date drops to its own line · stat rows stack with hairlines between · settings/step/setup rows wrap their control under the text · modal nav hides · pill 46px · titles shrink (record 21, page 20, title bar 17) |

Implementation: the app's root element carries `.win` (wrapping `.shell`). Measure that element's width (not `window.innerWidth` if the app is framed) and toggle `.w3` / `.w2` / `.w1` on it, and `.railmin` / `.listmin` on `.app` at 960 / 1180. All responsive rules in Appendix B are written against `.win.w2 …` etc.

```html
<div class="win w3" style="height:100vh"><div class="shell">…</div></div>
```

### 9.4 Page templates

Every screen in the system is one of these shapes. The HTML reference renders each at 1440 / 1280 / 1024 / 760.

| Template | Columns | Structure |
|---|---|---|
| **Dashboard** | rail · main | Title bar with primary action. Optional dismissable `.notice`. `.homegrid`: left a `.pnl` of collections (header with a grid/list `.seg` and a "New" link; body `.tiles-sm` or `.tlist`), right a 400px `.homecol` of `.pnl`s — recent `.list` of `.row`s and a `.sched`. Floating control bottom-right. |
| **First run / empty** | rail · main | A setup `.card` (`.setuphd` + `.setuprow`s counting down), then a centred `.empty` with one secondary action. |
| **Grouped list** | rail · list · main | Breadcrumb in the title bar. `.ghd` group headings ("Today · 3 items") each over a `.list` of `.row`s. List column with search, views and a tree. |
| **Category page** | rail · list · main | `.pagehd` (36px identity `.well`, 26px title, `.metarow`, options at the right), a `.ghd` with a trailing "New" link, then `.tiles` of full `.tile`s and one dashed `.tile.add`. |
| **Rollup detail** | rail · main | `.pagehd`, a `.band` of up to three flags with a footer, then `.dcols`: `.dmain` (a `.brief`: lead heading + `.lead` paragraphs, then `.bgrid` of `.bsec` lists; then `.sec` record lists with `.from` source links) and `.dside` (`.pnl`s: related `.row`s, open `.task`s capped at 5 with `.secmore`). A sticky dock (`.comp.stick`) at the foot; the page drops its bottom padding (`.body.docked`). |
| **Record detail** | rail · main | `.titlehd` (28px title + `.metarow`), an optional tinted `.notice` with Review/close, `.tabs`, then per tab: an `.actbar` directly under the tabs and the tab body (`.scrollcol` with `.dcols` of `.sec`s and `.pnl`s; a flag `.list`; a `.notebox`; timed lines `.trs` + `.player`). A dock (`.comp` + `.compbox.dock`) pinned to the foot. |
| **Detail + inspector** | rail(72) · main · aside.wide | As record detail; the selected row takes `tint2`; the 492px inspector holds a title + status line, a `.ghd` + `.compare` + `.relation`, a paragraph, a `.quotebox`, `.fields`, and an action row. |
| **Detail + assistant** | rail(72) · main · aside.chat | A 384px chat aside: header with clear/close, `.msg` thread (13px, 82% width), typing dots, and a `.cfoot` composer. |
| **Live session** | rail · main | `.livebar` (pulsing dot, tabular timer, a flag count, Stop), a live `.meter` with a hint, tabs with unavailable ones `.off`, a `.notebox`. The floating control is the pill, with a popover card when something critical arrives. |
| **Task list + inspector** | rail(72) · list(56) · main · aside | `.toolrow` (search 230px, show-completed `.chk`, quiet action), `.addrow`, `.ghd` groups (Overdue / Today / Upcoming) of `.task`s. List column views with counts; the overdue view uses a red `.npill`. The inspector: editable title, `.pri` chips, `.field` rows (84px label + `.sel`), a `.quote` with actions, a notes `.inp.area`. |
| **Capture** | rail · list · main | `.card.capture` (hold button + status line + sunk meter well), a quiet notice, a `.chiprow` over the list it filters, editable `.trow`s with hover actions, `.metrics`. |
| **Data table** | rail · list · main | Intro paragraph (13.5 sec, max 600px), `.chiprow`, `.toolrow`, `.addrow`, `.table` with `.tag`s and a delete action, a quiet notice. |
| **Analytics** | rail · main | `.chiprow` (range) + hint, a `.pnl` with a `.statrow`, then `.g2.pnls` of chart panels (`.chart`, `.hbar`) and a text panel with an action. |
| **Conversation** | rail · list · main | List column: `.lhead` + `.convrow`s. Main: `.msg` thread in a filling scroll region, a quiet notice, `.composer` at the foot. Empty variant: `.empty` + `.chips` + `.scope`. |
| **Settings** | modal over any screen | `.scrim` + `.modal` 1000×700: `.mnav` (220px, `.gl` group labels, items) + `.mbody` (`.mtop` + `.mcont` of `.sgroup`s with `.srow`s, theme cards, option cards, steps). |
| **Dialogs** | modal | Single column: `.mtop` with a 32px icon well (`.mi`, `.mi.dg`, `.mi.info`), `.mcont.tight` body, `.mfoot` of two equal-width buttons (safe first). |
| **Menus & notifications** | overlays | `.menu` anchored to its trigger and clamped to the window; `.notifs` stack top-right; `.toasts` bottom-centre. |

---
## 10. Components

Every component below is defined in Appendix B. Markup is shown with lorem ipsum; `<svg class="ic">` stands for an icon from Appendix C. Hover-revealed parts MUST also appear on `:focus-within`.

### 10.1 Buttons — `.btn`

| Variant | Class | Surface | Text | Hover | Use |
|---|---|---|---|---|---|
| Primary | `.btn.p` | `--brandFill` + `--e1` | `--brandOn` | `--brandFillHov` | the one main action of a view |
| Secondary | `.btn.s` | `--surf`, border `--line2` | `--ink2` | `--sunk`, text `--ink` | alternatives, dialog "Cancel" |
| Quiet | `.btn.q` | transparent, 10px side padding | `--sec` | `--sunk`, `--ink2` | most toolbar actions — export, copy, filter |
| Text | `.btn.t` | transparent, 9px side padding | `--brandInk` | `--tint2` | "Dismiss" inside a notice |
| Danger | `.btn.d` | `--danger` | `--dangerOn` | brightness 1.06 | only inside a confirm dialog |
| Disabled | `.btn.dis` / `[aria-disabled=true]` | `--sunk` | `--ter` | none, `not-allowed` | |

Sizes: default **32px**, 13px/600, padding `0 13px`, gap 6, radius `--r2` · `.sm` **28px**, 12px, `0 11px`, gap 5 (the title-bar size) · `.lg` 36px, 13.5px, `0 16px` · `.ico` square (32 / 28) — MUST carry a `title` · `.full` stretches in a `.mfoot` pair. Press: `translateY(.5px)`. Icon 15px (14 in `.sm`) before the label.

Title-bar tools use `.tbtn` (30px, `--ter` → `--ink2` on a `--sunk` hover; `.hasbadge` adds a 6px danger dot ringed with `--surf`). Inline links use `.link` (12px/600 `--brandInk`, underline on hover; `.link.quiet` = 500/`--ter`).

```html
<button class="btn p"><svg class="ic"/>Lorem ipsum</button>
<button class="btn s sm">Dolor</button>
<button class="btn q sm ico" title="Copy"><svg class="ic"/></button>
```

**Rules:** at most one primary per view, at the end of its row, labelled with a verb ("Create link", not "OK"). Row actions are never outlined buttons (§10.6).

### 10.2 Fields — `.inp` `.srch` `.addrow` `.sel` `.compbox` `.notebox`

Inputs are **inset**. Focus lights the **well itself** (brand border + 3px `--ring`) via `:focus-within`; the `<input>` inside never draws its own outline.

| Component | Height | At rest | Focus | Notes |
|---|---|---|---|---|
| Field `.inp` | 34 | `--surf`, border `--line2`, r2, padding `0 11px`, 13px | brand border + ring | `.inp.area` for multi-line (min 70px, top-aligned) · `.inp.err` danger border |
| Search well `.srch` | 34 | **filled** `--sunk`, transparent border, r2, 15px icon | `--surf` + brand border + ring | in list columns (margin `16px 12px 0`) and tool rows (width 230px, margin 0) |
| Add row `.addrow` | 38 | filled `--sunk`, 17px plus icon, 13.5px | as above | the primary action on a list page; Enter commits |
| Select `.sel` | 32 | `--surf`, border `--line2`, 12.5px `--ink2`, leading icon + trailing `chevd` | hover `--sunk` | opens a `.menu`, never a native `<select>` |
| Composer `.compbox` | ~50 | `--surf`, border `--line2`, **r4** (r3 inside an aside), padding `9px 10px 9px 12px` | brand border + ring | leading icon controls (`--ter`), input 13.5px, trailing 30px `.sendb` (brandFill, r2, send icon 2.0 stroke) |
| Dock `.compbox.dock` | ~50 | as composer; brand spark icon; placeholder text in `--ter` | hover brand border | a *door*: a full-width composer at the foot of a page that opens the real one in an aside. `.comp.stick` makes it sticky with a gradient to `--surf` (opaque by 62%) |
| Note box `.notebox` | ≥150 | border `--line`, r4, padding `16px 20px`, text 14px/1.75 `--ink2` | brand border + ring | contenteditable |
| Key `.kbd` / `.keycap` | — | `--sunk`, border `--line`, r1; 11px/700 inline · 12.5px/600 as a value | — | |

Form layout: a `.ghd` micro-label above the field (margin-bottom 7–8px), an optional `.hint` below (12.5px `--ter`, margin-top 7px).

### 10.3 Selection

| Component | Spec |
|---|---|
| Toggle `.tog` | 40 × 22 pill, `--line2` off / `--brand` on, 18px white knob with a 1px shadow, knob moves 2→20px with `--tr`. `.dis` = 45% opacity. `role="switch"` + `aria-checked`. |
| Checkbox `.cbx` | 17px, r1, 1.5px `--line2` border on `--surf`; hover brand border; on = brand fill + border, check icon 12px at 2.6 stroke in `--brandOn`. `role="checkbox"`. |
| Radio `.rdo` | 17px circle, 1.5px `--line2`; on = 5px brand border. |
| Checkbox label `.chk` | 12.5px `--sec`, gap 8, hover `--ink2`. |
| Segmented `.seg` | `--sunk` track, r2, 2px inset and gap; cells 22px high (26 in `.seg.lg`), radius `calc(r2 − 2px)`, `--ter`; selected cell `--surf` + `--brandInk` + `--e1`. Switches a *view*. |
| Filter chip `.fchip` | 30px, padding `0 11px`, 12.5px `--sec`, border `--line`, r2, `--surf`; hover `--sunk`; **selected = `--tint` + `--brandInk` + 600, no border**. Count `.b`: 11px/600 in a `--sunk` r1 well (`--chipWell` when selected). Single-select within its row. |
| Chip row `.chiprow` | flex, gap 8, margin-bottom 20; sits **directly above the list it filters**; an optional right-aligned `.r` hint. |
| Option card `.opt` | border `--line`, r3, padding `13px 16px`, gap 12; leading radio/checkbox; title 13.5/600, description 12.5 `--sec`, optional ✓/⚠ bullet list (12px); hover `--sunk`; **selected = brand border + `--tint2`**. For choices with consequences. |

### 10.4 Chips, tags & counts

| Component | Spec | Rule |
|---|---|---|
| Priority `.pri` | 11px/600, r1, padding `1px 6px`, `--ter` | only `.pri.hi` is tinted (`--dangerTint` / `--dangerInk`); `.pri.ok` = `--okInk` text |
| Tag `.tag` | 11px/500, r1, padding `1px 6px`, `--ter` | `.brand` (tint2/brandInk), `.ok` (okTint/okInk), `.box` (sunk/sec) |
| Live chip `.livechip` | 11.5px/700, `--danger` fill, `--dangerOn`, pill, padding `2px 8px` | replaces a row's right column while something is live |
| Badge `.badge` | 11px/500, `--sunk`, `--sec`, r1 | attaches a fact to a line of content |
| Tab count `.tabs a .cnt` | 11px/600, `--sunk`/`--sec`, r1 | `--tint`/`--brandInk` on the active tab; `.cnt.hot` = danger tint only when it counts a problem; `.off` tab → plain text |
| Count pill `.npill` | 18px pill, 11px/600, `--danger`/`--dangerOn` | the one red count in a list column (e.g. overdue) |
| Plain count `.n` | 11.5px `--ter`, tabular | everything else |
| Suggestion chip `.chip` | 32px pill, border `--line`, 13px `--ink2`, 15px icon `--ter` → `--brandInk` on hover | empty-state prompts; `.chip.off` dashed |

**Flags** — three severities read their colours off one class: `.f-crit` (danger), `.f-warn` (warning), `.f-ask` (info), each setting `--fc` (mark), `--fcI` (ink), `--fcT` (tint), `--fcL` (line). Only **critical** earns red, and only critical may interrupt.

| Component | Spec |
|---|---|
| `.flagchip` | 11px/600, `--fcT`/`--fcI`, r1, padding `2px 7px`, 12px glyph (`clash` / `delta` / `help`) |
| `.fdot` | pill 11px/600 `--fcT`/`--fcI`, `radar` glyph + count — on a row title, margin-left 8px |
| `.fstat` | 5px dot in `--fc` + **bold count** + label in `--sec` — counts in a header; the dot is the only colour |

### 10.5 Navigation

| Component | Spec |
|---|---|
| Rail item `.nav a` | 36px, padding `0 10px`, gap 11, r2, 13.5px/500 `--ink2`, 18px icon `--ter`; hover `--sunk`; **active `--tint` + `--brandInk` + 600** (icon too). Items are 2px apart. |
| Sub-nav `.subnav` | one indent (21px) and a hairline (`border-left: 1px solid var(--line)`); items 30px, r1, 12.5px `--sec`; active `--tint2`. |
| Micro-label `.slab` / `.slabel` | 11px/600 .07em uppercase `--ter`; `.slabel` padding `20px 9px 8px`. |
| List view `.views a` | min 32px, padding `5px 9px`, gap 10, r2, 13px `--ink2`, 16px icon; active `--tint`/`--brandInk`/600; right slot: `.n`, `.npill` or a hover `.fm` (⋯, 22px) — nothing in the right slot may set the row height. |
| Tree | one level only. Top rows carry a 16px twisty `.tw` (its own hit target; chevron rotates 90° in .14s; `.tw.blank` keeps alignment when there are no children). Sub rows `a.sub`: padding-left 32px on a 1px `--line2` guide at 19px. Identity glyphs take `--cI` (`a.idn.cN`). |
| Conversation row `.convrow` | padding `9px 10px`, r2; title 12.5/600 `--ink`, date 11.5 `--sec`; active `--tint` with brandInk text. |
| Column header `.lhead` | 56px, padding `0 16px`, bottom `--line`; title 14/600; trailing action 12/600 `--brandInk`. |
| Tabs `.tabs` | gap 24 (20 at w3, 16 at w1), bottom `--line`, margin-bottom 20; items 13.5px/500 `--sec` with 10px bottom padding and a 2px transparent underline (`margin-bottom:-1px`); hover `--ink`; **active `--ink`/600 + `--brand` underline**; `.off` = `--ter`, not-allowed, still visible. Horizontal scroll without a scrollbar. |
| Breadcrumb `.crumb` | 12.5px; root step with a `back` icon; steps `.bk` `--sec` (hover `--sunk` well, r1, padding `3px 6px`); 13px chevrons `--ter` at 70%; **current page `<b>` 14/600 `--ink`, never a link**. When it overflows, the middle steps collapse into one `⋯` step (`.crumb.collapsed` shows `.ell`, hides `.mids`) that opens a menu of them. |
| Action bar `.actbar` | directly under the tabs, min 30px, margin-bottom 20; `.l` = scope (12px `--ter`, icon + text, or filter chips, or a search well); `.r` = actions (quiet icon buttons, gap 4). Every tab uses it. |
| Show more `.secmore` | 12/600 `--brandInk`, padding `9px 10px`, the same −10px overhang as rows, `chevd` rotates 180° when open. Lists are capped at 5 and expand in place. |

### 10.6 Rows & lists

**The list pattern:** a group of things is a heading and rows, not a box. `.list` is a flex column with `margin: 0 -10px 32px`; siblings are split by `1px solid var(--hair)`; each row carries its own hover well (`--sunk`) that reaches 10px past the text. Row actions are **icon wells** (`.acts span`: 28px, r2, `--ter`; hover `--tint2`/`--brandInk`; `.dg` hover `--dangerTint`/`--dangerInk`; `.gd` hover ok) revealed with opacity on hover and focus.

| Row | Anatomy & spec |
|---|---|
| **Record row** `.row` | padding `11px 10px`, gap 12; left: title `.t` 14/600 (+ optional `.fdot`) and sub-line `.s` 12px `--sec` (single line, ellipsis); `.acts` (move / share / delete); right column `.rt` (min 104px, right-aligned): identity tag `.tg` (11.5px `--sec` + a 6px `--cI` dot) over meta `.mt` (12px `--sec`, tabular). Hover `--sunk`, press `--tint2`. Live: the right column becomes a `.livechip`. |
| **Task row** `.task` | padding 10, gap 12, top-aligned; 17px `.cbx`; title 13.5px `--ink`; meta `.m` 11.5px (`.pri.hi` + a `users` glyph in `--line2` + source); due `.due` 12px `--ter` (`.dg` late = dangerInk/600; `.wn` = warnInk/600); hover `.kb2` ⋯ (26px). Done: title struck through in `--ter`. Selected: `.on` = `--tint2`. Compact variant (in panels): meta shows only the due text, `.late` in dangerInk. |
| **Flag row** `.flag` | padding `13px 10px`; 26px r1 icon well in `--fcT`/`--fcI`; title `.ft` 13.5/600; line `.fs` 12.5px `--sec` with the speaker in `--ink2`/600; meta `.fm2` 11.5px with 12px `--line2` glyphs; right `.fr`: age 11.5px + `.acts` (make task / resolve / dismiss). Selected `.on` = `--tint2`. Settled `.done` = 62% opacity, neutral icon well. |
| **Schedule row** `.srow2` | inside `.sched` (day headings `.schedday`: micro-label, padding `16px 10px 4px`); 54px time column (12.5/600 tabular + 11px duration); a 3px `--cI` rule; title 13.5/600 + sub 11.5; chevron on hover. |
| **Collection row** `.trw` | inside `.tlist`; 32px identity `.well`; name 14/600; children as "A · B · C" 11.5 `--sec`; right meta (bold counts, 3px `.sp` dots); chevron at 50% → 100% on hover. |
| **Text row** `.trow` | editable line 13.5px + meta 11.5 `--ter`; hover actions edit / copy / play / delete. |
| **Records** `.records` | `<ul>` rows for decisions/questions: 13.5px/1.6 `--ink2`, padding `9px 10px`, hair between, hover `--sunk`; trailing `.jump` timestamp (11.5 `--ter`, tabular, hover brandInk) or `.from` source link (600). |
| **Timed lines** `.trs` | 40px tabular time (`--ter`, clickable) + speaker 12.5/600 + text 13.5/1.65; a 2px left rule marks a line that became something (`.hl` tint, `.said` okLine). |
| **Person row** `.prow` | 26px avatar, name 13px + 11px email/secondary, trailing remove `.rm` (45% → 100% on hover, danger hover) or "You". |
| **Group heading** `.ghd` | micro-label + `.n` count ("· 3 lorem", 12px/500, no uppercase) + optional trailing `.go` link. Margin-bottom 12. |

```html
<div class="ghd">Today <span class="n">· 3 lorem</span></div>
<div class="list">
  <div class="row" tabindex="0">
    <span><span class="t">Lorem ipsum dolor</span><span class="s">Sit Amet, Consectetur · 34:02</span></span>
    <span class="acts"><span title="Move"><svg class="ic"/></span><span title="Share"><svg class="ic"/></span><span class="dg" title="Delete"><svg class="ic"/></span></span>
    <span class="rt"><span class="tg c1"><i></i>Lorem / Ipsum</span><span class="mt">2:14 pm · 3 ipsum</span></span>
  </div>
</div>
```

### 10.7 Cards, panels & tiles

| Component | Spec |
|---|---|
| Card `.card` | `--surf`, 1px `--line`, r4 — nothing more. `.card.flat` drops the box. |
| Section panel `.pnl` | card + header strip `.ph` (padding `12px 16px`, bottom `--hair`; title `.t` 15/600; meta `.n` as a `--sunk` pill "· 6"; trailing `.go` links 11.5/600 brandInk and controls). Body `.pb` padding `12px 16px 16px`; `.pb.rows` `8px 16px 12px` for lists. **Use where unlike sections sit side by side** (a list beside a schedule, two charts). |
| Tile `.tile` | border `--line`, r4, padding 16, gap 12, min-height 132; top: 36px identity `.well` + name 14.5/600 + hover ⋯; then sub-item chips (`.subs span`: 11px `--sunk` r1, max 3 + "+N more") **or** a 2-line description; foot `.mt` 11.5 `--ter` with bold counts and an optional `.fstat`. Hover: `--line2` border, `--e2`, `translateY(-1px)`. |
| Small tile `.tile-sm` | r3, padding `12px 12px 11px`, gap 9; 30px well + hover ⋯; name 13/600; meta 11px. Grid `minmax(150px,1fr)`. |
| Add tile `.tile.add` | dashed border, centred `--ter` icon + 12.5px label; hover brand border + `--tint2`, no lift. |
| Identity well `.well` | `--cT` background, `--cI` glyph at 50% of its size, r3 (r2 at 32px). `.well.plain` = `--sunk`/`--ter` for "unassigned". |
| Stat `.stat` | label 12 `--ter`, figure 29/600 tabular, delta 12 `--sec` with a 13px glyph in `--cI` — **no box**. `.statrow`: gap 32, hairline `border-left` between stats. |
| Flag band `.band` | card; header `.bh` (28px r1 icon well — `--sunk`, or critical tint when `.hot` — title 13.5/600 + 12px sub, right: `.fstat`s); up to three `.flag` rows (padding 16 sides, no radius, hair between); footer `.bf` 12px `--ter`. A heading with evidence — never tinted as a whole. |
| Setup card | `.card` + `.setuphd` (title 14/600, `.steps` "2 steps left" 11.5 `--ter`, close) + `.setuprow`s (30px `--sunk` icon well, title 13.5/600, description 12.5 `--sec` max 560px, trailing action). |
| Empty `.empty` | centred, padding `40px 24px`; 44px r4 `--sunk` icon well (22px icon, 1.6 stroke); title 19/600; copy 13.5/1.65 `--sec` max 420px; actions margin-top 20. |
| Panel empty `.pnlempty` | the panel-scale version: 32px r3 well, 12.5px copy max 220px, padding `22px 18px`. |
| Section empty `.sbe` | one line, 12.5px `--ter`. |

### 10.8 Detail page parts

| Component | Spec |
|---|---|
| Title block `.titlehd` | h1 28/600/−.021em/1.18; hover reveals a 15px `edit` icon; margin-bottom 24. |
| Page header `.pagehd` | 36px r3 well (margin-top 2) + `.ft` (h1 26/600 + `.metarow` margin-top 8) + `.fa` actions (quiet icon button). Margin-bottom 24. |
| Fact line `.metarow` | 12.5px `--sec`, gap 12, wraps; units `.mi` (13px `--ter` glyph + value in `<b>` ink2/600), separated by 3px `.sp` dots in `--line2`. People unit `.mi.people`: `.faces` + count + `chevd`, a `--sunk` hover well (padding `3px 8px`, margin-left −8). Identity unit `.idchip`: a 7px r2 `--cI` square + path, hover well. |
| Face stack `.faces` | 24px circles, 2px `--surf` ring, −7px overlap, 10.5px/700 white initials; capped (5–6) with a `+N` `--sunk` chip. |
| Section `.sec` | h3 18/600 sentence case, count as a `--sunk` pill, optional trailing `.go`; consecutive sections split by a `--line` rule with 32px padding-top; prose `p` 14.5/1.7 `--ink2` max 66ch, 12px between paragraphs. |
| Lead `.lead` / `.brief` | lead paragraphs 14.5/1.7 max 72ch; `.bgrid` sub-sections below a hair rule (h4 12.5/600 `--sec`); `.blist` bullets are 5px dots (`--line2`; `.bad` warn; `.fix` ok; `.who` 22px avatars). |
| Detail columns `.dcols` | `3fr : 2fr`, gap 32, `align-items:start`; `.dside` stacks `.pnl`s with 20px gaps. |
| Live bar `.livebar` | `--dangerTint`, r3, padding `11px 16px`; 10px danger dot with a 4px `--dangerLine` ring, pulsing; label 13.5/600; timer 14/600 dangerInk tabular; sub 12.5 `--sec`; actions right. `.pause` → warn tint, still dot, no red. |
| Player `.player` | `--sunk`, r3, padding `9px 12px`; 32px round brand play button; tabular times 12px; `.scrub` of 3px bars (played = `--brand`, rest `--meterOff` 70%); a quiet speed button. |
| Quote `.quote` | 2px `--line2` left rule, 13px/1.65 italic `--ink2`. |
| Compare `.compare` | two-column grid in a `--line` r3 box; the second column on `--sunk` with a hair divider; each: micro-label header with icon, italic quote 13/1.65, attribution 11.5 (name ink2/600), a 11.5/600 brandInk link. Stacks under w2. |
| Relation `.relation` | the relation *in words* between two hairlines: 11px/600 .06em uppercase `--ter`. |
| Quote box `.quotebox` | `--sunk`, r3, padding `13px 16px`; micro-label header; italic 13/1.65 text; a row of secondary small buttons. |
| Field rows `.fields` / `.field` | a `--line` rule then rows with gap 12: 84px label (12px `--ter`) + a `.sel`. |

### 10.9 Feedback

| Component | Spec |
|---|---|
| Notice `.notice` | r3, padding `11px 13px`, 13px/1.5, gap 10; **the tint carries it — no matching border**: `.ok` `.warn` `.dg` `.info` (icon in the family Ink; `.info` icon in the mark). First clause bold `--ink`, rest `--ink2`. Optional `.act` slot on the right (text or secondary small button, close `tbtn` 26px). `.notice.quiet` = no surface, 12.5px `--sec`, `--ter` icon — for the many things that were never really alerts. |
| Toast `.toast` | bottom-centre stack (`.toasts`, 24px from the bottom, gap 8); **one ink surface for every toast** (`--ink` bg, `--surf` text), 12.5px, padding `9px 16px`, r2, `--e2`, max 480px; status carried by the 15px glyph only (ok `#6FDCA6`, warn `#F7CD82`, danger `#FFA79B`, info `#A8C8F8`). Rises in 6px (`tin`); auto-dismisses (~2.6s). |
| System notification `.notif` | 336px, stacked top-right (right 16, top 70); `--surf`, `--line`, r4, `--e2`, padding `12px 13px`; 32px r2 app icon well (brandFill; `.dg` danger; `.ok` ok); app line 10.5/600 uppercase + time; title 13.5/600; body 12.5 `--sec`; actions (primary + secondary small); close 24px. Slides in 22px (`osin`); clears itself after ~7s. |
| Tooltip `.tip` | **one per document**, positioned in viewport coordinates so no ancestor can clip it: `--ink` bg, `--surf` text, 11.5px/500, padding `5px 10px`, r2, max 250px, `0 8px 22px rgba(0,0,0,.22)`; above the control, flips below near the top, clamped to the sides; 340ms delay / 450ms warm window; hidden on scroll and mousedown. Built from `title` attributes (moved to `data-tt` + `aria-label`). Not shown for a sidebar item whose label is already visible. |
| Meter `.meter` | 3px bars, 3px gap, height 26 (22 in capture); idle `--meterOff` 80%; live `--danger` 80%. |
| Thinking `.typing` | three 6px `--sec` dots, `bl` 1.1s, staggered .18s, inside an assistant bubble (padding `13px 16px`). |
| Steps `.step` | 22px round number (`--sunk`/`--sec`; `.done` ok tint + check; `.wait` outline), title 13.5/600 with optional `.tag`, description 12.5 `--sec`; hair between steps. |

### 10.10 Data display

| Component | Spec |
|---|---|
| Table `.table` | full width, collapsed borders; `th` = micro-label with one `--line` rule under; `td` padding `12px 12px`, 13.5px `--ink2`, `--hair` between rows, `--sunk` on hover; the first column is the key (`td.tm` 600 `--ink`, 2px left padding); numbers `.num` right-aligned and tabular; row delete `.kb2` with danger hover. |
| Bar chart `.chart` | **single series** in one identity slot (`.cN` on the chart): bars `--cI` at 55% (100% on hover), max 26px wide, r1 top corners, gap 8, plot height 120 in a 132px box; zero = a 3px `--meterOff` stub; two hairline gridlines (50%, 100%) with tabular labels in a 38px left gutter; x-axis = one `--line` rule + 11px `--ter` labels; hover tooltip `.ttip` (ink surface, bold value + label). The panel title names the series — no legend. |
| Horizontal bars `.hbar` | 104px label 12.5 `--ink2`, 8px `--sunk` track with a pill-ended `--cI` fill at 62% (100% on hover), 34px tabular value. |

### 10.11 Conversation

| Component | Spec |
|---|---|
| Message `.msg` | avatar 28px r2 (26px r1 in an aside) + bubble; bubble 13.5/1.65 (13 in an aside), padding `10px 16px`, r4, max `min(76%,620px)` (82% in an aside). **Assistant `.a`**: left, `--sunk`, bottom-left corner r1, avatar is an `--ink` well with the spark glyph. **User `.u`**: right (`row-reverse`), `--tint`, `--ink` text, bottom-right corner r1, avatar `--tint`/`--brandInk` initial. |
| Source `.src` | outlined pill (`--line`), 11.5px `--sec`, `users` glyph, padding `3px 10px`; hover `--tint2`/brandInk. Every answer cites what it came from. |
| Prompt list `.prompts` | in an aside's empty state: rows with a 15px icon, border `--line`, r2, padding `9px 12px`, 12.5px; hover brand border + brandInk. |
| Suggestions `.chips` | centred row of `.chip`s under an `.empty`, then a 12px `.scope` note. |
| Composer | `.comp` pinned to the foot with `margin-top:auto`; see §10.2. |

### 10.12 Media & capture

`.card.capture`: the card on `--rail` with a transparent border, padding 20. Head `.caphead` (gap 20): the **hold button** `.holdbtn` (brandFill, r3, padding `11px 16px`, 13.5/600, `--e1`, an inline key chip `.kb` on `--onChip`; `.live` → danger fill), a status column (`.statusline` 12.5/500 with an 8px status dot; `.capsub` 12.5 `--ter`), and, while live, a 15px/600 dangerInk tabular timer. The meter is demoted into its own `--sunk` r3 well (`.capmeter`) under a `.cmhead` (micro-label + "Try it" link). The live state swaps the label for the timer.

### 10.13 People

Avatar `.avat`: circle, initial 600, sizes 20 / 26 / 28 / 30 / 34 / 36 (font ≈ 42% of size). In the account block it takes the user's identity slot (`--cT` / `--cI`). Add-person `.addp`: dashed `--line2` pill, 12.5/600 `--sec`; hover solid brand border + brandInk.

### 10.14 Floating control — `.fab`

An always-on control that floats over everything, 24px from both edges (draggable in products that allow it; it clamps to the window). **One object, three shapes** — it changes shape rather than being swapped:

1. **Idle** `.fab.idle` — a 60px round core (`.fab-core`: brandFill, 22px mic at 2.0 stroke, `0 10px 26px rgba(0,0,0,.26)` shadow, `cursor: grab`). On hover the pill body (`--pill`, `--pillShadow`) grows **inward from the anchored edge** and reveals three 38px `.hopt` wells (`--pillWell`) — width 0 → 132px in .24s `--pop`; the core stays under the cursor and becomes the end cap.
2. **Capsule** (capturing) — `.pill` 52px: mark well (36px) · live `.pmeter` (2.5px bars, green `#4ADE80` at 95%) · label 13/600 · tabular time in `--pillSec` · divider · a 36px danger stop button.
3. **Pill** (live session) — mark · pulsing 9px danger dot + 15px/600 tabular timer · meter (or "Paused") · divider · pause · stop (`.pbtn.stop`) · a badge button with an 18px count (`.b`, warn; `.b.hot` danger) ringed in `--pill`.

States: `.paused` — the red drops out entirely (dot → warn, timer → `--pillSec`, meter 28%). `.alert` — a breathing danger halo (`phalo` 2.4s); **only a critical flag turns it on**, and it clears as soon as the flag is looked at. Every control inside is 36px (32 at w1; the pill shrinks to 46px and drops the mark).

**Popover** `.pop` (326px) anchored to the pill's right edge with a 12px rotated tail, flipping below near the top of the window: `.pcard` (card + `--e3`). Peek variant: `.flagchip` + age, 13.5px title, "Lorem: “…” / Ipsum: “…”" lines (12.5 `--sec`, labels bold), footer buttons (primary + secondary + a square dismiss), an optional "N more" `.more` row. List variant: header + `.fstat`s + `.plist` rows (3px `--fc` left rule on `--fcT`, 22px `--surf` icon well, severity name in `--fcI` 12.5/600, two-line text, age) + a "Review all" `.more` row.

### 10.15 Dialogs, menus & settings

| Component | Spec |
|---|---|
| Scrim `.scrim` | `--scrim`, covers the window, `z-index:20`. **Two scrims never stack.** A transparent `.scrim.clear` sits behind open menus to catch outside clicks. |
| Modal `.modal` | centred, `--surf`, **r5**, `--e3`, max `calc(100% − 28px)` both ways, `mdin` .18s. `.modal.col` for single-column dialogs. |
| Dialog header `.mtop` | padding `20px 24px 16px`, bottom `--line`; optional 32px r2 icon well `.mi` (`--sunk`/`--sec`; `.dg` danger tint; `.info` info tint); title 17/600; description 12.5 `--sec`; close `.x` 30px. |
| Dialog body `.mcont` | padding `20px 24px 32px`, gap 32 (`.tight`: 14 gap, `20px 24px 24px`); copy 13.5/1.6 `--ink2` with the consequence in bold. Footer `.mfoot`: two `.btn.full` side by side, gap 9, safe option first. Destructive: `.mi.dg` + `.btn.d`; irreversible: a typed confirmation field and the danger button disabled until it matches. |
| Menu `.menu` | `--surf`, `--line`, **r3**, `--e2`, padding 4, min-width 210, `mnin` .12s; anchored to its trigger and clamped to the window (flip rather than clip). Items `a`: 32px, padding `0 8px`, gap 10, r1, 13px `--ink2`, 15px `--ter` icon, trailing `.k` key hint or check (11px tabular); hover `--sunk`; `.dg` item in dangerInk with a danger-tint hover. `.mh` = micro-label header; `hr` = hair with 8px side margins; `.fn` = footnote 11.5 `--ter` explaining consequences. `a.nrow` = two-line notification row that grows with content. |
| Settings modal | 1000 × 700: `.mnav` (220px, `--rail`, right `--line`, padding `20px 8px`; title 15/600; `.gl` group labels; items 32px r2, active tint/brandInk/600) + `.mbody` (`.mtop` + scrolling `.mcont`). Under w2 the nav becomes a 60px icon strip; under w1 it hides. |
| Settings group `.sgroup` | **a micro-label and a hairline, not a box**: `.sghd` (label + "· description" 12px `--ter`, bottom `--line`) then `.srow`s — padding `14px 0`, hair between, title 13.5/600, description 12.5/1.55 `--sec` max 560px, trailing `.a` control (toggle, select, chips, secondary small button, `.pri` status). |
| Theme card `.thcard` | border `--line`, r4, padding 12; a 48px preview strip of literal hex (rail 22% · surface · tint 14% · brand 14%); name 13.5/600 with a check tick when on; description 11.5 `--sec`; four 15px swatch dots + "LIGHT · DARK". Selected: brand border + 3px ring. |

---
## 11. Content & voice

Plain, specific and calm. Say what happened and what happens next; never celebrate, never blame.

- **Sentence case everywhere** — titles, buttons, tabs, menu items, headings. Uppercase only for 11px micro-labels.
- **Buttons are verbs** that name the outcome: "Create link", "Delete everything", "Turn on". Not "OK", "Submit", "Yes".
- **State the consequence** beside a destructive or irreversible action: what goes, where it goes, whether it comes back ("Goes to Recently deleted for 30 days").
- **Empty states explain** what will appear here and how it gets here, then offer one action.
- **Bold the fact, not the sentence.** In notices and toasts the first clause is bold.
- **Nothing is shared, sent or created until the user presses the primary button** — and the copy next to it says so.
- Placeholder text in this reference is lorem ipsum by design. Replace it with real content early.

| Thing | Format | Example |
|---|---|---|
| Clock time | `h:mm am/pm`, lowercase | 2:14 pm |
| Duration | `mm:ss` or `h:mm:ss`, tabular | 34:02 |
| Relative day | Today · Yesterday · weekday · `d Mon` | Fri 14 |
| Lateness | `n days late` / Yesterday | 2 days late |
| Counts | number then noun, pluralised | 3 items · 1 task |
| Separators | middle dot with spaces | Lorem · 11 Aug · 2:14 pm |
| Ranges | en dash, no spaces | 10–16 Aug |
| Multiplier | `×`, not `x` | 24× |
| Paths / hierarchy | slash with spaces | Lorem / Ipsum |
| Ellipsis | single character `…` | Generating… |

---

## 12. Accessibility (requirements)

- **Contrast:** body text ≥ 4.5 : 1, marks and large text ≥ 3 : 1. `--ink`, `--ink2`, `--sec` and `--ter` on `--surf` clear 4.5 : 1 in **all twelve** theme/mode combinations; never put text lighter than `--ter`.
- **Known exceptions in v1.0** (measured; the HTML reference's Accessibility page recomputes them live):

  | Theme · mode | Pair | Ratio | Guidance |
  |---|---|---|---|
  | Indigo · light | `--ter` on `--sunk` | 4.08 : 1 | placeholders and counts in wells only; no essential text |
  | Indigo · light | `--ter` on `--rail` | 4.26 : 1 | rail micro-labels only |
  | Indigo · dark | `--ter` on `--sunk` | 4.31 : 1 | as above |
  | Indigo · dark | `--brandInk` on `--tint` | 4.33 : 1 | active nav label — it is also 600 weight and carries an icon |
  | Citrus · light | `--brand` on `--surf` | 1.97 : 1 | the lime mark (focus ring, toggle-on) is weak on white; always pair it with a shape change — the toggle knob moves, the checkbox shows a check |

  New pairings MUST clear the target; do not add text in these combinations.
- **Focus:** every control shows `:focus-visible` — `outline: 2px solid var(--brand); outline-offset: 2px; border-radius: var(--r2)`. Rows inset it (`outline-offset: -2px`, no radius). Fields show focus on the well (`:focus-within` border + ring) and suppress the inner outline — never a ring inside a ring. A mouse click never leaves a ring.
- **Names:** every icon-only control has a `title` (converted to the shared tooltip + `aria-label`).
- **Roles:** custom controls declare themselves — `.tog` `role="switch"` + `aria-checked`; `.cbx` `role="checkbox"`; `.tabs a` `role="tab"` + `aria-selected` (+ `aria-disabled` when `.off`); the active nav/list/menu item gets `aria-current`; non-native clickable elements get `tabindex="0"` and `role="button"`/`"link"`.
- **Keyboard:** Enter and Space activate any non-native control (Space must not scroll). Esc closes the top overlay. Hover-revealed actions appear on `:focus-within`. Tabbing into a collapsed sidebar opens it.
- **Never colour alone:** every status colour ships with a glyph and a word; identity slots ship with their label or glyph.
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` collapses all animation and transition durations to .01ms and disables the peek slide.
- **Touch:** under w1, hover-only affordances (row actions) are removed rather than left unreachable; the same actions remain available from the item itself.

---

## 13. Do & don't

| Do | Don't | Why |
|---|---|---|
| Tint only the item that needs attention (`.pri.hi`) | Give medium amber and low green chips too | Ten coloured chips on ten rows mean nothing |
| Group with a `.ghd` heading and hairlines | Wrap each row in a card with a shadow | A list becomes a stack of objects competing for attention |
| Show a stat as label · figure · delta, split by hairlines | Box and colour each figure | Boxed numbers read as buttons — four things to act on |
| Reveal row actions as icon wells on hover/focus | Show outlined buttons on every row | Three more boxes appear the moment the pointer lands |
| Let the tint carry a notice; one ink surface for toasts | Add a matching border; fill a toast with the status colour | Two signals for one message; a toast arrives as a slab |
| Use 18px sentence-case headings for sections | Use 11px uppercase labels as section headings | A page of field names reads as a form |
| One primary, named for its outcome | Several primaries labelled OK / Apply / Submit | The user has to read every button |
| A filled well that lights up on focus | A focused input inside a focused box | A ring inside a ring |
| A hairline between surfaces | A shadow on anything that doesn't float | Shadows stop meaning "this floats" |
| A new component from existing tokens | A new radius, shadow, font size or colour | Neighbouring cards stop agreeing |

---

## 14. Class vocabulary

| Family | Classes |
|---|---|
| Shell | `.shell` `.topbar` `.lights` `.app` `.rail` `.listcol` `.main` `.body` `.aside(.wide .chat)` `.pkgap` |
| Collapse | `.app.railmin` `.app.listmin` `.app.pkrail` `.app.pklist` `.colbtn(.pin)` |
| Navigation | `.slab` `.nav` `.subnav` `.acct` `.avat` `.upg` `.lhead` `.srch` `.lbody` `.views` `.slabel` `.tw(.o .blank)` `.note` `.lfoot` `.convrow` `.tabs` `.crumb(.collapsed)` `.actbar` `.secmore` |
| Buttons | `.btn` + `.p .s .q .t .d` + `.sm .lg .ico .dis .full` · `.tbtn(.hasbadge .on)` · `.link(.quiet)` |
| Fields | `.inp(.area .err)` `.sel` `.addrow` `.compbox(.dock .off)` `.sendb` `.comp(.stick)` `.notebox` `.kbd` `.keycap` |
| Selection | `.tog` `.cbx` `.rdo` `.chk` `.seg(.lg)` `.fchip` `.chiprow` `.opt` |
| Chips | `.pri(.hi .ok)` `.tag(.brand .ok .box)` `.livechip` `.badge` `.cnt(.hot)` `.npill` `.chip(.off)` |
| Flags | `.f-crit` `.f-warn` `.f-ask` · `.flagchip(.plain .brand)` `.fdot` `.fstat` `.flag(.on .done)` `.band(.hot)` `.compare` `.relation` `.quotebox` |
| Rows | `.list` `.row` `.acts` `.task(.on .done)` `.trow` `.sched` `.schedday` `.srow2` `.tlist` `.trw` `.records` `.jump` `.from` `.trs(.hl .said)` `.prow` `.ghd` `.metrics` `.toolrow` |
| Cards | `.card(.flat)` `.pnl` `.tiles` `.tile(.add)` `.tiles-sm` `.tile-sm` `.well(.plain)` `.stat` `.statrow` `.empty` `.pnlempty` `.sbe` `.setuphd` `.setuprow` `.homegrid` `.homecol` |
| Detail | `.titlehd` `.pagehd` `.metarow` `.faces` `.idchip` `.addp` `.sec` `.lead` `.brief` `.bgrid` `.bsec` `.blist` `.dcols` `.scrollcol` `.g2` `.livebar(.pause)` `.player` `.scrub` `.quote` `.fields` `.field` |
| Capture | `.capture` `.caphead` `.holdbtn(.live)` `.statusline` `.capsub` `.captime` `.capmeter` `.meter(.idle .live)` |
| Data | `.table` `.chart` `.chartwrap` `.gridl` `.xax` `.ttip` `.hbar` `.step` `.tips` |
| Conversation | `.msg(.u .a)` `.src` `.typing` `.chips` `.scope` `.cempty` `.prompts` |
| Overlays | `.scrim(.clear)` `.modal(.col)` `.mnav` `.mbody` `.mtop` `.mcont(.tight)` `.mfoot` `.sgroup` `.sghd` `.srow` `.menu` `.toasts` `.toast` `.notifs` `.notif` `.tip` `.thgrid` `.thcard` |
| Floating | `.fab(.idle .paused .alert)` `.fab-home` `.fab-opts` `.fab-core` `.hopt` `.pill` `.pmark` `.pstat` `.pdiv` `.pbtn(.stop .on)` `.pmeter(.live)` `.pop` `.pcard` `.plist` |
| Identity | `.c1 … .c6` → `--cI` `--cT` |
| Width classes | `.w3` (< 1320) `.w2` (< 1080) `.w1` (< 840) on the window element |

Sub-element names inside a component (`.t` title, `.s` description, `.n` count, `.r` right slot, `.a` action slot, `.mt` meta…) are always scoped to their parent and never styled globally.

---

## 15. Review checklist

Run this before calling any screen done. Every item MUST pass.

**Tokens & theming**
- [ ] No literal colours, radii, shadows, font sizes or durations in product CSS — only the variables from §2.2 (literal hex is allowed only in theme-preview swatches).
- [ ] Components read roles (`--brandFill`, `--ink2`…), never ramp steps (`--o600`).
- [ ] The screen is checked in all six themes, light and dark; Citrus primary buttons have dark text.
- [ ] Onest is the only typeface; headings are sentence case; numbers are tabular.

**Structure**
- [ ] The shell matches §9.1: 56px title bar, rail 248/72, list column 272/56, aside 384/492.
- [ ] Groups are headings + rows, not boxes; panels (`.pnl`) are used only where unlike sections sit side by side.
- [ ] A view has at most one primary action; toolbar actions are quiet; row actions are hover icon wells.
- [ ] Controls for a tab live in the action bar directly under the tabs.
- [ ] Opening an aside folds both sidebars; closing it restores them.
- [ ] The w3 / w2 / w1 rules and the 1180 / 960 auto-collapse points are implemented against the window width.

**Colour**
- [ ] Every coloured thing names a meaning: identity (a slot bound to one entity) or status (a family with a glyph and a word).
- [ ] Only high priority, overdue counts, critical flags and live indicators are red.
- [ ] Notices use a tint without a matching border; toasts share one ink surface.

**Interaction & accessibility**
- [ ] Hover-revealed actions also appear on `:focus-within`; every icon-only control has a name.
- [ ] `:focus-visible` rings on controls, well focus on fields, no double rings.
- [ ] Custom controls have roles and states; Enter/Space activate; Esc closes overlays.
- [ ] Any text you add clears AA in every theme and mode (the known exceptions in §12 are not precedents).
- [ ] Motion uses `--tr` / `--sbT` / `--pop` and is removed under reduced motion; nothing animates on its own except live indicators.

**Content**
- [ ] Buttons are verbs; destructive actions state their consequence; empty states explain and offer one action.
- [ ] Times, durations, counts and ranges follow the formats in §11.

---

## Appendix A — Token stylesheet

See §2.2. It is the first stylesheet a product loads and MUST be copied unchanged.

## Appendix B — Component stylesheet (copy verbatim)

Every class in §10 and §14, the width-class rules (`.w3/.w2/.w1`) and the shell. It depends only on the tokens. Load it after the tokens.

```css
/* ═══════════════════════════ base ═══════════════════════════ */
*{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%}
body{font-family:var(--f-body);background:var(--backdrop);color:var(--ink);
  -webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;
  font-size:13.5px;line-height:1.5;transition:background .25s}
.h{font-family:var(--f-head)}
svg{display:block;flex:0 0 auto}
button{font:inherit;color:inherit;background:none;border:0;cursor:pointer}
input,textarea{font:inherit;color:inherit;background:none;border:0;outline:0}
a{color:inherit;text-decoration:none}
::-webkit-scrollbar{width:10px;height:10px}
::-webkit-scrollbar-thumb{background:var(--line2);border-radius:var(--rF);border:3px solid transparent;background-clip:content-box}
::-webkit-scrollbar-thumb:hover{background:var(--ter);background-clip:content-box}
::-webkit-scrollbar-track{background:transparent}
:focus{outline:none}
:focus-visible{outline:2px solid var(--brand);outline-offset:2px;border-radius:var(--r2)}
input:focus-visible,[contenteditable]:focus-visible{outline:none}
.row:focus-visible,.task:focus-visible,.flag:focus-visible,.trow:focus-visible,.table tr:focus-visible,.srow:focus-visible{outline-offset:-2px;border-radius:0}
/* an icon inside a sentence stays on the line with it */
.inl .ic,.notice>span .ic,.hint .ic,.sec p .ic,.metrics .ic,.srow .s:not(.btn) .ic,.opt .s:not(.btn) .ic,.sbe .ic{display:inline-block;vertical-align:-2px;margin-right:3px}
@media (prefers-reduced-motion:reduce){
  *,*:before,*:after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}

/* ═══════════════════════════ shell ═══════════════════════════
   topbar 56px · rail 248 (72 collapsed) · list column 272 (56 collapsed)
   · main flex · right aside 384 (492 wide) */
.shell{display:flex;flex-direction:column;height:100%;position:relative;overflow:hidden;background:var(--surf)}
.app{display:flex;flex:1;min-height:0;position:relative}
.topbar{height:56px;flex:0 0 auto;display:flex;align-items:center;gap:var(--s4);
  padding:0 var(--s3) 0 var(--s5);background:var(--surf);border-bottom:1px solid var(--line);z-index:6;min-width:0}
.topbar .ttl{display:flex;align-items:baseline;gap:10px;min-width:0}
.topbar h1{font-family:var(--f-head);font-size:19px;font-weight:600;letter-spacing:-.012em;white-space:nowrap;line-height:1.2}
.topbar .state{font-size:12.5px;color:var(--sec);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-variant-numeric:tabular-nums}
.topbar .r{margin-left:auto;display:flex;align-items:center;gap:var(--s1);flex:0 0 auto}
.lights{display:flex;align-items:center;gap:8px;flex:0 0 auto;padding-right:4px}
.lights i{width:12px;height:12px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:rgba(0,0,0,.5)}
.lights i svg{opacity:0;width:9px;height:9px}
.lights:hover i svg{opacity:1}
.lights .r{background:var(--lightR)}.lights .y{background:var(--lightY)}.lights .g{background:var(--lightG)}
.tbtn{width:30px;height:30px;border-radius:var(--r2);display:flex;align-items:center;justify-content:center;
  color:var(--ter);position:relative;flex:0 0 auto;cursor:pointer;transition:background var(--tr),color var(--tr)}
.tbtn:hover{background:var(--sunk);color:var(--ink2)}
.tbtn.on{background:var(--tint2);color:var(--brandInk)}
.tbtn.hasbadge:after{content:'';position:absolute;top:5px;right:5px;width:6px;height:6px;border-radius:50%;
  background:var(--danger);box-shadow:0 0 0 2px var(--surf)}

/* rail — sidebar 1 */
.rail{width:248px;flex:0 0 248px;background:var(--rail);border-right:1px solid var(--line);display:flex;flex-direction:column;
  padding:var(--s3) var(--s3) var(--s2);overflow:hidden;
  transition:width var(--sbT),flex-basis var(--sbT),padding var(--sbT),background .25s}
.app.railmin>.rail{width:72px;flex:0 0 72px;padding:14px 8px}
.app.railmin>.rail .lbl,.app.railmin>.rail .slab,.app.railmin>.rail .acct .who,.app.railmin>.rail .upg,
.app.railmin>.rail .subnav,.app.railmin>.rail .rail-hide,.app.railmin>.rail .nav a .n{display:none}
.app.railmin>.rail .nav a{justify-content:center;padding:0;width:44px;height:44px;margin:0 auto}
.app.railmin>.rail .colbtn{margin:0 auto}
.app.railmin>.rail .acct{justify-content:center;padding:0}
.app.railmin>.rail .acct .top{justify-content:center}
.app.railmin>.rail .avat{width:34px;height:34px;font-size:13px}
.slab{font-size:11px;font-weight:600;letter-spacing:.07em;text-transform:uppercase;color:var(--ter);padding:0 10px var(--s2);white-space:nowrap}
.nav{display:flex;flex-direction:column;gap:2px}
.nav a{display:flex;align-items:center;gap:11px;height:36px;padding:0 10px;border-radius:var(--r2);font-size:13.5px;
  font-weight:500;color:var(--ink2);cursor:pointer;white-space:nowrap;transition:background var(--tr),color var(--tr)}
.nav a:hover{background:var(--sunk)}
.nav a.on{background:var(--tint);color:var(--brandInk);font-weight:600}
.nav a .ic{color:var(--ter)}
.nav a.on .ic{color:var(--brandInk)}
.nav a .n{margin-left:auto;font-size:11.5px;color:var(--ter);font-weight:500;font-variant-numeric:tabular-nums}
.nav a.on .n{color:var(--brandInk)}
.subnav{display:flex;flex-direction:column;gap:1px;margin:1px 0 var(--s1) 21px;border-left:1px solid var(--line);padding-left:10px}
.subnav a{display:flex;align-items:center;gap:9px;height:30px;padding:0 8px;border-radius:var(--r1);font-size:12.5px;color:var(--sec);
  cursor:pointer;transition:background var(--tr),color var(--tr)}
.subnav a:hover{background:var(--sunk);color:var(--ink2)}
.subnav a.on{background:var(--tint2);color:var(--brandInk);font-weight:600}
.spacer{flex:1}
.colbtn{display:flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:var(--r2);color:var(--ter);
  cursor:pointer;flex:0 0 auto;transition:background var(--tr),color var(--tr)}
.colbtn:hover{background:var(--sunk);color:var(--ink2)}
.colbtn.pin{color:var(--brandInk)}
.colbtn.pin:hover{background:var(--tint2)}
.acct{display:flex;align-items:center;padding:var(--s2);border-radius:var(--r2);overflow:hidden;flex:0 0 auto;cursor:pointer;transition:background var(--tr)}
.acct:hover{background:var(--sunk)}
.acct .top{display:flex;align-items:center;gap:10px;min-width:0;width:100%}
.acct .who{min-width:0;flex:1}
.acct .nm{font-size:12.5px;font-weight:600;line-height:1.3;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.acct .pl{font-size:11.5px;color:var(--ter);display:block;line-height:1.35}
.acct .avat{width:30px;height:30px;background:var(--cT,var(--line2));color:var(--cI,var(--ink2));font-size:12px}
.avat{width:28px;height:28px;border-radius:50%;background:var(--tint);color:var(--brandInk);display:flex;align-items:center;
  justify-content:center;font-size:12px;font-weight:600;flex:0 0 auto}
.upg{display:flex;align-items:center;gap:5px;white-space:nowrap;flex:0 0 auto;font-size:12px;font-weight:600;color:var(--brandInk);
  border-radius:var(--r1);padding:4px 7px}
.upg:hover{background:var(--tint2)}

/* list column — sidebar 2 */
.listcol{width:272px;flex:0 0 272px;background:var(--surf);border-right:1px solid var(--line);display:flex;flex-direction:column;
  overflow:hidden;transition:width var(--sbT),flex-basis var(--sbT)}
.app.listmin>.listcol{width:56px;flex:0 0 56px}
.app.listmin>.listcol .lbl,.app.listmin>.listcol .n,.app.listmin>.listcol .npill,.app.listmin>.listcol .slabel,
.app.listmin>.listcol .note,.app.listmin>.listcol input,.app.listmin>.listcol .convrow,.app.listmin>.listcol .emptylist,
.app.listmin>.listcol .lhead b,.app.listmin>.listcol .tw,.app.listmin>.listcol .fm,.app.listmin>.listcol .views a.sub{display:none}
.app.listmin>.listcol .srch{width:36px;height:36px;padding:0;margin:12px auto 0;justify-content:center;cursor:pointer}
.app.listmin>.listcol .lbody{padding:10px 10px 8px;align-items:center}
.app.listmin>.listcol .views{width:100%;align-items:center}
.app.listmin>.listcol .views a{width:36px;height:36px;min-height:36px;padding:0;justify-content:center}
.app.listmin>.listcol .lhead{padding:0;justify-content:center}
.app.listmin>.listcol .lhead .act{margin-left:0}
.app.listmin>.listcol .lfoot{justify-content:center;padding:4px 0 8px}
.lfoot{padding:var(--s1) var(--s3) var(--s2);flex:0 0 auto;display:flex}
.lhead{height:56px;display:flex;align-items:center;padding:0 var(--s4);border-bottom:1px solid var(--line);flex:0 0 auto;gap:8px}
.lhead b{font-family:var(--f-head);font-size:14px;font-weight:600}
.lhead .act{margin-left:auto;display:flex;align-items:center;gap:5px;font-size:12px;font-weight:600;color:var(--brandInk);cursor:pointer}
.srch{display:flex;align-items:center;gap:var(--s2);background:var(--sunk);border:1px solid transparent;border-radius:var(--r2);height:34px;
  padding:0 10px;margin:var(--s4) var(--s3) 0;flex:0 0 auto;transition:background var(--tr),border-color var(--tr),box-shadow var(--tr)}
.srch .ic{color:var(--ter);flex:0 0 auto}
.srch:focus-within{background:var(--surf);border-color:var(--brand);box-shadow:0 0 0 3px var(--ring)}
.srch input{font-size:13px;width:100%;min-width:0}
.srch input::placeholder{color:var(--ter)}
.lbody{padding:var(--s3);display:flex;flex-direction:column;gap:1px;overflow-y:auto;flex:1}
.views{display:flex;flex-direction:column;gap:1px}
.views a{display:flex;align-items:center;gap:10px;min-height:32px;padding:5px 9px;border-radius:var(--r2);font-size:13px;color:var(--ink2);
  cursor:pointer;position:relative;transition:background var(--tr),color var(--tr)}
.views a>*{flex:0 0 auto}
.views a .lbl{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.views a:hover{background:var(--sunk)}
.views a.on{background:var(--tint);color:var(--brandInk);font-weight:600}
.views a .ic{color:var(--ter)}
.views a.on .ic{color:var(--brandInk)}
.views a.idn>.ic{color:var(--cI)}
.views a .n{margin-left:auto;font-size:11.5px;color:var(--ter);font-variant-numeric:tabular-nums}
.views a.on .n{color:var(--brandInk);font-weight:600}
.views a .npill{margin-left:auto;display:inline-flex;align-items:center;justify-content:center;height:18px;min-width:18px;padding:0 6px;
  font-size:11px;font-weight:600;line-height:1;color:var(--dangerOn);background:var(--danger);border-radius:var(--rF)}
.views a .tw{width:16px;height:16px;margin-right:-4px;display:flex;align-items:center;justify-content:center;color:var(--ter);border-radius:var(--r1);cursor:pointer}
.views a .tw svg{transition:transform .14s}
.views a .tw.o svg{transform:rotate(90deg)}
.views a .tw:hover{background:var(--line);color:var(--ink2)}
.views a .tw.blank{pointer-events:none}
.views a.sub{padding-left:32px;font-size:13px}
.views a.sub:before{content:'';position:absolute;left:19px;top:0;bottom:0;width:1px;background:var(--line2)}
.views a .fm{width:22px;height:22px;border-radius:var(--r1);display:flex;align-items:center;justify-content:center;color:var(--ter);opacity:0;
  pointer-events:none;margin-left:auto}
.views a:hover .fm{opacity:1;pointer-events:auto}
.views a .fm:hover{background:var(--line);color:var(--ink2)}
.views a .fm+.n{margin-left:6px}
.slabel{font-size:11px;font-weight:600;letter-spacing:.07em;text-transform:uppercase;color:var(--ter);padding:var(--s5) 9px var(--s2)}
.note{margin:var(--s4) 9px 0;font-size:11.5px;color:var(--ter);line-height:1.5}
.emptylist{padding:28px 14px;text-align:center;font-size:12px;color:var(--ter);line-height:1.55}
.emptylist b{display:block;color:var(--ink2);font-size:13px;font-family:var(--f-head);font-weight:600;margin-bottom:5px}
.convrow{display:block;padding:9px 10px;border-radius:var(--r2);cursor:pointer;transition:background var(--tr)}
.convrow:hover{background:var(--sunk)}
.convrow.on{background:var(--tint)}
.convrow .t:not(.btn){font-size:12.5px;font-weight:600;color:var(--ink);line-height:1.4;display:block}
.convrow.on .t:not(.btn),.convrow.on .d{color:var(--brandInk)}
.convrow .d{font-size:11.5px;color:var(--sec);margin-top:3px;display:block}

/* main */
.main{flex:1;display:flex;flex-direction:column;min-width:0;background:var(--surf)}
.body{flex:1;--bp:28px;padding:var(--bp);overflow-y:auto;display:flex;flex-direction:column;min-height:0}
.body>*{flex:0 0 auto}
.body>.empty,.body>.fill{flex:1 1 auto}
.crumb{display:flex;align-items:center;gap:var(--s1);font-size:12.5px;color:var(--ter);min-width:0;overflow:hidden}
.crumb .ic{color:var(--ter);opacity:.7;flex:0 0 auto}
.crumb .bk{cursor:pointer;display:flex;align-items:center;gap:5px;padding:3px 6px;border-radius:var(--r1);color:var(--sec);white-space:nowrap;
  flex:0 0 auto;transition:background var(--tr),color var(--tr)}
.crumb .bk:hover{color:var(--ink2);background:var(--sunk)}
.crumb .ell{display:none;cursor:pointer;align-items:center;padding:3px 8px;flex:0 0 auto;border-radius:var(--r1);color:var(--sec)}
.crumb .ell:hover{color:var(--ink2);background:var(--sunk)}
.crumb .mids{display:flex;align-items:center;gap:var(--s1);flex:0 0 auto}
.crumb.collapsed .mids{display:none}
.crumb.collapsed .ell{display:flex}
.crumb b{color:var(--ink);font-weight:600;font-family:var(--f-head);font-size:14px;padding-left:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:22px}

/* right-hand aside (inspector / assistant) */
.aside{width:384px;flex:0 0 384px;border-left:1px solid var(--line);background:var(--surf);display:flex;flex-direction:column;min-height:0}
.aside.wide{width:492px;flex:0 0 492px}
.aside .ph{display:flex;align-items:center;gap:var(--s2);height:56px;padding:0 var(--s5);border-bottom:1px solid var(--line);flex:0 0 auto}
.aside .ph b{font-family:var(--f-head);font-size:14px;font-weight:600}
.aside .ph .r{margin-left:auto;display:flex;gap:4px}
.aside .pb2{padding:var(--s5);display:flex;flex-direction:column;gap:var(--s5);overflow-y:auto;min-height:0}
.aside.chat .pb2{padding:18px 18px 0;gap:0;flex:1}
.aside .cfoot{padding:0 18px 16px;flex:0 0 auto}
.aside .cfoot .comp{margin-top:0;padding-top:10px}
.aside .cfoot .compbox{padding:8px 8px 8px 11px;border-radius:var(--r3)}
.aside .cfoot .compbox input{font-size:13px}
.aside.chat .msg{margin-bottom:15px}
.aside.chat .msg .tx{max-width:82%;font-size:13px}
.aside.chat .msg .who{width:26px;height:26px;border-radius:var(--r1)}
.field{display:flex;align-items:center;gap:var(--s3);font-size:13px}
.field .lb{width:84px;flex:0 0 auto;color:var(--ter);font-size:12px}
.fields{display:flex;flex-direction:column;gap:12px;border-top:1px solid var(--line);padding-top:16px}
.divtop{border-top:1px solid var(--line);padding-top:16px}

/* hover peek: a collapsed sidebar overlays rather than pushes */
.pkgap{flex:0 0 auto;pointer-events:none;align-self:stretch}
.app.pkrail>.rail,.app.pklist>.listcol{position:absolute;top:0;bottom:0;z-index:16;box-shadow:var(--peekShadow),1px 0 0 var(--line2)}
.app.pkrail>.rail{left:0}
.app.pklist>.listcol{left:var(--railw,72px)}
.pkin>.rail,.pkin>.listcol{animation:pkslide .17s var(--pop)}
@keyframes pkslide{from{opacity:.4;transform:translateX(-12px)}to{opacity:1;transform:none}}
@keyframes asideIn{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:none}}
.aside.asin{animation:asideIn .26s cubic-bezier(.32,.72,0,1) both}
/* ═══════════════════════════ buttons ═══════════════════════════ */
.btn{flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;gap:6px;font-family:var(--f-body);font-size:13px;font-weight:600;
  line-height:1;letter-spacing:-.005em;border-radius:var(--r2);height:32px;padding:0 13px;border:1px solid transparent;white-space:nowrap;cursor:pointer;
  transition:background var(--tr),border-color var(--tr),color var(--tr),box-shadow var(--tr)}
.btn:active{transform:translateY(.5px)}
.btn.p{background:var(--brandFill);color:var(--brandOn);box-shadow:var(--e1)}
.btn.p:hover{background:var(--brandFillHov)}
.btn.p:active{box-shadow:none}
.btn.s{background:var(--surf);color:var(--ink2);border-color:var(--line2)}
.btn.s:hover{background:var(--sunk);color:var(--ink)}
.btn.q{background:transparent;color:var(--sec);padding:0 10px}
.btn.q:hover{background:var(--sunk);color:var(--ink2)}
.btn.t{background:transparent;color:var(--brandInk);padding:0 9px}
.btn.t:hover{background:var(--tint2)}
.btn.d{background:var(--danger);color:var(--dangerOn)}
.btn.d:hover{filter:brightness(1.06)}
.btn.sm{font-size:12px;height:28px;padding:0 11px;gap:5px}
.btn.ico{padding:0;width:32px}
.btn.sm.ico{width:28px}
.btn.lg{height:36px;padding:0 16px;font-size:13.5px}
.btn.dis,.btn[aria-disabled="true"]{background:var(--sunk);color:var(--ter);border-color:transparent;cursor:not-allowed;box-shadow:none}
.btn.dis:active{transform:none}
.btn .dot{width:7px;height:7px;border-radius:50%;background:var(--brand)}
.btn.p .dot{background:var(--brandOn)}
.btn.full{flex:1;justify-content:center}
.link{display:inline-flex;align-items:center;gap:4px;font-size:12px;font-weight:600;color:var(--brandInk);cursor:pointer}
.link:hover{text-decoration:underline}
.link.quiet{font-weight:500;color:var(--ter)}

/* ═══════════════════════════ generic ═══════════════════════════ */
.card{background:var(--surf);border:1px solid var(--line);border-radius:var(--r4)}
.card.flat{border:0;border-radius:0;background:transparent}
.card>.row+.row,.card>.task+.task,.card>.flag+.flag,.card>.trow+.trow,.card>.setuprow+.setuprow{border-top:1px solid var(--hair)}
.empty{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:40px 24px}
.empty>.ico{width:44px;height:44px;border-radius:var(--r4);background:var(--sunk);display:flex;align-items:center;justify-content:center;color:var(--ter);margin-bottom:var(--s4)}
.empty h2{font-family:var(--f-head);font-size:19px;font-weight:600;letter-spacing:-.01em;margin-bottom:var(--s2)}
.empty p{font-size:13.5px;color:var(--sec);line-height:1.65;max-width:420px}
.empty .a{margin-top:var(--s5);display:flex;gap:var(--s2);flex-wrap:wrap;justify-content:center}
.pnlempty{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:22px 18px}
.pnlempty>.ico{width:32px;height:32px;border-radius:var(--r3);background:var(--sunk);display:flex;align-items:center;justify-content:center;color:var(--ter);margin-bottom:9px}
.pnlempty p{font-size:12.5px;color:var(--sec);line-height:1.55;max-width:220px}
.sbe{padding-top:2px;font-size:12.5px;color:var(--ter);line-height:1.6}
.pnl .sbe{padding:var(--s4) 0 var(--s2)}
.notice{display:flex;align-items:center;gap:10px;border-radius:var(--r3);padding:11px 13px;font-size:13px;line-height:1.5;flex-wrap:wrap;border:1px solid transparent}
.notice>span:not(.act){flex:1 1 220px;min-width:0}
.notice .act{margin-left:auto;display:flex;align-items:center;gap:var(--s1)}
.notice b{font-weight:600;color:var(--ink)}
.notice.warn{background:var(--warnTint);color:var(--ink2)} .notice.warn>.ic{color:var(--warnInk)}
.notice.ok{background:var(--okTint);color:var(--ink2)} .notice.ok>.ic{color:var(--okInk)}
.notice.dg{background:var(--dangerTint);color:var(--ink2)} .notice.dg>.ic{color:var(--dangerInk)}
.notice.info{background:var(--infoTint);color:var(--ink2)} .notice.info>.ic{color:var(--info)}
.notice.quiet{background:transparent;padding:0;gap:var(--s2);font-size:12.5px;color:var(--sec)}
.notice.quiet>.ic{color:var(--ter)}
.kbd{flex:0 0 auto;font-size:11px;font-weight:700;background:var(--sunk);border:1px solid var(--line);border-radius:var(--r1);padding:2px 6px;color:var(--ink2);display:inline-block;line-height:1.4}
.keycap{font-size:12.5px;font-weight:600;background:var(--sunk);border:1px solid var(--line);border-radius:var(--r1);padding:4px 10px;color:var(--ink2);display:inline-block}
/* the one micro-label */
.ghd{display:flex;align-items:center;gap:var(--s2);font-size:11px;font-weight:600;letter-spacing:.07em;text-transform:uppercase;color:var(--ter);margin:0 0 var(--s3)}
.ghd .n{color:var(--ter);font-weight:500;letter-spacing:0;text-transform:none;font-size:12px}
.ghd .go{margin-left:auto;font-size:11.5px;font-weight:600;letter-spacing:0;text-transform:none;color:var(--brandInk);cursor:pointer;display:inline-flex;align-items:center;gap:3px}
.ghd .go:hover{text-decoration:underline}
.meter{display:flex;align-items:center;gap:3px;height:26px;overflow:hidden;min-width:0}
.meter i{width:3px;flex:0 0 auto;border-radius:2px;background:var(--brand);transition:height .12s}
.meter.idle i{background:var(--meterOff);opacity:.8}
.meter.live i{background:var(--danger);opacity:.8}
.tog{width:40px;height:22px;border-radius:var(--rF);background:var(--line2);position:relative;flex:0 0 auto;cursor:pointer;transition:background var(--tr);display:inline-block}
.tog.on{background:var(--brand)}
.tog i{position:absolute;top:2px;left:2px;width:18px;height:18px;border-radius:50%;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.18);transition:left var(--tr)}
.tog.on i{left:20px}
.tog.dis{opacity:.45;cursor:not-allowed}
.inp{border:1px solid var(--line2);border-radius:var(--r2);height:34px;padding:0 11px;font-size:13px;background:var(--surf);display:flex;align-items:center;gap:var(--s2);
  transition:border-color var(--tr),box-shadow var(--tr)}
.inp:focus-within{border-color:var(--brand);box-shadow:0 0 0 3px var(--ring)}
.inp input,.inp textarea{width:100%;min-width:0}
.inp input::placeholder,.inp textarea::placeholder,.inp .ph{color:var(--ter)}
.inp .ic{color:var(--ter)}
.inp.area{height:auto;min-height:70px;align-items:flex-start;padding:9px 11px}
.inp.area textarea{resize:none;min-height:50px;line-height:1.5}
.inp.err{border-color:var(--danger)} .inp.err:focus-within{box-shadow:0 0 0 3px var(--dangerLine)}
.sel{border:1px solid var(--line2);border-radius:var(--r2);height:32px;padding:0 10px;font-size:12.5px;background:var(--surf);display:inline-flex;align-items:center;
  gap:var(--s2);cursor:pointer;white-space:nowrap;color:var(--ink2);transition:border-color var(--tr),background var(--tr)}
.sel:hover{background:var(--sunk)}
.sel .ic{color:var(--ter)}
.cbx{width:17px;height:17px;border-radius:var(--r1);border:1.5px solid var(--line2);flex:0 0 auto;display:flex;align-items:center;justify-content:center;background:var(--surf);
  cursor:pointer;color:transparent;transition:background var(--tr),border-color var(--tr)}
.cbx:hover{border-color:var(--brand)}
.cbx.on{background:var(--brand);border-color:var(--brand);color:var(--brandOn)}
.rdo{width:17px;height:17px;border-radius:50%;border:1.5px solid var(--line2);flex:0 0 auto;cursor:pointer;display:inline-block;background:var(--surf)}
.rdo.on{border:5px solid var(--brand)}
.chk{display:flex;align-items:center;gap:var(--s2);font-size:12.5px;color:var(--sec);cursor:pointer;padding:3px 6px;border-radius:var(--r1);transition:color var(--tr)}
.chk:hover{color:var(--ink2)}
/* priority — only "high" earns a colour */
.pri{display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:600;border-radius:var(--r1);padding:1px 6px;letter-spacing:.01em;background:transparent;color:var(--ter);line-height:1.5}
.pri.hi{background:var(--dangerTint);color:var(--dangerInk)}
.pri.ok{color:var(--okInk)}
/* tag — a quiet attribute on a table cell or a label */
.tag{display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:500;border-radius:var(--r1);padding:1px 6px;background:transparent;color:var(--ter)}
.tag.brand{background:var(--tint2);color:var(--brandInk)}
.tag.ok{background:var(--okTint);color:var(--okInk)}
.tag.box{background:var(--sunk);color:var(--sec)}
/* filter chips — 30px, hairline, the selected one is a tint */
.fchip{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 11px;font-size:12.5px;color:var(--sec);border:1px solid var(--line);border-radius:var(--r2);
  background:var(--surf);cursor:pointer;white-space:nowrap;transition:background var(--tr),color var(--tr),border-color var(--tr)}
.fchip:hover{background:var(--sunk);color:var(--ink2)}
.fchip.on{background:var(--tint);color:var(--brandInk);font-weight:600;border-color:transparent}
.fchip .b{font-size:11px;font-weight:600;color:var(--sec);background:var(--sunk);border-radius:var(--r1);padding:0 5px;line-height:1.6}
.fchip.on .b{background:var(--chipWell);color:var(--brandInk)}
.fchip .ic{color:var(--ter)} .fchip.on .ic{color:var(--brandInk)}
.chiprow{display:flex;align-items:center;gap:var(--s2);flex-wrap:wrap;flex:0 0 auto;margin:0 0 var(--s5)}
.chiprow .r{margin-left:auto;display:flex;align-items:center;gap:var(--s3)}
.hint{font-size:12.5px;color:var(--ter);line-height:1.5}
.dim{color:var(--sec)}
/* segmented control */
.seg{display:inline-flex;align-items:center;background:var(--sunk);border-radius:var(--r2);padding:2px;gap:2px;flex:0 0 auto}
.seg span{min-width:24px;height:22px;padding:0 6px;border-radius:calc(var(--r2) - 2px);display:flex;align-items:center;justify-content:center;gap:5px;color:var(--ter);
  cursor:pointer;font-size:12px;font-weight:500;transition:background var(--tr),color var(--tr),box-shadow var(--tr)}
.seg span:hover{color:var(--ink2)}
.seg span.on{background:var(--surf);color:var(--brandInk);box-shadow:var(--e1)}
.seg.lg span{height:26px;padding:0 10px;font-size:12.5px}

/* ═══════════════════════════ lists & rows ═══════════════════════════
   The heading does the grouping; rows are just rows, with a hover well that
   reaches 10px past the text column (margin:0 -10px). */
.list{display:flex;flex-direction:column;margin:0 -10px var(--s7)}
.list:last-child{margin-bottom:0}
.list>*{border-radius:0}
.list>*+*{border-top:1px solid var(--hair)}
.list>.trow+.trow{border-top:0}
.row{display:flex;align-items:center;gap:var(--s3);padding:11px 10px;cursor:pointer;transition:background var(--tr)}
.row:hover{background:var(--sunk)}
.row:active{background:var(--tint2)}
.row>span:first-child{flex:1;min-width:0}
.row .t:not(.btn){font-family:var(--f-head);font-size:14px;font-weight:600;display:block;line-height:1.35;letter-spacing:-.005em}
.row .t:not(.btn) .fdot{margin-left:var(--s2);vertical-align:1px}
.row .s:not(.btn){font-size:12px;color:var(--sec);display:block;margin-top:2px;line-height:1.4;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.row .rt{text-align:right;white-space:nowrap;flex:0 0 auto;min-width:104px}
.row .rt .tg{font-size:11.5px;font-weight:500;display:inline-flex;align-items:center;gap:5px;justify-content:flex-end;color:var(--sec)}
.row .rt .tg i{width:6px;height:6px;border-radius:50%;background:var(--cI);flex:0 0 auto}
.row .rt .mt{font-size:12px;color:var(--sec);display:block;margin-top:3px;font-variant-numeric:tabular-nums}
.row .rt .tg+.mt{display:block}
.row .acts,.flag .acts,.trow .acts{display:flex;gap:1px;flex:0 0 auto;opacity:0;pointer-events:none;transition:opacity var(--tr)}
.row:hover .acts,.row:focus-within .acts,.trow:hover .acts,.trow:focus-within .acts,.flag:hover .acts,.flag.on .acts{opacity:1;pointer-events:auto}
.acts span{width:28px;height:28px;border-radius:var(--r2);display:flex;align-items:center;justify-content:center;color:var(--ter);cursor:pointer;transition:background var(--tr),color var(--tr)}
.acts span:hover{background:var(--tint2);color:var(--brandInk)}
.acts span.dg:hover{background:var(--dangerTint);color:var(--dangerInk)}
.acts span.gd:hover{background:var(--okTint);color:var(--okInk)}
.livechip{display:inline-flex;align-items:center;gap:6px;font-size:11.5px;font-weight:700;color:var(--dangerOn);background:var(--danger);border-radius:var(--rF);padding:2px 8px}
.badge{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:500;color:var(--sec);background:var(--sunk);border-radius:var(--r1);padding:1px 7px}
.setuphd{display:flex;align-items:center;gap:var(--s2);padding:12px var(--s4) 10px}
.setuphd b{font-family:var(--f-head);font-size:14px;font-weight:600}
.setuphd .steps{font-size:11.5px;font-weight:500;color:var(--ter)}
.setuphd .x{margin-left:auto;color:var(--ter);cursor:pointer;width:26px;height:26px;border-radius:var(--r1);display:flex;align-items:center;justify-content:center}
.setuphd .x:hover{background:var(--sunk);color:var(--ink2)}
.setuprow{display:flex;align-items:center;gap:var(--s3);padding:11px var(--s4)}
.setuprow .si{width:30px;height:30px;border-radius:var(--r2);background:var(--sunk);color:var(--ter);display:flex;align-items:center;justify-content:center;flex:0 0 auto}
.setuprow .t:not(.btn){font-family:var(--f-head);font-size:13.5px;font-weight:600;display:block;line-height:1.4}
.setuprow .s:not(.btn){font-size:12.5px;color:var(--sec);display:block;margin-top:2px;line-height:1.5;max-width:560px}
.setuprow .a{margin-left:auto;flex:0 0 auto;padding-left:var(--s3)}
/* task row */
.task{display:flex;align-items:flex-start;gap:var(--s3);padding:10px;cursor:pointer;border-radius:var(--r2);transition:background var(--tr)}
.task:hover{background:var(--sunk)}
.task.on{background:var(--tint2)}
.task .cbx{margin-top:1px}
.task .t:not(.btn){font-size:13.5px;color:var(--ink);line-height:1.45;display:block}
.task.done .t:not(.btn){text-decoration:line-through;color:var(--ter)}
.task.done .cbx{opacity:.7}
.task .m{font-size:11.5px;color:var(--sec);margin-top:3px;display:flex;align-items:center;gap:var(--s2);flex-wrap:wrap}
.task .m .ic{color:var(--line2)}
.task .m .late{color:var(--dangerInk);font-weight:600}
.task .due{margin-left:auto;font-size:12px;color:var(--ter);flex:0 0 auto;white-space:nowrap;padding-top:1px}
.task .due.dg{color:var(--dangerInk);font-weight:600}
.task .due.wn{color:var(--warnInk);font-weight:600}
.task .kb2{opacity:0;width:26px;height:26px;border-radius:var(--r1);display:flex;align-items:center;justify-content:center;color:var(--ter);flex:0 0 auto;pointer-events:none;transition:opacity var(--tr),background var(--tr)}
.task:hover .kb2,.task:focus-within .kb2{opacity:1;pointer-events:auto}
.task .kb2:hover{background:var(--line);color:var(--ink2)}
.pnl .task{margin:0 -10px}
.pnl .task .pri{display:none}
/* text row — an editable line with hover actions */
.trow{display:flex;align-items:flex-start;gap:var(--s3);padding:10px;border-radius:var(--r2);transition:background var(--tr)}
.trow:hover{background:var(--sunk)}
.trow .tx{font-size:13.5px;color:var(--ink);line-height:1.5;display:block;outline:0}
.trow .tm{font-size:11.5px;color:var(--ter);margin-top:3px;display:block}
.trow .acts{margin-left:auto}
.metrics{display:flex;align-items:center;gap:var(--s5);font-size:12.5px;color:var(--ter);margin-top:var(--s5);padding:var(--s4) 2px 0;flex-wrap:wrap;border-top:1px solid var(--hair)}
.metrics b{color:var(--ink2);font-weight:600}
.toolrow{display:flex;align-items:center;gap:var(--s2);margin-bottom:var(--s4);flex-wrap:wrap;flex:0 0 auto;min-height:32px}
.toolrow .r{margin-left:auto;display:flex;align-items:center;gap:var(--s2)}
.addrow{display:flex;align-items:center;gap:var(--s2);border:1px solid transparent;background:var(--sunk);border-radius:var(--r2);height:38px;padding:0 var(--s3);
  margin-bottom:var(--s5);color:var(--ter);flex:0 0 auto;transition:background var(--tr),border-color var(--tr),box-shadow var(--tr)}
.addrow:focus-within{background:var(--surf);border-color:var(--brand);box-shadow:0 0 0 3px var(--ring)}
.addrow input{font-size:13.5px;width:100%;min-width:0}
.addrow input::placeholder{color:var(--ter)}
/* schedule row */
.sched{display:flex;flex-direction:column;margin:0 -10px}
.schedday{font-size:11px;font-weight:600;letter-spacing:.07em;text-transform:uppercase;color:var(--ter);padding:var(--s4) 10px var(--s1)}
.sched>.schedday:first-child{padding-top:0}
.srow2{display:flex;align-items:stretch;gap:var(--s3);padding:9px 10px;border-radius:var(--r2);cursor:pointer;transition:background var(--tr)}
.srow2:hover{background:var(--sunk)}
.srow2 .tmc{flex:0 0 auto;width:54px;font-size:12.5px;font-weight:600;color:var(--ink2);font-variant-numeric:tabular-nums;line-height:1.35;padding-top:1px}
.srow2 .tmc span{display:block;font-weight:500;font-size:11px;color:var(--ter)}
.srow2 .rule{width:3px;border-radius:2px;background:var(--cI);flex:0 0 auto;opacity:.9}
.srow2 .bd{flex:1;min-width:0;padding-top:1px}
.srow2 .t:not(.btn){font-family:var(--f-head);font-size:13.5px;font-weight:600;display:block;line-height:1.35;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.srow2 .s:not(.btn){font-size:11.5px;color:var(--sec);display:block;margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.srow2 .go{flex:0 0 auto;align-self:center;opacity:0;color:var(--ter);transition:opacity var(--tr)}
.srow2:hover .go{opacity:1}
/* tile row — an entry in a list of collections */
.tlist{display:flex;flex-direction:column;margin:0 -10px}
.tlist+.tlist{border-top:1px solid var(--hair)}
.trw{display:flex;align-items:center;gap:var(--s3);padding:10px;border-radius:var(--r2);cursor:pointer;transition:background var(--tr)}
.trw+.trw{border-top:1px solid var(--hair)}
.trw:hover{background:var(--sunk)}
.trw .well{width:32px;height:32px;border-radius:var(--r2)}
.trw .bd{flex:1 1 auto;min-width:0}
.trw .nm{font-family:var(--f-head);font-size:14px;font-weight:600;display:block;line-height:1.35;letter-spacing:-.008em}
.trw .s:not(.btn){font-size:11.5px;color:var(--sec);display:block;margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.trw .mt{flex:0 0 auto;display:flex;align-items:center;gap:7px;font-size:11.5px;color:var(--ter);white-space:nowrap}
.trw .mt b{font-weight:600;color:var(--ink2)}
.sp{width:3px;height:3px;border-radius:50%;background:var(--line2);flex:0 0 auto;display:inline-block}
.trw>.ic{color:var(--ter);flex:0 0 auto;opacity:.5}
.trw:hover>.ic{opacity:1;color:var(--ink2)}
/* person row */
.prow{display:flex;align-items:center;gap:var(--s2);padding:6px var(--s2);border-radius:var(--r2);transition:background var(--tr)}
.prow:hover{background:var(--sunk)}
.prow .av{width:26px;height:26px;border-radius:50%;flex:0 0 auto;display:flex;align-items:center;justify-content:center;font-size:10.5px;font-weight:700;color:#FFF}
.prow .nm{flex:1;min-width:0;font-size:13px;color:var(--ink2)}
.prow .nm span{display:block;font-size:11px;color:var(--ter);margin-top:1px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.prow .rm{width:24px;height:24px;border-radius:var(--r1);display:flex;align-items:center;justify-content:center;color:var(--ter);flex:0 0 auto;cursor:pointer;opacity:.45;transition:opacity .12s}
.prow:hover .rm{opacity:1}
.prow .rm:hover{background:var(--dangerTint);color:var(--dangerInk)}
.prow .me{font-size:11px;color:var(--ter);font-weight:600;flex:0 0 auto}

/* ═══════════════════════════ detail page ═══════════════════════════ */
.titlehd{margin-bottom:var(--s6)}
.titlehd h1{font-family:var(--f-head);font-size:28px;font-weight:600;letter-spacing:-.021em;line-height:1.18}
.titlehd h1 .edit,.pagehd h1 .edit{opacity:0;color:var(--sec);display:inline-flex;vertical-align:2px;margin-left:8px}
.titlehd:hover h1 .edit,.pagehd:hover h1 .edit{opacity:1}
.metarow{display:flex;align-items:center;gap:var(--s3);margin-top:13px;font-size:12.5px;color:var(--sec);flex-wrap:wrap}
.metarow .mi{display:inline-flex;align-items:center;gap:6px;white-space:nowrap}
.metarow .mi>b,.metarow .mi b{font-weight:600;color:var(--ink2)}
.metarow .mi>.ic{color:var(--ter);flex:0 0 auto}
.metarow .mi.people{gap:9px;cursor:pointer;border-radius:var(--r1);padding:3px 8px;margin-left:-8px;transition:background var(--tr)}
.metarow .mi.people:hover{background:var(--sunk)}
.metarow .idchip{display:inline-flex;align-items:center;gap:7px;border-radius:var(--r1);padding:3px 8px;font-size:12.5px;color:var(--sec);font-weight:500;cursor:pointer;transition:background var(--tr),color var(--tr)}
.metarow .idchip:hover{background:var(--sunk);color:var(--ink2)}
.metarow .idchip .fd{width:7px;height:7px;border-radius:2px;background:var(--cI);flex:0 0 auto}
.faces{display:flex;align-items:center}
.faces i{width:24px;height:24px;border-radius:50%;border:2px solid var(--surf);margin-left:-7px;font-style:normal;font-size:10.5px;font-weight:700;color:#FFFFFF;display:flex;align-items:center;justify-content:center}
.faces i:first-child{margin-left:0}
.faces i.more{background:var(--sunk)!important;color:var(--sec);font-size:10px}
.addp{display:inline-flex;align-items:center;gap:6px;border:1px dashed var(--line2);border-radius:var(--rF);padding:4px 11px 4px 9px;font-size:12.5px;color:var(--sec);cursor:pointer;font-weight:600}
.addp:hover{border-color:var(--brand);color:var(--brandInk);border-style:solid}
.livebar{display:flex;align-items:center;gap:var(--s3);background:var(--dangerTint);border-radius:var(--r3);padding:11px var(--s4)}
.livebar.pause{background:var(--warnTint)}
.livebar .rdot{width:10px;height:10px;border-radius:50%;background:var(--danger);flex:0 0 auto;box-shadow:0 0 0 4px var(--dangerLine);animation:pulse 1.6s infinite}
.livebar.pause .rdot{background:var(--warnInk);animation:none;box-shadow:0 0 0 4px var(--warnLine)}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
.livebar b{font-family:var(--f-head);font-size:13.5px;font-weight:600}
.livebar .t:not(.btn){font-size:14px;font-weight:600;color:var(--dangerInk);font-variant-numeric:tabular-nums;letter-spacing:.01em}
.livebar.pause .t:not(.btn){color:var(--warnInk)}
.livebar .s:not(.btn){font-size:12.5px;color:var(--sec);min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
.livebar .a{margin-left:auto;display:flex;gap:8px;flex:0 0 auto;align-items:center}
.tabs{display:flex;gap:var(--s6);border-bottom:1px solid var(--line);margin:0 0 var(--s5);flex:0 0 auto;overflow-x:auto;scrollbar-width:none}
.tabs::-webkit-scrollbar{display:none}
.tabs a{flex:0 0 auto;white-space:nowrap;display:flex;align-items:center;gap:7px;padding-bottom:10px;font-size:13.5px;font-weight:500;color:var(--sec);
  border-bottom:2px solid transparent;margin-bottom:-1px;cursor:pointer;transition:color var(--tr),border-color var(--tr)}
.tabs a .ic{color:var(--ter)}
.tabs a:hover{color:var(--ink)}
.tabs a.on{color:var(--ink);border-bottom-color:var(--brand);font-weight:600}
.tabs a.on .ic{color:var(--brandInk)}
.tabs a.off{color:var(--ter);cursor:not-allowed}
.tabs a .cnt{font-size:11px;font-weight:600;background:var(--sunk);color:var(--sec);border-radius:var(--r1);padding:1px 6px;line-height:1.55}
.tabs a.on .cnt{background:var(--tint);color:var(--brandInk)}
.tabs a.off .cnt{background:transparent;color:var(--ter);font-weight:500;padding:0}
.tabs a .cnt.hot{background:var(--dangerTint);color:var(--dangerInk)}
.actbar{display:flex;align-items:center;gap:var(--s2) var(--s3);flex-wrap:wrap;margin:0 0 var(--s5);flex:0 0 auto;min-height:30px}
.actbar .l{display:flex;align-items:center;gap:6px;flex-wrap:wrap;min-width:0;font-size:12px;color:var(--ter);line-height:1.5}
.actbar .l>.ic{color:var(--ter)}
.actbar .r{margin-left:auto;display:flex;align-items:center;gap:var(--s1);flex-wrap:wrap;justify-content:flex-end}
/* sections on a detail page are headings, not field labels */
.sec{margin-bottom:var(--s6)}
.sec:last-child{margin-bottom:0}
.sec h3{font-family:var(--f-head);font-size:18px;font-weight:600;letter-spacing:-.014em;color:var(--ink);margin-bottom:var(--s4);line-height:1.25;display:flex;align-items:baseline;gap:9px}
.sec h3 .n{font-size:11px;font-weight:600;color:var(--sec);background:var(--sunk);border-radius:var(--rF);padding:2px 8px;line-height:1.5;align-self:center}
.sec h3 .go{margin-left:auto;align-self:center;font-size:11.5px;font-weight:600;color:var(--brandInk);cursor:pointer;display:inline-flex;align-items:center;gap:4px}
.sec+.sec{border-top:1px solid var(--line);padding-top:var(--s7);margin-top:var(--s2)}
.sec p{font-size:14.5px;line-height:1.7;color:var(--ink2);max-width:66ch;overflow-wrap:break-word}
.sec p+p{margin-top:12px}
.sec .list{margin-bottom:0}
.records{list-style:none;display:flex;flex-direction:column;margin:0 -10px}
.records li{display:flex;gap:11px;font-size:13.5px;line-height:1.6;color:var(--ink2);padding:9px 10px;transition:background var(--tr)}
.records li+li{border-top:1px solid var(--hair)}
.records li:hover{background:var(--sunk)}
.records li>span:first-child{flex:1 1 auto;min-width:0}
.jump,.from{font-size:11.5px;color:var(--ter);white-space:nowrap;margin-left:auto;flex:0 0 auto;font-weight:500;cursor:pointer;font-variant-numeric:tabular-nums;align-self:center;transition:color var(--tr)}
.from{font-weight:600}
.jump:hover,.from:hover{color:var(--brandInk)}
.secmore{display:flex;align-items:center;gap:5px;font-size:12px;font-weight:600;color:var(--brandInk);cursor:pointer;padding:9px 10px;margin:0 -10px;border-radius:var(--r2);transition:background var(--tr)}
.secmore:hover{background:var(--sunk)}
.secmore .ic{transition:transform var(--tr)}
.secmore.open .ic{transform:rotate(180deg)}
.notebox{border:1px solid var(--line);border-radius:var(--r4);padding:var(--s4) var(--s5);min-height:150px;transition:border-color var(--tr),box-shadow var(--tr)}
.notebox:focus-within{border-color:var(--brand);box-shadow:0 0 0 3px var(--ring)}
.notebox .ln{font-size:14px;line-height:1.75;color:var(--ink2);outline:0;min-height:80px}
.trs{display:flex;gap:var(--s4);padding:10px var(--s3);border-radius:var(--r2);border-left:2px solid transparent}
.trs.hl{border-left-color:var(--tint)}
.trs.said{border-left-color:var(--okLine)}
.trs.said .spk{color:var(--okInk)}
.trs.said .badge{background:var(--okTint);color:var(--okInk)}
.trs .tm{font-size:11.5px;color:var(--ter);font-variant-numeric:tabular-nums;width:40px;flex:0 0 auto;padding-top:3px;cursor:pointer}
.trs .tm:hover{color:var(--brandInk)}
.trs .spk{font-family:var(--f-head);font-size:12.5px;font-weight:600;display:block;margin-bottom:2px;color:var(--ink)}
.trs .tx{font-size:13.5px;line-height:1.65;color:var(--ink2)}
.trs .tx mark{background:var(--tint);color:var(--brandInk);border-radius:3px}
.trs .badge{margin-top:6px}
.player{display:flex;align-items:center;gap:var(--s3);background:var(--sunk);border-radius:var(--r3);padding:9px var(--s3);margin-top:var(--s4);flex:0 0 auto}
.player .pb{width:32px;height:32px;border-radius:50%;background:var(--brandFill);color:var(--brandOn);display:flex;align-items:center;justify-content:center;flex:0 0 auto;cursor:pointer;transition:background var(--tr)}
.player .pb:hover{background:var(--brandFillHov)}
.player .tm{font-size:12px;color:var(--sec);font-variant-numeric:tabular-nums;flex:0 0 auto}
.scrub{flex:1 1 0;min-width:0;overflow:hidden;height:24px;display:flex;align-items:center;gap:2px;cursor:pointer}
.scrub i{width:3px;flex:0 0 auto;border-radius:2px;background:var(--meterOff);opacity:.7}
.scrub i.p{background:var(--brand);opacity:1}
.quote{border-left:2px solid var(--line2);padding:2px 0 2px var(--s3);font-size:13px;line-height:1.65;color:var(--ink2);font-style:italic}
.pagehd{display:flex;align-items:flex-start;gap:var(--s3);margin-bottom:var(--s6);flex-wrap:wrap}
.pagehd>.well{width:36px;height:36px;border-radius:var(--r3);margin-top:2px}
.pagehd>.well.plain{background:var(--sunk);color:var(--sec)}
.pagehd .ft{min-width:0;flex:1}
.pagehd h1{font-family:var(--f-head);font-size:26px;font-weight:600;letter-spacing:-.02em;display:flex;align-items:center;gap:var(--s2);flex-wrap:wrap;line-height:1.2}
.pagehd .metarow{margin-top:8px}
.pagehd .fa{margin-left:auto;display:flex;gap:var(--s1);flex:0 0 auto;padding-left:var(--s4)}
.lead{font-size:14.5px;line-height:1.7;color:var(--ink2);max-width:72ch}
.lead+.lead{margin-top:12px}
.brief{margin:var(--s5) 0 var(--s7)}
.brief h4.lead-h{font-family:var(--f-head);font-size:18px;font-weight:600;letter-spacing:-.014em;color:var(--ink);margin-bottom:var(--s4);line-height:1.25}
.bgrid{display:flex;flex-direction:column;gap:var(--s6);margin-top:var(--s5);padding-top:var(--s5);border-top:1px solid var(--hair)}
.bsec h4{font-size:12.5px;font-weight:600;letter-spacing:-.002em;color:var(--sec);margin-bottom:var(--s3)}
.blist{list-style:none;display:flex;flex-direction:column;gap:10px}
.blist li{display:flex;gap:9px;font-size:12.5px;line-height:1.55;color:var(--ink2)}
.blist li>i{width:5px;height:5px;border-radius:50%;flex:0 0 auto;margin-top:7px;background:var(--line2);font-style:normal}
.blist.bad li>i{background:var(--warn)}
.blist.fix li>i{background:var(--ok)}
.blist.who li>i.av{width:22px;height:22px;margin-top:0;color:#FFFFFF;display:flex;align-items:center;justify-content:center;font-size:9.5px;font-weight:700}
.blist.who li>span{color:var(--sec);font-size:12px;line-height:1.5}
.blist.who li>span b{display:block;font-size:12.5px;font-weight:600;color:var(--ink);margin-bottom:2px}
.dcols{display:grid;grid-template-columns:minmax(0,3fr) minmax(0,2fr);gap:var(--s7);align-items:start}
.dcols .dmain{min-width:0}
.dcols .dside{display:flex;flex-direction:column;gap:var(--s5);min-width:0}
.scrollcol{flex:1;display:flex;flex-direction:column;overflow-y:auto;overflow-x:hidden;padding:0 10px;margin:0 -10px;min-height:0}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:var(--s7)}
.g2.pnls{gap:var(--s4)}
.wrapflex{display:flex;gap:var(--s4);flex-wrap:wrap}

/* ═══════════════════════════ capture ═══════════════════════════ */
.holdbtn{display:flex;align-items:center;gap:var(--s2);background:var(--brandFill);color:var(--brandOn);border-radius:var(--r3);padding:11px var(--s4);
  font-size:13.5px;font-weight:600;flex:0 0 auto;cursor:pointer;user-select:none;box-shadow:var(--e1);transition:background var(--tr)}
.holdbtn:hover{filter:brightness(1.08)}
.holdbtn.live{background:var(--danger);color:var(--dangerOn);filter:none}
.holdbtn .kb{font-size:11.5px;font-weight:600;background:var(--onChip);border-radius:var(--r1);padding:2px 6px;color:var(--brandOn)}
.statusline{display:flex;align-items:center;gap:var(--s2);font-size:12.5px;font-weight:500;color:var(--ink);flex-wrap:wrap}
.statusline .d{width:8px;height:8px;border-radius:50%;flex:0 0 auto}
.capsub{font-size:12.5px;color:var(--ter);margin-top:3px}
.capture{padding:var(--s5);margin-bottom:var(--s6);background:var(--rail);border-color:transparent}
.caphead{display:flex;align-items:center;gap:var(--s5);flex-wrap:wrap}
.capstat{display:flex;flex-direction:column;gap:1px;min-width:0}
.captime{margin-left:auto;font-size:15px;font-weight:600;color:var(--dangerInk);font-variant-numeric:tabular-nums}
.capmeter{margin-top:var(--s4);background:var(--sunk);border-radius:var(--r3);padding:var(--s3) var(--s4) 13px}
.capmeter.live{padding:13px var(--s4)}
.capmeter .meter{height:22px}
.cmhead{display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--s2)}

/* ═══════════════════════════ conversation ═══════════════════════════ */
.chips{display:flex;gap:var(--s2);flex-wrap:wrap;justify-content:center;margin-top:var(--s6);max-width:600px}
.chip{display:flex;align-items:center;gap:7px;border:1px solid var(--line);background:var(--surf);border-radius:var(--rF);height:32px;padding:0 14px;font-size:13px;color:var(--ink2);
  cursor:pointer;transition:background var(--tr),border-color var(--tr),color var(--tr)}
.chip .ic{color:var(--ter)}
.chip:hover{background:var(--sunk);color:var(--ink)}
.chip:hover .ic{color:var(--brandInk)}
.chip.off{background:transparent;border-style:dashed;color:var(--ter);cursor:not-allowed}
.scope{font-size:12px;color:var(--ter);margin-top:var(--s5)}
.comp{margin-top:auto;padding-top:var(--s4);flex:0 0 auto}
.compbox{display:flex;align-items:center;gap:var(--s3);border:1px solid var(--line2);background:var(--surf);border-radius:var(--r4);padding:9px 10px 9px var(--s3);
  transition:border-color var(--tr),box-shadow var(--tr)}
.compbox:focus-within{border-color:var(--brand);box-shadow:0 0 0 3px var(--ring)}
.compbox.off{background:var(--sunk);border-color:var(--line)}
.compbox input{flex:1;font-size:13.5px;min-width:0}
.compbox input::placeholder{color:var(--ter)}
.compbox>.ic,.compbox>span>.ic{color:var(--ter)}
.compbox .cic{display:flex;cursor:pointer}
.sendb{width:30px;height:30px;border-radius:var(--r2);background:var(--brandFill);display:flex;align-items:center;justify-content:center;flex:0 0 auto;cursor:pointer;transition:background var(--tr)}
.sendb .ic{color:var(--brandOn)!important}
.sendb:hover{background:var(--brandFillHov)}
.sendb.off{background:var(--sunk);cursor:not-allowed}
.sendb.off .ic{color:var(--ter)!important}
.compbox.dock{cursor:pointer;gap:12px}
.compbox.dock .ph{flex:1;font-size:13.5px;color:var(--ter);min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.compbox.dock:hover{border-color:var(--brand)}
.compbox.dock>.ic{color:var(--brandInk)}
.body.docked{padding-bottom:0}
.comp.stick{position:sticky;bottom:0;z-index:6;margin-top:var(--s6);padding:var(--s7) 0 var(--bp);background:linear-gradient(to bottom,transparent,var(--surf) 62%,var(--surf))}
.msg{display:flex;gap:var(--s2);margin-bottom:var(--s5);align-items:flex-end}
.msg.u{flex-direction:row-reverse}
.msg .who{width:28px;height:28px;border-radius:var(--r2);flex:0 0 auto;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600}
.msg.u .who{background:var(--tint);color:var(--brandInk)}
.msg.a .who{background:var(--ink);color:var(--surf)}
.msg .tx{font-size:13.5px;line-height:1.65;color:var(--ink2);padding:10px var(--s4);border-radius:var(--r4);max-width:min(76%,620px)}
.msg.a .tx{background:var(--sunk);border-bottom-left-radius:var(--r1)}
.msg.u .tx{background:var(--tint);color:var(--ink);border-bottom-right-radius:var(--r1)}
.msg .tx b{color:var(--ink)}
.msg.a .tx.typing{padding:13px 16px}
.src{display:inline-flex;align-items:center;gap:5px;margin-top:var(--s2);font-size:11.5px;color:var(--sec);border:1px solid var(--line);border-radius:var(--rF);padding:3px 10px;cursor:pointer;
  transition:background var(--tr),color var(--tr),border-color var(--tr)}
.src:hover{background:var(--tint2);color:var(--brandInk);border-color:transparent}
.typing i{display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--sec);margin-right:4px;animation:bl 1.1s infinite}
.typing i:nth-child(2){animation-delay:.18s}.typing i:nth-child(3){animation-delay:.36s}
@keyframes bl{0%,80%,100%{opacity:.25}40%{opacity:1}}
.cempty{font-size:13px;color:var(--sec);line-height:1.6}
.prompts{display:flex;flex-direction:column;gap:8px;margin-top:14px}
.prompts span{border:1px solid var(--line);border-radius:var(--r2);padding:9px 12px;font-size:12.5px;color:var(--ink2);cursor:pointer;display:flex;align-items:center;gap:9px;background:var(--surf);transition:border-color var(--tr),color var(--tr)}
.prompts span:hover{border-color:var(--brand);color:var(--brandInk)}
.prompts span .ic{color:var(--sec)}
.prompts span:hover .ic{color:var(--brandInk)}
/* ═══════════════════════════ section panel ═══════════════════════════
   A hairline, a radius and a header strip — for unlike sections that sit
   beside each other, where a gap alone would read as alignment. */
.pnl{border:1px solid var(--line);border-radius:var(--r4);background:var(--surf);display:flex;flex-direction:column;min-width:0;overflow:hidden}
.pnl>.ph{display:flex;align-items:center;gap:var(--s2);padding:12px var(--s4);border-bottom:1px solid var(--hair);flex:0 0 auto;min-height:47px}
.pnl>.ph .t:not(.btn){font-family:var(--f-head);font-size:15px;font-weight:600;letter-spacing:-.01em;color:var(--ink);white-space:nowrap}
.pnl>.ph .n{font-size:11px;font-weight:600;color:var(--sec);background:var(--sunk);border-radius:var(--rF);padding:2px 8px;line-height:1.5;white-space:nowrap}
.pnl>.ph .go{margin-left:auto;flex:0 0 auto;display:flex;align-items:center;gap:var(--s3)}
.pnl>.ph .go>span.lk{font-size:11.5px;font-weight:600;color:var(--brandInk);cursor:pointer;display:inline-flex;align-items:center;gap:4px;white-space:nowrap}
.pnl>.ph .go>span.lk:hover{text-decoration:underline}
.pnl>.pb{padding:var(--s3) var(--s4) var(--s4);min-width:0}
.pnl>.pb.rows{padding:var(--s2) var(--s4) var(--s3)}
.pnl .statrow{margin-bottom:0}
.pnl .list,.pnl .sched{margin-bottom:0}
.pnl .hbar:last-child{margin-bottom:0}

/* ═══════════════════════════ identity tiles ═══════════════════════════ */
.well{display:flex;align-items:center;justify-content:center;flex:0 0 auto;background:var(--cT);color:var(--cI);border-radius:var(--r3)}
.well.plain{background:var(--sunk);color:var(--ter)}
.tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(236px,1fr));gap:var(--s3);margin-bottom:var(--s8)}
.tile{border:1px solid var(--line);border-radius:var(--r4);padding:var(--s4);cursor:pointer;background:var(--surf);display:flex;flex-direction:column;gap:var(--s3);min-height:132px;
  transition:border-color var(--tr),box-shadow var(--tr),transform var(--tr)}
.tile:hover{border-color:var(--line2);box-shadow:var(--e2);transform:translateY(-1px)}
.tile .top{display:flex;align-items:center;gap:var(--s3)}
.tile .well{width:36px;height:36px}
.tile .nm{font-family:var(--f-head);font-size:14.5px;font-weight:600;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;letter-spacing:-.01em}
.tile .fm,.tile-sm .fm{width:26px;height:26px;border-radius:var(--r1);display:flex;align-items:center;justify-content:center;color:var(--ter);flex:0 0 auto;opacity:0;pointer-events:none;transition:opacity var(--tr),background var(--tr)}
.tile:hover .fm,.tile-sm:hover .fm,.tile:focus-within .fm{opacity:1;pointer-events:auto}
.tile .fm:hover,.tile-sm .fm:hover{background:var(--sunk);color:var(--ink2)}
.tile .subs{display:flex;gap:5px;flex-wrap:wrap}
.tile .subs span{font-size:11px;font-weight:500;color:var(--sec);background:var(--sunk);border-radius:var(--r1);padding:2px 7px;line-height:1.5;white-space:nowrap}
.tile .subs span.plain{background:transparent;padding:2px 0;color:var(--ter)}
.tile .ds{font-size:12.5px;color:var(--sec);line-height:1.55;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.tile .mt{font-size:11.5px;color:var(--ter);display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-top:auto}
.tile .mt b{color:var(--ink2);font-weight:600}
.tile.add{border-style:dashed;align-items:center;justify-content:center;text-align:center;color:var(--ter);background:transparent;gap:var(--s2)}
.tile.add:hover{color:var(--brandInk);border-color:var(--brand);background:var(--tint2);box-shadow:none;transform:none}
.tile.add .nm{flex:0 0 auto;font-family:var(--f-body);font-size:12.5px;font-weight:500;white-space:normal}
.tiles-sm{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:var(--s3)}
.tile-sm{border:1px solid var(--line);border-radius:var(--r3);padding:var(--s3) var(--s3) 11px;cursor:pointer;background:var(--surf);display:flex;flex-direction:column;gap:9px;min-width:0;
  transition:border-color var(--tr),box-shadow var(--tr),transform var(--tr)}
.tile-sm:hover{border-color:var(--line2);box-shadow:var(--e2);transform:translateY(-1px)}
.tile-sm .top{display:flex;align-items:center;justify-content:space-between}
.tile-sm .well{width:30px;height:30px}
.tile-sm .fm{width:22px;height:22px}
.tile-sm .nm{font-family:var(--f-head);font-size:13px;font-weight:600;letter-spacing:-.006em;line-height:1.3;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile-sm .mt{font-size:11px;color:var(--ter);display:flex;align-items:center;gap:5px;flex-wrap:wrap}
.tile-sm .mt b{color:var(--ink2);font-weight:600}
.homegrid{display:grid;grid-template-columns:minmax(0,1fr) 400px;gap:var(--s5);align-items:start}
.homecol{display:flex;flex-direction:column;gap:var(--s5);min-width:0}

/* ═══════════════════════════ data display ═══════════════════════════ */
.table{width:100%;border-collapse:collapse}
.table th{text-align:left;font-size:11px;font-weight:600;letter-spacing:.07em;text-transform:uppercase;color:var(--ter);padding:0 var(--s3) var(--s2);border-bottom:1px solid var(--line)}
.table td{padding:12px var(--s3);border-bottom:1px solid var(--hair);font-size:13.5px;color:var(--ink2)}
.table tr:last-child td{border-bottom:0}
.table tbody tr:hover td{background:var(--sunk)}
.table td:first-child,.table th:first-child{padding-left:2px}
.table td.tm{font-weight:600;color:var(--ink)}
.table td.num,.table th.num{text-align:right;font-variant-numeric:tabular-nums}
.table .kb2{width:26px;height:26px;border-radius:var(--r1);display:inline-flex;align-items:center;justify-content:center;color:var(--ter);cursor:pointer}
.table .kb2:hover{background:var(--dangerTint);color:var(--dangerInk)}
.stat{flex:1;min-width:0}
.stat .lb{font-size:12px;color:var(--ter)}
.stat .big{font-family:var(--f-head);font-size:29px;font-weight:600;letter-spacing:-.025em;margin-top:var(--s1);line-height:1.05;font-variant-numeric:tabular-nums}
.stat .dl{font-size:12px;color:var(--sec);margin-top:var(--s2);display:flex;align-items:center;gap:5px;line-height:1.45}
.stat .dl .ic{color:var(--cI,var(--ter));flex:0 0 auto}
.statrow{display:flex;gap:var(--s7);margin-bottom:var(--s8);flex-wrap:wrap}
.statrow>.stat+.stat{border-left:1px solid var(--hair);padding-left:var(--s7)}
.chartwrap{padding-left:38px}
.chart{display:flex;align-items:flex-end;gap:var(--s2);height:132px;position:relative;padding-top:var(--s2)}
.chart .col{flex:1;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;height:100%;position:relative;cursor:default}
.chart .bar{width:100%;max-width:26px;background:var(--cI);opacity:.55;border-radius:var(--r1) var(--r1) 0 0;transition:height .3s,opacity var(--tr)}
.chart .col:hover .bar{opacity:1}
.chart .bar.mute{background:var(--meterOff);opacity:.5}
.chart .col:hover .ttip,.chart .ttip.pin{opacity:1}
.gridl{position:absolute;left:0;right:0;border-top:1px solid var(--hair);font-size:11px;color:var(--ter)}
.gridl span{position:absolute;left:-32px;top:-8px;font-variant-numeric:tabular-nums}
.xax{display:flex;gap:var(--s2);margin-top:var(--s2);border-top:1px solid var(--line);padding-top:var(--s2)}
.xax span{flex:1;text-align:center;font-size:11px;color:var(--ter)}
.hbar{display:flex;align-items:center;gap:var(--s3);padding:6px 0}
.hbar .lb{width:104px;flex:0 0 auto;font-size:12.5px;color:var(--ink2)}
.hbar .tr{flex:1;height:8px;background:var(--sunk);border-radius:var(--rF);overflow:hidden}
.hbar .tr i{display:block;height:8px;background:var(--cI);opacity:.62;border-radius:var(--rF);transition:width .3s}
.hbar:hover .tr i{opacity:1}
.hbar .vv{width:34px;text-align:right;font-size:12px;color:var(--ter);flex:0 0 auto;font-variant-numeric:tabular-nums}
.ttip{position:absolute;background:var(--ink);color:var(--surf);font-size:11px;padding:5px var(--s2);border-radius:var(--r1);white-space:nowrap;z-index:3;opacity:0;transition:opacity var(--tr);pointer-events:none}
.ttip b{display:block;font-size:12px;font-weight:600}
.opt{display:flex;gap:var(--s3);border:1px solid var(--line);border-radius:var(--r3);padding:13px var(--s4);flex:1;cursor:pointer;transition:border-color var(--tr),background var(--tr)}
.opt:hover{background:var(--sunk)}
.opt.on{border-color:var(--brand);background:var(--tint2)}
.opt .rdo,.opt .cbx{margin-top:1px}
.opt .t:not(.btn){font-family:var(--f-head);font-size:13.5px;font-weight:600;display:block}
.opt .s:not(.btn){font-size:12.5px;color:var(--sec);display:block;margin-top:4px;line-height:1.55}
.opt ul{list-style:none;margin-top:var(--s2);display:flex;flex-direction:column;gap:var(--s1)}
.opt li{display:flex;gap:6px;font-size:12px;color:var(--sec);align-items:flex-start;line-height:1.45}
.opt li .ic{margin-top:1px}
.step{display:flex;gap:var(--s3);padding:13px 0}
.step+.step{border-top:1px solid var(--hair)}
.step .num{width:22px;height:22px;border-radius:50%;background:var(--sunk);color:var(--sec);font-size:11.5px;font-weight:600;display:flex;align-items:center;justify-content:center;flex:0 0 auto;margin-top:1px}
.step .num.done{background:var(--okTint);color:var(--okInk)}
.step .num.wait{background:transparent;color:var(--ter);box-shadow:inset 0 0 0 1px var(--line)}
.step .t:not(.btn){font-family:var(--f-head);font-size:13.5px;font-weight:600;display:block;line-height:1.4}
.step .s:not(.btn){font-size:12.5px;color:var(--sec);display:block;margin-top:3px;line-height:1.55;max-width:560px}
.step .a{margin-left:auto;flex:0 0 auto;display:flex;align-items:center;gap:var(--s2);padding-left:var(--s4)}
.tips{display:flex;flex-direction:column;gap:var(--s2);padding:var(--s3) 0 0}
.tips div{display:flex;gap:var(--s2);font-size:12.5px;color:var(--sec);line-height:1.5}
.tips div .ic{flex:0 0 auto;margin-top:2px}

/* ═══════════════════════════ flags ═══════════════════════════
   Severity is the only signal that varies, so every flag surface reads its
   colours off one .f-* class: --fc accent, --fcT tint, --fcL line, --fcI ink. */
.flagchip{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:600;border-radius:var(--r1);padding:2px 7px;letter-spacing:.01em;background:var(--fcT);color:var(--fcI);white-space:nowrap;flex:0 0 auto;line-height:1.55}
.flagchip.plain{background:var(--sunk);color:var(--ter)}
.flagchip.brand{background:var(--tint);color:var(--brandInk)}
.fdot{display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:600;border-radius:var(--rF);padding:0 7px 0 5px;background:var(--fcT);color:var(--fcI);line-height:1.7;vertical-align:1px}
.fstat{display:inline-flex;align-items:center;gap:5px;font-size:11.5px;font-weight:500;color:var(--sec)}
.fstat b{font-weight:600;color:var(--ink2)}
.fstat i{width:5px;height:5px;border-radius:50%;background:var(--fc);font-style:normal;flex:0 0 auto}
.flag{display:flex;align-items:flex-start;gap:var(--s3);padding:13px 10px;cursor:pointer;position:relative;flex-wrap:wrap;border-radius:var(--r2);transition:background var(--tr)}
.flag:hover{background:var(--sunk)}
.flag.on{background:var(--tint2)}
.flag .fi{width:26px;height:26px;border-radius:var(--r1);background:var(--fcT);color:var(--fcI);display:flex;align-items:center;justify-content:center;flex:0 0 auto;margin-top:1px}
.flag .fmain{flex:1 1 190px;min-width:0}
.flag .ft{font-family:var(--f-head);font-size:13.5px;font-weight:600;line-height:1.45;color:var(--ink);display:block}
.flag .fs{font-size:12.5px;color:var(--sec);line-height:1.55;margin-top:4px;display:block;overflow-wrap:break-word}
.flag .fs b{color:var(--ink2);font-weight:600}
.flag .fm2{display:flex;align-items:center;gap:6px;margin-top:6px;font-size:11.5px;color:var(--sec);flex-wrap:wrap}
.flag .fm2 .ic{color:var(--line2)}
.flag .fm2>span{display:inline-flex;align-items:center;gap:5px}
.flag .fr{flex:0 0 auto;display:flex;flex-direction:column;align-items:flex-end;gap:var(--s2);margin-left:auto}
.flag .fr .age{font-size:11.5px;color:var(--sec);white-space:nowrap;line-height:1.3}
.flag.done{opacity:.62}
.flag.done .fi{background:var(--sunk);color:var(--ter)}
.flag.done .ft{color:var(--ink2)}
.compare{display:grid;grid-template-columns:1fr 1fr;border:1px solid var(--line);border-radius:var(--r3);overflow:hidden;background:var(--surf)}
.compare>div{padding:13px var(--s4);min-width:0}
.compare>div+div{border-left:1px solid var(--hair);background:var(--sunk)}
.compare .hd{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:600;letter-spacing:.07em;text-transform:uppercase;color:var(--sec);margin-bottom:var(--s2)}
.compare .q{font-size:13px;line-height:1.65;color:var(--ink2);font-style:italic;overflow-wrap:break-word}
.compare .who{display:flex;align-items:center;gap:6px;margin-top:var(--s2);font-size:11.5px;color:var(--sec);flex-wrap:wrap}
.compare .who b{font-weight:600;color:var(--ink2);font-size:12px}
.compare .lk{font-size:11.5px;font-weight:600;color:var(--brandInk);cursor:pointer;display:inline-flex;align-items:center;gap:4px;margin-top:var(--s2)}
.compare .lk:hover{text-decoration:underline}
.relation{display:flex;align-items:center;gap:var(--s2);padding:var(--s2) 2px;font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--ter)}
.relation:before,.relation:after{content:'';height:1px;background:var(--hair);flex:1}
.quotebox{border-radius:var(--r3);padding:13px var(--s4);background:var(--sunk)}
.quotebox .hd{display:flex;align-items:center;gap:7px;font-size:11px;font-weight:600;letter-spacing:.07em;text-transform:uppercase;color:var(--ter);margin-bottom:var(--s2)}
.quotebox p{font-size:13px;line-height:1.65;color:var(--ink2);font-style:italic}
.quotebox .a{display:flex;gap:var(--s2);margin-top:var(--s3);flex-wrap:wrap}
.band{border:1px solid var(--line);border-radius:var(--r4);background:var(--surf);margin-bottom:var(--s7);flex:0 0 auto;overflow:hidden}
.band .bh{display:flex;align-items:center;gap:var(--s3);padding:13px var(--s4);border-bottom:1px solid var(--hair);flex-wrap:wrap}
.band .bh .bi{width:28px;height:28px;border-radius:var(--r1);background:var(--sunk);color:var(--ter);display:flex;align-items:center;justify-content:center;flex:0 0 auto}
.band.hot .bh .bi{background:var(--fcrTint);color:var(--fcrInk)}
.band .bh b{font-family:var(--f-head);font-size:13.5px;font-weight:600}
.band .bh .s:not(.btn){font-size:12px;color:var(--ter);display:block;margin-top:1px}
.band .bh .r{margin-left:auto;display:flex;align-items:center;gap:var(--s3);flex-wrap:wrap}
.band .flag{border-radius:0;padding-left:var(--s4);padding-right:var(--s4)}
.band .flag+.flag{border-top:1px solid var(--hair)}
.band .bf{padding:10px var(--s4);border-top:1px solid var(--hair);font-size:12px;color:var(--ter);display:flex;align-items:center;gap:var(--s3);flex-wrap:wrap}
.foot2{display:flex;align-items:center;gap:var(--s2);font-size:12px;color:var(--ter);padding:var(--s4) 2px 2px;flex-wrap:wrap;line-height:1.5}

/* ═══════════════════════════ overlays ═══════════════════════════ */
.scrim{position:absolute;inset:0;background:var(--scrim);z-index:20}
.scrim.clear{background:transparent}
.modal{position:absolute;z-index:21;left:50%;top:50%;transform:translate(-50%,-50%);background:var(--surf);border-radius:var(--r5);box-shadow:var(--e3);
  max-width:calc(100% - 28px);max-height:calc(100% - 28px);overflow:hidden;display:flex;animation:mdin .18s var(--pop)}
.modal.col{flex-direction:column}
@keyframes mdin{from{opacity:0;transform:translate(-50%,-48%) scale(.985)}}
.modal.static{position:relative;left:auto;top:auto;transform:none;animation:none;max-width:100%;max-height:none}
.mnav{width:220px;flex:0 0 auto;background:var(--rail);border-right:1px solid var(--line);padding:var(--s5) var(--s2);display:flex;flex-direction:column;gap:1px;overflow-y:auto}
.mnav h3{font-family:var(--f-head);font-size:15px;font-weight:600;padding:0 10px var(--s4)}
.mnav .gl{font-size:11px;font-weight:600;letter-spacing:.07em;text-transform:uppercase;color:var(--ter);padding:var(--s4) 10px 5px}
.mnav a{display:flex;align-items:center;gap:10px;height:32px;padding:0 10px;border-radius:var(--r2);color:var(--ink2);font-size:13px;cursor:pointer;flex:0 0 auto;transition:background var(--tr),color var(--tr)}
.mnav a:hover{background:var(--sunk)}
.mnav a.on{background:var(--tint);color:var(--brandInk);font-weight:600}
.mnav a .ic{color:var(--ter)}
.mnav a.on .ic{color:var(--brandInk)}
.mbody{flex:1;display:flex;flex-direction:column;min-width:0}
.mtop{display:flex;align-items:flex-start;gap:var(--s3);padding:var(--s5) var(--s6) var(--s4);border-bottom:1px solid var(--line)}
.mtop h2{font-family:var(--f-head);font-size:17px;font-weight:600;letter-spacing:-.01em}
.mtop p{font-size:12.5px;color:var(--sec);margin-top:3px;line-height:1.5}
.mtop .mi{width:32px;height:32px;border-radius:var(--r2);background:var(--sunk);color:var(--sec);display:flex;align-items:center;justify-content:center;flex:0 0 auto;margin-top:2px}
.mtop .mi.dg{background:var(--dangerTint);color:var(--dangerInk)}
.mtop .mi.info{background:var(--infoTint);color:var(--info)}
.mtop .x{margin-left:auto;width:30px;height:30px;border-radius:var(--r2);display:flex;align-items:center;justify-content:center;color:var(--ter);flex:0 0 auto;cursor:pointer;transition:background var(--tr),color var(--tr)}
.mtop .x:hover{background:var(--sunk);color:var(--ink2)}
.mcont{flex:1;padding:var(--s5) var(--s6) var(--s7);display:flex;flex-direction:column;gap:var(--s7);overflow-y:auto}
.mcont.tight{gap:14px;padding:var(--s5) var(--s6) var(--s6)}
.mcont .body-tx{font-size:13.5px;line-height:1.6;color:var(--ink2)}
.mfoot{display:flex;gap:9px}
.sgroup{flex:0 0 auto}
.sghd{display:flex;align-items:baseline;gap:var(--s2);padding:0 0 var(--s2);border-bottom:1px solid var(--line)}
.sghd>span{display:flex;align-items:baseline;gap:6px;flex-wrap:wrap;min-width:0}
.sghd b{font-size:11px;font-weight:600;letter-spacing:.07em;text-transform:uppercase;color:var(--ter);white-space:nowrap}
.sghd>span>span{font-size:12px;color:var(--ter)}
.sghd>span>span:before{content:'· '}
.srow{display:flex;align-items:center;gap:var(--s4);padding:14px 0}
.srow+.srow{border-top:1px solid var(--hair)}
.srow .t:not(.btn){font-size:13.5px;font-weight:600;display:block;font-family:var(--f-head);line-height:1.4}
.srow .s:not(.btn){font-size:12.5px;color:var(--sec);display:block;margin-top:3px;line-height:1.55;max-width:560px}
.srow .a{margin-left:auto;flex:0 0 auto;display:flex;align-items:center;gap:var(--s2);padding-left:var(--s4)}
.menu{position:absolute;z-index:22;background:var(--surf);border:1px solid var(--line);border-radius:var(--r3);box-shadow:var(--e2);padding:var(--s1);min-width:210px;
  max-width:calc(100% - 24px);overflow-y:auto;animation:mnin .12s ease-out}
.menu.static{position:relative;animation:none}
@keyframes mnin{from{opacity:0;transform:translateY(-4px)}}
.menu a{display:flex;align-items:center;gap:10px;height:32px;padding:0 var(--s2);border-radius:var(--r1);font-size:13px;color:var(--ink2);cursor:pointer;transition:background var(--tr),color var(--tr)}
.menu a:hover,.menu a.hov{background:var(--sunk)}
.menu a .ic{color:var(--ter)}
.menu a.dg,.menu a.dg .ic{color:var(--dangerInk)}
.menu a.dg:hover{background:var(--dangerTint)}
.menu a .k{margin-left:auto;font-size:11px;color:var(--ter);font-variant-numeric:tabular-nums}
.menu a.nrow{height:auto;align-items:flex-start;padding:8px var(--s2)}
.menu a.nrow .ic{margin-top:1px}
.menu a.nrow .bd{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
.menu a.nrow .bd .t:not(.btn){font-size:12.5px;line-height:1.4;color:var(--ink2)}
.menu a.nrow .bd .d{font-size:11.5px;color:var(--sec)}
.menu a.nrow+a.nrow{border-top:1px solid var(--hair)}
.menu hr{border:0;border-top:1px solid var(--hair);margin:var(--s1) var(--s2)}
.menu .mh{font-size:11px;font-weight:600;letter-spacing:.07em;text-transform:uppercase;color:var(--ter);padding:var(--s2) var(--s2) var(--s1)}
.menu .fn{font-size:11.5px;color:var(--ter);padding:2px var(--s2) var(--s2);line-height:1.5}
.toasts{position:absolute;left:50%;bottom:24px;transform:translateX(-50%);z-index:40;display:flex;flex-direction:column;gap:var(--s2);align-items:center;pointer-events:none}
.toast{display:flex;align-items:center;justify-content:center;gap:var(--s2);background:var(--ink);color:var(--surf);font-size:12.5px;padding:9px var(--s4);border-radius:var(--r2);
  box-shadow:var(--e2);animation:tin .2s;max-width:480px;line-height:1.45}
.toast b{font-weight:600}
.toast.ok .ic{color:#6FDCA6} .toast.warn .ic{color:#F7CD82} .toast.dg .ic{color:#FFA79B} .toast.info .ic{color:#A8C8F8}
@keyframes tin{from{opacity:0;transform:translateY(6px)}}
.notifs{position:absolute;right:16px;top:70px;z-index:41;display:flex;flex-direction:column;gap:var(--s2);align-items:flex-end;width:336px}
.notif{width:100%;background:var(--surf);border:1px solid var(--line);border-radius:var(--r4);box-shadow:var(--e2);padding:12px 13px;display:flex;gap:var(--s3);animation:osin .26s var(--pop)}
@keyframes osin{from{opacity:0;transform:translateX(22px)}}
.notif .ai{width:32px;height:32px;border-radius:var(--r2);background:var(--brandFill);color:var(--brandOn);display:flex;align-items:center;justify-content:center;flex:0 0 auto}
.notif.dg .ai{background:var(--danger);color:var(--dangerOn)}
.notif.ok .ai{background:var(--ok);color:#FFF}
.notif .bd{flex:1;min-width:0}
.notif .ap{font-size:10.5px;font-weight:600;letter-spacing:.07em;text-transform:uppercase;color:var(--ter);display:flex;align-items:center;gap:6px}
.notif .ap .w{margin-left:auto;font-weight:500;letter-spacing:0;text-transform:none;font-size:11px}
.notif .ti{display:block;font-family:var(--f-head);font-size:13.5px;font-weight:600;margin-top:4px;line-height:1.35}
.notif .bo{display:block;font-size:12.5px;color:var(--sec);line-height:1.45;margin-top:3px}
.notif .ac{display:flex;gap:7px;margin-top:10px;flex-wrap:wrap}
.notif .x{width:24px;height:24px;border-radius:var(--r1);display:flex;align-items:center;justify-content:center;color:var(--ter);flex:0 0 auto;cursor:pointer}
.notif .x:hover{background:var(--sunk);color:var(--ink2)}
/* the one tooltip */
.tip{position:fixed;z-index:200;pointer-events:none;max-width:250px;background:var(--ink);color:var(--surf);font-size:11.5px;font-weight:500;line-height:1.45;padding:5px 10px;
  border-radius:var(--r2);text-align:center;box-shadow:0 8px 22px rgba(0,0,0,.22);opacity:0;transform:translateY(3px);transition:opacity .12s,transform .12s;left:0;top:0;visibility:hidden}
.tip.on{opacity:1;transform:none;visibility:visible}
.tip.static{position:relative;opacity:1;transform:none;visibility:visible;display:inline-block}

/* theme cards */
.thgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:var(--s3)}
.thcard{border:1px solid var(--line);border-radius:var(--r4);padding:var(--s3);cursor:pointer;background:var(--surf);display:flex;flex-direction:column;gap:var(--s2);position:relative;transition:border-color var(--tr),box-shadow var(--tr)}
.thcard:hover{border-color:var(--line2)}
.thcard.on{border-color:var(--brand);box-shadow:0 0 0 3px var(--ring)}
.thcard .prev{height:48px;border-radius:var(--r2);overflow:hidden;display:flex;box-shadow:inset 0 0 0 1px rgba(128,128,128,.18)}
.thcard .prev i{flex:1}
.thcard .prev i.a{flex:0 0 22%}
.thcard .prev i.b{flex:0 0 14%}
.thcard .nm{font-family:var(--f-head);font-size:13.5px;font-weight:600;display:flex;align-items:center;gap:7px}
.thcard .nm .tick{margin-left:auto;width:18px;height:18px;border-radius:50%;background:var(--brand);color:var(--brandOn);display:none;align-items:center;justify-content:center}
.thcard.on .nm .tick{display:flex}
.thcard .ds{font-size:11.5px;color:var(--sec);line-height:1.45;flex:1}
.thcard .dots{display:flex;gap:5px;align-items:center}
.thcard .dots i{width:15px;height:15px;border-radius:50%;box-shadow:inset 0 0 0 1px rgba(128,128,128,.38)}
.thcard .modes{margin-left:auto;font-size:10.5px;color:var(--ter);font-weight:600;letter-spacing:.04em}

/* ═══════════════════════════ floating control ═══════════════════════════
   One object, three shapes: an idle 60px core with a hover tray, a short
   capsule while capturing, a pill while live. Dark in every theme. */
.fab{position:absolute;z-index:18;width:max-content;user-select:none}
.fab.static{position:relative}
.fab.idle{width:60px;height:60px}
.fab-home{position:absolute;bottom:0;right:0;display:flex;align-items:center;border-radius:var(--rF);background:transparent;
  transition:background .2s,box-shadow .2s,padding .22s var(--pop)}
.fab.idle:hover .fab-home,.fab.idle.open .fab-home{background:var(--pill);box-shadow:var(--pillShadow);padding-left:15px}
.fab-opts{display:flex;align-items:center;gap:9px;width:0;opacity:0;pointer-events:none;overflow:visible;transition:width .24s var(--pop),margin .24s var(--pop),opacity .16s}
.fab.idle:hover .fab-opts,.fab.idle.open .fab-opts{width:132px;margin-right:9px;opacity:1;pointer-events:auto}
.hopt{width:38px;height:38px;border-radius:50%;background:var(--pillWell);color:var(--pillInk);display:flex;align-items:center;justify-content:center;flex:0 0 auto;cursor:pointer;transition:background .13s,transform .11s}
.hopt:hover{background:rgba(255,255,255,.20);transform:translateY(-1px)}
.fab-core{width:60px;height:60px;border-radius:50%;background:var(--brandFill);color:var(--brandOn);display:flex;align-items:center;justify-content:center;flex:0 0 auto;
  box-shadow:0 10px 26px rgba(0,0,0,.26),0 0 0 1px rgba(0,0,0,.06);cursor:grab;transition:background .16s,box-shadow .2s}
.fab-core:hover{background:var(--brandFillHov)}
.fab.idle:hover .fab-core,.fab.idle.open .fab-core{box-shadow:0 0 0 1px rgba(0,0,0,.10)}
.pill{display:flex;align-items:center;gap:9px;height:52px;padding:0 9px 0 8px;border-radius:var(--rF);background:var(--pill);color:var(--pillInk);box-shadow:var(--pillShadow);cursor:grab;position:relative;
  animation:pgrow .22s var(--pop)}
@keyframes pgrow{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:none}}
.pill .pmark{width:36px;height:36px;border-radius:50%;background:var(--pillWell);display:flex;align-items:center;justify-content:center;flex:0 0 auto}
.pill .pdiv{width:1px;height:22px;background:var(--pillLine);flex:0 0 auto}
.pill .pstat{display:flex;align-items:center;gap:8px;flex:0 0 auto;padding-left:1px}
.pill .rdot{width:9px;height:9px;border-radius:50%;background:var(--danger);flex:0 0 auto;animation:pdot 1.7s ease-in-out infinite}
@keyframes pdot{0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(217,45,32,.55)}55%{opacity:.55;box-shadow:0 0 0 5px rgba(217,45,32,0)}}
.pill .pstat b{font-size:15px;font-weight:600;letter-spacing:.01em;font-variant-numeric:tabular-nums}
.pill .plabel{font-size:13px;font-weight:600;white-space:nowrap}
.pill .psub{font-size:12px;color:var(--pillSec);white-space:nowrap}
.fab.paused .pill .rdot{background:var(--warn);animation:none}
.fab.paused .pill .pstat b{color:var(--pillSec)}
.pmeter{display:flex;align-items:center;gap:2.5px;height:20px;flex:0 0 auto}
.pmeter i{width:2.5px;border-radius:2px;background:var(--pillInk);opacity:.5;transition:height .14s linear}
.pmeter.live i{background:#4ADE80;opacity:.95}
.pbtn{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--pillInk);background:var(--pillWell);flex:0 0 auto;cursor:pointer;position:relative;transition:background .13s,transform .11s}
.pbtn:hover{background:rgba(255,255,255,.19);transform:translateY(-1px)}
.pbtn.stop{background:var(--danger);color:#fff}
.pbtn.stop:hover{filter:brightness(1.1)}
.pbtn.on{background:var(--pillInk);color:var(--pill)}
.pbtn .b{position:absolute;top:-3px;right:-3px;min-width:18px;height:18px;border-radius:var(--rF);padding:0 5px;font-style:normal;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;
  background:var(--warn);color:#241500;border:2px solid var(--pill)}
.pbtn .b.hot{background:var(--danger);color:#fff}
.fab.alert .pill{box-shadow:var(--pillShadow),0 0 0 1.5px var(--danger),0 0 0 7px var(--dangerTint);animation:phalo 2.4s ease-in-out infinite}
@keyframes phalo{0%,100%{box-shadow:var(--pillShadow),0 0 0 1.5px var(--danger),0 0 0 5px var(--dangerTint)}50%{box-shadow:var(--pillShadow),0 0 0 1.5px var(--danger),0 0 0 10px var(--dangerTint)}}
.pill .pbar{width:104px;height:4px;border-radius:2px;background:var(--pillWell);overflow:hidden;flex:0 0 auto}
.pill .pbar i{display:block;height:100%;border-radius:2px;background:#4ADE80;animation:pfill 3.1s linear infinite}
@keyframes pfill{from{width:6%}to{width:100%}}
.pop{width:326px}
.pop .pcard{background:var(--surf);border:1px solid var(--line);border-radius:var(--r4);box-shadow:var(--shadow);overflow:hidden}
.pop .ph2{display:flex;align-items:center;gap:9px;padding:12px 14px 0}
.pop .ph2 .age{margin-left:auto;font-size:11.5px;color:var(--ter);white-space:nowrap}
.pop .ptx{padding:10px 15px 0;font-size:13.5px;line-height:1.55;color:var(--ink)}
.pop .psy{padding:9px 15px 0;font-size:12.5px;line-height:1.55;color:var(--sec)}
.pop .psy b{color:var(--ink2);font-weight:600}
.pop .pfoot{display:flex;gap:7px;padding:13px 14px 14px;flex-wrap:wrap}
.pop .pfoot .btn{flex:1 1 auto;justify-content:center}
.pop .more{border-top:1px solid var(--line);padding:10px 15px;font-size:12.5px;font-weight:600;color:var(--brandInk);cursor:pointer;display:flex;align-items:center;gap:7px}
.pop .more:hover{background:var(--sunk)}
.pop .more .n{margin-left:auto;color:var(--ter);font-weight:500}
.plist .pl{display:flex;align-items:flex-start;gap:10px;padding:11px 14px;cursor:pointer;border-left:3px solid var(--fc);background:var(--fcT)}
.plist .pl+.pl{border-top:1px solid var(--surf)}
.plist .pl .fi{width:22px;height:22px;border-radius:var(--r1);background:var(--surf);color:var(--fcI);display:flex;align-items:center;justify-content:center;flex:0 0 auto;margin-top:1px}
.plist .pl .l1{font-size:12.5px;font-weight:600;color:var(--fcI);display:block}
.plist .pl .l2{font-size:12px;color:var(--ink2);display:block;margin-top:3px;line-height:1.45}
.plist .pl .age{font-size:11px;color:var(--sec);white-space:nowrap;flex:0 0 auto;margin-top:2px}
.hidden{display:none!important}
/* ═══════════════════════════ responsive — window width classes ═══════════════════════════
   Widths are measured on the WINDOW, not the viewport: w3 < 1320 · w2 < 1080 · w1 < 840.
   The list column auto-collapses under 1180 and the rail under 960. */
.win.w3 .body{--bp:22px}
.win.w3 .aside{width:340px;flex-basis:340px}
.win.w3 .tabs{gap:var(--s5)}
.win.w3 .aside.wide{position:absolute;right:0;top:0;bottom:0;width:min(430px,86%);flex-basis:auto;z-index:15;box-shadow:var(--shadow)}
.win.w2 .body{--bp:18px}
.win.w2 .g2,.win.w2 .dcols,.win.w2 .homegrid{grid-template-columns:minmax(0,1fr);gap:var(--s6)}
.win.w2 .topbar{gap:10px;padding:0 12px 0 16px}
.win.w2 .topbar .state{display:none}
.win.w2 .mnav{width:60px;padding:14px 8px;align-items:center}
.win.w2 .mnav h3,.win.w2 .mnav .gl,.win.w2 .mnav .lbl{display:none}
.win.w2 .mnav a{justify-content:center;width:40px;height:40px;padding:0}
.win.w2 .chart{height:112px}
.win.w2 .stat .big{font-size:23px}
.win.w2 .metrics{gap:var(--s4)}
.win.w2 .statrow{gap:var(--s5)}
.win.w2 .statrow>.stat+.stat{padding-left:var(--s5)}
.win.w2 .aside,.win.w2 .aside.wide{position:absolute;right:0;top:0;bottom:0;width:min(370px,90%);flex-basis:auto;z-index:15;box-shadow:var(--shadow2)}
.win.w2 .compare{grid-template-columns:1fr}
.win.w2 .compare>div+div{border-left:0;border-top:1px solid var(--line2)}
.win.w2 .tiles{grid-template-columns:repeat(auto-fill,minmax(200px,1fr))}
.win.w2 .actbar .r{margin-left:0}
.win.w1 .mnav{display:none}
.win.w1 .body{--bp:14px}
.win.w1 .topbar h1{font-size:17px}
.win.w1 .tabs{gap:var(--s4)}
.win.w1 .tabs a{font-size:13px}
.win.w1 .titlehd h1{font-size:21px}
.win.w1 .pagehd h1{font-size:20px}
.win.w1 .stat .big{font-size:22px}
.win.w1 .statrow{flex-direction:column;gap:var(--s5)}
.win.w1 .statrow>.stat+.stat{border-left:0;padding-left:0;border-top:1px solid var(--hair);padding-top:var(--s5)}
.win.w1 .toolrow .r{margin-left:0}
.win.w1 .setuprow,.win.w1 .step,.win.w1 .srow{flex-wrap:wrap}
.win.w1 .setuprow .a,.win.w1 .step .a,.win.w1 .srow .a{margin-left:0;padding-left:47px}
.win.w1 .row{flex-wrap:wrap;gap:var(--s1) var(--s2);padding:12px 10px}
.win.w1 .row>span:first-child{flex:1 1 100%}
.win.w1 .row .acts{display:none}
.win.w1 .row .rt{text-align:left;min-width:0;display:flex;align-items:baseline;gap:var(--s2);flex-wrap:wrap}
.win.w1 .row .rt .mt{margin:0}
.win.w1 .player{gap:var(--s2);padding:8px 10px}
.win.w1 .meter{display:none}
.win.w1 .task{flex-wrap:wrap}
.win.w1 .task .due{margin-left:0;padding-left:29px;flex-basis:100%}
.win.w1 .livebar{flex-wrap:wrap}
.win.w1 .livebar .a{margin-left:0;width:100%}
.win.w1 .modal{border-radius:var(--r4)}
.win.w1 .tiles{grid-template-columns:1fr}
.win.w1 .tile{min-height:0}
.win.w1 .trw .mt{display:none}
.win.w1 .tiles-sm{grid-template-columns:repeat(auto-fill,minmax(130px,1fr))}
.win.w1 .pill{height:46px;gap:7px}
.win.w1 .pill .pmark{display:none}
.win.w1 .pill .pbtn{width:32px;height:32px}
.win.w1 .aside,.win.w1 .aside.wide{width:92%}

/* ═══════════════════════════ glue ═══════════════════════════ */
.pkgap{display:none}
.app.pkrail>.pkgap.pr{display:block;flex:0 0 72px}
.app.pklist>.pkgap.pl{display:block;flex:0 0 56px}
/* the app window: .win on the root element, plus .w3/.w2/.w1 by measured width */
.win{position:relative;overflow:hidden;background:var(--surf)}
.win>.shell{height:100%}
.list>*,.scrollcol>*,.pane>*,.sched>*,.tlist>*,.records>*{flex:0 0 auto}
.pane>.scrollcol,.pane>.notebox{flex:1 1 auto;min-height:0}
.fab .pop{position:absolute;right:0;bottom:100%;padding-bottom:14px;transform-origin:88% 100%;animation:wpin .17s var(--pop)}
.fab .pop:after,.pop.tail:after{content:'';position:absolute;right:25px;bottom:9px;width:12px;height:12px;background:var(--surf);border-right:1px solid var(--line2);border-bottom:1px solid var(--line2);transform:rotate(45deg);border-bottom-right-radius:3px}
@keyframes wpin{from{opacity:0;transform:translateY(8px) scale(.95)}to{opacity:1;transform:none}}
.menu a .k .ic{color:var(--brandInk)}
.aside .ph .fi2{width:26px;height:26px;border-radius:var(--r1);background:var(--fcT);color:var(--fcI);display:flex;align-items:center;justify-content:center;flex:0 0 auto}
```

## Appendix C — Icon set

Path data for every glyph (16 × 16 viewBox, render with the `ic()` helper in §7).

```js
const P={
cal:'<rect x="2.2" y="3.4" width="11.6" height="10.4" rx="2.2"/><path d="M2.2 6.6h11.6M5.5 2v2.6M10.5 2v2.6"/>',
mic:'<rect x="5.9" y="1.7" width="4.2" height="7.6" rx="2.1"/><path d="M3.4 7.6a4.6 4.6 0 0 0 9.2 0"/><path d="M8 12.2v2.1"/>',
checkc:'<circle cx="8" cy="8" r="6.2"/><path d="M5.3 8.2l1.9 1.9 3.6-4.2"/>',
spark:'<path d="M6.6 2.2l1.3 3.4 3.4 1.3-3.4 1.3-1.3 3.4-1.3-3.4L1.9 6.9l3.4-1.3z"/><path d="M12 9.6l.6 1.6 1.6.6-1.6.6-.6 1.6-.6-1.6-1.6-.6 1.6-.6z"/>',
wave:'<path d="M2 6.6v2.8M4.6 4.4v7.2M7.2 2.4v11.2M9.8 5v6M12.4 3.4v9.2"/>',
panelL:'<rect x="1.8" y="2.6" width="12.4" height="10.8" rx="2"/><path d="M6.2 2.6v10.8"/><path d="M9.1 6.4L11.3 8l-2.2 1.6z" fill="currentColor" stroke="none"/>',
panelR:'<rect x="1.8" y="2.6" width="12.4" height="10.8" rx="2"/><path d="M9.8 2.6v10.8"/><path d="M6.9 6.4L4.7 8l2.2 1.6z" fill="currentColor" stroke="none"/>',
people:'<circle cx="6.2" cy="5.6" r="2.5"/><path d="M1.9 13.4a4.35 4.35 0 0 1 8.6 0"/><path d="M11 3.5a2.5 2.5 0 0 1 0 4.9"/><path d="M12.1 13.4a3.6 3.6 0 0 0-1.4-2.7"/>',
wave2:'<path d="M2 8h1.1l1.3-4.2L6.2 12l1.7-7.6L9.5 10l1.1-2h1.4"/>',
clipb:'<rect x="5.1" y="1.7" width="5.8" height="2.8" rx="1.2"/><path d="M5.1 3.1H4.4a1.6 1.6 0 0 0-1.6 1.6v7.9A1.6 1.6 0 0 0 4.4 14.2h7.2a1.6 1.6 0 0 0 1.6-1.6V4.7a1.6 1.6 0 0 0-1.6-1.6h-.7"/><path d="M5.9 7.7h4.2M5.9 10.3h2.8"/>',
gear:'<circle cx="8" cy="8" r="2.4"/><path d="M8 1.6l.9 1.7 1.9-.3.5 1.9 1.8.7-.8 1.7.8 1.7-1.8.7-.5 1.9-1.9-.3L8 14.4l-.9-1.7-1.9.3-.5-1.9-1.8-.7.8-1.7-.8-1.7 1.8-.7.5-1.9 1.9.3z"/>',
help:'<circle cx="8" cy="8" r="6.3"/><path d="M6.3 6.3a1.8 1.8 0 1 1 2.4 1.7c-.5.2-.7.6-.7 1.1v.4"/><circle cx="8" cy="11.7" r=".55" fill="currentColor" stroke="none"/>',
kbd:'<rect x="1.4" y="4" width="13.2" height="8" rx="1.8"/><path d="M4 6.6h.01M6.4 6.6h.01M8.8 6.6h.01M11.2 6.6h.01M4.6 9.4h6.8"/>',
bell:'<path d="M4.2 7a3.8 3.8 0 0 1 7.6 0c0 3 1 4.2 1 4.2H3.2S4.2 10 4.2 7z"/><path d="M6.6 13.2a1.6 1.6 0 0 0 2.8 0"/>',
search:'<circle cx="7.2" cy="7.2" r="4.4"/><path d="M10.6 10.6L14 14"/>',
plus:'<path d="M8 3.4v9.2M3.4 8h9.2"/>',
home:'<path d="M2.4 7.2L8 2.6l5.6 4.6v6a1 1 0 0 1-1 1H3.4a1 1 0 0 1-1-1z"/>',
clock:'<circle cx="8" cy="8" r="6"/><path d="M8 4.6V8l2.4 1.6"/>',
folder:'<path d="M1.9 5.1a1.6 1.6 0 0 1 1.6-1.6h2.3l1.3 1.6h4.4a1.6 1.6 0 0 1 1.6 1.6v4.8a1.6 1.6 0 0 1-1.6 1.6H3.5a1.6 1.6 0 0 1-1.6-1.6z"/>',
folderplus:'<path d="M1.9 5.1a1.6 1.6 0 0 1 1.6-1.6h2.3l1.3 1.6h4.4a1.6 1.6 0 0 1 1.6 1.6v4.8a1.6 1.6 0 0 1-1.6 1.6H3.5a1.6 1.6 0 0 1-1.6-1.6z"/><path d="M8 7.6v3.2M6.4 9.2h3.2"/>',
users:'<path d="M11 14.5a4 4 0 0 0-8 0"/><circle cx="7" cy="6.5" r="2.6"/><path d="M12.4 9.6a3.2 3.2 0 0 0 0-6.2"/><path d="M13.6 14.5a3.4 3.4 0 0 0-1.6-2.9"/>',
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
reset:'<path d="M2.6 8a5.4 5.4 0 1 1 1.6 3.8"/><path d="M2.2 12.4V8.4h4"/>',
minus:'<path d="M3.4 8h9.2"/>',
expand:'<path d="M3.2 3.2h5.6L3.2 8.8z" fill="currentColor" stroke="none"/><path d="M12.8 12.8H7.2l5.6-5.6z" fill="currentColor" stroke="none"/>',
md:'<rect x="1.6" y="3.4" width="12.8" height="9.2" rx="1.8"/><path d="M4.2 10.4V5.6l2 2.4 2-2.4v4.8M11 5.6v4.8M9.4 8.8L11 10.4l1.6-1.6"/>',
userplus:'<circle cx="6.4" cy="5.6" r="2.7"/><path d="M1.9 13.6a4.5 4.5 0 0 1 9 0"/><path d="M12.6 5.2v4M14.6 7.2h-4"/>',
briefcase:'<rect x="1.9" y="4.9" width="12.2" height="8.6" rx="1.9"/><path d="M5.6 4.9V3.6a1.3 1.3 0 0 1 1.3-1.3h2.2a1.3 1.3 0 0 1 1.3 1.3v1.3"/><path d="M1.9 8.4h12.2"/>',
layers:'<path d="M8 1.9l6.1 3.1L8 8.1 1.9 5z"/><path d="M2.4 8.2L8 11l5.6-2.8"/><path d="M2.4 11.1L8 13.9l5.6-2.8"/>',
grid:'<rect x="2.1" y="2.1" width="5" height="5" rx="1.4"/><rect x="8.9" y="2.1" width="5" height="5" rx="1.4"/><rect x="2.1" y="8.9" width="5" height="5" rx="1.4"/><rect x="8.9" y="8.9" width="5" height="5" rx="1.4"/>',
chevl:'<path d="M9.8 3.6L5.4 8l4.4 4.4"/>',
calday:'<rect x="2.2" y="3.4" width="11.6" height="10.4" rx="2.2"/><path d="M2.2 6.6h11.6M5.5 2v2.6M10.5 2v2.6"/><path d="M5.2 9.6h5.6M5.2 11.6h3.2"/>',
cam:'<rect x="1.5" y="4.2" width="9.2" height="7.6" rx="1.8"/><path d="M10.7 7.6l3.8-2.3v5.4l-3.8-2.3z"/>',
radar:'<path d="M8 8L12.6 5.4"/><path d="M8 2.4a5.6 5.6 0 1 1-5.35 3.9"/><path d="M8 5.2a2.8 2.8 0 1 1-2.6 1.8"/><circle cx="8" cy="8" r=".95" fill="currentColor" stroke="none"/>',
clash:'<path d="M1.9 5.4h4.1M4.3 3.5L6.2 5.4 4.3 7.3"/><path d="M14.1 10.6H10M11.7 8.7L9.8 10.6l1.9 1.9"/><path d="M8 2.2v3M8 10.8v3"/>',
delta:'<path d="M3 5.6h10M3 10.4h10"/><path d="M11.4 3.2L4.6 12.8"/>',
speak:'<path d="M3 6.2h1.9L8.4 3.4v9.2L4.9 9.8H3z"/><path d="M11 5.9a3 3 0 0 1 0 4.2"/><path d="M13 4.1a5.6 5.6 0 0 1 0 7.8"/>',
eyeoff:'<path d="M6.1 6.2A2 2 0 0 0 8 10a2 2 0 0 0 1.9-1.3"/><path d="M3.1 4.4C1.9 5.5 1.4 8 1.4 8s2.5 4.4 6.6 4.4c1 0 1.9-.2 2.7-.6"/><path d="M12.6 10.4c1.3-1.1 2-2.4 2-2.4s-2.5-4.4-6.6-4.4c-.5 0-1 .1-1.4.2"/><path d="M2.4 2.4l11.2 11.2"/>',
undo:'<path d="M13.4 9a5.4 5.4 0 1 0-1.6 3.8"/><path d="M13.8 12.4V8.4h-4"/>',
history:'<path d="M2.6 8a5.4 5.4 0 1 1 5.4 5.4A5.4 5.4 0 0 1 3.4 11"/><path d="M2.2 4.2v3.6h3.6"/><path d="M8 5.6V8l2 1.3"/>'
};
/* extra glyphs drawn to the same grid: 16×16 viewBox, 1.7 stroke, round caps and joins */
Object.assign(P,{
code:'<path d="M5.6 4.4L2 8l3.6 3.6M10.4 4.4L14 8l-3.6 3.6"/>',
type:'<path d="M3 4.4V3h10v1.4M8 3v10M6 13h4"/>',
ruler:'<rect x="1.8" y="5.2" width="12.4" height="5.6" rx="1.4"/><path d="M4.6 5.2v2.2M7.4 5.2v1.4M10.2 5.2v2.2"/>',
radius:'<path d="M2.8 13.2V8.4a5.6 5.6 0 0 1 5.6-5.6h4.8"/><circle cx="12.8" cy="12.8" r=".7" fill="currentColor" stroke="none"/>',
motion:'<path d="M1.8 12.2c3 0 3.4-8.4 6.2-8.4s3.2 8.4 6.2 8.4"/>',
contrast:'<circle cx="8" cy="8" r="6.2"/><path d="M8 1.8v12.4A6.2 6.2 0 0 0 8 1.8z" fill="currentColor" stroke="none"/>',
palette:'<path d="M8 1.9a6.1 6.1 0 1 0 0 12.2c.9 0 1.4-.6 1.4-1.3 0-.9-.8-1.2-.8-2 0-.7.5-1.2 1.2-1.2h1.5a2.9 2.9 0 0 0 2.8-2.9C14.1 3.9 11.4 1.9 8 1.9z"/><circle cx="4.9" cy="7.7" r=".85" fill="currentColor" stroke="none"/><circle cx="6.8" cy="4.9" r=".85" fill="currentColor" stroke="none"/><circle cx="10.2" cy="5.2" r=".85" fill="currentColor" stroke="none"/>',
window:'<rect x="1.8" y="2.6" width="12.4" height="10.8" rx="2"/><path d="M1.8 5.8h12.4M5.8 5.8v7.6"/>',
table:'<rect x="1.8" y="2.6" width="12.4" height="10.8" rx="2"/><path d="M1.8 6.2h12.4M1.8 9.8h12.4M6.2 6.2v7.2"/>',
bubble:'<path d="M2.4 4.4a2 2 0 0 1 2-2h7.2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H7.2l-3 2.4v-2.4a1.8 1.8 0 0 1-1.8-1.8z"/>',
cursor:'<path d="M3.4 2.6l9 4.2-3.8 1.4-1.4 3.8z"/><path d="M8.6 8.2l3.4 3.4"/>',
toggle:'<rect x="1.6" y="4.4" width="12.8" height="7.2" rx="3.6"/><circle cx="10.8" cy="8" r="1.9"/>',
tag:'<path d="M2.2 8.3V3.2a1 1 0 0 1 1-1h5.1l5.5 5.5a1 1 0 0 1 0 1.4l-4.1 4.1a1 1 0 0 1-1.4 0z"/><circle cx="5.4" cy="5.4" r=".9" fill="currentColor" stroke="none"/>',
rows:'<rect x="1.8" y="2.4" width="12.4" height="4.4" rx="1.4"/><rect x="1.8" y="9.2" width="12.4" height="4.4" rx="1.4"/>',
cards:'<rect x="1.8" y="2.6" width="5.4" height="10.8" rx="1.6"/><rect x="8.8" y="2.6" width="5.4" height="6" rx="1.6"/><path d="M8.8 11.6h5.4"/>',
bolt:'<path d="M9 1.8L3.4 9h4.2L7 14.2 12.6 7H8.4z"/>',
phone:'<rect x="4.2" y="1.6" width="7.6" height="12.8" rx="2"/><path d="M7 12.2h2"/>',
desktop:'<rect x="1.6" y="2.6" width="12.8" height="8.4" rx="1.6"/><path d="M5.6 14h4.8M8 11v3"/>',
arrowr:'<path d="M2.8 8h10M9.2 4.4L12.8 8l-3.6 3.6"/>',
arrowl:'<path d="M13.2 8h-10M6.8 4.4L3.2 8l3.6 3.6"/>',
fullscreen:'<path d="M2.4 6V2.4H6M10 2.4h3.6V6M13.6 10v3.6H10M6 13.6H2.4V10"/>',
star:'<path d="M8 2l1.8 3.9 4.2.5-3.1 2.9.8 4.2L8 11.4l-3.7 2.1.8-4.2L2 6.4l4.2-.5z"/>',
});
```

---

*Aithinkers Design System · v1.0 · September 2026.*
