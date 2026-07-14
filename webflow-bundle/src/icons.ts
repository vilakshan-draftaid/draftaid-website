// Curated Phosphor icon set exposed to the <draftaid-button> `icon` attribute.
// Add a friendly kebab-case name here to make a new icon available in Webflow.
// Only the icons imported below are included in the bundle.
import {
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  CaretRight,
  Check,
  DownloadSimple,
  ArrowSquareOut,
  Plus,
  Envelope,
  CalendarBlank,
  Play,
  Star,
  MagnifyingGlass,
  PaperPlaneTilt,
  PlugsConnected,
  type Icon,
} from "@phosphor-icons/react"

export const ICONS: Record<string, Icon> = {
  "arrow-right": ArrowRight,
  "arrow-left": ArrowLeft,
  "arrow-up-right": ArrowUpRight,
  "caret-right": CaretRight,
  check: Check,
  download: DownloadSimple,
  "external-link": ArrowSquareOut,
  plus: Plus,
  mail: Envelope,
  calendar: CalendarBlank,
  play: Play,
  star: Star,
  search: MagnifyingGlass,
  send: PaperPlaneTilt,
  "plugs-connected": PlugsConnected,
}

export type IconName = keyof typeof ICONS

// Phosphor weights for visual hierarchy (brand guideline).
export type IconWeight =
  | "thin"
  | "light"
  | "regular"
  | "bold"
  | "fill"
  | "duotone"
