import { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getBoards from "app/boards/queries/getBoards"

const ITEMS_PER_PAGE = 100

export const BoardsList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ boards, hasMore }] = usePaginatedQuery(getBoards, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        {boards.map((board) => (
          <>
            <div className="h-32 rounded-md p-2 font-semibold flex bg-blue-500 text-white justify-between">
              <Link href={Routes.ShowBoardPage({ boardId: board.id })}>
                <a>{board.name}</a>
              </Link>
            </div>
          </>
        ))}

        <div className="h-32 rounded-md p-2 font-semibold flex bg-gray-400 text-white justify-between">
          <Link href={Routes.NewBoardPage()}>Create board</Link>
        </div>
      </div>
      {/* <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button> */}
    </>
  )
}

const BoardsPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Boards</title>
      </Head>

      <div>
        <div className="flex mt-3 mb-4 items-center text-xl">Personal board</div>

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
