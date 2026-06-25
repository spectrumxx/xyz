"use client"

import { createScript } from "@/app/actions/scripts"
import { Button } from "@/components/ui/button"
import { FileCode2, Loader2, Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"

export function PasteForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [content, setContent] = useState("")
  const [title, setTitle] = useState("")

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (!content.trim()) {
      setError("Cole algum código antes de publicar.")
      return
    }

    const formData = new FormData()
    formData.set("content", content)
    formData.set("title", title)

    startTransition(async () => {
      const result = await createScript(formData)
      if (result.ok) {
        router.push(result.path)
      } else {
        setError(result.error)
      }
    })
  }

  const lineCount = content ? content.split("\n").length : 0
  const charCount = content.length

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <FileCode2 className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nome do script (opcional)"
            maxLength={120}
            className="h-10 w-full rounded-md border border-border bg-card pl-9 pr-3 text-sm text-foreground outline-none ring-ring/40 transition placeholder:text-muted-foreground focus:ring-2"
          />
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
          <span>{lineCount} linhas</span>
          <span aria-hidden>•</span>
          <span>{charCount} chars</span>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="flex items-center gap-1.5 border-b border-border bg-secondary/40 px-4 py-2.5">
          <span className="size-3 rounded-full bg-destructive/70" aria-hidden />
          <span className="size-3 rounded-full bg-chart-2/70" aria-hidden />
          <span className="size-3 rounded-full bg-primary/70" aria-hidden />
          <span className="ml-3 font-mono text-xs text-muted-foreground">script.lua</span>
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          spellCheck={false}
          placeholder={'-- Cole seu script Lua aqui\nprint("Hello from your executor!")'}
          className="h-80 w-full resize-y bg-transparent p-4 font-mono text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/60"
        />
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          O código é salvo e fica acessível via URL raw para usar com{" "}
          <code className="font-mono text-primary">loadstring</code>.
        </p>
        <Button type="submit" disabled={isPending} size="lg" className="shrink-0">
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Publicando...
            </>
          ) : (
            <>
              <Upload className="size-4" />
              Publicar script
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
