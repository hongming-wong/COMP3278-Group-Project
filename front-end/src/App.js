import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
	const [data, setData] = useState("Server is down");
	const [random, setRandom] = useState("No Data");
	const [msg, setMsg] = useState("");
	const [to, setTo] = useState(null);
	const [from, setFrom] = useState(null);
	const [currentUser, setCurrentUser] = useState("No user");
	const [amount, setAmount] = useState(0);

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
			setCurrentUser(res.data[0]);
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
			setCurrentUser("No user");
		} catch (err) {
			console.log(err);
		}
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		var f = new FormData();
		f.append("from", from);
		f.append("to", to);
		f.append("message", msg);
		f.append("amount", amount);
		try {
			const res = await axios({
				method: "post",
				url: "http://localhost:5000/Transaction",
				data: f,
			});
			setRandom(res.data);
			console.log(res.data);
		} catch (err) {
			setRandom("");
			console.log(err);
		}
	};

	return (
		<div className="App">
			<h1> Is the server active?</h1>
			<h2>{data}</h2>
			<h2>{random}</h2>
			<h2>Current User: {currentUser}</h2>
			<button onClick={handleLogin}>Login</button>
			<button onClick={handleLogout}>Logout</button>
			<form onSubmit={handleSubmit}>
				From:
				<input
					type="number"
					value={from}
					onChange={(t) => setFrom(t.target.value)}
				/>
				<br />
				To
				<input
					type="number"
					value={to}
					onChange={(t) => setTo(t.target.value)}
				/>
				<br />
				Amount
				<input
					type="number"
					value={amount}
					onChange={(t) => setAmount(t.target.value)}
				/>
				<br />
				<label>
					Message:
					<input
						type="text"
						value={msg}
						onChange={(t) => setMsg(t.target.value)}
					/>
				</label>
				<input type="submit" value="Submit" />
			</form>
		</div>
	);
}

export default App;
