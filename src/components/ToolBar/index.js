import React, { useState, useContext } from 'react';
import { Button, Dropdown, Navbar } from 'react-bootstrap';
import { priorityList } from '../../constants/priorities';
import { TodoContext } from '../../contexts/TodoContext';
import TodoAPI from '../../api/todo.api';

import './ToolBar.css';
import { mapOrder } from '../../utilities/sort';

const ToolBar = () => {
	const [sortType, setSortType] = useState(null);
	const todoContext = useContext(TodoContext);

	const handleSort = (type) => {
		const types = {
			priority: 'priority',
			createdDate: 'createdDate',
			dueDate: 'dueDate',
			alphabetically: 'name',
		};
		const sortProperty = types[type];

		const sorted = [...todoContext.todosList].sort((a, b) => {
			let valueA = a[sortProperty];
			let valueB = b[sortProperty];

			//Sort by alphabetically
			if (sortProperty === 'name') {
				valueA.toUpperCase(); // ignore upper and lowercase
				valueB.toUpperCase(); // ignore upper and lowercase
			}

			//Sort by priority
			if (sortProperty === 'priority') {
				const levelA = priorityList.find((p) => p.name === valueA)
					? priorityList.find((p) => p.name === valueA).level
					: 5;
				const levelB = priorityList.find((p) => p.name === valueB)
					? priorityList.find((p) => p.name === valueB).level
					: 5;
				valueA = levelA;
				valueB = levelB;
			}

			if (valueA < valueB) return -1;
			if (valueA > valueB) return 1;
			return 0;
		});

		todoContext.setTodosList(sorted);
		setSortType(type);
	};

	const handleReverseSortOrder = () => {
		const reverseList = [...todoContext.todosList].reverse();

		todoContext.setTodosList(reverseList);
	};

	const handleRemoveSortOrder = async () => {
		setSortType(null);

		const result = await TodoAPI.loadAllTodos();
		const jsonResult = await result.json();
		todoContext.setTodosList(
			mapOrder(jsonResult.todos, jsonResult.todoOrder, '_id')
		);
	};

	return (
		<Navbar
			variant="light"
			className={`toolbar ${todoContext.expand ? 'expand' : ''}`}>
			<Navbar.Brand>My Day</Navbar.Brand>

			<Dropdown>
				<Dropdown.Toggle
					id="dropdown-sort"
					size="sm"
					className={`btn-sort ${todoContext.expand ? 'btn-on-expand' : ''}`}>
					<i className="bi bi-arrow-down-up icon"></i>Sort
				</Dropdown.Toggle>

				<Dropdown.Menu className="menu-sort">
					<Dropdown.Header className="sort-header">Sort by</Dropdown.Header>
					<Dropdown.Divider />
					<Dropdown.Item onClick={() => handleSort('priority')}>
						<i className="bi bi-flag-fill"></i>
						Priority
					</Dropdown.Item>
					<Dropdown.Item onClick={() => handleSort('createdDate')}>
						<i className="bi bi-calendar2-plus"></i>
						Creation date
					</Dropdown.Item>
					<Dropdown.Item onClick={() => handleSort('dueDate')}>
						<i className="bi bi-calendar3"></i>
						Due date
					</Dropdown.Item>
					<Dropdown.Item onClick={() => handleSort('alphabetically')}>
						<i className="bi bi-arrow-down-up icon"></i>
						Alphabetically
					</Dropdown.Item>
				</Dropdown.Menu>
			</Dropdown>
			{sortType ? (
				<div
					className={`sorting-indicator ${
						todoContext.expand ? 'btn-on-expand' : ''
					}`}>
					<Button onClick={handleReverseSortOrder} className="sorting-opts-btn">
						<i className="bi bi-list-columns-reverse"></i>
					</Button>
					<span>Sorted by {sortType}</span>
					<Button onClick={handleRemoveSortOrder} className="sorting-opts-btn">
						<i className="bi bi-x"></i>
					</Button>
				</div>
			) : null}
		</Navbar>
	);
};

export default ToolBar;
