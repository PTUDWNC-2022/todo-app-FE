import React, { useContext, useEffect, useState } from 'react';
import { Navbar } from 'react-bootstrap';
import TodoItem from '../TodoItem';
import './TodoList.css';
import TodoForm from '../TodoForm';
import { authHeader } from '../../api/auth';
import { useNavigate } from 'react-router-dom';
import { TodoContext } from '../../contexts/TodoContext';
import TodoAPI from '../../api/todo.api';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { mapOrder } from '../../utilities/sort';
import { cloneDeep } from 'lodash';

const TodoList = () => {
	const [error, setError] = useState(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const [board, setBoard] = useState({});
	const navigate = useNavigate();
	const todoContext = useContext(TodoContext);

	// Note: the empty deps array [] means
	// this useEffect will run once
	// similar to componentDidMount()
	useEffect(() => {
		loadAllTodos();
	}, []);

	const loadAllTodos = async () => {
		const fetchResult = await TodoAPI.loadAllTodos()
			.then((res) => {
				if (res.status === 401) {
					setError({ message: 'Unauthorized' });
					navigate('login');
					return;
				}
				return res.json();
			})
			.then(
				(board) => {
					setIsLoaded(true);
					setBoard(board);
					todoContext.setTodosList(
						mapOrder(board.todos, board.todoOrder, '_id')
					);
					console.log(board);
					return Promise.resolve(board);
				},
				// Note: it's important to handle errors here
				// instead of a catch() block so that we don't swallow
				// exceptions from actual bugs in components.
				(error) => {
					setIsLoaded(true);
					setError(error);
				}
			);
		return fetchResult;
	};

	const handleCreateNewTodo = (input) => {
		const userId = JSON.parse(localStorage.getItem('authInfo')).user._id;
		const requestOptions = {
			method: 'POST',
			headers: authHeader(),
			body: JSON.stringify({
				name: input,
				isCompleted: false,
				userId: userId,
			}),
		};

		fetch(`${process.env.REACT_APP_API_URL}/todos`, requestOptions)
			.then(async (resp) => {
				if (resp.ok) {
					await loadAllTodos();
				} else {
					const data = await resp.json();
					const error = (data && data.message) || resp.status;
					await Promise.reject(error);
				}
			})
			.catch((error) => {
				setError(error);
			});
	};

	const handleToggleTodoItem = async (todo) => {
		const { _id, ...rest } = todo;

		try {
			const response = await TodoAPI.handleUpdateTodoItem({
				...todo,
				isCompleted: !todo.isCompleted,
			});
			if (response.ok) {
				const result = await loadAllTodos();
				todoContext.setChosenTodo(result.find((item) => item._id === _id));
			} else {
				const data = await response.json();
				const error = (data && data.message) || response.status;
				await Promise.reject(error);
			}
		} catch (e) {
			setError(e);
		}
	};

	const handleViewTodoDetail = (todo) => {
		todoContext.setChosenTodo(todo);
	};

	const handleDeleteTodo = (todo) => {
		const id = todo._id;

		//Call API
		fetch(`${process.env.REACT_APP_API_URL}/todos/${id}`, {
			method: 'DELETE',
			headers: authHeader(),
		})
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

	// a little function to help us with reordering the result
	const reorder = (list, startIndex, endIndex) => {
		const result = Array.from(list);
		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);

		return result;
	};

	const onDragEnd = (result) => {
		// dropped outside the list
		if (!result.destination) {
			return;
		}

		if (result.destination.index === result.source.index) {
			return;
		}

		const newTodoList = reorder(
			todoContext.todosList,
			result.source.index,
			result.destination.index
		);

		const newBoard = { ...board };
		newBoard.todoOrder = newTodoList.map((todo) => todo._id);
		newBoard.todos = newTodoList;

		todoContext.setTodosList(newTodoList);
		setBoard(newBoard);

		// Call API update todoOrder in board detail
		const requestOptions = {
			method: 'PUT',
			headers: authHeader(),
			body: JSON.stringify({ id: board._id, todoOrder: newBoard.todoOrder }),
		};

		fetch(
			`${process.env.REACT_APP_API_URL}/user/${board._id}`,
			requestOptions
		).catch((error) => {
			setError(error);
			setBoard(board);
			todoContext.setTodosList(todoContext.todosList);
		});
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
				<TodoForm handleCreateNewTodo={handleCreateNewTodo} />
				<DragDropContext onDragEnd={onDragEnd}>
					<Droppable droppableId="droppable">
						{(provided, snapshot) => (
							<ul
								className="todo-list"
								ref={provided.innerRef}
								{...provided.droppableProps}>
								{todoContext.todosList.map((todo, index) => (
									<TodoItem
										key={todo._id}
										id={todo._id}
										index={index}
										name={todo.name}
										isCompleted={todo.isCompleted}
										priority={todo.priority}
										createdDate={todo.createdDate}
										onToggle={() => handleToggleTodoItem(todo)}
										onTodoClicked={() => handleViewTodoDetail(todo)}
										onTodoDelete={() => handleDeleteTodo(todo)}
									/>
								))}
								{provided.placeholder}
							</ul>
						)}
					</Droppable>
				</DragDropContext>
			</>
		);
	}
};

export default TodoList;
