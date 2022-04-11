import {createContext, useState} from "react";

const TodoContext = createContext(null);

const TodoProvider = ({ children }) => {
  const [chosenTodo, setChosenTodo] = useState(null);
  const [todosList, setTodosList] = useState([]);

  const value = {
    chosenTodo,
    setChosenTodo,
    todosList,
    setTodosList
  };

  return (
      <TodoContext.Provider value={value}>
        {children}
      </TodoContext.Provider>
  );
}

export { TodoContext, TodoProvider };