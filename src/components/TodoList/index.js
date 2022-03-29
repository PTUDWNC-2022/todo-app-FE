import React, { useEffect, useState } from 'react';
import { Navbar } from 'react-bootstrap';
import TodoItem from '../TodoItem';
import './TodoList.css';

const TodoList = ({ setTodoCallback }) => {
	const [error, setError] = useState(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const [todos, setTodos] = useState([]);

	// Note: the empty deps array [] means
	// this useEffect will run once
	// similar to componentDidMount()
	useEffect(() => {
		loadAllTodos();
	}, []);

	const loadAllTodos = () => {
		fetch(`${process.env.REACT_APP_API_URL}/todos`)
			.then((res) => res.json())
			.then(
				(result) => {
					console.log('call')
					setIsLoaded(true);
					setTodos(result);
				},
				// Note: it's important to handle errors here
				// instead of a catch() block so that we don't swallow
				// exceptions from actual bugs in components.
				(error) => {
					setIsLoaded(true);
					setError(error);
				}
			);
	};

	const handleToggleTodoItem = (todo) => {
		const { isCompleted, ...rest } = todo;
		const id = todo._id;

		const requestOptions = {
		  	method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ isCompleted: !isCompleted })
		};

		fetch(`${process.env.REACT_APP_API_URL}/todos/${id}`, requestOptions).then(async response => {
			if (response.ok) {
				console.log(todos)
				await loadAllTodos();
				console.log(todos)
				setTodoCallback(todos.find(item => item._id === id));
			} else {
				const data = await response.json();
				const error = (data && data.message) || response.status;
				await Promise.reject(error);
			}
		}).catch(error => setError(error));
	};

	const handleViewTodoDetail = (todo) => {
		setTodoCallback(todo);
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
				<ul className="todo-list">
					{todos.map((todo) => (
						<TodoItem
							key={todo._id}
							name={todo.name}
							isCompleted={todo.isCompleted}
							onToggle={() => handleToggleTodoItem(todo)}
							onTodoClicked={() => handleViewTodoDetail(todo)}
						/>
					))}
				</ul>
			</>
		);
	}
};

export default TodoList;
