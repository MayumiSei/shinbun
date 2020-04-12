import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
// import logo from './logo.svg';
import './Assets/style/index.scss';
import './App.scss';
import Home from "./Pages/Home";
import Header from "./Components/Header";
import { withAuthentication } from './Components/Session';
import * as ROUTES from './Routes';
import SignUp from './Pages/SignUp';
import SignIn from './Pages/SignIn';

const App = () => {
	return (
		<Router>
			<Header />
			<Switch>
				<Route exact path={ROUTES.HOME} component={Home} />
				<Route path={ROUTES.SIGNUP} component={SignUp} />
				<Route path={ROUTES.SIGNIN} component={SignIn} />
			</Switch>
		</Router>
	);
}

export default withAuthentication(App)
