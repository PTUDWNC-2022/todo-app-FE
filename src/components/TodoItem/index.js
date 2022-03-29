import React from 'react';
import { Form } from 'react-bootstrap';

import './TodoItem.css';

const TodoItem = ({ name, isCompleted, onToggle }) => {
	return (
		<li className="todo-item">
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
