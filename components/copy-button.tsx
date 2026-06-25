"use client"

import { Button } from "@/components/ui/button"
import { Check, Copy } from "lucide-react"
import { useState } from "react"

export function CopyButton({
  value,
  label = "Copiar",
  className,
}: {
  value: string
  label?: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard indisponível — ignora silenciosamente
    }
  }

  return (
    <Button type="button" variant="secondary" size="sm" onClick={handleCopy} className={className}>
      {copied ? <Check className="size-4 text-primary" /> : <Copy className="size-4" />}
      {copied ? "Copiado!" : label}
    </Button>
  )
}
