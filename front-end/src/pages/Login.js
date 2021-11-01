import React, { useState, useEffect } from "react"
import { Box, Button, TextField } from '@mui/material';

import './Login.scss';
import axios from 'axios';

const Login = () => {
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
            const res = await axios.post("http://localhost:5000/Login", {
                username: "dummy",
            });
            console.log(res.data);
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
                url: "http://localhost:5000/Transfer",
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
        <Box className = 'login-container'>
            <h1 className = 'test'> Is the server active?</h1>
 			<h2>{data}</h2>
 			<h2>{random}</h2>
 			<h2>Current User: {currentUser}</h2>
            <Button onClick = {handleLogin}>Login</Button>
            <Button onClick = {handleLogout}>Logout</Button>
            <form onSubmit={handleSubmit}>
 				<TextField
                    label = 'From'
                    required
					type="number"
					value={from}
					onChange={(t) => setFrom(t.target.value)}
				/>
				<br />
				<TextField
					type="number"
                    required
                    label = 'To'
					value={to}
					onChange={(t) => setTo(t.target.value)}
				/>
				<br />
				<TextField
                    label = 'Amount'
                    required
					type="number"
					value={amount}
					onChange={(t) => setAmount(t.target.value)}
				/>
				<br />
                <TextField 
                    type="text"
                    value={msg}
                    onChange={(t) => setMsg(t.target.value)}
                />
                <br />
				<input type="submit" value="Submit" />
			</form>
        </Box>
    )
}

export default Login;