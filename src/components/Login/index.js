import React, {useEffect} from 'react';
import {Formik} from 'formik';
import { login } from './actions';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

import './Login.css';

const validationSchema = yup.object({
	email: yup
		.string("Enter user's email")
		.max(255)
		.email('Email is invalid')
		.required('Email is required'),
	password: yup
		.string('Enter user password')
		.max(255)
		.required('Password is required'),
});

const Login = () => {
	const navigate = useNavigate();

	useEffect( () => {
		const getUser = async () => {
			const resp = await fetch('http://localhost:8080/users/login/success', {
				method: 'GET',
				credentials: 'include',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'Access-Control-Allow-Credentials': true
				}
			});

			if (resp.status === 200) {
				const userJson = await resp.json();
				localStorage.setItem('authInfo', JSON.stringify(userJson.user));
				navigate('/', { replace: true });
				return;
			}
			throw new Error('Login with Google has been failed');
		};
		const currentUser = JSON.parse(localStorage.getItem('authInfo')) || null;
		if (currentUser) {
			navigate('/', { replace: true });
			return;
		}
		getUser();
	}, []);

	return (
		<Container fluid className="login-container">
			<div className="todo-logo">
				<img
					src="https://static.macupdate.com/products/62626/l/microsoft-to-do-logo.png?v=1647851602"
					alt="logo"
					width="60px"
				/>
				<h3>My Todo App</h3>
			</div>
			<Row className="justify-content-center">
				<Col className="todo-login-container">
					<h1>Log in to My Todo App</h1>
					<Formik
						initialValues={{ email: '', password: '' }}
						validationSchema={validationSchema}
						onSubmit={async (values, { setSubmitting }) => {
							const authInfo = await login(values.email, values.password);
							localStorage.setItem('authInfo', JSON.stringify(authInfo));
							navigate('/');
						}}>
						{({
							values,
							errors,
							touched,
							handleChange,
							handleBlur,
							handleSubmit,
							isSubmitting,
						}) => (
							<Form onSubmit={handleSubmit} className="todo-login-form">
								<Form.Group className="mb-3" controlId="formEmail">
									<Form.Control
										type="text"
										name="email"
										placeholder="Enter email"
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.email}
										className={touched.email && errors.email ? 'error' : null}
									/>
									{touched.email && errors.email ? (
										<div className="error-message">{errors.email}</div>
									) : null}
								</Form.Group>
								<Form.Group className="mb-3" controlId="formPassword">
									<Form.Control
										type="password"
										name="password"
										placeholder="Enter password"
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.password}
										className={
											touched.password && errors.password ? 'error' : null
										}
									/>
									{touched.password && errors.password ? (
										<div className="error-message">{errors.password}</div>
									) : null}
								</Form.Group>
								<Button className="forgot-password">Forgot password?</Button>
								<Button type="submit" disabled={isSubmitting} variant="success">
									Log in
								</Button>
							</Form>
						)}
					</Formik>
					<div className="login-methods">
						<div className="login-method-separator">OR</div>
						<Button className="oauth-btn" onClick={() => window.open(`${process.env.REACT_APP_API_URL}/users/google/`, '_self')}>
							<i className="bi bi-google icon" id="google-icon"/>
							<span>Continue with Google</span>
						</Button>
						<Button className="oauth-btn" onClick={() => window.open(`${process.env.REACT_APP_API_URL}/users/facebook/`, '_self')}>
							<i className="bi bi-facebook icon" id="facebook-icon"/>
							<span>Continue with Facebook</span>
						</Button>
					</div>
					<hr />
					<div>
						Don't have an account? <Link to="/register">Sign up</Link>
					</div>
				</Col>
			</Row>

			<Row className="todo-background">
				<Col md={4} className="todo-background-left">
					<img
						src="https://media.istockphoto.com/vectors/business-office-work-and-task-management-concept-vector-flat-person-vector-id1208534790?k=20&m=1208534790&s=612x612&w=0&h=v9V3ytTdspHvEFMP5oUrbd1WCGU46-WxH26s7EOi_yQ="
						alt="left-bg"
					/>
				</Col>
				<Col md={4} className="todo-background-right">
					<img
						src="https://media.istockphoto.com/vectors/business-task-management-concept-vector-flat-people-illustration-vector-id1208534912?k=20&m=1208534912&s=612x612&w=0&h=GBrj08Rj5uxJLTxtg_Y9aQuLasa8gYJvrEnGSfIs41Y="
						alt="right-bg"
					/>
				</Col>
			</Row>
		</Container>
	);
};

export default Login;
