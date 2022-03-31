import { resolver, NotFoundError, AuthorizationError } from "blitz"
import db from "db"
import { z } from "zod"
import { Ctx } from "blitz"

const GetBoard = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(
  resolver.zod(GetBoard),
  resolver.authorize(),
  async ({ id }, ctx: Ctx) => {
    const board = await db.board.findFirst({ where: { id } })

    if (ctx.session.userId !== board?.userId) throw new AuthorizationError()

    if (!board) throw new NotFoundError()

    return board
  }
)
