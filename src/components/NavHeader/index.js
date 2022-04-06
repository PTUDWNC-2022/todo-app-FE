import React from 'react';
import { Container, Form, FormControl, Navbar } from 'react-bootstrap';

import './NavHeader.css';

const NavHeader = ({ user }) => {
	return (
		<Navbar bg="primary" variant="dark">
			<Container fluid className="header">
				<div className="header-left">
					<button className="wrap-icon">
						<i className="bi bi-grid-3x3-gap-fill icon"/>
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
							<i className="bi bi-gear icon"/>
						</button>
						<button className="wrap-icon">
							<i className="bi bi-question-lg icon"/>
						</button>
						<button className="wrap-icon">
							<i className="bi bi-megaphone icon"/>
						</button>
					</div>
				</div>
				<div className="header-right">
					<span>Hi, {user ? user.socialUser.fullName : ''}</span>
					{user ? <img src={user.socialUser.picture} alt="user-picture" style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '50%', marginLeft: '1rem' }}/> : <button className="wrap-icon">
						<i className="bi bi-person-circle icon"/>
					</button>}
				</div>
			</Container>
		</Navbar>
	);
};

export default NavHeader;
