import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getBoard from "app/boards/queries/getBoard"
import updateBoard from "app/boards/mutations/updateBoard"
import { BoardForm, FORM_ERROR } from "app/boards/components/BoardForm"

export const EditBoard = () => {
  const router = useRouter()
  const boardId = useParam("boardId", "number")
  const [board, { setQueryData }] = useQuery(
    getBoard,
    { id: boardId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateBoardMutation] = useMutation(updateBoard)

  return (
    <>
      <Head>
        <title>Edit Board {board.id}</title>
      </Head>

      <div>
        <h1>Edit Board {board.id}</h1>
        <pre>{JSON.stringify(board, null, 2)}</pre>

        <BoardForm
          submitText="Update Board"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateBoard}
          initialValues={board}
          onSubmit={async (values) => {
            try {
              const updated = await updateBoardMutation({
                id: board.id,
                ...values,
              })
              await setQueryData(updated)
              router.push(Routes.ShowBoardPage({ boardId: updated.id }))
            } catch (error: any) {
              console.error(error)
              return {
                [FORM_ERROR]: error.toString(),
              }
            }
          }}
        />
      </div>
    </>
  )
}

const EditBoardPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditBoard />
      </Suspense>

      <p>
        <Link href={Routes.BoardsPage()}>
          <a>Boards</a>
        </Link>
      </p>
    </div>
  )
}

EditBoardPage.authenticate = true
EditBoardPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditBoardPage
