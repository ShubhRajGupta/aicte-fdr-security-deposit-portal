---
name: aicte-gov-ui
description: Build or restyle web UI so it looks and behaves like the AICTE government portals (aicte-india.org public site, AICTE Web Portal / approval-process portal, NATS-style role login) - dense, form-and-table driven, tab-based, plain, familiar to clerks, institute staff and officers who use it every day. Use this skill whenever the user wants a UI that is "like AICTE", "government portal style", "same as the official site", "consistent for daily users", or complains that their site looks "AI-made", flashy, startup-like, too modern or too pretty. Also use it for any admin/data-entry/approval/dashboard screen, login page, form, table, status badge, button or navigation work in this project, even if AICTE is not named. Do NOT use it for marketing landing pages or design-showcase work.
---

# AICTE Government Portal UI

## The one idea

AICTE users are not browsing. They are **doing work**: filling 40-field forms, checking status, downloading a report, paying a fee, reading a circular. They open the same screens every day and rely on muscle memory. So the UI must be:

- **Predictable** - same control, same place, same label, every screen.
- **Dense** - many fields and rows visible without scrolling through whitespace.
- **Plain** - no decoration that does not carry information.
- **Explicit** - text labels, visible status words, instructions written out.

If a choice makes the site look more "designed", it is probably wrong. If it makes the site look more like a government form-and-table system, it is probably right.

## What this is based on (and what is not verified)

Verified from AICTE's official portal user manuals (Approval Process 2018-19 / 2019-20): the portal's structure, tabs, button set, status model, validation behaviour, payment/report flows and instruction tone. See `references/portal-behaviour.md`.

Verified as the Indian-government convention on AICTE-family sites (nats.education.gov.in, state higher-education sites on the same template): skip-link, screen-reader link, A- / A / A+ text resize, language toggle, emblem + title header, mega-menu, "You are here" breadcrumb, related-links footer, WCAG target.

**NOT verified - exact hex colours, font and pixel sizes.** The live homepage could not be loaded when this skill was written. `assets/aicte-tokens.css` holds a conservative baseline. **Before final delivery, calibrate**: ask the user for 2-3 screenshots of the AICTE screens to match (header, a form tab, a table), or use a browser tool on the live site, and change values in that one file only. Never scatter colours through components.

## Workflow

1. **Classify the screen**: public content page, login, dashboard/home after login, record form (tabbed), list/table, report/download, payment, or notice/circular. Read the matching section of `references/page-patterns.md`.
2. **Load tokens**: include `assets/aicte-tokens.css` unchanged as the base. Components use only its variables.
3. **Build with the component rules** in `references/components.md` (buttons, fields, tabs, grids, status, alerts, pagination).
4. **Write copy** per `references/copy-and-content.md` (imperative, literal, no marketing).
5. **Check accessibility** per `references/accessibility-gigw.md`.
6. **Lint**: run `scripts/lint_ui.sh <dir>`; fix every hit. Then walk the checklist at the bottom.

## Hard rules (non-negotiable)

**Never use:** gradients, glassmorphism/backdrop-filter, glow or coloured shadows, large drop shadows, border-radius above 4px (no pills, no rounded cards), purple/indigo/neon accents, emoji as icons, hero banners with slogans, centred marketing copy, decorative illustrations, animated entrances, parallax, hover lift/scale effects, dark mode by default, "cards in a grid" as the default layout, floating action buttons, toasts that vanish on their own for errors, skeleton shimmer, text like "Seamlessly", "Empower", "Unlock", "Welcome back".

**Always use:** flat rectangles, 1px solid borders, a single blue family plus semantic red/green/amber, system-safe sans-serif at 13-14px, visible text labels above or left of every field, red asterisk for required, tab strips for sections of a record, tables for lists, a "Quick links" side panel for long records, status shown as words, breadcrumbs ("You are here"), a footer with copyright and policy links.

**Interaction principles:**
- Nothing moves unless the user clicks. No transitions over 100ms; none on layout.
- Errors and validation messages stay on screen until fixed, are written in a message area, and name the field.
- Destructive actions ask for confirmation in a plain modal.
- Every list screen has search/filter above, record count, pagination below.
- Long forms save per tab ("Save" on each section), not one giant submit; final step is an explicit "Submit".
- Read-only values look read-only (grey fill), never hidden.

## Page skeleton (every page)

```
[skip links]  [A- A A+] [language] [Screen Reader Access]        <- utility bar
[emblem] [Organisation name, English + Hindi]    [search] [Web Portal Login]
[ Home | About Us | ... primary nav ........................ ]  <- nav bar
You are here: Home » Section » Page                             <- breadcrumb
[ page title ]
[ content: form / table / notice list ]
[ related links ]
[ footer: quick links | help | contact | privacy | Copyright (c) AICTE. All Rights Reserved. ]
```
After login, replace the public nav with the portal shell described in `references/page-patterns.md` ("Logged-in shell").

See also: `assets/example-record-form.html` (reference page using every core component).

## Final checklist

- [ ] Could a first-time visitor mistake this for a startup SaaS site? If yes, flatten it.
- [ ] Every button is one of the five variants in `components.md`, with a text label.
- [ ] Every form field has a label, required marker, and (if needed) hint text under it.
- [ ] Tables have header row, zebra or row borders, right-aligned numbers, an Action column only when needed.
- [ ] Statuses are words in a bordered badge ("Submitted", "Payment Required") - not just colour.
- [ ] Keyboard: tab order matches visual order; focus ring visible.
- [ ] Works at 1366x768 without horizontal page scroll (grids may scroll inside their own box).
- [ ] `scripts/lint_ui.sh` prints no findings.
- [ ] Colours/fonts only via CSS variables from `assets/aicte-tokens.css`.
