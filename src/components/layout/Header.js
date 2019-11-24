import React from 'react';
import { Link } from 'react-router-dom';
import './StyleLayout.css';
import PropTypes from 'prop-types';

class Header extends React.Component {
	state = {
		name: 'header',
		currentNavItem: 'Home'
	};

	render() {
		const { home, about, support, introspection } = this.props.nav;

		return (
			<header hidden={this.props.hideHeader}>
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
					<Link className={this.getNavItemStyle(introspection)} to={introspection.path} onClick={this.clickNavItem}>
						{introspection.name}
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
		//console.log('header state:', this.state.currentNavItem);

		// state.currentNavItem = e.target.innerText;
		this.setState({ currentNavItem: e.target.innerText });
		//console.log('header state after set:', this.state.currentNavItem);
	};

	componentDidMount() {
		console.log('-----> header did mount ', document.location);

		//fixme: don't know why, can't get value from AppConst here...
		const lowerPath = document.location.pathname.toLowerCase();
		const lowerBase = this.props.nav._basePath.path.toLowerCase();
		const current = Object.values(this.props.nav).find(n => lowerBase + n.path.toLowerCase() === lowerPath);

		if (current && current.name !== this.state.currentNavItem) {
			this.setState({ currentNavItem: current.name });
		}
	}

	componentDidUpdate(pp, ps, ss) {
		console.log('-----> header did update, pre: ', ps, ', current: ', this.state);
		console.log('-----> location', document.location.pathname);

		//fixme: don't know why, can't get value from AppConst here...
		const lowerPath = document.location.pathname.toLowerCase();
		const lowerBase = this.props.nav._basePath.path.toLowerCase();
		const current = Object.values(this.props.nav).find(n => lowerBase + n.path.toLowerCase() === lowerPath);

		if (current && current.name !== this.state.currentNavItem) {
			//if (current) {
			this.setState({ currentNavItem: current.name });
		}
	}
}

Header.propTypes = {
	nav: PropTypes.object.isRequired,
	hideHeader: PropTypes.bool.isRequired
};

export default Header;
