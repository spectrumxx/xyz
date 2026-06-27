import { createScript } from "@/app/actions/scripts"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PasteForm } from "@/components/paste-form"
import { Terminal, Zap, Link2, Code2 } from "lucide-react"

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-3xl flex-col gap-10 px-4 py-12 sm:py-16">
      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Terminal className="size-5" />
          </div>
          <span className="font-mono text-lg font-semibold tracking-tight text-foreground">LuaPaste</span>
        </div>
        <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Cole seu script, gere a URL raw e rode no executor
        </h1>
        <p className="max-w-2xl text-pretty leading-relaxed text-muted-foreground">
          Publique qualquer código Lua (obfuscado ou não) e receba um link raw em texto puro. Depois é só carregar com{" "}
          <code className="rounded bg-card px-1.5 py-0.5 font-mono text-sm text-primary">loadstring</code> direto no seu
          executor.
        </p>
      </header>

      <PasteForm />

      <section className="grid gap-4 sm:grid-cols-3">
        <Feature
          icon={<Code2 className="size-5" />}
          title="24/7 — Perfeição"
          desc="hospedagem gratuita, você pode usar nosso raw pelo tempo que preferir, com o melhor desempenho possível, online 24 horas por dia, toda semana!"
        />
        <Feature
          icon={<Link2 className="size-5" />}
          title="Raw, Loadstring & Source"
          desc="Após upar seu source/script obfuscado ou sem obfuscação aqui, você receberá tudo certinho, eu digo: url feita, loadstring feita, e o código vai exibir no seu output, praticamente tudo de primeira mão."
        />
        <Feature
          icon={<Zap className="size-5" />}
          title="Execução Otimizada"
          desc="Ao rodar no executor, ele demora um curto segundo, isso não é por conta de obfuscador nem nada, é só a otimização do url sendo montada."
        />
      </section>
    </main>
  )
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4">
      <div className="flex size-9 items-center justify-center rounded-md bg-accent text-primary">{icon}</div>
      <h2 className="font-medium text-foreground">{title}</h2>
      <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
    </div>
  )
}
