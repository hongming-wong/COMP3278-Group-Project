import React, { useContext, useState, useEffect } from "react";
import {
	Alert,
	AppBar,
	Snackbar,
	TableFooter,
	TablePagination,
} from "@mui/material";

import "./Home.scss";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Box,
	Button,
	Dialog,
	DialogContent,
	TextField,
	DialogTitle,
	Stack,
} from "@mui/material";
import axios from "axios";

const Home = () => {
	const [username, setUsername] = useState("User");
	const [allAccounts, setAllAccounts] = useState([]);
	const [checkAccountNumber, setCheckAccountNumber] = useState(0);
	const [checkTransfers, setCheckTransfers] = useState(0);
	const [recentTransactions, setRecentTransactions] = useState([]);
	const [recentTransfers, setRecentTransfers] = useState([]);
	const [recentDetailsType, setRecentDetailsType] = useState("");
	const [accountType, setAccountType] = useState("");
	const [goToAccount, setGoToAccount] = useState(0);

	// Account details hooks
	const [accountDetails, setAccountDetails] = useState([]);
	const [isAccountDetailsOpen, setIsAccountDetailsOpen] = useState(false);
	const [accountTransactions, setAccountTransactions] = useState([]);
	const [accountTransfers, setAccountTransfers] = useState([]);
	const [transactionPage, setTransactionPage] = useState(0);
	const [transferPage, setTransferPage] = useState(0);
	const [transferSuccessful, setTransferSuccessful] = useState(null);
	const [transferMessage, setTransferMessage] = useState("");
	const [transactionSuccessful, setTransactionSuccessful] = useState(null);
	const [transactionMessage, setTransactionMessage] = useState("");

	const [isTransactionOpen, setIsTransactionOpen] = useState(false);
	const [isTransferOpen, setIsTransferOpen] = useState(false);
	const [isTransactionFilterOptionOpen, setIsTransactionFilterOptionOpen] =
		useState(false);
	const [isTransferFilterOptionOpen, setIsTransferFilterOptionOpen] =
		useState(false);

	const [transactionFilterOption, setTransactionFilterOption] = useState([
		{
			year: 0,
			month: 0,
			day: 0,
			amount: 0,
			time: "",
			message: "",
		},
	]);
	const [transferFilterOption, setTransferFilterOption] = useState([
		{
			year: 0,
			month: 0,
			day: 0,
			amount: 0,
			time: "",
			message: "",
		},
	]);
	const [transactionDetails, setTransactionDetails] = useState([
		{
			from: null,
			to: null,
			amount: 0,
			message: "",
		},
	]);
	const [transferDetails, setTransferDetails] = useState([
		{
			from: null,
			to: null,
			amount: 0,
			message: "",
		},
	]);

	useEffect(() => {
		if (isAccountDetailsOpen) {
			getAccountsDetails(goToAccount);
			getAccountTransactions(goToAccount);
			getAccountTransfers(goToAccount);
		}
	}, [isAccountDetailsOpen]);

	// filter account transactions
	useEffect(() => {
		if (!isTransactionFilterOptionOpen) {
			let year = transactionFilterOption.year;
			let month = transactionFilterOption.month;
			let day = transactionFilterOption.day;
			let time = transactionFilterOption.time;
			let amount = transactionFilterOption.amount;
			let message = transactionFilterOption.message;

			getAccountTransactions(
				goToAccount,
				year,
				month,
				day,
				time,
				amount,
				message
			);
		}
	}, [isTransactionFilterOptionOpen, transactionFilterOption]);

	// filter account transfer
	useEffect(() => {
		if (!isTransferFilterOptionOpen) {
			let year = transferFilterOption.year;
			let month = transferFilterOption.month;
			let day = transferFilterOption.day;
			let time = transferFilterOption.time;
			let amount = transferFilterOption.amount;
			let message = transferFilterOption.message;

			getAccountTransfers(goToAccount, year, month, day, time, amount, message);
		}
	}, [isTransferFilterOptionOpen, transferFilterOption]);

	useEffect(() => {
		setUsername(window.location.pathname.substr(6));
		getAccounts();
	}, [window.location.pathname]);

	useEffect(() => {
		if (goToAccount !== 0) {
			setIsAccountDetailsOpen(true);
		}
	}, [goToAccount]);

	useEffect(() => {
		if (accountType !== "") {
			getAccounts(accountType);
		}
	}, [accountType]);

	useEffect(() => {
		if (checkAccountNumber !== 0) {
			getRecentTransactions(checkAccountNumber);
			setRecentDetailsType("Transactions");
		} else {
			setRecentTransactions([]);
		}
	}, [checkAccountNumber]);

	useEffect(() => {
		console.log("This is checkTransfers", checkTransfers);
		if (checkTransfers !== 0) {
			getRecentTransfers(checkTransfers);
			setRecentDetailsType("Transfers");
		} else {
			setRecentTransfers([]);
		}
	}, [checkTransfers]);

	useEffect(() => {
		if (allAccounts.length > 0) {
			setCheckAccountNumber(allAccounts[0][0]);
		} else {
			setCheckAccountNumber(0);
		}
	}, [allAccounts]);

	const getAccountsDetails = async (accountNo) => {
		try {
			const res = await axios("http://localhost:5000/AccountDetails", {
				params: {
					accountNo: accountNo,
				},
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
		f.append("from", transferDetails.from);
		f.append("to", transferDetails.to);
		f.append("message", transferDetails.message);
		f.append("amount", transferDetails.amount);
		try {
			const res = await axios({
				method: "post",
				url: "http://localhost:5000/Transfer",
				data: f,
			});
			let data = res.data;
			if (data.indexOf("unsuccessful") !== -1) setTransferSuccessful(false);
			else setTransferSuccessful(true);
			setTransferMessage(res.data);
		} catch (err) {
			setTransferSuccessful(false);
			setTransferMessage(err);
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
				url: "http://localhost:5000/Transaction",
				data: f,
			});
			let data = res.data;
			if (data.indexOf("unsuccessful") !== -1) setTransactionSuccessful(false);
			else setTransactionSuccessful(true);
			setTransactionMessage(res.data);
		} catch (err) {
			setTransactionSuccessful(false);
			setTransactionMessage(err);
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
					accountType: accountType,
				},
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
					accountNo: accountNo,
				},
			});
			console.log(res.data);
			setRecentTransactions(res.data);
		} catch (err) {
			console.log(err);
		}
	};

	const getRecentTransfers = async (accountNo) => {
		try {
			const res = await axios("http://localhost:5000/SeeTransfers", {
				params: {
					accountNo: accountNo,
				},
			});
			console.log(res.data);
			setRecentTransfers(res.data);
		} catch (err) {
			console.log(err);
		}
	};

	const getAccountTransactions = async (
		accountNo,
		year,
		month,
		day,
		time,
		amount,
		message
	) => {
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
				},
			});
			console.log(res.data);
			setAccountTransactions(res.data);
		} catch (err) {
			console.log(err);
		}
	};

	const getAccountTransfers = async (
		accountNo,
		year,
		month,
		day,
		time,
		amount,
		message
	) => {
		try {
			const res = await axios("http://localhost:5000/SeeTransfers", {
				params: {
					accountNo: accountNo,
					year: year ? year : null,
					month: month ? month : null,
					day: day ? day : null,
					time: time ? time : null,
					amount: amount ? amount : null,
					message: message ? message : null,
				},
			});
			console.log(res.data);
			setAccountTransfers(res.data);
		} catch (err) {
			console.log(err);
		}
	};

	function createAccountData(accountNo, type) {
		return { accountNo, type };
	}

	function createRecentTransactionData(
		transactionID,
		year,
		month,
		day,
		amount
	) {
		return { transactionID, year, month, day, amount };
	}

	function createTransactionData(
		transactionID,
		year,
		month,
		day,
		time,
		amount,
		message
	) {
		return { transactionID, year, month, day, time, amount, message };
	}

	const accountRows = allAccounts?.map((data) =>
		createAccountData(data[0], data[1])
	);

	const recentTransactionRows = recentTransactions?.map((data) =>
		createRecentTransactionData(data[0], data[1], data[2], data[3], data[5])
	);
	const recentTransfersRows = recentTransfers?.map((data) =>
		createRecentTransactionData(data[0], data[1], data[2], data[3], data[5])
	);

	const accountTransactionRows = accountTransactions?.map((data) =>
		createTransactionData(
			data[0],
			data[1],
			data[2],
			data[3],
			data[4],
			data[5],
			data[6]
		)
	);

	const accountTransferRows = accountTransfers?.map((data) =>
		createTransactionData(
			data[0],
			data[1],
			data[2],
			data[3],
			data[4],
			data[5],
			data[6]
		)
	);

	// Account details component

	return (
		<>
			<React.Fragment>
				<AppBar position="fixed" className="appbar">
					<h1 style={{ margin: "20px 0px 20px 20px" }}>United Banks</h1>
				</AppBar>
			</React.Fragment>
			<Box className="home-big-container">
				<Box className="home-left-container">
					<h3>Welcome back, {username}.</h3>
					<Box className="home-left-content">
						<Box className="account-type-container">
							<h3>
								Currently showing{" "}
								{accountType === "" ? "ALL" : accountType.toUpperCase()}{" "}
								accounts
							</h3>
							<Button
								className="account-type-button"
								variant="contained"
								onClick={() =>
									accountType === "saving"
										? setAccountType("current")
										: setAccountType("saving")
								}
							>
								Show {accountType === "saving" ? "CURRENT" : "SAVING"}
							</Button>
						</Box>

						<TableContainer component={Paper}>
							<Table aria-label="simple table">
								<TableHead className="appbar">
									<TableRow>
										<TableCell style={{ color: "white" }}>
											Account no.
										</TableCell>
										<TableCell align="right" style={{ color: "white" }}>
											Type
										</TableCell>
										<TableCell align="right" style={{ color: "white" }}>
											Action
										</TableCell>
										<TableCell align="right" style={{ color: "white" }}>
											Action
										</TableCell>
										<TableCell align="right" style={{ color: "white" }}>
											Action
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{accountRows?.map((row) => (
										<TableRow
											key={row?.accountNo}
											sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
										>
											<TableCell component="th" scope="row">
												{row?.accountNo}
											</TableCell>
											<TableCell align="right">
												{row?.type
													? row.type.toUpperCase()
													: accountType.toUpperCase()}
											</TableCell>
											<TableCell align="right">
												<Button
													variant="outlined"
													onClick={() => setCheckAccountNumber(row.accountNo)}
												>
													Transactions
												</Button>
											</TableCell>
											<TableCell align="right">
												<Button
													variant="outlined"
													onClick={() => setCheckTransfers(row.accountNo)}
													disabled={
														row.type == "Current" || accountType == "current"
													}
												>
													Transfers
												</Button>
											</TableCell>
											<TableCell align="right">
												<Button
													variant="outlined"
													onClick={() => setGoToAccount(row?.accountNo)}
												>
													Details
												</Button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</Box>
				</Box>
				<Box className="home-right-container">
					<h3>
						Recent {recentDetailsType} for Account:{" "}
						{recentDetailsType === "Transfers"
							? checkTransfers
							: checkAccountNumber}
					</h3>
					<TableContainer component={Paper}>
						<Table aria-label="simple table">
							<TableHead className="appbar">
								<TableRow>
									<TableCell style={{ color: "white" }}>
										{recentDetailsType} No.
									</TableCell>
									<TableCell align="right" style={{ color: "white" }}>
										Date
									</TableCell>
									<TableCell align="right" style={{ color: "white" }}>
										Amount
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{recentDetailsType === "Transfers"
									? recentTransfersRows?.map((row) => (
											<TableRow
												key={row.transactionID}
												sx={{
													"&:last-child td, &:last-child th": { border: 0 },
												}}
											>
												<TableCell component="th" scope="row">
													{row.transactionID}
												</TableCell>
												<TableCell align="right">
													{row.year + "/" + row.month + "/" + row.day}
												</TableCell>
												<TableCell align="right">{row.amount}</TableCell>
											</TableRow>
									  ))
									: recentTransactionRows?.map((row) => (
											<TableRow
												key={row.transactionID}
												sx={{
													"&:last-child td, &:last-child th": { border: 0 },
												}}
											>
												<TableCell component="th" scope="row">
													{row.transactionID}
												</TableCell>
												<TableCell align="right">
													{row.year + "/" + row.month + "/" + row.day}
												</TableCell>
												<TableCell align="right">{row.amount}</TableCell>
											</TableRow>
									  ))}
							</TableBody>
						</Table>
					</TableContainer>
				</Box>
				)
				<Dialog
					open={isAccountDetailsOpen}
					onClose={() => setIsAccountDetailsOpen(false)}
				>
					<DialogContent className="account-transaction-dialog">
						<Stack spacing={10}>
							{accountDetails[3] === "Current" && (
								<>
									<Box className="account-big-container">
										<Box className="account-left-container">
											<Stack
												direction="row"
												spacing={4}
												className="account-details-container"
											>
												<Box>Account number: {accountDetails[0]}</Box>
												<Box>Account type: {accountDetails[3]}</Box>
												<Box>
													Balance: {accountDetails[1] + " " + accountDetails[2]}
												</Box>
											</Stack>

											<Box className="account-transactions-container">
												<h2>Transaction Records</h2>
												<TableContainer component={Paper}>
													<Table aria-label="simple table">
														<TableHead>
															<TableRow>
																<TableCell>Transaction No.</TableCell>
																<TableCell align="right">Date</TableCell>
																<TableCell align="right">Time</TableCell>
																<TableCell align="right">Amount</TableCell>
																<TableCell align="right">Currency</TableCell>
																<TableCell align="right">Message</TableCell>
															</TableRow>
														</TableHead>
														<TableBody>
															{accountTransactionRows
																?.slice(
																	transactionPage * 5,
																	transactionPage * 5 + 5
																)
																.map((row) => (
																	<TableRow
																		key={row.transactionID}
																		sx={{
																			"&:last-child td, &:last-child th": {
																				border: 0,
																			},
																		}}
																	>
																		<TableCell component="th" scope="row">
																			{row.transactionID}
																		</TableCell>
																		<TableCell align="right">
																			{row.year +
																				"/" +
																				row.month +
																				"/" +
																				row.day}
																		</TableCell>
																		<TableCell align="right">
																			{row.time}
																		</TableCell>
																		<TableCell align="right">
																			{row.amount}
																		</TableCell>
																		<TableCell align="right">
																			{accountDetails[1]}
																		</TableCell>
																		<TableCell align="right">
																			{row.message}
																		</TableCell>
																	</TableRow>
																))}
														</TableBody>
														<TableFooter>
															<TableRow>
																<TablePagination
																	count={accountTransactionRows.length}
																	rowsPerPage={5}
																	page={transactionPage}
																	onPageChange={(event, newPage) =>
																		setTransactionPage(newPage)
																	}
																	rowsPerPageOptions={[5]}
																/>
															</TableRow>
														</TableFooter>
													</Table>
												</TableContainer>
											</Box>
										</Box>

										<Stack className="account-right-container">
											<Stack spacing={1}>
												<Button
													variant="outlined"
													onClick={() => setIsTransactionFilterOptionOpen(true)}
												>
													Filter options
												</Button>
												<Button
													variant="contained"
													disabled={accountDetails[3] === "Saving"}
													onClick={() => setIsTransactionOpen(true)}
												>
													Make transaction
												</Button>
											</Stack>

											<Dialog
												open={isTransactionFilterOptionOpen}
												onClose={() => setIsTransactionFilterOptionOpen(false)}
											>
												<DialogTitle>
													Select filter option for transactions
												</DialogTitle>
												<DialogContent>
													<Stack className="dialog-content" spacing={3}>
														<Box className="action-container">
															<TextField
																label="Year"
																type="number"
																value={transactionFilterOption.year}
																onChange={(t) =>
																	setTransactionFilterOption({
																		...transactionFilterOption,
																		year: t.target.value,
																	})
																}
															/>
														</Box>
														<Box className="action-container">
															<TextField
																label="Month"
																type="number"
																value={transactionFilterOption.month}
																onChange={(t) =>
																	setTransactionFilterOption({
																		...transactionFilterOption,
																		month: t.target.value,
																	})
																}
															/>
														</Box>
														<Box className="action-container">
															<TextField
																label="Day"
																type="number"
																value={transactionFilterOption.day}
																onChange={(t) =>
																	setTransactionFilterOption({
																		...transactionFilterOption,
																		day: t.target.value,
																	})
																}
															/>
														</Box>
														<Box className="action-container">
															<TextField
																label="Time"
																placeholder="HH-MM"
																type="text"
																value={transactionFilterOption.time}
																onChange={(t) =>
																	setTransactionFilterOption({
																		...transactionFilterOption,
																		time: t.target.value,
																	})
																}
															/>
														</Box>
														<Box className="action-container">
															<TextField
																label="Amount"
																type="number"
																value={transactionFilterOption.amount}
																onChange={(t) =>
																	setTransactionFilterOption({
																		...transactionFilterOption,
																		amount: t.target.value,
																	})
																}
															/>
														</Box>
														<Box className="action-container">
															<TextField
																label="Message"
																value={transactionFilterOption.message}
																onChange={(t) =>
																	setTransactionFilterOption({
																		...transactionFilterOption,
																		message: t.target.value,
																	})
																}
															/>
														</Box>
														<Button
															variant="outlined"
															onClick={() =>
																setIsTransactionFilterOptionOpen(false)
															}
														>
															Confirm
														</Button>
													</Stack>
												</DialogContent>
											</Dialog>

											<Snackbar
												open={transactionSuccessful !== null}
												autoHideDuration={5000}
												onClose={() => setTransactionSuccessful(null)}
											>
												<Alert
													severity={
														transactionSuccessful !== null
															? transactionSuccessful
																? "success"
																: "error"
															: ""
													}
												>
													{transactionMessage}
												</Alert>
											</Snackbar>

											<Dialog
												open={isTransactionOpen}
												onClose={() => setIsTransactionOpen(false)}
											>
												<DialogTitle>Make a transaction</DialogTitle>
												<DialogContent>
													<form onSubmit={handleTransactionSubmit}>
														<Stack className="dialog-content" spacing={3}>
															<TextField
																label="From"
																required
																type="number"
																value={transactionDetails.from}
																onChange={(t) =>
																	setTransactionDetails({
																		...transactionDetails,
																		from: t.target.value,
																	})
																}
															/>
															<TextField
																type="number"
																required
																label="To"
																value={transactionDetails.to}
																onChange={(t) =>
																	setTransactionDetails({
																		...transactionDetails,
																		to: t.target.value,
																	})
																}
															/>
															<TextField
																label="Amount"
																required
																type="number"
																value={transactionDetails.amount}
																onChange={(t) =>
																	setTransactionDetails({
																		...transactionDetails,
																		amount: t.target.value,
																	})
																}
															/>
															<TextField
																label="Message"
																type="text"
																value={transactionDetails.message}
																onChange={(t) =>
																	setTransactionDetails({
																		...transactionDetails,
																		message: t.target.value,
																	})
																}
															/>
															<Button variant="outined" type="submit">
																Submit
															</Button>
														</Stack>
													</form>
												</DialogContent>
											</Dialog>
										</Stack>
									</Box>
								</>
							)}
							<Box className="account-big-container">
								<Box className="account-left-container">
									<h2>Transfer Records</h2>
									<Box className="account-transactions-container">
										<TableContainer component={Paper}>
											<Table aria-label="simple table">
												<TableHead>
													<TableRow>
														<TableCell>Transfer No.</TableCell>
														<TableCell align="right">Date</TableCell>
														<TableCell align="right">Time</TableCell>
														<TableCell align="right">Amount</TableCell>
														<TableCell align="right">Currency</TableCell>
														<TableCell align="right">Message</TableCell>
													</TableRow>
												</TableHead>
												<TableBody>
													{accountTransferRows
														?.slice(transferPage * 5, transferPage * 5 + 5)
														.map((row) => (
															<TableRow
																key={row.transactionID}
																sx={{
																	"&:last-child td, &:last-child th": {
																		border: 0,
																	},
																}}
															>
																<TableCell component="th" scope="row">
																	{row.transactionID}
																</TableCell>
																<TableCell align="right">
																	{row.year + "/" + row.month + "/" + row.day}
																</TableCell>
																<TableCell align="right">{row.time}</TableCell>
																<TableCell align="right">
																	{row.amount}
																</TableCell>
																<TableCell align="right">
																	{accountDetails[1]}
																</TableCell>
																<TableCell align="right">
																	{row.message}
																</TableCell>
															</TableRow>
														))}
												</TableBody>
												<TableFooter>
													<TableRow>
														<TablePagination
															count={accountTransferRows.length}
															rowsPerPage={5}
															page={transferPage}
															onPageChange={(event, newPage) =>
																setTransferPage(newPage)
															}
															rowsPerPageOptions={[5]}
														/>
													</TableRow>
												</TableFooter>
											</Table>
										</TableContainer>
									</Box>
								</Box>
								<Stack className="account-right-container">
									<Stack spacing={1}>
										<Button
											variant="outlined"
											onClick={() => setIsTransferFilterOptionOpen(true)}
										>
											Filter options
										</Button>
										<Button
											variant="contained"
											onClick={() => setIsTransferOpen(true)}
										>
											Make transfer
										</Button>
									</Stack>

									<Dialog
										open={isTransferFilterOptionOpen}
										onClose={() => setIsTransferFilterOptionOpen(false)}
									>
										<DialogTitle>Select filter option for transfer</DialogTitle>
										<DialogContent>
											<Stack className="dialog-content" spacing={3}>
												<Box className="action-container">
													<TextField
														label="Year"
														type="number"
														value={transferFilterOption.year}
														onChange={(t) =>
															setIsTransferFilterOptionOpen({
																...transferFilterOption,
																year: t.target.value,
															})
														}
													/>
												</Box>
												<Box className="action-container">
													<TextField
														label="Month"
														type="number"
														value={transferFilterOption.month}
														onChange={(t) =>
															setIsTransferFilterOptionOpen({
																...transferFilterOption,
																month: t.target.value,
															})
														}
													/>
												</Box>
												<Box className="action-container">
													<TextField
														label="Day"
														type="number"
														value={transferFilterOption.day}
														onChange={(t) =>
															setIsTransferFilterOptionOpen({
																...transferFilterOption,
																day: t.target.value,
															})
														}
													/>
												</Box>
												<Box className="action-container">
													<TextField
														label="Time"
														placeholder="HH-MM"
														type="text"
														value={transferFilterOption.time}
														onChange={(t) =>
															setIsTransferFilterOptionOpen({
																...transferFilterOption,
																time: t.target.value,
															})
														}
													/>
												</Box>
												<Box className="action-container">
													<TextField
														label="Amount"
														type="number"
														value={transferFilterOption.amount}
														onChange={(t) =>
															setIsTransferFilterOptionOpen({
																...transferFilterOption,
																amount: t.target.value,
															})
														}
													/>
												</Box>
												<Box className="action-container">
													<TextField
														label="Message"
														value={transferFilterOption.message}
														onChange={(t) =>
															setIsTransferFilterOptionOpen({
																...transferFilterOption,
																message: t.target.value,
															})
														}
													/>
												</Box>
												<Button
													variant="outlined"
													onClick={() => setIsTransferFilterOptionOpen(false)}
												>
													Confirm
												</Button>
											</Stack>
										</DialogContent>
									</Dialog>

									<Dialog
										open={isTransferOpen}
										onClose={() => setIsTransferOpen(false)}
									>
										<DialogTitle>Make a transfer</DialogTitle>
										<DialogContent>
											<form onSubmit={handleTransferSubmit}>
												<Stack className="dialog-content" spacing={3}>
													<TextField
														label="From"
														required
														type="number"
														value={transferDetails.from}
														onChange={(t) =>
															setTransferDetails({
																...transferDetails,
																from: t.target.value,
															})
														}
													/>
													<TextField
														type="number"
														required
														label="To"
														value={transferDetails.to}
														onChange={(t) =>
															setTransferDetails({
																...transferDetails,
																to: t.target.value,
															})
														}
													/>
													<TextField
														label="Amount"
														required
														type="number"
														value={transferDetails.amount}
														onChange={(t) =>
															setTransferDetails({
																...transferDetails,
																amount: t.target.value,
															})
														}
													/>
													<TextField
														label="Message"
														type="text"
														value={transferDetails.message}
														onChange={(t) =>
															setTransferDetails({
																...transferDetails,
																message: t.target.value,
															})
														}
													/>
													<Button variant="outlined" type="submit">
														Submit
													</Button>
												</Stack>
											</form>
										</DialogContent>
									</Dialog>
								</Stack>
							</Box>

							<Snackbar
								open={transferSuccessful !== null}
								autoHideDuration={5000}
								onClose={() => setTransferSuccessful(null)}
							>
								<Alert
									severity={
										transferSuccessful !== null
											? transferSuccessful
												? "success"
												: "error"
											: ""
									}
								>
									{transferMessage}
								</Alert>
							</Snackbar>

							<Snackbar
								open={transactionSuccessful !== null}
								autoHideDuration={5000}
								onClose={() => setTransactionSuccessful(null)}
							>
								<Alert
									severity={
										transactionSuccessful !== null
											? transactionSuccessful
												? "success"
												: "error"
											: ""
									}
								>
									{transactionMessage}
								</Alert>
							</Snackbar>
						</Stack>
					</DialogContent>
				</Dialog>
			</Box>
			<Button
				variant="contained"
				className="footer-button"
				onClick={() => {
					window.location.pathname = "/login";
					handleLogout();
				}}
			>
				Logout
			</Button>
		</>
	);
};

export default Home;
