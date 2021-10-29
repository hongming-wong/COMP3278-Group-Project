import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
	const [data, setData] = useState("Server is down");
	const [random, setRandom] = useState("No Data");
	useEffect(() => {
		const getData = async () => {
			try {
				const res = await axios.get("http://localhost:5000/");
				setData(res.data);
			} catch (err) {
				console.log(err);
			}
		};
		getData();
	});

	const handleLogin = async () => {
		try {
			const res = await axios.post("http://localhost:5000/login", {
				username: "dummy",
			});
			console.log(res.data);
		} catch (err) {
			console.log(err);
		}
	};

	const handleLogout = async () => {
		try {
			const res = await axios.post("http://localhost:5000/logout", {
				username: "dummy",
			});
			console.log(res.data);
		} catch (err) {
			console.log(err);
		}
	};
	return (
		<div className="App">
			<h1> Is the server active?</h1>
			<h2>{data}</h2>
			<h2>{random}</h2>
			<button onClick={handleLogin}>Login</button>
			<button onClick={handleLogout}>Logout</button>
		</div>
	);
}

export default App;
