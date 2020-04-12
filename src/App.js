import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
// import logo from './logo.svg';
import './Assets/style/index.scss';
import './App.scss';
import Home from "./Pages/Home";
import Header from "./Components/Header";


function App() {
	return (
		<Router>
			<Header />
			{/* <div className="App">
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<p>
						Edit <code>src/App.js</code> and save to reload.
           			</p>
					<a
						className="App-link"
						href="https://reactjs.org"
						target="_blank"
						rel="noopener noreferrer"
					>
						Learn React
          			</a>
				</header>
			</div> */}
			<Switch>
				<Route exact path="/" component={Home} />
			</Switch>
		</Router>
	);
}

export default App;
