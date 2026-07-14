# Draftaid UI — Webflow web-component bundle

Ships the design system's `Button` as a `<draftaid-button>` custom element in a
single JS file, so it can be embedded in Webflow (or any HTML page) with one
`<script>` tag. Each button renders in a Shadow DOM with the compiled Tailwind
CSS injected, so it is fully isolated from the host page's styles.

## Local development

```bash
npm install
npm run dev      # opens the demo page (index.html)
npm run build    # outputs dist/draftaid-ui.js
```

## Deploy on Vercel (separate project from the Next.js app)

1. Vercel dashboard → **Add New → Project** → import this same repo.
2. Set **Root Directory** to `webflow-bundle`.
3. Framework Preset should auto-detect **Vite** (also pinned in `vercel.json`).
4. Deploy. The bundle is served at
   `https://<project>.vercel.app/draftaid-ui.js`.

Every push to `main` rebuilds and redeploys automatically.

## Use in Webflow

1. **Project Settings → Custom Code → Footer Code** (before `</body>`):

   ```html
   <script src="https://<project>.vercel.app/draftaid-ui.js"></script>
   ```

2. Drop an **Embed** element anywhere and use the tag:

   ```html
   <draftaid-button text="Get Started" variant="default" href="/signup"></draftaid-button>
   ```

### Attributes

| Attribute | Values | Default |
|---|---|---|
| `text` | any string | `Button` |
| `variant` | `default`, `secondary`, `outline`, `ghost`, `glow`, `link`, `destructive` | `default` |
| `size` | `default`, `xs`, `sm`, `lg`, `icon` (icon-only) | `default` |
| `href` | any URL (renders as a link) | none |
| `disabled` | present = disabled | off |
| `theme` | `dark` for the dark palette | light |
| `icon` | a Phosphor icon name (see below) | none |
| `icon-position` | `start`, `end` | `start` |
| `icon-weight` | `thin`, `light`, `regular`, `bold`, `fill`, `duotone` | `regular` |

Available `icon` names (Phosphor): `arrow-right`, `arrow-left`, `arrow-up-right`,
`caret-right`, `check`, `download`, `external-link`, `plus`, `mail`, `calendar`,
`play`, `star`, `search`, `send`, `plugs-connected`. Add more in `src/icons.ts`.

Examples:

```html
<draftaid-button text="Continue" variant="default" icon="arrow-right" icon-position="end"></draftaid-button>
<draftaid-button text="Schedule a Demo" variant="secondary" icon="calendar"></draftaid-button>
<draftaid-button text="Add" size="icon" icon="plus"></draftaid-button>
```

## Keeping in sync

`src/button.tsx` and the tokens in `src/styles.css` are copies of the design
system's `components/ui/button.tsx` and `app/globals.css`. If you change the
button there, mirror it here.
