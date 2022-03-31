import { resolver } from "blitz"
import db from "db"
import { z } from "zod"
import { Ctx } from "blitz"

const CreateBoard = z.object({
  name: z.string(),
  id: z.number(),
})

export default resolver.pipe(
  resolver.zod(CreateBoard),
  resolver.authorize(),
  async (input, ctx: Ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const board = await db.board.create({
      data: {
        name: input.name,
        boardDetial: {
          tasks: {
            "task-1": {
              id: "task-1",
              content: "clean room",
              priority: true,
            },
            "task-2": {
              id: "task-2",
              content: "run",
              priority: false,
            },
          },
          columns: {
            "column-1": {
              id: "column-1",
              title: "To do",
              taskIds: ["task-1"],
            },
            "column-2": {
              id: "column-2",
              title: "Done",
              taskIds: ["task-2"],
            },
          },
          columnOrder: ["column-1", "column-2"],
        },
        user: {
          connect: {
            //@ts-ignore
            id: ctx.session.userId,
          },
        },
      },
    })

    return board
  }
)
