import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteBoard = z.object({
  id: z.number(),
})

export default resolver.pipe(resolver.zod(DeleteBoard), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const board = await db.board.deleteMany({ where: { id } })

  return board
})
