import React from 'react';
import { Todo } from '../models/Todo';
import './StyleTodo.css';
import PropTypes from 'prop-types';

export class AddTodo extends React.Component {
	state = {
		title: '',
		isSendingRequest: false
	};

	onInputChange = e => {
		this.setState({
			[e.target.name]: e.target.value
		});
		console.log('add todo: ', this.state.title);
	};

	onSubmit = e => {
		e.preventDefault();
		if (this.state.isSendingRequest) return;

		this.setState({ isSendingRequest: true });
		let newTodo = new Todo(null, this.state.title);
		this.props.addTodo(newTodo).finally(() => {
			this.setState({ isSendingRequest: false, title: '' });
			document.querySelector('#add-todo-title').select();
		});
	};

	render() {
		return (
			<form className="add-todo-form" onSubmit={this.onSubmit}>
				<input
					type="text"
					id="add-todo-title"
					name="title"
					value={this.state.title}
					onChange={this.onInputChange}
					placeholder="Input todo ..."
					disabled={this.state.isSendingRequest}
				></input>
				<button type="submit" className="add-todo-btn" disabled={this.state.isSendingRequest || !this.state.title}>
					Add
				</button>
			</form>
		);
	}

	componentDidMount() {
		document.querySelector('#add-todo-title').select();
	}
}

AddTodo.propTypes = {
	addTodo: PropTypes.func.isRequired
};
