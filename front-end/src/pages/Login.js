import React, { useState, useEffect } from "react"
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

import './Login.scss';
import axios from 'axios';

const Login = () => {
    const [data, setData] = useState("Server is down");
    // const [random, setRandom] = useState("No Data");
    const [currentUser, setCurrentUser] = useState("No user");
    const [isCheckCredentials, setIsCheckCredentials] = useState(false);

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

    // const handleSubmit = async (event) => {
    //     event.preventDefault();
    //     var f = new FormData();
    //     f.append("from", from);
    //     f.append("to", to);
    //     f.append("message", msg);
    //     f.append("amount", amount);
    //     try {
    //         const res = await axios({
    //             method: "post",
    //             url: "http://localhost:5000/Transfer",
    //             data: f,
    //         });
    //         setRandom(res.data);
    //         console.log(res.data);
    //     } catch (err) {
    //         setRandom("");
    //         console.log(err);
    //     }
    // };

    return (
        <Box className = 'login-container'>
            <h1 className = 'test'> Is the server active?</h1>
 			<h2>{data}</h2>
 			{/* <h2>{random}</h2> */}
 			<h2>Current User: {currentUser}</h2>
            {/* <Button onClick = {handleLogin}>Login</Button> */}
            <Button onClick = {() => setIsCheckCredentials(true)}>Login</Button> {/* test */}
            <Button onClick = {handleLogout}>Logout</Button>
            <Dialog open = {isCheckCredentials} onClose = {() => isCheckCredentials(false)}>
                <DialogTitle>Is this you?</DialogTitle>
                <DialogContent>
                    Credentials data goes here
                </DialogContent>
                <DialogActions>
                    <Button onClick = {() => window.location.pathname = '/'}>Yes!</Button>
                    <Button onClick = {() => setIsCheckCredentials(false)}>No</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default Login;