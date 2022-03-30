import './App.css';
import { Col, Container, Row, ThemeProvider } from 'react-bootstrap';
import TodoList from '../TodoList';
import Sidebar from '../Sidebar';
import NavHeader from '../NavHeader';
import RightSideBar from '../RightsideBar';
import { useState } from 'react';

function App() {
	const [todo, setTodo] = useState({});

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
