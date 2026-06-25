import { db } from "@/lib/db"
import { scripts } from "@/lib/db/schema"
import { eq, sql } from "drizzle-orm"
import type { NextRequest } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const rows = await db
    .select({ content: scripts.content })
    .from(scripts)
    .where(eq(scripts.id, id))
    .limit(1)

  const script = rows[0]

  if (!script) {
    return new Response("-- Script não encontrado", {
      status: 404,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
    })
  }

  // Conta a visualização sem bloquear a resposta
  void db
    .update(scripts)
    .set({ views: sql`${scripts.views} + 1` })
    .where(eq(scripts.id, id))
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
