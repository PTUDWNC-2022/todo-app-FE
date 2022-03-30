import { Form } from "react-bootstrap";
import {useState} from "react";

const TodoForm = ({ handleCreateNewTodo }) => {
    const [input, setInput] = useState('');

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
          />
      </>
  );
}

export default TodoForm;