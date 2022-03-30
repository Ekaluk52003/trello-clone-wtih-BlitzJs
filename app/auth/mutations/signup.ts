import { resolver, SecurePassword } from "blitz"
import db from "db"
import { Signup } from "app/auth/validations"
import { Role } from "types"

export default resolver.pipe(resolver.zod(Signup), async ({ email, password }, ctx) => {
  const hashedPassword = await SecurePassword.hash(password.trim())
  const user = await db.user.create({
    data: { email: email.toLowerCase().trim(), hashedPassword, role: "USER" },
    select: { id: true, name: true, email: true, role: true },
  })

  await ctx.session.$create({ userId: user.id, role: user.role as Role })

  await db.board.create({
    data: {
      name: "dfat board",
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
          id: user.id,
        },
      },
    },
  })

  return user
})
