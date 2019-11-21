import React from 'react';
import { Link } from 'react-router-dom';
import './StyleLayout.css';

class NavItem {
	constructor(name, path) {
		this.name = name;
		this.path = path;
	}
}
class Header extends React.Component {
	state = {
		name: 'header',
		currentNavItem: 'Home',
		home: new NavItem('Home', '/'),
		about: new NavItem('About', '/about'),
		support: new NavItem('Support', '/support')
	};

	render() {
		const { home, about, support } = this.state;

		return (
			<header>
				<nav className="nav-bar">
					<Link className={this.getNavItemStyle(home)} to={home.path} onClick={this.clickNavItem}>
						{home.name}
					</Link>
					<Link className={this.getNavItemStyle(about)} to={about.path} onClick={this.clickNavItem}>
						{about.name}
					</Link>
					<Link className={this.getNavItemStyle(support)} to={support.path} onClick={this.clickNavItem}>
						{support.name}
					</Link>
				</nav>
			</header>
		);
	}

	getNavItemStyle = navItem => {
		if (this.state.currentNavItem === navItem.name) {
			return 'nav-item selected';
		}

		return 'nav-item';
	};

	clickNavItem = e => {
		console.log('click nav item:', e);
		console.log('header state:', this.state.currentNavItem);

		// state.currentNavItem = e.target.innerText;
		this.setState({ currentNavItem: e.target.innerText });
		console.log('header state after set:', this.state.currentNavItem);
	};

	componentDidMount() {
		console.log(document.location);

		// reset current nav item if not root path
		if (document.location.pathname === '/') return;

		const navItems = [this.state.home, this.state.about, this.state.support];
		const current = navItems.find(n => document.location.pathname.toLowerCase() === n.path.toLowerCase());

		if (current) {
			this.setState({ currentNavItem: current.name });
		}
	}
}

export default Header;
