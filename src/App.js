import React from 'react';
import './App.css';
// import logo from './logo.svg';

import Todos from './components/Todos';

function App() {
	let state = {
		deadline: new Date(new Date().getTime() + 24 * 60 * 60 * 1000) //24 hours later
	};

	return (
		<div className="App">
			<h1>Dev React 101</h1>
			<br />
			<Todos deadline={state.deadline} />
		</div>

		// <div className="App">
		//   <header className="App-header">
		//     <img src={logo} className="App-logo" alt="logo" />
		//   </header>
		// </div>
	);
}

export default App;
