import "./RightsideBar.css";
import { Card, Col, Form, Row } from "react-bootstrap";
import React, { useContext, useEffect, useRef, useState } from "react";
import DatePicker from "react-date-picker";
import { TodoContext } from "../../contexts/TodoContext";
import TodoAPI from "../../api/todo.api";
import { priorityList } from "../../constants/priorities";

const RightSideBar = () => {
  const todoContext = useContext(TodoContext);
  const chosenTodo = todoContext.chosenTodo;
  const [showPriority, setShowPriority] = useState(false);

  function useOutsideAlerter(ref) {
    useEffect(() => {
      /**
       * If clicked on outside of element
       */
      function handleClickOutside(event) {
        if (
          !ref.current ||
          ref.current.contains(event.target) ||
          event.target.classList.contains("todo-item") ||
          event.target.classList.contains("form-check-label") ||
          event.target.classList.contains("form-check-input") ||
          event.target.classList.contains("dropdown-btn") ||
          event.target.classList.contains("dropdown-toggle") ||
          event.target.classList.contains("dropdown-item") ||
          (event.target.classList.contains("form-control") &&
            todoContext.expand)
        ) {
          todoContext.setExpand(true);
        } else {
          todoContext.setExpand(false);
          setShowPriority(false);
        }
      }

      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  const containerRef = useRef(null);
  useOutsideAlerter(containerRef);

  const onFocusOut = async (event, field) => {
    if (
      (event.currentTarget.textContent === chosenTodo.name &&
        field === "name") ||
      (event.currentTarget.textContent === chosenTodo.note && field === "note")
    )
      return;
    try {
      const response = await TodoAPI.handleUpdateTodoItem({
        ...chosenTodo,
        [field]: event.currentTarget.textContent,
      });
      if (response.ok) {
        const result = await TodoAPI.loadAllTodos();
        const jsonResult = await result.json();
        todoContext.setTodosList(jsonResult);
        todoContext.setChosenTodo(
          jsonResult.find((item) => item._id === chosenTodo._id)
        );
      } else {
        const data = await response.json();
        const error = (data && data.message) || response.status;
        await Promise.reject(error);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onToggleTodo = async () => {
    try {
      const response = await TodoAPI.handleUpdateTodoItem({
        ...chosenTodo,
        isCompleted: !chosenTodo.isCompleted,
      });
      if (response.ok) {
        const result = await TodoAPI.loadAllTodos();
        const jsonResult = await result.json();
        todoContext.setTodosList(jsonResult);
        todoContext.setChosenTodo(
          jsonResult.find((item) => item._id === chosenTodo._id)
        );
      } else {
        const data = await response.json();
        const error = (data && data.message) || response.status;
        await Promise.reject(error);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Customize React-Datetime
  const updateDatetime = async (value) => {
    try {
      const response = await TodoAPI.handleUpdateTodoItem({
        ...chosenTodo,
        dueDate: value,
      });
      if (response.ok) {
        const result = await TodoAPI.loadAllTodos();
        const jsonResult = await result.json();
        todoContext.setTodosList(jsonResult);
        todoContext.setChosenTodo(
          jsonResult.find((item) => item._id === chosenTodo._id)
        );
      } else {
        const data = await response.json();
        const error = (data && data.message) || response.status;
        await Promise.reject(error);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onDateChanged = async (date) => {
    await updateDatetime(!date ? date : date.toISOString());
  };

  const addPriority = async (e) => {
    try {
      const response = await TodoAPI.handleUpdateTodoItem({
        ...chosenTodo,
        priority: e.currentTarget.value,
      });
      if (response.ok) {
        const result = await TodoAPI.loadAllTodos();
        const jsonResult = await result.json();
        todoContext.setTodosList(jsonResult);
        todoContext.setChosenTodo(
          jsonResult.find((item) => item._id === chosenTodo._id)
        );
      } else {
        const data = await response.json();
        const error = (data && data.message) || response.status;
        await Promise.reject(error);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div
      className={`container w-25 ${
        !todoContext.expand ? "collapse-container" : ""
      }`}
      ref={containerRef}
    >
      <Card body>
        <Row>
          <Col xl={1} className="d-flex align-items-center">
            <Form.Check
              type="checkbox"
              checked={chosenTodo && chosenTodo.isCompleted}
              onChange={onToggleTodo}
            />
          </Col>
          <Col xl={11}>
            <span
              role="textbox"
              dangerouslySetInnerHTML={{
                __html: chosenTodo ? chosenTodo.name : "",
              }}
              contentEditable
              type="text"
              className="todo-name"
              onBlur={(event) => onFocusOut(event, "name")}
              style={{
                textDecoration:
                  chosenTodo && chosenTodo.isCompleted
                    ? "line-through"
                    : "none",
              }}
            />
          </Col>
        </Row>
      </Card>
      <Card className="my-2 due-date-card">
        <Card.Body className="">
          <Row>
            <Col xl={1} className="d-flex align-items-center">
              <div>
                <i className="bi bi-calendar-check" />
              </div>
            </Col>
            <Col xl={11}>
              <DatePicker
                onChange={onDateChanged}
                value={
                  chosenTodo &&
                  chosenTodo.dueDate &&
                  new Date(chosenTodo.dueDate)
                }
                calendarIcon={null}
                minDate={new Date()}
                className="date-picker"
                format="dd/MMM/yyyy"
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <Card>
        <Card.Body>
          <span
            role="textbox"
            type="text"
            className="note"
            contentEditable
            data-placeholder="Add note"
            dangerouslySetInnerHTML={{
              __html: chosenTodo ? chosenTodo.note : "",
            }}
            onBlur={(event) => onFocusOut(event, "note")}
          />
        </Card.Body>
      </Card>
      <Card
        body
        className="mt-2"
        onClick={() => setShowPriority(!showPriority)}
      >
        <Row>
          <Col xl={1} className="d-flex align-items-center">
            <i className="bi bi-flag-fill"></i>
          </Col>
          <Col xl={11}>
            {chosenTodo && chosenTodo.priority
              ? `Priority: ${chosenTodo.priority}`
              : "Set priority of your task"}
          </Col>
        </Row>
      </Card>
      {showPriority && (
        <Form.Group className="priority-list">
          {priorityList.map((p, index) => (
            <Form.Check
              key={index}
              value={p.name}
              label={p.name}
              id={p.name}
              type="radio"
              checked={chosenTodo && chosenTodo.priority === p.name}
              onChange={(e) => addPriority(e)}
              className="priority-item"
              style={{ color: p.color }}
            />
          ))}
        </Form.Group>
      )}
    </div>
  );
};

export default RightSideBar;
