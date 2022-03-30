import { Link, useRouter, useMutation, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import createBoard from "app/boards/mutations/createBoard"
import { BoardForm, FORM_ERROR } from "app/boards/components/BoardForm"

const NewBoardPage: BlitzPage = () => {
  const router = useRouter()
  const [createBoardMutation] = useMutation(createBoard)

  return (
    <div>
      <h1>Create New Board</h1>

      <BoardForm
        submitText="Create Board"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateBoard}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const board = await createBoardMutation(values)
            router.push(Routes.ShowBoardPage({ boardId: board.id }))
          } catch (error: any) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />

      <p>
        <Link href={Routes.BoardsPage()}>
          <a>Boards</a>
        </Link>
      </p>
    </div>
  )
}

NewBoardPage.authenticate = true
NewBoardPage.getLayout = (page) => <Layout title={"Create New Board"}>{page}</Layout>

export default NewBoardPage
