import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from '../Login';
import Register from '../Register';
import Homepage from '../Homepage';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" exact element={<Homepage />} />
				<Route path="login" element={<Login />} />
				<Route path="register" element={<Register />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
