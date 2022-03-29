import React from 'react';
import { Nav } from 'react-bootstrap';

import './Sidebar.css';

const Sidebar = () => {
	return (
		<div className="sidebar">
			<div className="sidebar-header">
				<i class="bi bi-list icon"></i>
			</div>
			<Nav variant="tabs" className="flex-column">
				<Nav.Item>
					<Nav.Link href="/home">Active</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					<Nav.Link eventKey="link-1">Longer NavLink</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					<Nav.Link eventKey="link-2">Link</Nav.Link>
				</Nav.Item>
			</Nav>
		</div>
	);
};
export default Sidebar;
