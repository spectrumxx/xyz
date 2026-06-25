"use server"

import { db } from "@/lib/db"
import { scripts } from "@/lib/db/schema"
import { isLegacyId, toSlug } from "@/lib/slug"
import { and, eq, sql } from "drizzle-orm"

export type CreateScriptResult =
  | { ok: true; path: string }
  | { ok: false; error: string }

export async function createScript(formData: FormData): Promise<CreateScriptResult> {
  const content = String(formData.get("content") ?? "")
  const rawTitle = String(formData.get("title") ?? "").trim()

  if (!content.trim()) {
    return { ok: false, error: "O script não pode estar vazio." }
  }

  if (content.length > 50_000_000) {
    return { ok: false, error: "O script é muito grande (máximo 50 MB)." }
  }

  const title = rawTitle.slice(0, 120) || "Untitled"
  const slug = toSlug(title) || "script"

  // Conta quantas versões desse slug já existem
  const existing = await db
    .select({ version: scripts.version })
    .from(scripts)
    .where(eq(scripts.slug, slug))

  const nextVersion = existing.length === 0 ? 1 : existing.length + 1

  // ID interno: slug + versão (único no DB)
  const id = nextVersion === 1 ? slug : `${slug}/${nextVersion}`

  await db.insert(scripts).values({
    id,
    slug,
    version: nextVersion,
    title,
    content,
    language: "lua",
  })

  // path público da página de detalhes
  const path = nextVersion === 1 ? `/${slug}` : `/${slug}/${nextVersion}`
  return { ok: true, path }
}

export async function getScriptBySlug(slug: string, version: number) {
  const rows = await db
    .select()
    .from(scripts)
    .where(and(eq(scripts.slug, slug), eq(scripts.version, version)))
    .limit(1)
  return rows[0] ?? null
}

// Mantém compatibilidade com IDs legados (ex: "EU0098IQ")
export async function getScriptById(id: string) {
  const rows = await db.select().from(scripts).where(eq(scripts.id, id)).limit(1)
  return rows[0] ?? null
}

export async function incrementViewsById(id: string) {
  await db
    .update(scripts)
    .set({ views: sql`${scripts.views} + 1` })
    .where(eq(scripts.id, id))
}
