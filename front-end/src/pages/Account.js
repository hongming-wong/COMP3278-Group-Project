import React, { useState, useEffect } from "react"

import './Account.scss';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Stack, TextField, Button, Dialog, DialogTitle, DialogContent } from '@mui/material';

const Account = () => {
    const [accountNum, setAccountNum] = useState(0);
    const [isTransactionOpen, setIsTransactionOpen] = useState(false);

    const [data, setData] = useState("Server is down");
    const [random, setRandom] = useState("No Data");
    const [msg, setMsg] = useState("");
    const [to, setTo] = useState(null);
    const [from, setFrom] = useState(null);
    const [currentUser, setCurrentUser] = useState("No user");
    const [amount, setAmount] = useState(0);

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

    function createData(name, calories, fat, carbs, protein) {
        return { name, calories, fat, carbs, protein };
    }

    const rows = [
        createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
        createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
        createData('Eclair', 262, 16.0, 24, 6.0),
        createData('Cupcake', 305, 3.7, 67, 4.3),
        createData('Gingerbread', 356, 16.0, 49, 3.9),
    ];

    return (
        <Box className='account-big-container'>
            <Box className='account-left-container'>
                <Box className='account-number-container'>
                    Account number: {accountNum}
                </Box>
                <Box className='account-transactions-container'>
                    <TableContainer component={Paper}>
                        <Table aria-label='simple table'>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Dessert (100g serving)</TableCell>
                                    <TableCell align="right">Calories</TableCell>
                                    <TableCell align="right">Fat&nbsp;(g)</TableCell>
                                    <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                                    <TableCell align="right">Protein&nbsp;(g)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow
                                        key={row.name}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.name}
                                        </TableCell>
                                        <TableCell align="right">{row.calories}</TableCell>
                                        <TableCell align="right">{row.fat}</TableCell>
                                        <TableCell align="right">{row.carbs}</TableCell>
                                        <TableCell align="right">{row.protein}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
            <Stack className='account-right-container'>
                <Box className='action-container'>
                    <TextField
                        label='Search'
                    />
                </Box>
                <Box className='action-container'>
                    <TextField
                        label='Filter'
                    />
                </Box>
                <Button onClick={() => setIsTransactionOpen(true)}>Make transaction</Button>
                <Dialog open={isTransactionOpen} onClose={() => setIsTransactionOpen(false)}>
                    <DialogTitle>Make a transaction</DialogTitle>
                    <DialogContent>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                label='From'
                                required
                                type="number"
                                value={from}
                                onChange={(t) => setFrom(t.target.value)}
                            />
                            <br />
                            <TextField
                                type="number"
                                required
                                label='To'
                                value={to}
                                onChange={(t) => setTo(t.target.value)}
                            />
                            <br />
                            <TextField
                                label='Amount'
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
                            <Button type="submit">Submit</Button>
                        </form>
                    </DialogContent>

                </Dialog>
            </Stack>
        </Box>
    )
}

export default Account;