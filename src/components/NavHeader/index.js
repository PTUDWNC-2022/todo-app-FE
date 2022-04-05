import React from 'react';
import { Container, Form, FormControl, Navbar } from 'react-bootstrap';

import './NavHeader.css';

const NavHeader = () => {
	return (
		<Navbar bg="primary" variant="dark">
			<Container fluid className="header">
				<div className="header-left">
					<button className="wrap-icon">
						<i className="bi bi-grid-3x3-gap-fill icon"></i>
					</button>
				</div>
				<div className="header-center">
					<Navbar.Brand href="#home">To Do</Navbar.Brand>
					<Form className="search">
						<FormControl
							type="search"
							placeholder="Search"
							className="me-2"
							aria-label="Search"
						/>
					</Form>
					<div className="options">
						<button className="wrap-icon">
							<i className="bi bi-gear icon"></i>
						</button>
						<button className="wrap-icon">
							<i className="bi bi-question-lg icon"></i>
						</button>
						<button className="wrap-icon">
							<i className="bi bi-megaphone icon"></i>
						</button>
					</div>
				</div>
				<div className="header-right">
					<button className="wrap-icon">
						<i className="bi bi-person-circle icon"></i>
					</button>
				</div>
			</Container>
		</Navbar>
	);
};

export default NavHeader;
