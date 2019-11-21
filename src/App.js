import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
// import logo from './logo.svg';

import Todos from './components/Todos';
import AppConst from './common/AppConst';
import Header from './components/layout/Header';
import About from './components/pages/About';
import Support from './components/pages/Support';

function App() {
	let state = {
		deadline: new Date(new Date().getTime() + 24 * 60 * 60 * 1000) //24 hours later
	};

	//fixme: what's 'exact' in <Route> for?
	return (
		<Router>
			<div className="App">
				<h1 className="app-name">{AppConst.AppName}</h1>
				<Header></Header>
				<Route
					path="/"
					exact
					render={_ => (
						<div className="todo-board">
							<Todos deadline={state.deadline} />
						</div>
					)}
				></Route>
				<Route path="/about" component={About}></Route>
				<Route path="/support" component={Support}></Route>
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
