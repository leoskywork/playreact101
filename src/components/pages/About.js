import React from 'react';
import './StylePages.css';

function About() {
	let state = {
		name: 'About'
	};

	//function render() {
	return (
		<React.Fragment>
			<div className="text-centered">
				<br></br>
				<h3>{state.name}</h3>
				<br></br>
				<p>leoskywork@outlook.com</p>
				<br></br>
				<p>leo @ home @ 2019.11.21 23:52 GMT+0800</p>
			</div>
		</React.Fragment>
	);
	//}
}

export default About;
