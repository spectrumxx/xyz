"use server"

import { db } from "@/lib/db"
import { scripts } from "@/lib/db/schema"
import { eq, sql } from "drizzle-orm"

const ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

function generateId(length = 8) {
  let id = ""
  for (let i = 0; i < length; i++) {
    id += ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
  }
  return id
}

export type CreateScriptResult =
  | { ok: true; id: string }
  | { ok: false; error: string }

export async function createScript(formData: FormData): Promise<CreateScriptResult> {
  const content = String(formData.get("content") ?? "")
  const rawTitle = String(formData.get("title") ?? "").trim()

  if (!content.trim()) {
    return { ok: false, error: "O script não pode estar vazio." }
  }

  if (content.length > 500_000) {
    return { ok: false, error: "O script é muito grande (máximo 500 KB)." }
  }

  const title = rawTitle.slice(0, 120) || "Untitled"

  // Tenta gerar um id único (colisão é altamente improvável, mas tratamos mesmo assim)
  let id = generateId()
  for (let attempt = 0; attempt < 5; attempt++) {
    const existing = await db
      .select({ id: scripts.id })
      .from(scripts)
      .where(eq(scripts.id, id))
      .limit(1)
    if (existing.length === 0) break
    id = generateId()
  }

  await db.insert(scripts).values({ id, title, content, language: "lua" })

  return { ok: true, id }
}

export async function getScript(id: string) {
  const rows = await db.select().from(scripts).where(eq(scripts.id, id)).limit(1)
  return rows[0] ?? null
}

export async function incrementViews(id: string) {
  await db
    .update(scripts)
    .set({ views: sql`${scripts.views} + 1` })
    .where(eq(scripts.id, id))
}
