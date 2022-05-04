import { createContext, useState } from "react";

const TodoContext = createContext(null);

const TodoProvider = ({ children }) => {
  const [chosenTodo, setChosenTodo] = useState(null);
  const [todosList, setTodosList] = useState([]);
  const [expand, setExpand] = useState(false);
  const [allTodos, setAllTodos] = useState([]);

  const value = {
    chosenTodo,
    setChosenTodo,
    todosList,
    setTodosList,
    expand,
    setExpand,
    allTodos,
    setAllTodos,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};

export { TodoContext, TodoProvider };
