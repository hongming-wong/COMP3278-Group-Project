import React from "react";

import Login from './pages/Login';
import Account from './pages/Account';
import Home from './pages/Home';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

function App() {
	return (
		<Router>
			<Switch>
				<Route exact path = {"/login"} component = {Login} />
				<Route exact path = {"/account"} component = {Account} />
				<Route path = {"/"} component = {Home} />
			</Switch>
		</Router>
	)
}

export default App;
