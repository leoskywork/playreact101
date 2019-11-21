import React from 'react';
import './App.css';
// import logo from './logo.svg';

import Todos from './components/Todos';
import AppConst from './common/AppConst';

function App() {
	let state = {
		deadline: new Date(new Date().getTime() + 24 * 60 * 60 * 1000) //24 hours later
	};

	return (
		<div className="App">
			<h1>{AppConst.AppName}</h1>
			<br />
			<div className="todo-board">
				<Todos deadline={state.deadline} />
			</div>
		</div>

		// <div className="App">
		//   <header className="App-header">
		//     <img src={logo} className="App-logo" alt="logo" />
		//   </header>
		// </div>
	);
}

export default App;
