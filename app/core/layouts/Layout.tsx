import { Head, BlitzLayout, Link, Routes } from "blitz"

const Layout: BlitzLayout<{ title?: string }> = ({ title, children }) => {
  return (
    <>
      <Head>
        <title>{title || "trello-clone"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex justify-between px-3 py-2 text-white bg-blue-500">
        <Link href={Routes.BoardsPage()}>
          <a>Home</a>
        </Link>
        <p>Setting</p>
      </div>
      <div className="max-w-5xl px-2 mx-auto">{children}</div>
    </>
  )
}

export default Layout
