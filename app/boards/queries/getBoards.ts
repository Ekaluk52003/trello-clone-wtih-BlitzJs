import { resolver } from "blitz"
import db, { Prisma } from "db"
import { Ctx } from "blitz"

export default resolver.pipe(resolver.authorize(), async (_, ctx: Ctx) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const boards = await db.board.findMany({
    where: {
      userId: ctx.session.userId,
    },
  })
  return boards
})
