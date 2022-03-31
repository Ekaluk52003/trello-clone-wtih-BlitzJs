import { Suspense, useEffect, useState } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import { DragDropContext, Droppable } from "react-beautiful-dnd"
import Layout from "app/core/layouts/Layout"
import getBoard from "app/boards/queries/getBoard"
import Column from "../../boards/components/Column"
import AddColumn from "../../boards/components/AddColumn"
import updateBoard from "app/boards/mutations/updateBoard"

export const Board = () => {
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
  const [state, setState] = useState<any>(board.boardDetial)
  const [boardName, setBoardName] = useState<string | null>(board.name)
  const [updateBoardMutation] = useMutation(updateBoard)
  const [showEditName, setShowEditname] = useState(false)

  const onDragEnd = async (result) => {
    const { destination, source, draggableId, type } = result

    if (!destination) {
      return
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    if (type === "column") {
      const newColumnOrder = Array.from(state.columnOrder)
      newColumnOrder.splice(source.index, 1)
      newColumnOrder.splice(destination.index, 0, draggableId)

      setState({
        ...state,
        columnOrder: newColumnOrder,
      })

      return
    }

    const start = state.columns[source.droppableId]
    const finish = state.columns[destination.droppableId]

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds)
      newTaskIds.splice(source.index, 1)
      newTaskIds.splice(destination.index, 0, draggableId)

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      }

      setState({
        ...state,
        columns: {
          ...state.columns,
          [newColumn.id]: newColumn,
        },
      })

      return
    }

    const startTaskIds = Array.from(start.taskIds)
    startTaskIds.splice(source.index, 1)
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    }

    const finishTaskIds = Array.from(finish.taskIds)
    finishTaskIds.splice(destination.index, 0, draggableId)
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    }

    setState({
      ...state,
      columns: {
        ...state.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    })
  }

  useEffect(() => {
    // declare the data fetching function
    const updateData = async () => {
      await updateBoardMutation({
        //@ts-ignore
        id: boardId,
        name: boardName,
        boardDetial: state,
      })
      setQueryData(board)
    }

    // call the function
    updateData().catch(console.error)
  }, [state, boardName])

  function changeBoardName(e) {
    setBoardName(e.target.value)
  }

  return (
    <>
      <Head>
        <title>Board {board.name}</title>
      </Head>

      <div
        className="bg-cover bg-no-repeat overflow-x-clip"
        style={{
          backgroundImage: `url("../images/background2.jpg")`,
        }}
      >
        <div className="px-8 mx-auto">
          {showEditName ? (
            <div>
              <input
                className="py-4"
                //@ts-ignore
                value={boardName}
                onChange={(e) => changeBoardName(e)}
                onBlur={() => setShowEditname(false)}
              />
            </div>
          ) : (
            <div className="flex items-center">
              <h1
                className="cursor-pointer text-3xl font-bold pt-6"
                onClick={() => setShowEditname(true)}
              >
                {" "}
                {board.name}
              </h1>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 self-end"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </div>
          )}

          {/* <pre>{JSON.stringify(board, null, 2)}</pre> */}
          <DragDropContext onDragEnd={onDragEnd}>
            <AddColumn state={state} setState={setState} />
            <Droppable droppableId="all-columns" direction="horizontal" type="column">
              {(provided) => (
                <div
                  className="flex flex-nowrap"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {state.columnOrder.map((columnId, index) => {
                    const column = state.columns[columnId]
                    const tasks = column.taskIds.map((taskId) => state.tasks[taskId])
                    return (
                      <Column
                        key={column.id}
                        column={column}
                        tasks={tasks}
                        index={index}
                        state={state}
                        setState={setState}
                      />
                    )
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </>
  )
}

const ShowBoardPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Board />
      </Suspense>
    </div>
  )
}

ShowBoardPage.authenticate = true
ShowBoardPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowBoardPage
