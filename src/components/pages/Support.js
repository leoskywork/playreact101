import React from 'react';
import * as uuid from 'uuid';
import './StylePages.css';

class Contact {
	constructor(name, value) {
		this.name = name;
		this.value = value;
	}
}

function Support() {
	let state = {
		name: 'Support',
		contacts: [
			new Contact('qq', 2228460788),
			//new Contact('微信公众号', '李欧谈谈'),
			new Contact('website', 'www.leoskywork.com'),
			new Contact('email', 'leoskywork@outlook.com'),
			new Contact('github', 'www.github.com/leoskywork')
		]
	};

	//function render() {
	return (
		<div className="text-centered">
			<br></br>
			<h3>{state.name}</h3>
			<br></br>
			<ol className="contact-list">
				{state.contacts.map(c => (
					<li className="contact-item" key={uuid.v4()}>
						<span>{c.name}</span>:<span>&nbsp;&nbsp;{c.value}</span>
					</li>
				))}
			</ol>
		</div>
	);
	//}
}

export default Support;
