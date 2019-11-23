import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
// import logo from './logo.svg';

import Todos from './components/todos/Todos';
import AppConst from './common/AppConst';
import Header from './components/layout/Header';
import About from './components/pages/About';
import Support from './components/pages/Support';

class NavItem {
	constructor(name, path) {
		this.name = name;
		this.path = path;
	}
}

function App() {
	let state = {
		deadline: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), //24 hours later
		nav: {
			home: new NavItem('Home', '/'),
			about: new NavItem('About', '/about'),
			support: new NavItem('Support', '/support'),
			introspection: new NavItem('Introspection', '/intro')
		},
		hideHeader: false
	};

	const { nav } = state;
	//fixme: what's 'exact' in <Route> for?
	return (
		<Router>
			<div className="App">
				<h1 className="app-name" hidden={state.hideHeader}>
					{AppConst.AppName}
				</h1>
				<Header nav={nav} hidden={state.hideHeader}></Header>
				<Route
					path={nav.home.path}
					exact
					render={_ => (
						<div className="todo-board">
							<Todos deadline={state.deadline} />
						</div>
					)}
				></Route>
				<Route path={nav.about.path} component={About}></Route>
				<Route path={nav.support.path} component={Support}></Route>
			</div>
		</Router>
	);
}

export default App;

// <div className="App">
//   <header className="App-header">
//     <img src={logo} className="App-logo" alt="logo" />
//   </header>
// </div>
