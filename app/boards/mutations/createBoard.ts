import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateBoard = z.object({
  name: z.string(),
})

export default resolver.pipe(resolver.zod(CreateBoard), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const board = await db.board.create({ data: input })

  return board
})
