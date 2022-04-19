import { Form } from "react-bootstrap";
import {useContext, useState} from "react";
import {TodoContext} from "../../contexts/TodoContext";
import './TodoForm.css';

const TodoForm = ({ handleCreateNewTodo }) => {
    const [input, setInput] = useState('');
    const todoContext = useContext(TodoContext);

    const handleEnter = (event) => {
        if (event.key === 'Enter') {
            handleCreateNewTodo(input);
            setInput('');
        }
    }

    const handleInput = (event) => {
        setInput(event.target.value);
    }

  return (
      <>
          <Form.Label htmlFor="inputTodoName">Create new todo</Form.Label>
          <Form.Control
              type="text"
              value={input}
              id="inputTodoName"
              onKeyPress={handleEnter}
              onChange={handleInput}
              className={todoContext.expand ? 'expand' : ''}
          />
      </>
  );
}

export default TodoForm;