import React, { useEffect, useState } from 'react';
import { Navbar } from 'react-bootstrap';
import TodoItem from '../TodoItem';
import './TodoList.css';
import TodoForm from "../TodoForm";

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

	const loadAllTodos = async () => {
		return fetch(`${process.env.REACT_APP_API_URL}/todos`)
			.then((res) => res.json())
			.then(
				(result) => {
					setIsLoaded(true);
					setTodos(result);
					return Promise.resolve(result);
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

	const handleCreateNewTodo = (input) => {
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name: input, isCompleted: false }),
		};

		fetch(`${process.env.REACT_APP_API_URL}/todos`, requestOptions).then(async (resp) => {
			if (resp.ok) {
				await loadAllTodos();
			} else {
				const data = await resp.json();
				const error = (data && data.message) || resp.status;
				await Promise.reject(error);
			}
		}).catch(error => {
			setError(error);
		});
	};

	const handleToggleTodoItem = (todo) => {
		const { isCompleted, ...rest } = todo;
		const id = todo._id;

		const requestOptions = {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ isCompleted: !isCompleted }),
		};

		fetch(`${process.env.REACT_APP_API_URL}/todos/${id}`, requestOptions)
			.then(async (response) => {
				if (response.ok) {
					const result = await loadAllTodos();
					setTodoCallback(result.find((item) => item._id === id));
				} else {
					const data = await response.json();
					const error = (data && data.message) || response.status;
					await Promise.reject(error);
				}
			})
			.catch((error) => setError(error));
	};

	const handleViewTodoDetail = (todo) => {
		setTodoCallback(todo);
	};

	const handleDeleteTodo = (todo) => {
		const id = todo._id;

		//Call API
		fetch(`${process.env.REACT_APP_API_URL}/todos/${id}`, { method: 'DELETE' })
			.then((res) => res.json())
			.then(
				(result) => {
					setIsLoaded(true);
					loadAllTodos();
				},
				(error) => {
					setIsLoaded(true);
					setError(error);
				}
			);
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
				<TodoForm handleCreateNewTodo={handleCreateNewTodo}/>
				<ul className="todo-list">
					{todos.map((todo) => (
						<TodoItem
							key={todo._id}
							name={todo.name}
							isCompleted={todo.isCompleted}
							onToggle={() => handleToggleTodoItem(todo)}
							onTodoClicked={() => handleViewTodoDetail(todo)}
							onTodoDelete={() => handleDeleteTodo(todo)}
						/>
					))}
				</ul>
			</>
		);
	}
};

export default TodoList;
