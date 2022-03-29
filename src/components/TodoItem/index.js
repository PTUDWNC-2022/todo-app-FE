import React from 'react';
import { Form } from 'react-bootstrap';

import './TodoItem.css';

const TodoItem = ({ name, isCompleted, onToggle, onTodoClicked }) => {
	return (
		<li className={`todo-item ${isCompleted && "checked-item"}`} onClick={onTodoClicked}>
			<Form.Check
				type="checkbox"
				label={name}
				checked={isCompleted}
				onChange={onToggle}
			/>
		</li>
	);
};

export default TodoItem;
