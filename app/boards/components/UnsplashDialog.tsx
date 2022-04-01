import axios from "axios"
import React, { useState, useEffect, Fragment } from "react"
import { Dialog, Transition } from "@headlessui/react"
import InfiniteScroll from "react-infinite-scroll-component"

const UnsplashDialog = ({ isOpen, setIsOpen, bgimage, SetBgimage }) => {
  const [data, setData] = useState<any>([])
  const [query, setQuery] = useState("code")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  const client_id = process.env.NEXT_PUBLIC_PIXABAY_KEY
  const fetchUrl = `https://pixabay.com/api/?key=${client_id}&q=${query}&page=${page}`

  const fetchImages = () => {
    const images = axios
      .get(fetchUrl, {
        headers: {},
      })
      .then((response) => {
        //@ts-ignore
        setData([...data, ...response.data.hits])
      })
      .catch((error) => {
        console.log(error)
        setHasMore(false)
      })

    setPage(page + 1)
  }
  const searchImages = (e) => {
    setHasMore(true)
    if (e.keyCode === 13) {
      setQuery(e.target.value)
      setData([])
      setPage(1)
    }
  }

  useEffect(() => {
    fetchImages()
  }, [query])

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="absolute top-0 inset-0 z-10" onClose={closeModal}>
          <div className="px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span className="inline-block h-screen align-middle" aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div
                className="inline-block w-full max-w-2xl p-6 my-8 transition-all transform bg-white shadow-xl rounded-2xl"
                id="scrollableDiv"
              >
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 pb-2">
                  These images are brought from Pixalbay API
                </Dialog.Title>
                <div className="mb-2">
                  <input
                    type="text"
                    className="mb-4"
                    onKeyDown={(e) => searchImages(e)}
                    placeholder="Search For Images 🔎"
                  />
                  <InfiniteScroll
                    dataLength={data.length}
                    next={fetchImages}
                    hasMore={hasMore}
                    loader={<p>Loading...</p>}
                    height={350}
                    endMessage={
                      <p style={{ textAlign: "center" }}>
                        <b>Load all images are completed</b>
                      </p>
                    }
                    scrollableTarget="scrollableDiv"
                  >
                    <div className="flex flex-wrap justify-between items-end">
                      {data.map((data, key) => (
                        <div
                          className="w-32 mr-4 mb-2"
                          key={key}
                          //@ts-ignore
                          onClick={() => SetBgimage(data.largeImageURL)}
                        >
                          <img src={data.previewURL} />
                        </div>
                      ))}
                    </div>
                  </InfiniteScroll>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={closeModal}
                  >
                    close
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default UnsplashDialog
