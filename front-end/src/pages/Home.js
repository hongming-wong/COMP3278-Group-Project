import React, { useContext, useState, useEffect } from "react";

import './Home.scss';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Button } from '@mui/material';
import axios from 'axios';

const Home = () => {
    const [username, setUsername] = useState("User");
    const [allAccounts, setAllAccounts] = useState([]);
    const [checkAccountNumber, setCheckAccountNumber] = useState(0);
    const [allTransactions, setAllTransactions] = useState([]);
    const [accountType, setAccountType] = useState("");
    const [goToAccount, setGoToAccount] = useState(0);

    useEffect(() => {
        setUsername(window.location.pathname.substr(6));
        getAccounts();
    }, [window.location.pathname]);

    useEffect(() => {
        if (goToAccount !== 0) {
            window.location.pathname = '/account/' + username + '/' + goToAccount;
        }
    }, [goToAccount]);

    useEffect(() => {
        if (accountType !== "") {
            getAccounts(accountType)
        }
    }, [accountType]);

    useEffect(() => {
        if (checkAccountNumber !== 0) {
            getAllTransactions(checkAccountNumber);
        } else {
            setAllTransactions([]);
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

    const getAllTransactions = async (accountNo) => {
        try {
            const res = await axios("http://localhost:5000/SeeTransactions", {
                params: {
                    accountNo: accountNo
                }
            });
            console.log(res.data);
            setAllTransactions(res.data);
        } catch (err) {
            console.log(err);
        }
    }

    function createAccountData(accountNo, type) {
        return { accountNo, type };
    }

    function createTransactionData(transactionID, year, month, day, amount) {
        return { transactionID, year, month, day, amount };
    }

    const accountRows = allAccounts?.map((data) => (
        createAccountData(data[0], data[1])
    ))

    const transactionRows = allTransactions?.map((data) => (createTransactionData(data[0], data[1], data[2], data[3], data[5])));

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
                                variant = "contained"
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
                                                <Button variant = "outlined" onClick={() => setCheckAccountNumber(row.accountNo)}>Transactions</Button>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Button variant = "outlined" onClick={() => setGoToAccount(row?.accountNo)}>Details</Button>
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
                                {transactionRows?.map((row) => (
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
            </Box>
            <Button variant = "outlined" className = 'footer-button' onClick = {() => {window.location.pathname = "/login"; handleLogout()}}>Logout</Button>
        </>
    )
}

export default Home;