import React, { useContext, useState, useEffect } from "react";

import './Home.scss';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Button, Dialog, DialogContent, TextField, DialogTitle, Stack } from '@mui/material';
import axios from 'axios';


const Home = () => {
    const [username, setUsername] = useState("User");
    const [allAccounts, setAllAccounts] = useState([]);
    const [checkAccountNumber, setCheckAccountNumber] = useState(0);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [accountType, setAccountType] = useState("");
    const [goToAccount, setGoToAccount] = useState(0);

    // Account details hooks
    const [accountDetails, setAccountDetails] = useState([]);
    const [isAccountDetailsOpen, setIsAccountDetailsOpen] = useState(false);
    const [accountTransactions, setAccountTransactions] = useState([]);

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
    }]);

    useEffect(() => {
        if (isAccountDetailsOpen) {
            getAccountsDetails(goToAccount);
        }
    }, [isAccountDetailsOpen]);


    // filter account transactions
    useEffect(() => {
        if (!isFilterOptionOpen) {
            let year = filterOption.year;
            let month = filterOption.month;
            let day = filterOption.day;
            let time = filterOption.time;
            let amount = filterOption.amount;
            let message = filterOption.message;

            getAccountTransactions(goToAccount, year, month, day, time, amount, message);
        }
    }, [isFilterOptionOpen, filterOption])

    useEffect(() => {
        setUsername(window.location.pathname.substr(6));
        getAccounts();
    }, [window.location.pathname]);

    useEffect(() => {
        if (goToAccount !== 0) {
            // window.location.pathname = '/account/' + username + '/' + goToAccount;
            setIsAccountDetailsOpen(true);
        }
    }, [goToAccount]);

    useEffect(() => {
        if (accountType !== "") {
            getAccounts(accountType)
        }
    }, [accountType]);

    useEffect(() => {
        if (checkAccountNumber !== 0) {
            getRecentTransactions(checkAccountNumber);
        } else {
            setRecentTransactions([]);
        }
    }, [checkAccountNumber]);

    useEffect(() => {
        if (allAccounts.length > 0) {
            setCheckAccountNumber(allAccounts[0][0]);
        }
        else {
            setCheckAccountNumber(0);
        }
    }, [allAccounts])

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

    const handleLogout = async () => {
        try {
            const res = await axios.post("http://localhost:5000/Logout");
        } catch (err) {
            console.log(err);
        }
    };

    const getAccounts = async (accountType) => {
        try {
            const res = await axios("http://localhost:5000/Accounts", {
                params: {
                    accountType: accountType
                }
            });
            console.log(res.data);
            setAllAccounts(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const getRecentTransactions = async (accountNo) => {
        try {
            const res = await axios("http://localhost:5000/SeeTransactions", {
                params: {
                    accountNo: accountNo
                }
            });
            console.log(res.data);
            setRecentTransactions(res.data);
        } catch (err) {
            console.log(err);
        }
    }

    const getAccountTransactions = async (accountNo, year, month, day, time, amount, message) => {
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
            setAccountTransactions(res.data);
        } catch (err) {
            console.log(err);
        }
    }

    function createAccountData(accountNo, type) {
        return { accountNo, type };
    }

    function createRecentTransactionData(transactionID, year, month, day, amount) {
        return { transactionID, year, month, day, amount };
    }

    function createAccountTransactionData(transactionID, year, month, day, time, amount, message) {
        return { transactionID, year, month, day, time, amount, message };
    }

    const accountRows = allAccounts?.map((data) => (
        createAccountData(data[0], data[1])
    ))

    const recentTransactionRows = recentTransactions?.map((data) => (createRecentTransactionData(data[0], data[1], data[2], data[3], data[5])));
    const accountTransactionRows = accountTransactions?.map((data) => (createAccountTransactionData(data[0], data[1], data[2], data[3], data[4], data[5], data[6])));


    // Account details component


    return (
        <>
            <Box className='home-big-container'>
                <Box className='home-left-container'>
                    <Box>Welcome back, {username}</Box>
                    <Box className='home-left-content'>
                        <Box className='account-type-container'>
                            <Box>Currently showing {accountType === "" ? 'ALL' : accountType.toUpperCase()} account</Box>
                            <Button
                                className='account-type-button'
                                variant="contained"
                                onClick={() => accountType === 'saving' ? setAccountType('current') : setAccountType('saving')}>
                                Show {accountType === 'saving' ? 'CURRENT' : 'SAVING'}
                            </Button>
                        </Box>

                        <TableContainer component={Paper}>
                            <Table aria-label='simple table'>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Account no.</TableCell>
                                        <TableCell align="right">Type</TableCell>
                                        <TableCell align="right">Action</TableCell>
                                        <TableCell align="right">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {accountRows?.map((row) => (
                                        <TableRow
                                            key={row?.accountNo}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}

                                        >
                                            <TableCell component="th" scope="row">
                                                {row?.accountNo}
                                            </TableCell>
                                            <TableCell align="right">{row?.type ? row.type.toUpperCase() : accountType.toUpperCase()}</TableCell>
                                            <TableCell align="right">
                                                <Button variant="outlined" onClick={() => setCheckAccountNumber(row.accountNo)}>Transactions</Button>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Button variant="outlined" onClick={() => setGoToAccount(row?.accountNo)}>Details</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Box>
                <Box className='home-right-container'>
                    <Box>Recent transactions for Account: {checkAccountNumber}</Box>
                    <TableContainer component={Paper}>
                        <Table aria-label='simple table'>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Transaction No.</TableCell>
                                    <TableCell align="right">Date</TableCell>
                                    <TableCell align="right">Amount</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {recentTransactionRows?.map((row) => (
                                    <TableRow
                                        key={row.transactionID}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.transactionID}
                                        </TableCell>
                                        <TableCell align="right">{row.year + '/' + row.month + '/' + row.day}</TableCell>
                                        <TableCell align="right">{row.amount}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>

                <Dialog open={isAccountDetailsOpen} onClose={() => setIsAccountDetailsOpen(false)}>
                    <DialogContent className='account-transaction-dialog'>
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
                                                    {accountTransactionRows?.map((row) => (
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
                                    <Stack spacing={1}>
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
                                                        placeholder="HH-MM"
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
                        </>
                    </DialogContent>
                </Dialog>
            </Box>
            <Button variant="outlined" className='footer-button' onClick={() => { window.location.pathname = "/login"; handleLogout() }}>Logout</Button>
        </>
    )
}

export default Home;