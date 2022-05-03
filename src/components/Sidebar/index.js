import React, { useContext, useEffect, useState } from "react";
import { Dropdown, FloatingLabel, Form, ListGroup } from "react-bootstrap";

import "./Sidebar.css";
import { authHeader } from "../../api/auth";
import { LabelContext } from "../../contexts/LabelContext";
import { ListContext } from "../../contexts/ListContext";
import { TodoContext } from "../../contexts/TodoContext";
import TodoAPI from "../../api/todo.api";

const Sidebar = () => {
  const defaultLabels = [
    "My day",
    "Important",
    "Planned",
    "Assigned to me",
    "Flagged email",
    "Task",
  ];
  const [newList, setNewList] = useState("");
  const labelContext = useContext(LabelContext);
  const listContext = useContext(ListContext);
  const todoContext = useContext(TodoContext);
  const user = JSON.parse(localStorage.getItem("authInfo")).user;

  const fetchLabels = async () => {
    const resp = await fetch(
      `${process.env.REACT_APP_API_URL}/labels/${user._id}`,
      {
        method: "GET",
        headers: authHeader(),
      }
    );
    const respJson = await resp.json();

    labelContext.setDocumentId(respJson.insertedId || respJson._id);
    labelContext.setLabels(
      respJson.insertedId
        ? []
        : [...defaultLabels, ...respJson.additionalLabels]
    );
    // setLabels([...defaultLabels, ...respJson.additionalLabels]);
  };

  useEffect(() => {
    void fetchLabels();
    void fetchLists();
  }, []);

  const handleOnChangeNewList = (event) => {
    setNewList(event.target.value);
  };

  const handleRemoveLabel = async (label) => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/labels/remove-label`, {
        method: "PUT",
        headers: authHeader(),
        body: JSON.stringify({
          documentId: labelContext.documentId,
          label: label.trim(),
        }),
      });
      await fetchLabels();
    } catch (e) {
      console.log(e);
    }
  };

  const fetchLists = async () => {
    const resp = await fetch(
      `${process.env.REACT_APP_API_URL}/lists/user/${user._id}`,
      {
        method: "GET",
        headers: authHeader(),
      }
    );
    const respJson = await resp.json();

    listContext.setLists(respJson);

    return respJson;
  };

  const handleEnter = async (event) => {
    if (
      event.key === "Enter" &&
      event.target.value.trim() !== "" &&
      event.target.value.trim().toLowerCase() !== "all"
    ) {
      await fetch(`${process.env.REACT_APP_API_URL}/lists`, {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify({
          name: newList,
          isPublish: false,
          creator: user._id,
          users: [user],
          disabled: false,
          todos: [],
        }),
      });
      setNewList("");
      await fetchLists();
    }
  };

  const onListNameBlurred = async (event) => {
    if (
      event.currentTarget.textContent.trim() ===
        listContext.selectedList.name ||
      event.currentTarget.textContent.trim() === "All" ||
      !event.currentTarget.textContent.trim()
    )
      return;
    else {
      const lastId = listContext.selectedList._id;
      try {
        await fetch(`${process.env.REACT_APP_API_URL}/lists/update`, {
          method: "PUT",
          headers: authHeader(),
          body: JSON.stringify({
            ...listContext.selectedList,
            name: event.currentTarget.textContent.trim(),
          }),
        });
        const newLists = await fetchLists();
        listContext.setSelectedList(
          newLists.find((list) => list._id === lastId)
        );
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleRemoveList = async () => {
    try {
      await Promise.all(
        listContext.selectedList.todos.map(async (todo) => {
          await fetch(`${process.env.REACT_APP_API_URL}/todos/${todo._id}`, {
            method: "DELETE",
            headers: authHeader(),
          });
        })
      );

      await fetch(`${process.env.REACT_APP_API_URL}/lists/update`, {
        method: "PUT",
        headers: authHeader(),
        body: JSON.stringify({
          ...listContext.selectedList,
          todos: [],
          disabled: true,
        }),
      });
      await fetchLists();
      const todos = await TodoAPI.loadAllTodos();
      const todosJSON = await todos.json();
      todoContext.setAllTodos(todosJSON.todos);
      listContext.setSelectedList({ name: "All", todos: todosJSON.todos });
      todoContext.setTodosList(todosJSON.todos);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className={"sidebar"}>
      <ListGroup variant="flush">
        <ListGroup.Item
          className={`label-item ${
            listContext.selectedList.name === "All" ? "custom-active" : ""
          }`}
          action
          onClick={() => {
            listContext.setSelectedList({
              name: "All",
              todos: todoContext.todosList,
            });
          }}
        >
          <i className="bi bi-brightness-high"></i>
          <span className={"label-name"}>All</span>
        </ListGroup.Item>
        {listContext.lists.sort().map((list) => {
          return (
            !list.disabled && (
              <ListGroup.Item
                className={`additional-label ${
                  list.name === listContext.selectedList.name
                    ? "custom-active"
                    : ""
                }`}
                action
                onClick={() => {
                  listContext.setSelectedList(list);
                }}
              >
                <div className={"list-item"}>
                  <i
                    className="bi bi-list-check"
                    style={{ flexBasis: "auto" }}
                  ></i>
                  <span
                    contentEditable
                    role="textbox"
                    type="text"
                    className={"list-name"}
                    onBlur={onListNameBlurred}
                  >
                    {list.name}
                  </span>
                </div>
                <div>
                  <Dropdown>
                    <Dropdown.Toggle
                      id="dropdown-basic"
                      size="sm"
                      className="dropdown-btn list-menu"
                    />
                    <Dropdown.Menu>
                      <Dropdown.Item className="dropdown-list-item">
                        <i className="bi bi-people-fill" />
                        Publish this list
                      </Dropdown.Item>
                      <Dropdown.Item
                        className="dropdown-list-item delete-task"
                        onClick={handleRemoveList}
                      >
                        <i className="bi bi-trash3" />
                        Remove list
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </ListGroup.Item>
            )
          );
        })}
      </ListGroup>
      <FloatingLabel
        controlId={"floatingInput"}
        label={"Add new list"}
        className={"mt-2 me-2"}
      >
        <Form.Control
          id={"new-list-form"}
          type="text"
          placeholder={"ABC"}
          value={newList}
          onChange={handleOnChangeNewList}
          onKeyDown={handleEnter}
        />
      </FloatingLabel>
    </div>
  );
};
export default Sidebar;
