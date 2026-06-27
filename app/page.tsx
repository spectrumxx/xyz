import { createScript } from "@/app/actions/scripts"
import { Button } from "@/components/ui/button"
import { Terminal, Upload, Code2 } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-3xl flex-col gap-8 px-4 py-12 sm:py-16">
      <header className="flex flex-col items-center gap-4 text-center">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Terminal className="size-6" />
        </div>
        <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground">
          Genesis Loader
        </h1>
        <p className="max-w-md text-muted-foreground">
          Cole seu script Lua, gere um link curto e compartilhe com loadstring.
        </p>
      </header>

      <form
        action={createScript}
        className="flex flex-col gap-6 rounded-xl border border-border bg-card p-6 shadow-sm"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="text-sm font-medium text-foreground">
            Título do script
          </label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="Meu script incrível"
            maxLength={120}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="content" className="text-sm font-medium text-foreground">
            Código Lua
          </label>
          <textarea
            id="content"
            name="content"
            required
            placeholder="-- cole seu script aqui"
            rows={12}
            className="resize-y rounded-md border border-input bg-background px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <Button type="submit" className="w-full gap-2">
          <Upload className="size-4" />
          Gerar link
        </Button>
      </form>

      <footer className="mt-auto text-center text-xs text-muted-foreground">
        <p>Scripts são armazenados anonimamente.</p>
      </footer>
    </main>
  )
}
