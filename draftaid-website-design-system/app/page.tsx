import type { ReactNode } from "react"
import { ArrowRight, DownloadSimple, Plus } from "@phosphor-icons/react/dist/ssr"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

// A living catalog of every component in the design system.
// To document a new component, add a <Block> to the list below.

export default function Page() {
  return (
    <div className="min-h-svh">
      <header className="line-b bg-background/80 sticky top-0 z-10 backdrop-blur-sm">
        <div className="mx-auto flex max-w-(--spacing-container) items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">
              Design System
            </h1>
            <p className="text-muted-foreground text-sm">
              Component reference for the Draftaid website
            </p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-(--spacing-container) px-4 pb-24">
        <Block
          title="Colors"
          description="Semantic tokens from the theme. Values shift automatically in dark mode."
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {SWATCHES.map((token) => (
              <Swatch key={token.var} {...token} />
            ))}
          </div>
        </Block>

        <Block
          title="Typography"
          description="Geist for text, Geist Mono for code."
        >
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight">
              Heading 1
            </h1>
            <h2 className="text-2xl font-semibold tracking-tight">Heading 2</h2>
            <h3 className="text-xl font-medium">Heading 3</h3>
            <p className="max-w-prose leading-relaxed">
              Body text. The quick brown fox jumps over the lazy dog.
            </p>
            <p className="text-muted-foreground max-w-prose text-sm">
              Muted secondary text for supporting details.
            </p>
            <p className="font-mono text-sm">{`const mono = "Geist Mono"`}</p>
          </div>
        </Block>

        <Block
          title="Button"
          description="Each button shows the <draftaid-button> attribute to copy into a Webflow embed."
        >
          <pre className="bg-muted mb-8 overflow-x-auto rounded-md p-3 font-mono text-xs">
            {`<draftaid-button text="Get Started" variant="default" size="default" href="/signup"></draftaid-button>`}
          </pre>

          <div className="space-y-8">
            <Row label="Variants">
              {BUTTON_VARIANTS.map((variant) => (
                <Chip key={variant} code={`variant="${variant}"`}>
                  <Button variant={variant}>{label(variant)}</Button>
                </Chip>
              ))}
            </Row>

            <Row label="Sizes">
              {BUTTON_SIZES.map((size) => (
                <Chip key={size} code={`size="${size}"`}>
                  <Button size={size}>{SIZE_LABELS[size]}</Button>
                </Chip>
              ))}
            </Row>

            <Row label="As link">
              <Chip code={`href="/your-link"`}>
                <Button asChild>
                  <a href="#">Get Started</a>
                </Button>
              </Chip>
            </Row>

            <Row label="Icons">
              <Chip code={`icon="download"`}>
                <Button>
                  <DownloadSimple />
                  Download
                </Button>
              </Chip>
              <Chip code={`icon="arrow-right" icon-position="end"`}>
                <Button>
                  Continue
                  <ArrowRight />
                </Button>
              </Chip>
              <Chip code={`size="icon" icon="plus"`}>
                <Button size="icon" aria-label="Add">
                  <Plus />
                </Button>
              </Chip>
            </Row>

            <Row label="States">
              <Chip code="disabled">
                <Button disabled>Disabled</Button>
              </Chip>
              <Chip code={`theme="dark"`}>
                <div className="dark bg-background rounded-md p-2">
                  <Button>On dark</Button>
                </div>
              </Chip>
            </Row>
          </div>
        </Block>

        <Block
          title="Section"
          description="Layout primitive with responsive vertical rhythm and a bottom rule."
        >
          <div className="border-border/60 overflow-hidden rounded-lg border border-dashed">
            <div className="line-b px-4 py-12 text-center sm:py-16">
              <p className="text-muted-foreground text-sm">
                {`<Section>`} content — padding scales with the viewport.
              </p>
            </div>
          </div>
        </Block>
      </main>
    </div>
  )
}

const BUTTON_VARIANTS = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "glow",
  "link",
  "destructive",
] as const

const BUTTON_SIZES = ["xs", "sm", "default", "lg"] as const

const SIZE_LABELS: Record<(typeof BUTTON_SIZES)[number], string> = {
  xs: "Extra small",
  sm: "Small",
  default: "Default",
  lg: "Large",
}

const SWATCHES: { name: string; var: string; className: string }[] = [
  { name: "Background", var: "--background", className: "bg-background border" },
  { name: "Foreground", var: "--foreground", className: "bg-foreground" },
  { name: "Primary", var: "--primary", className: "bg-primary" },
  { name: "Secondary", var: "--secondary", className: "bg-secondary" },
  { name: "Muted", var: "--muted", className: "bg-muted" },
  { name: "Accent", var: "--accent", className: "bg-accent" },
  { name: "Brand", var: "--brand", className: "bg-brand" },
  { name: "Destructive", var: "--destructive", className: "bg-destructive" },
  { name: "Card", var: "--card", className: "bg-card border" },
  { name: "Border", var: "--border", className: "bg-border" },
  { name: "Ring", var: "--ring", className: "bg-ring" },
  { name: "Chart 1", var: "--chart-1", className: "bg-chart-1" },
  { name: "Chart 2", var: "--chart-2", className: "bg-chart-2" },
  { name: "Chart 3", var: "--chart-3", className: "bg-chart-3" },
  { name: "Chart 4", var: "--chart-4", className: "bg-chart-4" },
  { name: "Chart 5", var: "--chart-5", className: "bg-chart-5" },
]

function Block({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <section className="line-b py-10">
      <div className="mb-6">
        <h2 className="text-base font-medium">{title}</h2>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      {children}
    </section>
  )
}

function Chip({ code, children }: { code: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-1.5">
      {children}
      <code className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 font-mono text-[11px]">
        {code}
      </code>
    </div>
  )
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <span className="text-muted-foreground w-28 shrink-0 text-xs font-medium tracking-wide uppercase">
        {label}
      </span>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}

function Swatch({
  name,
  var: cssVar,
  className,
}: {
  name: string
  var: string
  className: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className={cn("h-14 w-full rounded-md", className)} />
      <div className="text-xs">
        <p className="font-medium">{name}</p>
        <p className="text-muted-foreground font-mono">{cssVar}</p>
      </div>
    </div>
  )
}

function label(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
