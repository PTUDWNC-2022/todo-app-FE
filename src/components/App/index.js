import './App.css';
import { Col, Container, Row, ThemeProvider } from 'react-bootstrap';
import TodoList from '../TodoList';
import Sidebar from '../Sidebar';
import NavHeader from '../NavHeader';
import RightSideBar from '../RightsideBar';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function App() {
	const [todo, setTodo] = useState({});

	const navigate = useNavigate();

	useEffect(() => {
		const authString = localStorage.getItem('authInfo');
		const accessToken = authString && JSON.parse(authString).accessToken;
		if (!accessToken) {
			navigate('/login');
		}
	}, []);

	const setTodoCallback = (todo) => {
		setTodo(todo);
	};

	return (
		<ThemeProvider
			breakpoints={['xxxl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']}>
			<NavHeader />
			<Container fluid>
				<Row>
					<Col md={4}>{/*<Sidebar />*/}</Col>
					<Col md={8}>
						<TodoList setTodoCallback={setTodoCallback} />
					</Col>
				</Row>
				<RightSideBar todoDetail={todo} />
			</Container>
		</ThemeProvider>
	);
}

export default App;
