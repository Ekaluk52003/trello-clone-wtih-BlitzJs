import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetBoardsInput
  extends Pick<Prisma.BoardFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetBoardsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: boards,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.board.count({ where }),
      query: (paginateArgs) => db.board.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      boards,
      nextPage,
      hasMore,
      count,
    }
  }
)
