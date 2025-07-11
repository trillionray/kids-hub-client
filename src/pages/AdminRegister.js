import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import UserContext from '../context/UserContext';

export default function AdminRegister() {

	const { user } = useContext(UserContext);

	const [firstName, setFirstName] = useState("");
	const [middleName, setMiddleName] = useState("");
	const [lastName, setLastName] = useState("");
	const [suffix, setSuffix] = useState("");
	const [username, setUsername] = useState("");
	const [role, setRole] = useState("teacher");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isActive, setIsActive] = useState(false);

	useEffect(() => {
		if (
			firstName && middleName && lastName &&
			username && role && password && confirmPassword &&
			password === confirmPassword && password.length >= 8
		) {
			setIsActive(true);
		} else {
			setIsActive(false);
		}
	}, [firstName, middleName, lastName, username, role, password, confirmPassword]);

	function registerAdmin(e) {
		e.preventDefault();

		fetch(`${process.env.REACT_APP_API_URL}/admin/register`, {
			method: 'POST',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				firstName,
				middleName,
				lastName,
				suffix,
				username,
				password,
				role
			})
		})
			.then(res => res.json())
			.then(data => {
				console.log(data);
				if (data.message === "Admin registered successfully") {
					alert("Registration successful!");

					setFirstName("");
					setMiddleName("");
					setLastName("");
					setSuffix("");
					setUsername("");
					setPassword("");
					setConfirmPassword("");
					setRole("teacher");
				} else {
					alert(data.message || "Something went wrong.");
				}
			})

			.catch((error) => {
				console.log(error)
				alert("Server error. Please try again.")
			});
	}

	// Redirect if already logged in
	if (user.id) return <Navigate to="/" />;

	return (
		<Form onSubmit={registerAdmin}>
			<h1 className="my-5 text-center">Admin Registration</h1>

			<Form.Group>
				<Form.Label>First Name:</Form.Label>
				<Form.Control type="text" required value={firstName} onChange={e => setFirstName(e.target.value)} />
			</Form.Group>

			<Form.Group>
				<Form.Label>Middle Name:</Form.Label>
				<Form.Control type="text" required value={middleName} onChange={e => setMiddleName(e.target.value)} />
			</Form.Group>

			<Form.Group>
				<Form.Label>Last Name:</Form.Label>
				<Form.Control type="text" required value={lastName} onChange={e => setLastName(e.target.value)} />
			</Form.Group>

			<Form.Group>
				<Form.Label>Suffix (optional):</Form.Label>
				<Form.Control type="text" value={suffix} onChange={e => setSuffix(e.target.value)} />
			</Form.Group>

			<Form.Group>
				<Form.Label>Username:</Form.Label>
				<Form.Control type="text" required value={username} onChange={e => setUsername(e.target.value)} />
			</Form.Group>

			<Form.Group>
				<Form.Label>Role:</Form.Label>
				<Form.Select value={role} onChange={e => setRole(e.target.value)}>
					<option value="teacher">Teacher</option>
					<option value="principal">Principal</option>
					<option value="cashier">Cashier</option>
				</Form.Select>
			</Form.Group>

			<Form.Group>
				<Form.Label>Password:</Form.Label>
				<Form.Control type="password" required value={password} onChange={e => setPassword(e.target.value)} />
			</Form.Group>

			<Form.Group className="mb-3">
				<Form.Label>Confirm Password:</Form.Label>
				<Form.Control type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
			</Form.Group>

			<Button variant="primary" type="submit" disabled={!isActive}>
				Register
			</Button>
		</Form>
	);
}
