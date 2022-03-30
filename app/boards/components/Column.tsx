import React from "react"
import { Droppable, Draggable } from "react-beautiful-dnd"
import Task from "./Task"
import AddTask from "./AddTask"

function Column(props) {
  function deleteColumn(columnId, index) {
    const columnTasks = props.state.columns[columnId].taskIds

    const finalTasks = columnTasks.reduce((previousValue, currentValue) => {
      const { [currentValue]: oldTask, ...newTasks } = previousValue
      return newTasks
    }, props.state.tasks)

    const columns = props.state.columns
    const { [columnId]: oldColumn, ...newColumns } = columns

    const newColumnOrder = Array.from(props.state.columnOrder)
    newColumnOrder.splice(index, 1)

    props.setState({
      tasks: {
        ...finalTasks,
      },
      columns: {
        ...newColumns,
      },
      columnOrder: newColumnOrder,
    })
  }

  return (
    <Draggable draggableId={props.column.id} index={props.index}>
      {(provided) => (
        <>
          <div className="mr-5 w-52" {...provided.draggableProps} ref={provided.innerRef}>
            <div className="px-2 pb-2 bg-gray-200 rounded-none shadow-sm">
              <div className="flex justify-between px-2 py-2 align-baseline">
                <h3 {...provided.dragHandleProps} className="text-sm font-bold">
                  {props.column.title}
                </h3>
                <span onClick={() => deleteColumn(props.column.id, props.index)}> 🗑</span>
              </div>
              <Droppable droppableId={props.column.id} type="task">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {props.tasks.map((task, index) => (
                      <Task
                        key={task.id}
                        task={task}
                        index={index}
                        columnId={props.column.id}
                        state={props.state}
                        setState={props.setState}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <AddTask columnId={props.column.id} state={props.state} setState={props.setState} />
            </div>
          </div>
        </>
      )}
    </Draggable>
  )
}

export default Column
