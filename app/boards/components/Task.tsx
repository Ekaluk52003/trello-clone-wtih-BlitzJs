import React from "react"
import { Draggable } from "react-beautiful-dnd"

function Task(props) {
  const [priority, setPriority] = React.useState(props.task.priority)

  function editTask(e, taskId) {
    props.setState({
      ...props.state,
      tasks: {
        ...props.state.tasks,
        [taskId]: {
          id: taskId,
          content: e.target.value,
          priority: priority,
        },
      },
    })
  }

  function setHighPriority(taskId) {
    console.log("check", props.state.tasks[taskId])

    setPriority(!props.task.priority)

    props.setState({
      ...props.state,
      tasks: {
        ...props.state.tasks,
        [taskId]: {
          id: taskId,
          content: props.task.content,
          priority: !priority,
        },
      },
    })
    console.log("after", props.task)
  }

  function addTask(columnId) {
    const newTaskId = "task-" + Math.floor(Math.random() * 100000)

    const column = props.state.columns[columnId]
    const newTaskIds = Array.from(column.taskIds)
    newTaskIds.push(newTaskId)

    const newTask = {
      id: newTaskId,
      content: "",
      priority: false,
    }

    props.setState({
      ...props.state,
      tasks: {
        ...props.state.tasks,
        [newTaskId]: newTask,
      },
      columns: {
        ...props.state.columns,
        [columnId]: {
          ...props.state.columns[columnId],
          taskIds: newTaskIds,
        },
      },
    })
  }

  function deleteTask(columnId, index, taskId) {
    const column = props.state.columns[columnId]
    const newTaskIds = Array.from(column.taskIds)
    newTaskIds.splice(index, 1)

    const tasks = props.state.tasks
    const { [taskId]: oldTask, ...newTasks } = tasks

    props.setState({
      ...props.state,
      tasks: {
        ...newTasks,
      },
      columns: {
        ...props.state.columns,
        [columnId]: {
          ...column,
          taskIds: newTaskIds,
        },
      },
    })
  }

  return (
    <>
      <Draggable draggableId={props.task.id} index={props.index}>
        {(provided) => (
          <>
            <div
              className="px-3 py-4 mb-4 bg-white rounded-md shadow-md cursor-pointer"
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
            >
              {priority && (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-yellow-400 inline-flex"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>{" "}
                  <p className="inline-flex text-red-600 text-sm">Urgent</p>
                </>
              )}

              <textarea
                placeholder="title"
                value={props.task.content}
                onChange={(e) => editTask(e, props.task.id)}
              />

              <div className="flex justify-between ">
                <div onClick={() => deleteTask(props.columnId, props.index, props.task.id)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                  </svg>
                </div>
                <div onClick={() => setHighPriority(props.task.id)}>
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
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </div>
                <div onClick={() => addTask(props.columnId)}>+</div>
              </div>
            </div>
          </>
        )}
      </Draggable>
    </>
  )
}

export default Task
