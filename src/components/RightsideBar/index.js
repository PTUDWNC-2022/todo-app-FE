import "./RightsideBar.css";
import { Card, Col, Form, Row } from "react-bootstrap";
import React, { useEffect, useRef, useState } from "react";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";

const RightSideBar = ({ todoDetail }) => {
  const [expand, setExpand] = useState(false);
  const [todoName, setTodoName] = useState("");

  function useOutsideAlerter(ref) {
    useEffect(() => {
      // Update current todo
      setTodoName(todoDetail.name);

      /**
       * If clicked on outside of element
       */
      function handleClickOutside(event) {
        if (
          ref.current &&
          !ref.current.contains(event.target) &&
          !event.target.classList.contains("todo-item") &&
          !event.target.classList.contains("form-check-label") &&
          !event.target.classList.contains("form-check-input")
        ) {
          setExpand(false);
        } else {
          setExpand(true);
        }
      }

      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref, todoDetail]);
  }

  const containerRef = useRef(null);
  useOutsideAlerter(containerRef);

  const onFocusOut = (event) => {
    setTodoName(event.currentTarget.textContent);
  };

  return (
    <div
      className={`container w-25 ${!expand ? "collapse-container" : ""}`}
      ref={containerRef}
    >
      <Card body>
        <Row>
          <Col xl={1} className="d-flex align-items-center">
            <Form.Check
              type="checkbox"
              checked={todoDetail.isCompleted}
              onChange={() => {}}
            />
          </Col>
          <Col xl={11}>
            <span
              role="textbox"
              dangerouslySetInnerHTML={{
                __html: todoName ? todoName.toString() : "",
              }}
              contentEditable
              type="text"
              className="todo-name"
              onBlur={onFocusOut}
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
            <Col xl={10}>
              <Datetime
                inputProps={{
                  placeholder: "Add due date",
                  style: {
                    border: "none",
                    outline: "none",
                    boxShadow: "none",
                    color: "rgb(13, 110, 253)",
                  },
                }}
              />
            </Col>
            <Col xl={1} className="close-button d-none">
              <i className="bi bi-x" />
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <Card>
        <Card.Body>
          <p>Add note</p>
          <textarea className="note"></textarea>
        </Card.Body>
      </Card>
    </div>
  );
};

export default RightSideBar;
