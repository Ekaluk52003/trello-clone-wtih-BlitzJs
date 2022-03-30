import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateBoard = z.object({
  id: z.number(),
  name: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateBoard),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const board = await db.board.update({ where: { id }, data })

    return board
  }
)
