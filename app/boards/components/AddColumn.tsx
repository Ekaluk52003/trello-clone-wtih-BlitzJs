import React, { useState } from "react"

function AddColumn(props) {
  const [showNewColumnButton, setShowNewColumnButton] = useState(true)
  const [value, setValue] = useState("")

  function handleInputChange(event) {
    setValue(event.target.value)
  }

  function onNewColumnButtonClick() {
    setShowNewColumnButton(false)
  }

  function onNewColumnInputComplete() {
    setShowNewColumnButton(true)
    addNewColumn(value)
    setValue("")
  }

  function addNewColumn(title) {
    const newColumnOrder = Array.from(props.state.columnOrder)
    const newColumnId = "column-" + Math.floor(Math.random() * 100000)
    newColumnOrder.push(newColumnId)

    const newColumn = {
      id: newColumnId,
      title: title,
      taskIds: [],
    }

    props.setState({
      ...props.state,
      columnOrder: newColumnOrder,
      columns: {
        ...props.state.columns,
        [newColumnId]: newColumn,
      },
    })
  }

  return (
    <div>
      {showNewColumnButton ? (
        <button
          onClick={onNewColumnButtonClick}
          className=" text-bold bg-gray-200 px-4 py-2 mt-5 mb-2 rounded-lg"
        >
          + Add column
        </button>
      ) : (
        <div className="p-2 mb-5 bg-gray-200 w-52">
          <input
            type="text"
            value={value}
            className="align-middle w-44"
            onChange={handleInputChange}
            onBlur={onNewColumnInputComplete}
          />
          <p className="text-gray-600 tex-sm">Please type column name</p>{" "}
        </div>
      )}
    </div>
  )
}

export default AddColumn
