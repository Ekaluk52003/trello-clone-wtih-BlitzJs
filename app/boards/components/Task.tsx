import React from "react"
import { Draggable } from "react-beautiful-dnd"

function Task(props) {
  const [priority, setPriority] = React.useState(props.task.priority)
  function editTask(e, taskId, columnId) {
    props.setState({
      ...props.state,
      tasks: {
        ...props.state.tasks,
        [taskId]: {
          id: taskId,
          content: e.target.value,
        },
      },
    })
  }

  function setHighPriority(taskId) {
    setPriority(!priority)
    props.setState({
      ...props.state,
      tasks: {
        ...props.state.tasks,
        [taskId]: {
          id: taskId,
          content: taskId.content,
          priority,
        },
      },
    })
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
              {priority ? (
                <>
                  ⚡<span className="text-sm">Urgent</span>{" "}
                </>
              ) : (
                ""
              )}
              <textarea
                rows="2"
                type="text"
                value={props.task.content}
                onChange={(e) => editTask(e, props.task.id, props.columnId)}
              />
              <div className="flex justify-between ">
                <div onClick={() => deleteTask(props.columnId, props.index, props.task.id)}>⛔</div>

                <div onClick={() => setHighPriority(props.task.id)}>🔥</div>
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
