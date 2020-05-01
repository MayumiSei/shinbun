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
import articleAdd from './Pages/Article/articleAdd';
import articlesList from './Pages/Article/articlesList';
import articleDetails from './Pages/Article/articleDetails';
import articleUpdate from './Pages/Article/articleUpdate';
import articleTags from './Pages/Article/articleTags';

const App = () => {
	return (
		<Router>
			<Header />
			<Switch>
				<Route exact path={ROUTES.HOME} component={Home} />
				<Route exact path={ROUTES.SIGNUP} component={SignUp} />
				<Route exact path={ROUTES.SIGNIN} component={SignIn} />
				<Route exact path={ROUTES.ACCOUNT} component={Account} />
				<Route exact path={ROUTES.PASSWORD_FORGET} component={PasswordForget} />
				<Route exact path={ROUTES.ARTICLEADD} component={articleAdd} />
				<Route path={ROUTES.ARTICLEUPDATE} component={articleUpdate} />
				<Route path={ROUTES.ARTICLEDETAILS} component={articleDetails} />
				<Route path={ROUTES.ARTICLESTAGS} component={articleTags} />
				<Route path={ROUTES.ARTICLESLIST} component={articlesList} />
			</Switch>
		</Router>
	);
}

export default withAuthentication(App)


