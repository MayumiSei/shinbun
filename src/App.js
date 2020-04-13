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
import Account from './Pages/Account';
import PasswordForget from './Components/PasswordForget';
import ArticleAdd from './Pages/Article/ArticleAdd';

const App = () => {
	return (
		<Router>
			<Header />
			<Switch>
				<Route exact path={ROUTES.HOME} component={Home} />
				<Route path={ROUTES.SIGNUP} component={SignUp} />
				<Route path={ROUTES.SIGNIN} component={SignIn} />
				<Route path={ROUTES.ACCOUNT} component={Account} />
				<Route path={ROUTES.PASSWORD_FORGET} component={PasswordForget} />
				<Route path={ROUTES.ARTICLEADD} component={ArticleAdd} />
			</Switch>
		</Router>
	);
}

export default withAuthentication(App)
