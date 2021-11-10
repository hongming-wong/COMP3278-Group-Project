import React, { useState, useEffect } from "react"

import './Account.scss';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Stack, TextField, Button, Dialog, DialogTitle, DialogContent } from '@mui/material';

const Account = () => {
    const [accountNum, setAccountNum] = useState(0);
    const [username, setUsername] = useState("");
    const [accountDetails, setAccountDetails] = useState([]);
    const [allTransactions, setAllTransactions] = useState([]);


    const [isTransactionOpen, setIsTransactionOpen] = useState(false);
    const [isTransferOpen, setIsTransferOpen] = useState(false);
    const [isFilterOptionOpen, setIsFilterOptionOpen] = useState(false);

    const [filterOption, setFilterOption] = useState([{
        year: 0,
        month: 0,
        day: 0,
        amount: 0,
        time: "",
        message: ""
    }]);
    const [transactionDetails, setTransactionDetails] = useState([{
        from: null,
        to: null,
        amount: 0,
        message: ""
    }]);
    const [transferDetails, setTransferDetails] = useState([{
        from: null,
        to: null,
        amount: 0,
        message: ""
    }])

    const [data, setData] = useState("Server is down");
    const [random, setRandom] = useState("No Data");

    useEffect(() => {
        let lastOccurence = window.location.pathname.lastIndexOf("/");
        let secondLastOccurence = window.location.pathname.lastIndexOf("/", lastOccurence - 1);
        let username = window.location.pathname.substr(secondLastOccurence + 1, lastOccurence - secondLastOccurence - 1);
        let temp = window.location.pathname.substr(lastOccurence + 1);

        setUsername(username);
        setAccountNum(temp);
        getAccountsDetails(temp);
        getAllTransactions(temp);
    }, [])

    useEffect(() => {
        if (!isFilterOptionOpen) {
            let year = filterOption.year;
            let month = filterOption.month;
            let day = filterOption.day;
            let time = filterOption.time;
            let amount = filterOption.amount;
            let message = filterOption.message;

            getAllTransactions(accountNum, year, month, day, time, amount, message);
        }
    }, [isFilterOptionOpen, filterOption])

    const getAccountsDetails = async (accountNo) => {
        try {
            const res = await axios("http://localhost:5000/AccountDetails", {
                params: {
                    accountNo: accountNo
                }
            });
            setAccountDetails(res.data);
            console.log(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const getAllTransactions = async (accountNo, year, month, day, time, amount, message) => {
        try {
            const res = await axios("http://localhost:5000/SeeTransactions", {
                params: {
                    accountNo: accountNo,
                    year: year ? year : null,
                    month: month ? month : null,
                    day: day ? day : null,
                    time: time ? time : null,
                    amount: amount ? amount : null,
                    message: message ? message : null,
                }
            });
            console.log(res.data);
            setAllTransactions(res.data);
        } catch (err) {
            console.log(err);
        }
    }

    const handleTransferSubmit = async (event) => {
        event.preventDefault();
        var f = new FormData();
        f.append("from", transactionDetails.from);
        f.append("to", transactionDetails.to);
        f.append("message", transactionDetails.message);
        f.append("amount", transactionDetails.amount);
        try {
            const res = await axios({
                method: "post",
                url: "http://localhost:5000/Transfer",
                data: f,
            });
            // setRandom(res.data);
            console.log(res.data);
        } catch (err) {
            // setRandom("");
            console.log(err);
        }
    };

    const handleTransactionSubmit = async (event) => {
        event.preventDefault();
        var f = new FormData();
        f.append("from", transactionDetails.from);
        f.append("to", transactionDetails.to);
        f.append("message", transactionDetails.message);
        f.append("amount", transactionDetails.amount);
        try {
            const res = await axios({
                method: "post",
                url: "http://localhost:5000/Transfer",
                data: f,
            });
            // setRandom(res.data);
            console.log(res.data);
        } catch (err) {
            // setRandom("");
            console.log(err);
        }
    };

    function createTransactionData(transactionID, year, month, day, time, amount, message) {
        return { transactionID, year, month, day, time, amount, message };
    }

    const transactionRows = allTransactions?.map((data) => (createTransactionData(data[0], data[1], data[2], data[3], data[4], data[5], data[6])));

    return (
        <>
            <Box className='account-big-container'>
                <Box className='account-left-container'>
                    <Stack direction="row" spacing={4} className='account-details-container'>
                        <Box>Account number: {accountDetails[0]}</Box>
                        <Box>Account type: {accountDetails[3]}</Box>
                        <Box>Balance: {accountDetails[1] + " " + accountDetails[2]}</Box>
                    </Stack>
                    <Box className='account-transactions-container'>
                        <TableContainer component={Paper}>
                            <Table aria-label='simple table'>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Transaction No.</TableCell>
                                        <TableCell align="right">Date</TableCell>
                                        <TableCell align="right">Time</TableCell>
                                        <TableCell align="right">Amount</TableCell>
                                        <TableCell align="right">Message</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {transactionRows?.map((row) => (
                                        <TableRow
                                            key={row.transactionID}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {row.transactionID}
                                            </TableCell>
                                            <TableCell align="right">{row.year + '/' + row.month + '/' + row.day}</TableCell>
                                            <TableCell align="right">{row.time}</TableCell>
                                            <TableCell align="right">{row.amount}</TableCell>
                                            <TableCell align="right">{row.message}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Box>
                <Stack className='account-right-container'>
                    <Stack spacing = {1}>
                        <Button variant="outlined" onClick={() => setIsFilterOptionOpen(true)}>Filter options</Button>
                        <Button variant="contained" onClick={() => setIsTransferOpen(true)}>Make transfer</Button>
                        <Button variant="contained" disabled={accountDetails[3] === "Saving"} onClick={() => setIsTransactionOpen(true)}>Make transaction</Button>
                    </Stack>


                    <Dialog open={isFilterOptionOpen} onClose={() => setIsFilterOptionOpen(false)}>
                        <DialogTitle>Select filter option</DialogTitle>
                        <DialogContent>
                            <Stack className='dialog-content' spacing={3}>
                                <Box className='action-container'>
                                    <TextField
                                        label='Year'
                                        type="number"
                                        value={filterOption.year}
                                        onChange={(t) => setFilterOption({ ...filterOption, year: t.target.value })}
                                    />
                                </Box>
                                <Box className='action-container'>
                                    <TextField
                                        label='Month'
                                        type="number"
                                        value={filterOption.month}
                                        onChange={(t) => setFilterOption({ ...filterOption, month: t.target.value })}
                                    />
                                </Box>
                                <Box className='action-container'>
                                    <TextField
                                        label='Day'
                                        type="number"
                                        value={filterOption.day}
                                        onChange={(t) => setFilterOption({ ...filterOption, day: t.target.value })}
                                    />
                                </Box>
                                <Box className='action-container'>
                                    <TextField
                                        label='Time'
                                        type="text"
                                        value={filterOption.time}
                                        onChange={(t) => setFilterOption({ ...filterOption, time: t.target.value })}
                                    />
                                </Box>
                                <Box className='action-container'>
                                    <TextField
                                        label='Amount'
                                        type="number"
                                        value={filterOption.amount}
                                        onChange={(t) => setFilterOption({ ...filterOption, amount: t.target.value })}
                                    />
                                </Box>
                                <Box className='action-container'>
                                    <TextField
                                        label='Message'
                                        value={filterOption.message}
                                        onChange={(t) => setFilterOption({ ...filterOption, message: t.target.value })}
                                    />
                                </Box>
                                <Button onClick={() => setIsFilterOptionOpen(false)}>Confirm</Button>
                            </Stack>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isTransferOpen} onClose={() => setIsTransferOpen(false)}>
                        <DialogTitle>Make a transfer</DialogTitle>
                        <DialogContent>
                            <form onSubmit={handleTransferSubmit}>
                                <Stack className='dialog-content' spacing={3}>
                                    <TextField
                                        label='From'
                                        required
                                        type="number"
                                        value={transferDetails.from}
                                        onChange={(t) => setTransferDetails({ ...transactionDetails, from: t.target.value })}
                                    />
                                    <TextField
                                        type="number"
                                        required
                                        label='To'
                                        value={transferDetails.to}
                                        onChange={(t) => setTransferDetails({ ...transactionDetails, to: t.target.value })}
                                    />
                                    <TextField
                                        label='Amount'
                                        required
                                        type="number"
                                        value={transferDetails.amount}
                                        onChange={(t) => setTransferDetails({ ...transactionDetails, amount: t.target.value })}
                                    />
                                    <TextField
                                        label="Message"
                                        type="text"
                                        value={transferDetails.message}
                                        onChange={(t) => setTransferDetails({ ...transactionDetails, message: t.target.value })}
                                    />
                                    <Button type="submit">Submit</Button>
                                </Stack>
                            </form>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isTransactionOpen} onClose={() => setIsTransactionOpen(false)}>
                        <DialogTitle>Make a transaction</DialogTitle>
                        <DialogContent>
                            <form onSubmit={handleTransactionSubmit}>
                                <Stack className='dialog-content' spacing={3}>
                                    <TextField
                                        label='From'
                                        required
                                        type="number"
                                        value={transactionDetails.from}
                                        onChange={(t) => setTransactionDetails({ ...transactionDetails, from: t.target.value })}
                                    />
                                    <TextField
                                        type="number"
                                        required
                                        label='To'
                                        value={transactionDetails.to}
                                        onChange={(t) => setTransactionDetails({ ...transactionDetails, to: t.target.value })}
                                    />
                                    <TextField
                                        label='Amount'
                                        required
                                        type="number"
                                        value={transactionDetails.amount}
                                        onChange={(t) => setTransactionDetails({ ...transactionDetails, amount: t.target.value })}
                                    />
                                    <TextField
                                        label="Message"
                                        type="text"
                                        value={transactionDetails.message}
                                        onChange={(t) => setTransactionDetails({ ...transactionDetails, message: t.target.value })}
                                    />
                                    <Button type="submit">Submit</Button>
                                </Stack>
                            </form>
                        </DialogContent>
                    </Dialog>
                </Stack>
            </Box>
            <Button variant="outlined" className='footer-button' onClick={() => window.location.pathname = "/home/" + username}>Back to home</Button>
        </>
    )
}

export default Account;