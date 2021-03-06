import React, { useState, useEffect, useContext } from "react";
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from "@mui/material";

import "./Login.scss";
import axios from "axios";
import AppContext from "../AppContext";

const Login = () => {
	const [currentUser, setCurrentUser] = useState("No user");
	const [userCredentials, setUserCredentials] = useState([]);
	const [isCheckCredentials, setIsCheckCredentials] = useState(false);

	const context = useContext(AppContext);

	useEffect(() => {
		if (currentUser != "Login failed" && currentUser != "No user") {
			setIsCheckCredentials(true);
		}
	}, [currentUser]);

	useEffect(() => {
		const getData = async () => {
			try {
				const res = await axios.get("http://localhost:5000/");
			} catch (err) {
				console.log(err);
			}
		};
		getData();
	});

	const handleLogin = async () => {
		try {
			const res = await axios.post("http://localhost:5000/Login", {
				username: "dummy",
			});
			setUserCredentials(res.data);
			setCurrentUser(res.data[1]);
		} catch (err) {
			setCurrentUser("Login failed");
			console.log(err);
		}
	};

	const handleLogout = async () => {
		try {
			const res = await axios.post("http://localhost:5000/Logout", {
				username: "dummy",
			});
			setCurrentUser("No user");
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className="container">
			<div className="login-container">
				<h1 className="test"> Welcome to United Banks </h1>
				<Button onClick={handleLogin}>Login</Button>
			</div>
			<Dialog
				open={isCheckCredentials}
				onClose={() => setIsCheckCredentials(false)}
			>
				<DialogTitle>Welcome user, please verify your credentials</DialogTitle>
				<DialogContent>
					<Box>
						<b>ID:</b> {userCredentials[0]}
					</Box>
					<Box>
						<b>Name:</b> {currentUser}
					</Box>
					<Box>
						<b>Last login date:</b> {userCredentials[2]}
					</Box>
					<Box>
						<b>Last login time:</b> {userCredentials[3]}
					</Box>
				</DialogContent>
				<DialogActions>
					<Button
						variant="contained"
						onClick={() => {
							window.location.pathname = "/home/" + currentUser;
							context.setIsLogin(true);
						}}
					>
						Go to home
					</Button>
					<Button
						variant="outlined"
						onClick={() => {
							setIsCheckCredentials(false);
							handleLogout();
						}}
					>
						Logout
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default Login;
