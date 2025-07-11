import { useState, useEffect, useContext } from 'react';
import UserContext from "../context/UserContext";
import { Navigate } from "react-router-dom";
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import { Notyf } from 'notyf';

export default function Login() {

	const notyf = new Notyf();

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [isActive, setIsActive] = useState(true);

	const { user, setUser } = useContext(UserContext);

	function authenticate(e) {
		e.preventDefault();

		fetch(`${process.env.REACT_APP_API_URL}/admin/login`, {
			method: 'POST',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				username,
				password
			})
		})
		.then(res => res.json())
		.then(data => {
			if (data.access) {
				localStorage.setItem('token', data.access);
				retrieveUserDetails(data.access);
				setUsername('');
				setPassword('');
				notyf.success("You are now logged in");
			} else if (data.message === "Incorrect email or password" || data.message === "Incorrect username or password") {
				notyf.error("Incorrect username or password");
			} else {
				notyf.error(`${username} does not exist`);
			}
		})
		.catch(error => {
			if (error.toString().includes("TypeError: Failed to fetch")) {
				notyf.error("Server not responding. Please wait.");
			}
		});
	}

	function retrieveUserDetails(token) {
		fetch(`${process.env.REACT_APP_API_URL}/admin/details`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		})
		.then(res => res.json())
		.then(data => {
			console.log("Admin profile retrieved:", data);

			setUser({
				id: data._id,
				firstName: data.firstName,
				lastName: data.lastName,
				username: data.username,
				role: data.role
			});
		});
	}

	useEffect(() => {
		if (username !== '' && password !== '') {
			setIsActive(true);
		} else {
			setIsActive(false);
		}
	}, [username, password]);

	return (
		(user.id != null && user.id !== undefined) ? (
			<Navigate to="/students" />
		) : (
			<Container fluid className="d-flex justify-content-center align-items-center mt-5 pt-5">
				<Form onSubmit={authenticate} className="col-12 col-md-6">
					<h1 className="text-center">Admin Login</h1>
					<Row className="justify-content-center">
						<Col md={6}>
							<Form.Group>
								<Form.Label>Username</Form.Label>
								<Form.Control
									type="text"
									placeholder="Enter username"
									required
									value={username}
									onChange={(e) => setUsername(e.target.value)}
								/>
							</Form.Group>

							<Form.Group className="mb-3">
								<Form.Label>Password</Form.Label>
								<Form.Control
									type="password"
									placeholder="Password"
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
							</Form.Group>

							{isActive ? (
								<Button variant="primary" type="submit" id="loginBtn">Login</Button>
							) : (
								<Button variant="danger" type="submit" id="loginBtn" disabled>Login</Button>
							)}
						</Col>
					</Row>
				</Form>
			</Container>
		)
	);
}
