import React from 'react';
import {
	Container,
	Dropdown,
	Form,
	FormControl,
	Navbar,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import './NavHeader.css';

const NavHeader = ({ user }) => {
	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.removeItem('authInfo');
		window.open(`${process.env.REACT_APP_API_URL}/users/logout`, '_self');
	};

	return (
		<Navbar bg="primary" variant="dark">
			<Container fluid className="header">
				<div className="header-left">
					<button className="wrap-icon">
						<i className="bi bi-grid-3x3-gap-fill icon" />
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
							<i className="bi bi-gear icon" />
						</button>
						<button className="wrap-icon">
							<i className="bi bi-question-lg icon" />
						</button>
						<button className="wrap-icon">
							<i className="bi bi-megaphone icon" />
						</button>
					</div>
				</div>
				<div className="header-right">
					<span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{user ? `Hi, ${user.socialUser ? user.socialUser.fullName : user.user.email}` : 'Login'}</span>
						<Dropdown className="wrap-icon">
							<Dropdown.Toggle
								id="dropdown-basic"
								size="sm"
								className="profile-btn">
								{user && user.socialUser ? <img src={user.socialUser.picture} alt="user-picture" style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '50%' }}/> : <i className="bi bi-person-circle icon"></i>}
							</Dropdown.Toggle>

							<Dropdown.Menu className="profile-menu">
								<Dropdown.Item>Profile</Dropdown.Item>
								<Dropdown.Item>Setting</Dropdown.Item>
								<Dropdown.Divider />
								<Dropdown.Item onClick={handleLogout}>Log out</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>
				</div>
			</Container>
		</Navbar>
	);
};

export default NavHeader;
