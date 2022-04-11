import React, { useContext, useEffect, useState } from "react";
import { Navbar } from "react-bootstrap";
import TodoItem from "../TodoItem";
import "./TodoList.css";
import TodoForm from "../TodoForm";
import { authHeader } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import { TodoContext } from "../../contexts/TodoContext";
import TodoAPI from "../../api/todo.api";

const TodoList = () => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  const todoContext = useContext(TodoContext);

  // Note: the empty deps array [] means
  // this useEffect will run once
  // similar to componentDidMount()
  useEffect(() => {
    loadAllTodos();
  }, []);

  const loadAllTodos = async () => {
    const fetchResult = await TodoAPI.loadAllTodos()
      .then((res) => {
        if (res.status === 401) {
          setError({ message: "Unauthorized" });
          navigate("login");
          return;
        }
        return res.json();
      })
      .then(
        (result) => {
          setIsLoaded(true);
          todoContext.setTodosList(result);
          return Promise.resolve(result);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
    return fetchResult;
  };

  const handleCreateNewTodo = (input) => {
    const userId = JSON.parse(localStorage.getItem("authInfo")).user._id;
    const requestOptions = {
      method: "POST",
      headers: authHeader(),
      body: JSON.stringify({
        name: input,
        isCompleted: false,
        userId: userId,
      }),
    };

    fetch(`${process.env.REACT_APP_API_URL}/todos`, requestOptions)
      .then(async (resp) => {
        if (resp.ok) {
          await loadAllTodos();
        } else {
          const data = await resp.json();
          const error = (data && data.message) || resp.status;
          await Promise.reject(error);
        }
      })
      .catch((error) => {
        setError(error);
      });
  };

  const handleToggleTodoItem = async (todo) => {
    const { _id, ...rest } = todo;

    try {
      const response = await TodoAPI.handleUpdateTodoItem({
        ...todo,
        isCompleted: !todo.isCompleted,
      });
      if (response.ok) {
        const result = await loadAllTodos();
        todoContext.setChosenTodo(result.find((item) => item._id === _id));
      } else {
        const data = await response.json();
        const error = (data && data.message) || response.status;
        await Promise.reject(error);
      }
    } catch (e) {
      setError(e);
    }
  };

  const handleViewTodoDetail = (todo) => {
    todoContext.setChosenTodo(todo);
  };

  const handleDeleteTodo = (todo) => {
    const id = todo._id;

    //Call API
    fetch(`${process.env.REACT_APP_API_URL}/todos/${id}`, {
      method: "DELETE",
      headers: authHeader(),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          loadAllTodos();
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <>
        <Navbar variant="light">
          <Navbar.Brand>My Day</Navbar.Brand>
        </Navbar>
        <TodoForm handleCreateNewTodo={handleCreateNewTodo} />
        <ul className="todo-list">
          {todoContext.todosList.map((todo) => (
            <TodoItem
              key={todo._id}
              name={todo.name}
              isCompleted={todo.isCompleted}
              onToggle={() => handleToggleTodoItem(todo)}
              onTodoClicked={() => handleViewTodoDetail(todo)}
              onTodoDelete={() => handleDeleteTodo(todo)}
            />
          ))}
        </ul>
      </>
    );
  }
};

export default TodoList;
