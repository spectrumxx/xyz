import { getScriptById, getScriptBySlug, isLegacyId } from "@/app/actions/scripts"
import { db } from "@/lib/db"
import { scripts } from "@/lib/db/schema"
import { eq, sql } from "drizzle-orm"
import type { NextRequest } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params
  // slug pode ser ["sarradanoar"] ou ["sarradanoar", "2"]

  let script = null
  let scriptId: string | null = null

  if (slug.length === 1) {
    const segment = slug[0]

    if (isLegacyId(segment)) {
      // Compatibilidade com IDs antigos como "EU0098IQ"
      script = await getScriptById(segment)
      scriptId = segment
    } else {
      // Slug novo, versão 1
      script = await getScriptBySlug(segment, 1)
      scriptId = script?.id ?? null
    }
  } else if (slug.length === 2) {
    const slugName = slug[0]
    const version = parseInt(slug[1], 10)

    if (!isNaN(version) && version >= 1) {
      script = await getScriptBySlug(slugName, version)
      scriptId = script?.id ?? null
    }
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
