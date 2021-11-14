import React, { useState } from "react";

import Login from './pages/Login';
import Home from './pages/Home';

import AppContext from './AppContext';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

const App = () => {
	const [isLogin, setIsLogin] = useState(true);

	const PrivateRoute = ({component}) => {
		return (
		  <Route render = {() => isLogin ? React.createElement(component) : <Redirect to = {"/"} />} />
		)
	  }

	return (
		<AppContext.Provider value={{isLogin, setIsLogin}}>
			<Router>
				<Switch>
					<PrivateRoute path={"/home"} component={Home} />
					<Route path={"/"} component={Login} />
					
				</Switch>
			</Router>
		</AppContext.Provider>
	)
}

export default App;
