import { createElement, type ReactNode } from "react"
import { createRoot, type Root } from "react-dom/client"

import { Button } from "@/button"
// `?inline` gives the compiled Tailwind CSS as a string so we can inject it
// into each element's shadow root (isolated from the host page's styles).
import css from "@/styles.css?inline"

type Variant =
  | "default"
  | "secondary"
  | "outline"
  | "ghost"
  | "glow"
  | "link"
  | "destructive"
type Size = "default" | "xs" | "sm" | "lg"

const TAG = "draftaid-button"

// Tailwind v4 gradients/shadows/rings rely on `@property` registrations, but
// `@property` at-rules are ignored inside a Shadow DOM (they only register at
// the document level). They register custom properties without applying any
// visual styles, so injecting just these rules globally is safe and does not
// leak styling into the host page.
function ensureGlobalProperties(cssText: string) {
  const id = "draftaid-ui-properties"
  if (document.getElementById(id)) return
  const rules = cssText.match(/@property[^{]+\{[^}]*\}/g)
  if (!rules) return
  const style = document.createElement("style")
  style.id = id
  style.textContent = rules.join("\n")
  document.head.appendChild(style)
}

class DraftaidButton extends HTMLElement {
  static get observedAttributes() {
    return ["text", "variant", "size", "href", "disabled", "theme"]
  }

  private root: Root | null = null
  private wrapper: HTMLDivElement | null = null

  connectedCallback() {
    ensureGlobalProperties(css)

    if (!this.shadowRoot) {
      const shadow = this.attachShadow({ mode: "open" })

      const style = document.createElement("style")
      style.textContent = css
      shadow.appendChild(style)

      this.wrapper = document.createElement("div")
      shadow.appendChild(this.wrapper)
      this.root = createRoot(this.wrapper)
    }
    this.render()
  }

  attributeChangedCallback() {
    if (this.root) this.render()
  }

  disconnectedCallback() {
    this.root?.unmount()
    this.root = null
  }

  private render() {
    if (!this.root || !this.wrapper) return

    const text = this.getAttribute("text") ?? "Button"
    const variant = (this.getAttribute("variant") ?? "default") as Variant
    const size = (this.getAttribute("size") ?? "default") as Size
    const href = this.getAttribute("href")
    const disabled = this.hasAttribute("disabled")

    // Tailwind `dark:` utilities need a `.dark` ancestor inside the shadow.
    this.wrapper.className = this.getAttribute("theme") === "dark" ? "dark" : ""

    const child: ReactNode = href
      ? createElement("a", { href }, text)
      : text

    this.root.render(
      createElement(
        Button,
        { variant, size, asChild: Boolean(href), disabled: disabled || undefined },
        child,
      ),
    )
  }
}

if (!customElements.get(TAG)) {
  customElements.define(TAG, DraftaidButton)
}
