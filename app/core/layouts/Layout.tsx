import { Head, BlitzLayout, Link, Routes, useMutation } from "blitz"
import logout from "app/auth/mutations/logout"
import { useSession } from "blitz"
import { Suspense } from "react"

const UserInfo = () => {
  const session = useSession()
  const [logoutMutation] = useMutation(logout)

  return (
    <div className="flex justify-between px-3 py-2 text-white bg-blue-500">
      <Link href={Routes.BoardsPage()}>
        <a>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 inline-flex"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
          <span className="text-md font-bold">Board Room</span>
        </a>
      </Link>

      {session.userId && (
        <button
          className="button small text-md font-bold"
          onClick={async () => {
            await logoutMutation()
          }}
        >
          Logout
        </button>
      )}
    </div>
  )
}

const Layout: BlitzLayout<{ title?: string }> = ({ title, children }) => {
  return (
    <>
      <Head>
        <title>{title || "trello-clone"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Suspense fallback="Loading...">
        <UserInfo />
      </Suspense>
      {children}
    </>
  )
}

export default Layout
