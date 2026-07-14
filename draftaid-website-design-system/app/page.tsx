import type { ReactNode } from "react"
import { ArrowRight } from "lucide-react"

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
          description="Variants, sizes, and states from launchui."
        >
          <div className="space-y-8">
            <Row label="Variants">
              {BUTTON_VARIANTS.map((variant) => (
                <Button key={variant} variant={variant}>
                  {label(variant)}
                </Button>
              ))}
            </Row>

            <Row label="Sizes">
              <Button size="xs">Extra small</Button>
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon" aria-label="Continue">
                <ArrowRight />
              </Button>
            </Row>

            <Row label="With icon">
              <Button>
                Continue
                <ArrowRight />
              </Button>
              <Button variant="outline">
                Continue
                <ArrowRight />
              </Button>
            </Row>

            <Row label="States">
              <Button disabled>Disabled</Button>
              <Button variant="outline" disabled>
                Disabled
              </Button>
              <Button asChild variant="link">
                <a href="#">As link (asChild)</a>
              </Button>
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
