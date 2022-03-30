import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetBoard = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetBoard), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const board = await db.board.findFirst({ where: { id } })

  if (!board) throw new NotFoundError()

  return board
})
