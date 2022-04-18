import React, {useContext, useState} from 'react';
import { Dropdown, Form } from 'react-bootstrap';
import { priorityList } from '../../constants/priorities';
import ConfirmModal from '../CommonModal/ConfirmModal';

import './TodoItem.css';
import {TodoContext} from "../../contexts/TodoContext";

const TodoItem = ({
	name,
	isCompleted,
	priority,
	onToggle,
	onTodoClicked,
	onTodoDelete,
}) => {
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const todoContext = useContext(TodoContext);

	const toggleShowConfirmModal = () => setShowConfirmModal(!showConfirmModal);

	const handleConfirmModalAction = (type) => {
		if (type === 'MODAL_ACTION_CONFIRM') {
			onTodoDelete(onTodoDelete);
		}
		toggleShowConfirmModal();
	};

	return (
		<li
			className={`todo-item ${isCompleted ? 'checked-item' : ''} ${todoContext.expand ? 'expand-item' : ''}`}
			onClick={onTodoClicked}>
			<Form.Check
				type="checkbox"
				label={name}
				checked={isCompleted}
				onChange={onToggle}
			/>
			{priorityList.map((p) =>
				priority && p.name === priority ? (
					<div style={{ color: p.color }} className="priority">
						<i className="bi bi-flag-fill"></i>
						{priority}
					</div>
				) : null
			)}

			<div className="column-dropdown-actions">
				<Dropdown>
					<Dropdown.Toggle
						id="dropdown-basic"
						size="sm"
						className="dropdown-btn"
					/>

					<Dropdown.Menu>
						<Dropdown.Item>
							<i className="bi bi-brightness-high" />
							Remove from My Day
						</Dropdown.Item>
						<Dropdown.Item>
							<i className="bi bi-star" />
							Mark as important
						</Dropdown.Item>
						<Dropdown.Item>
							<i className="bi bi-check-circle" />
							Mark as completed
						</Dropdown.Item>
						<Dropdown.Item
							onClick={toggleShowConfirmModal}
							className="delete-task">
							<i className="bi bi-trash3" />
							Delete task
						</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			</div>

			<ConfirmModal
				show={showConfirmModal}
				onAction={handleConfirmModalAction}
				title="Delete task"
				content={`<strong>"${name}" will be permanently deleted.</strong> <br />You won't be unable to undo this action.`}
			/>
		</li>
	);
};

export default TodoItem;
