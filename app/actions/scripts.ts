"use server"

import { db } from "@/lib/db"
import { scripts } from "@/lib/db/schema"
import { isLegacyId, toSlug } from "@/lib/slug"
import { and, eq, sql } from "drizzle-orm"

export type CreateScriptResult =
  | { ok: true; path: string }
  | { ok: false; error: string }

// Limite em bytes (não caracteres) — 4MB é seguro pro Vercel
const MAX_SIZE_BYTES = 4 * 1024 * 1024 // 4MB

function getByteLength(str: string): number {
  return new Blob([str]).size
}

export async function createScript(formData: FormData): Promise<CreateScriptResult> {
  const content = String(formData.get("content") ?? "")
  const rawTitle = String(formData.get("title") ?? "").trim()

  if (!content.trim()) {
    return { ok: false, error: "O script não pode estar vazio." }
  }

  const sizeBytes = getByteLength(content)

  if (sizeBytes > MAX_SIZE_BYTES) {
    const mb = (sizeBytes / (1024 * 1024)).toFixed(2)
    return {
      ok: false,
      error: `Script muito grande (${mb}MB). Máximo permitido: 4MB. Tente usar um minifier/obfuscador para reduzir o tamanho.`,
    }
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

  try {
    await db.insert(scripts).values({
      id,
      slug,
      version: nextVersion,
      title,
      content,
      language: "lua",
    })
  } catch (err) {
    console.error("DB insert error:", err)
    return {
      ok: false,
      error: "Erro ao salvar no banco de dados. O script pode estar muito grande ou o servidor está sobrecarregado.",
    }
  }

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
