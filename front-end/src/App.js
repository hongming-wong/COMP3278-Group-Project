import React, { useState } from "react";

import Login from './pages/Login';
import Account from './pages/Account';
import Home from './pages/Home';

import AppContext from './AppContext';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

const App = () => {
	const [username, setUsername] = useState("");

	const global = {
		user: { get: username, set: setUsername },
	};

	return (
		<AppContext.Provider value={global}>
			<Router>
				<Switch>
					<Route exact path={"/login"} component={Login} />
					<Route exact path={"/account"} component={Account} />
					<Route path={"/"} component={Home} />
				</Switch>
			</Router>
		</AppContext.Provider>
	)
}

export default App;
