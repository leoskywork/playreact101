import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// import logo from './logo.svg';

import Todos from './components/todos/Todos';
import AppConst from './common/AppConst';
import Header from './components/layout/Header';
import About from './components/pages/About';
import Support from './components/pages/Support';
import { Introspection as Intro } from './components/routines/Introspection';

class NavItem {
    constructor(name, path, appInternal = false) {
        this.name = name;
        this.path = path;
        this.appInternal = appInternal;
    }
}

export class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            deadline: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), //24 hours later
            nav: {
                // home: new NavItem('Home', AppConst.frontendBaseUrl + '/'),
                // about: new NavItem('About', AppConst.frontendBaseUrl + '/about'),
                // support: new NavItem('Support', AppConst.frontendBaseUrl + '/support'),
                // introspection: new NavItem('Introspection', AppConst.frontendBaseUrl + '/intro')
                home: new NavItem('Home', '/'),
                about: new NavItem('About', '/about'),
                support: new NavItem('Support', '/support'),
                introspection: new NavItem('Intro', '/intro'),
                _basePath: new NavItem('_basePath', '/r101', true)
            },
            hideHeader: false
        };
    }

    collapseHeader = collapse => {
        console.log(typeof this, this);

        //fixme: not working - fix by class + arrow func
        //let _this = this;
        this.setState({
            hideHeader: collapse
        });
    };

    render() {
        const { nav } = this.state;
        //fixme: what's 'exact' in <Route> for?
        return (
            <Router basename={nav._basePath.path}>
                <div className="App">
                    <h1 className="app-name" hidden={this.state.hideHeader}>
                        {AppConst.appName}
                    </h1>
                    <Header nav={nav} hideHeader={this.state.hideHeader}></Header>
                    <Routes>
                        <Route path={nav.home.path} exact element={<div className="todo-board"><Todos deadline={this.state.deadline} /></div>}></Route>
                        <Route path={nav.about.path} element={<About />}></Route>
                        <Route path={nav.support.path} element={<Support />}></Route>
                        <Route path={nav.introspection.path} element={<Intro collapseHeader={this.collapseHeader}></Intro>}></Route>
                    </Routes>
                </div>
            </Router>
        );
    }
}

export default App;

// <div className="App">
//   <header className="App-header">
//     <img src={logo} className="App-logo" alt="logo" />
//   </header>
// </div>
