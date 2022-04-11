import React, {useContext, useState} from "react";
import { Dropdown, Form } from "react-bootstrap";
import ConfirmModal from "../CommonModal/ConfirmModal";

import "./TodoItem.css";

const TodoItem = ({
  name,
  isCompleted,
  onToggle,
  onTodoClicked,
  onTodoDelete,
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const toggleShowConfirmModal = () => setShowConfirmModal(!showConfirmModal);

  const handleConfirmModalAction = (type) => {
    if (type === "MODAL_ACTION_CONFIRM") {
      onTodoDelete(onTodoDelete);
    }
    toggleShowConfirmModal();
  };

  return (
    <li
      className={`todo-item ${isCompleted ? "checked-item" : ""}`}
      onClick={onTodoClicked}
    >
      <Form.Check
        type="checkbox"
        label={name}
        checked={isCompleted}
        onChange={onToggle}
      />
      <div className="column-dropdown-actions">
        <Dropdown>
          <Dropdown.Toggle
            id="dropdown-basic"
            size="sm"
            className="dropdown-btn"
          />

          <Dropdown.Menu>
            <Dropdown.Item>
              <i className="bi bi-brightness-high" />
              Remove from My Day
            </Dropdown.Item>
            <Dropdown.Item>
              <i className="bi bi-star" />
              Mark as important
            </Dropdown.Item>
            <Dropdown.Item>
              <i className="bi bi-check-circle" />
              Mark as completed
            </Dropdown.Item>
            <Dropdown.Item
              onClick={toggleShowConfirmModal}
              className="delete-task"
            >
              <i className="bi bi-trash3" />
              Delete task
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <ConfirmModal
        show={showConfirmModal}
        onAction={handleConfirmModalAction}
        title="Delete task"
        content={`<strong>"${name}" will be permanently deleted.</strong> <br />You won't be unable to undo this action.`}
      />
    </li>
  );
};

export default TodoItem;
