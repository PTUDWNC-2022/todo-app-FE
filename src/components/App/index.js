import './App.css';
import { Col, Container, Row, ThemeProvider } from 'react-bootstrap';
import TodoList from '../TodoList';
import Sidebar from '../Sidebar';
import NavHeader from '../NavHeader';

function App() {
	return (
		<ThemeProvider
			breakpoints={['xxxl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']}>
			<NavHeader />
			<Container fluid>
				<Row>
					<Col md={4}>
						<Sidebar />
					</Col>
					<Col md={8}>
						<TodoList />
					</Col>
				</Row>
			</Container>
		</ThemeProvider>
	);
}

export default App;
