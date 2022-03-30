import { Suspense, useState } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import { DragDropContext, Droppable } from "react-beautiful-dnd"
import Layout from "app/core/layouts/Layout"
import getBoard from "app/boards/queries/getBoard"
import deleteBoard from "app/boards/mutations/deleteBoard"
import Column from "../../boards/components/Column"
import AddColumn from "../../boards/components/AddColumn"

export const Board = () => {
  const router = useRouter()
  const boardId = useParam("boardId", "number")
  const [deleteBoardMutation] = useMutation(deleteBoard)
  const [board] = useQuery(getBoard, { id: boardId })
  const [state, setState] = useState<any>(board.boardDetial)

  function onDragEnd(result) {
    console.log(result)
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

  return (
    <>
      <Head>
        <title>Board {board.id}</title>
      </Head>

      <div>
        <h1>Board {board.id}</h1>
        {/* <pre>{JSON.stringify(board, null, 2)}</pre> */}
        <DragDropContext onDragEnd={onDragEnd}>
          <AddColumn state={state} setState={setState} />
          <Droppable droppableId="all-columns" direction="horizontal" type="column">
            {(provided) => (
              <div className="flex" {...provided.droppableProps} ref={provided.innerRef}>
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

        {/* <Link href={Routes.EditBoardPage({ boardId: board.id })}>
          <a>Edit</a>
        </Link> */}

        {/* <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteBoardMutation({ id: board.id })
              router.push(Routes.BoardsPage())
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button> */}
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
