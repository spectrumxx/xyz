import { getScriptById, getScriptBySlug } from "@/app/actions/scripts"
import { isLegacyId } from "@/lib/slug"
import { db } from "@/lib/db"
import { scripts } from "@/lib/db/schema"
import { eq, sql } from "drizzle-orm"
import type { NextRequest } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  let script = null
  let scriptId: string | null = null

  if (isLegacyId(id)) {
    // Compatibilidade com IDs antigos como "EU0098IQ"
    script = await getScriptById(id)
    scriptId = id
  } else {
    // Tenta como slug v1
    script = await getScriptBySlug(id, 1)
    scriptId = script?.id ?? null
  }

  if (!script || !scriptId) {
    return new Response("-- Script não encontrado", {
      status: 404,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
    })
  }

  // Incrementa views sem bloquear resposta
  void db
    .update(scripts)
    .set({ views: sql`${scripts.views} + 1` })
    .where(eq(scripts.id, scriptId))
    .catch(() => {})

  return new Response(script.content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store",
    },
  })
}
