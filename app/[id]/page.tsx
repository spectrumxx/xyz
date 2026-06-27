import { getScriptById, getScriptBySlug } from "@/app/actions/scripts"
import { isLegacyId } from "@/lib/slug"
import { CopyButton } from "@/components/copy-button"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Eye, Link2, Terminal } from "lucide-react"
import { headers } from "next/headers"
import Link from "next/link"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

async function getBaseUrl() {
  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000"
  const proto = h.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https")
  return `${proto}://${host}`
}

export default async function ScriptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  let script = null

  // ID legado (ex: EU0098IQ) ou slug simples
  if (isLegacyId(id)) {
    script = await getScriptById(id)
  } else {
    // Tenta como slug v1
    script = await getScriptBySlug(id, 1)
  }

  if (!script) notFound()

  const baseUrl = await getBaseUrl()

  // Monta raw URL
  let rawPath: string
  if (isLegacyId(script.id)) {
    rawPath = `/raw/${script.id}`
  } else {
    rawPath = script.version === 1
      ? `/raw/${script.slug}`
      : `/raw/${script.slug}/${script.version}`
  }

  const rawUrl = `${baseUrl}${rawPath}`
  const loadstring = `loadstring(game:HttpGet("${rawUrl}"))()`

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-3xl flex-col gap-8 px-4 py-12 sm:py-16">
      <div className="flex items-center justify-between gap-4">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="size-4" />
            Novo script
          </Button>
        </Link>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Eye className="size-4" />
          <span className="font-mono">{script.views}</span>
        </div>
      </div>

      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Terminal className="size-4" />
          </div>
          <h1 className="text-balance text-2xl font-bold tracking-tight text-foreground">{script.title}</h1>
        </div>
        <p className="font-mono text-xs text-muted-foreground">
          {new Date(script.createdAt).toLocaleString("pt-BR")}
        </p>
      </header>

      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Link2 className="size-4 text-primary" />
          URL raw
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-3">
          <code className="flex-1 overflow-x-auto whitespace-nowrap font-mono text-sm text-foreground">{rawUrl}</code>
          <CopyButton value={rawUrl} className="shrink-0" />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-foreground">Rodar no executor</span>
          <CopyButton value={loadstring} label="Copiar comando" />
        </div>
        <div className="overflow-hidden rounded-lg border border-primary/30 bg-card">
          <pre className="overflow-x-auto p-4">
            <code className="font-mono text-sm leading-relaxed text-primary">{loadstring}</code>
          </pre>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-foreground">Conteúdo do script</span>
          <CopyButton value={script.content} label="Copiar código" />
        </div>
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <div className="flex items-center gap-1.5 border-b border-border bg-secondary/40 px-4 py-2.5">
            <span className="size-3 rounded-full bg-destructive/70" aria-hidden />
            <span className="size-3 rounded-full bg-chart-2/70" aria-hidden />
            <span className="size-3 rounded-full bg-primary/70" aria-hidden />
            <span className="ml-3 font-mono text-xs text-muted-foreground">script.lua</span>
          </div>
          <pre className="max-h-[28rem] overflow-auto p-4">
            <code className="font-mono text-sm leading-relaxed text-foreground">{script.content}</code>
          </pre>
        </div>
      </section>
    </main>
  )
}
