import React, { useContext, useState } from 'react';
import { Dropdown, Form } from 'react-bootstrap';
import { priorityList } from '../../constants/priorities';
import ConfirmModal from '../CommonModal/ConfirmModal';
import { Draggable } from 'react-beautiful-dnd';

import './TodoItem.css';
import { TodoContext } from '../../contexts/TodoContext';

const TodoItem = ({
	index,
	id,
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

	const getItemStyle = (isDragging, draggableStyle) => ({
		// some basic styles to make the items look a bit nicer
		userSelect: 'none',
		// change background colour if dragging
		background: isDragging ? '#ecf7fd' : '',

		// styles we need to apply on draggables
		...draggableStyle,
	});

	return (
		<Draggable draggableId={id} index={index}>
			{(provided, snapshot) => (
				<li
					className={`todo-item ${isCompleted ? 'checked-item' : ''} ${
						todoContext.expand ? 'expand-item' : ''
					}`}
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					style={getItemStyle(
						snapshot.isDragging,
						provided.draggableProps.style
					)}
					onClick={onTodoClicked}>
					<Form.Check
						type="checkbox"
						label={name}
						checked={isCompleted}
						onChange={onToggle}
					/>
					{priorityList.map((p, index) =>
						priority && p.name === priority && priority !== 'None' ? (
							<div key={index} style={{ color: p.color }} className="priority">
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
								<Dropdown.Item className="dropdown-todo-item">
									<i className="bi bi-brightness-high" />
									Remove from My Day
								</Dropdown.Item>
								<Dropdown.Item className="dropdown-todo-item">
									<i className="bi bi-star" />
									Mark as important
								</Dropdown.Item>
								<Dropdown.Item className="dropdown-todo-item">
									<i className="bi bi-check-circle" />
									Mark as completed
								</Dropdown.Item>
								<Dropdown.Item
									onClick={toggleShowConfirmModal}
									className="dropdown-todo-item delete-task">
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
			)}
		</Draggable>
	);
};

export default TodoItem;
