# Draftaid Website Design System: Project Report

**Repo:** `vilakshan-draftaid/draftaid-website` · **Period:** July 2026 · **Built with:** Claude Code (AI pair programmer)

---

## 1. What this project is

A design system for the Draftaid website, plus a pipeline that lets the same React buttons be used inside Webflow. The repo contains two apps:

| Folder | What it is | Deployed as |
|---|---|---|
| `draftaid-website-design-system/` | Next.js 16 app: a living component catalog (colors, typography, buttons, layout primitives) | Vercel project #1 |
| `webflow-bundle/` | Vite library build that wraps the design system's Button as a `<draftaid-button>` web component in one JS file | Vercel project #2 |

The flow: push to `main` on GitHub → Vercel rebuilds both → Webflow pulls the latest `draftaid-ui.js` through a single `<script>` tag → buttons on the marketing site update without touching Webflow again.

---

## 2. What we did, step by step

### 2.1 Scaffolding
- Created the Next.js app with `npx shadcn@latest init` (radix base, `nova` preset). It landed in a subfolder, which we kept since more packages were expected later.
- Added a root `.gitignore` and untracked `.DS_Store`.

### 2.2 First real bug: the folder that would not push
The scaffold created its own nested `.git` inside the subfolder. Git treated it as an *embedded repo* and only stored a pointer, so pushes from GitHub Desktop uploaded everything except the app. Fix: delete the nested `.git`, re-add the files (23 files, `node_modules` correctly ignored).

### 2.3 Components and the showcase page
- Installed the launchui registry (`@launchui/launchui`, `@launchui/button`): a `Section` primitive, glass/fade CSS utilities, and a Button with 7 variants (`default`, `secondary`, `outline`, `ghost`, `glow`, `link`, `destructive`) and 5 sizes.
- Replaced the starter page with a **design system catalog**: color token swatches, typography scale, every button variant/size/state, and the Section primitive. Added a visible light/dark toggle (CSS-driven icon swap, no hydration flicker).
- Later upgraded the Button section into a **Webflow cheat sheet**: every rendered button shows the exact `<draftaid-button>` attribute chip underneath it (`variant="glow"`, `size="lg"`, `icon="download"`, etc.) plus a copyable full-tag example.

### 2.4 Vercel deployment debugging (two-part 404)
The deployed site 404'd even after a green build that clearly prerendered `/`. Diagnosis in two steps:
1. **Root Directory** was unset, so Vercel built from the repo root where there is no app. Fixed in project settings.
2. Still 404: the **Framework Preset** was stuck on "Other" (from the original import when no `package.json` existed at root), so Vercel served only static files and ignored the Next.js runtime. Switching the preset to Next.js and redeploying fixed it.

Lesson: a successful build and a served site are different layers; `Code: NOT_FOUND` vs `DEPLOYMENT_NOT_FOUND` on Vercel's 404 page tells you which layer is broken.

### 2.5 The Webflow bridge (`webflow-bundle/`)
Goal: use real React design system buttons in Webflow without pasting compiled CSS or fighting character limits. An online guide suggested the general shape (web components on Vercel), but its example code had real flaws (hand-rolled HTMLElement with no attribute reactivity, light-DOM styling that would clash with Webflow, nonexistent variant names). We built it properly:

- **Vite library mode**, single IIFE output `draftaid-ui.js`, React bundled in.
- **Shadow DOM per button** with the compiled Tailwind CSS injected into each shadow root: full style isolation from Webflow.
- Attributes: `text`, `variant`, `size`, `href`, `disabled`, `theme="dark"`, and later `icon`, `icon-position`, `icon-weight`.
- Deployed as its own Vercel project (root directory `webflow-bundle`, Vite preset pinned in `vercel.json` so the "Other" preset bug cannot recur).
- Webflow setup: one script tag in Footer Code, then `<draftaid-button ...>` inside Embed elements.
- **Designer placeholder trick:** children placed between the custom element tags show in the Webflow Designer (which does not run custom code) but disappear on the published site once the Shadow DOM renders. Used a dashed-border span as a visual placeholder.

Three genuine bugs found and fixed along the way:
1. **`@property` rules are ignored inside Shadow DOM** (per spec they only register at document level). Tailwind v4 gradients depend on them, so the default button rendered invisible. Fix: extract the `@property` rules from the compiled CSS and inject them once into `document.head` (they register custom properties only, no style leakage).
2. **`process is not defined`:** Vite library mode does not replace `process.env.NODE_ENV`, so bundled React crashed silently and the element never registered. Fix: `define: { "process.env.NODE_ENV": '"production"' }`. Side benefit: bundle dropped from 192KB to 75KB gzipped (production React).
3. **Outline/ghost text color inherited from the host page.** These variants do not set their own text color. In the design system the page `body` supplies `color: var(--foreground)`; inside a shadow root there is no body, so Webflow's ambient color leaked in (dark text on dark sections). Fix: a `.da-root` wrapper inside the shadow pins `color` to the theme's `--foreground` token.

### 2.6 Icons (Phosphor, per brand guidelines)
Draftaid's brand icon library is Phosphor, so `@phosphor-icons/react` was used (an earlier lucide plan was corrected). A curated registry in `src/icons.ts` maps kebab-case names (`arrow-right`, `download`, `calendar`, `plugs-connected`, ...) to components; only imported icons are bundled (tree-shaking kept the cost to ~1KB gzipped). Added `size="icon"` for icon-only buttons with the `text` attribute doubling as the accessible label.

### 2.7 Brand colors: fail, revert, retry, succeed
- **Attempt 1 (failed):** put the raw palettes into Tailwind v4 `@theme` blocks. Tailwind tree-shook unused variables out of `:root`, `@theme static` did not emit as expected, and swatches rendered empty. Reverted completely at Vilakshan's request rather than stacking guesses.
- **Attempt 2 (succeeded):** two clean layers, no Tailwind theme machinery.
  - **Raw layer:** three palettes as plain `:root` CSS variables: `draftacid` (the aquamarine scale, named for the brand color Draft Acid `#25FFC0`), `black`, and `meteorite` (violet, matching Draft Violet `#3A1F73` at the 950 step).
  - **Semantic layer:** `--primary: var(--draftacid-800)` (`#00785f`) with white text, light mode only. Dark mode and all other variants untouched.
- Process: previewed `draftacid-700` first, flagged its 3.6:1 contrast (AA for large text only), previewed `draftacid-800` (5.3:1, passes AA fully) in the design system, got approval, then mirrored to the bundle and pushed.
- Key mechanic learned: the default button's gradient is **one color at two opacities** (`from-primary/60` to `to-primary/100`, top to bottom), so recoloring the whole button family is a single token swap; no variant code changes.

---

## 3. How AI was used

- **Scaffolding and plumbing:** ran the CLIs, wired configs, wrote the showcase page and web component code, kept both apps' tokens in sync.
- **Debugging from evidence, not guesses:** read Vercel build logs to separate build success from serving failure; used browser previews with DOM/computed-style inspection (not just screenshots) to prove things like `--tw-gradient-from` being set but `background-image: none`, which pinpointed the `@property` Shadow DOM issue; executed the built bundle in a try/catch to surface the silent `process` crash.
- **Verification before shipping:** every change was typechecked, linted, built, and visually verified in a live preview before commit. Colors were confirmed by computed values (`#00785f`), not eyeballing screenshots.
- **Pushing back on bad input:** the pasted "how to" guide was followed in spirit but its broken specifics (light-DOM styling, fake variants, wrong bundler assumptions) were called out and replaced.
- **Brand awareness:** consulted the Draftaid brand guidelines skill; caught that "draftacid" mapped to the actual brand color Draft Acid, and that Phosphor (not lucide) is the brand icon library.
- **Honest failure handling:** the first palette attempt involved guessing at Tailwind v4 internals and compounding fixes; when asked to revert, everything was removed cleanly and the retry used a simpler, verifiable approach. A silent removal of icon examples from the showcase was owned and corrected when questioned.
- **Decision hygiene:** design decisions (primary color, gradient construction, black button exposure, hosting architecture, style isolation) were put to Vilakshan as explicit options with recommendations, not decided silently.

## 4. What I learned

**Git**
- A folder with its own `.git` inside a repo becomes an embedded repo: the parent only tracks a pointer, which is why the folder never appeared on GitHub.
- `.gitignore` does not untrack already-committed files; `git rm --cached` does.

**Vercel**
- Root Directory and Framework Preset are separate settings; either one wrong produces a 404, and settings changes only apply to *new* deployments.
- A library build with no `index.html` will 404 at `/` by design; the artifact URL (`/draftaid-ui.js`) is what matters.
- Each Vercel project builds one root directory, so one repo with two apps means two Vercel projects.

**Design systems**
- The token chain: raw palette values → semantic tokens (`--primary`) → variant classes (cva) → components. Recoloring an entire system is a one-line change at the semantic layer if the chain is clean.
- Gradients built from a single color at different opacities recolor for free; two-shade gradients do not.
- WCAG contrast is checkable math: white on `#009878` is ~3.6:1 (large text only), white on `#00785f` is ~5.3:1 (passes AA).

**Web components + Shadow DOM**
- Shadow DOM gives real style isolation, but three things cross the boundary in surprising ways: `@property` registrations (document-level only), inherited properties like `color`, and nothing else you put inside (children become Designer-only placeholders when there is no slot).
- Custom elements bridge React and no-code tools cleanly: attributes in, rendered component out, `attributeChangedCallback` for reactivity.

**Build tooling**
- Vite library mode does not define `process.env.NODE_ENV`; the resulting crash was silent (no console error, element just never registered).
- Tree-shaking works: a 1,500-icon library cost ~1KB because only 15 icons were imported through a registry file.
- Tailwind v4's CSS-first `@theme` emits variables only when their utilities are used; plain `:root` variables are the reliable channel for raw design tokens.

**Webflow**
- Custom code does not run in the Designer or Preview, only on the published site.
- Browsers cache the bundle; a hard refresh (Cmd+Shift+R) is needed after each redeploy to see changes.

---

## 5. Current state and next steps

**Live now:** design system showcase (Vercel project #1), `draftaid-ui.js` bundle (Vercel project #2), buttons embedded in Webflow with icons, dark theme, and Draft Acid 800 primary.

**Known follow-ups:**
- `button.tsx` and the tokens are *copied* between the two apps and must be mirrored manually; a shared package would remove the drift risk.
- `size="lg"` is only 4px taller than default; a hero-sized CTA scale was discussed but not built.
- Possible next mappings: `secondary` → black palette, meteorite for accents.
- The `lg`/black/meteorite decisions, plus any new icons, follow the same loop: change tokens → preview → push.
