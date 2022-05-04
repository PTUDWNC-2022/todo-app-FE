import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from '../Login';
import Register from '../Register';
import Homepage from '../Homepage';
import Join from '../Join';
import './App.css';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" exact element={<Homepage />} />
				<Route path="login" element={<Login />} />
				<Route path="register" element={<Register />} />

        <Route path="/list/:id/join" element={<Join />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
