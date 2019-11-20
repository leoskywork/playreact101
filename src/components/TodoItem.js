import React from 'react';
import PropTypes from 'prop-types';
import './StyleTodo.css';

export class TodoItem extends React.Component {
	state = {
		name: 'todo item'
	};

	render() {
		const { id, title, completed } = this.props.todo;

		return (
			<div className="todo-item">
				<input type="checkbox" className="toggle-completed" onChange={this.props.toggleCompleted.bind(this, id)} checked={completed}></input>
				&nbsp; {title} &nbsp;
				<button className="delete-todo-btn" onClick={this.props.deleteTodo.bind(this, id)}>
					Delete
				</button>
			</div>
		);
	}
}

TodoItem.propTypes = {
	todo: PropTypes.object.isRequired,
	toggleCompleted: PropTypes.func.isRequired,
	deleteTodo: PropTypes.func.isRequired
};
