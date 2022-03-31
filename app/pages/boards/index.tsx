import { Suspense } from "react"
import { Head, Link, useQuery, useRouter, BlitzPage, Routes, useMutation } from "blitz"
import Layout from "app/core/layouts/Layout"
import getBoards from "app/boards/queries/getBoards"
import deleteBoard from "app/boards/mutations/deleteBoard"

export const BoardsList = () => {
  const [deleteBoardMutation] = useMutation(deleteBoard)
  const [boards, { setQueryData }] = useQuery(getBoards, {})

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {boards.map((board) => (
        <div
          key={board.id}
          className="h-32 rounded-md p-2 font-semibold bg-blue-500 text-white flex flex-col justify-between"
        >
          <div>
            <Link href={Routes.ShowBoardPage({ boardId: board.id })}>
              <a>{board.name}</a>
            </Link>
          </div>
          <button
            className="self-end"
            onClick={async () => {
              if (window.confirm("This will be deleted")) {
                try {
                  const product = await deleteBoardMutation({ id: board?.id })
                  setQueryData(boards)
                } catch (error) {
                  alert("Error saving product")
                }
                // router.push(Routes.BoardsPage())
              }
            }}
          >
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      ))}

      <div className="h-32 rounded-md p-2 font-semibold flex bg-gray-400 text-white justify-between">
        <Link href={Routes.NewBoardPage()}>Create board</Link>
      </div>
    </div>
  )
}

const BoardsPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Boards</title>
      </Head>

      <div className="max-w-5xl px-2 mx-auto">
        <div className="flex flex-wrap mt-3 mb-4 items-center text-xl space-x-4 font-bold">
          Personal board
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <BoardsList />
        </Suspense>
      </div>
    </>
  )
}

BoardsPage.authenticate = true
BoardsPage.getLayout = (page) => <Layout>{page}</Layout>

export default BoardsPage
