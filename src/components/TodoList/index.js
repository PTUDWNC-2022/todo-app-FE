import React, { useEffect, useState } from 'react';
import { Navbar } from 'react-bootstrap';
import TodoItem from '../TodoItem';
import './TodoList.css';

const TodoList = () => {
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
		console.log(todo);
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
						/>
					))}
				</ul>
			</>
		);
	}
};

export default TodoList;
