import React from 'react';
import PropTypes from 'prop-types';
import './StyleTodos.css';

export class TodoItem extends React.Component {
	state = {
		name: 'todo item'
	};

	//fixme: Warning: A component is changing an uncontrolled input of type checkbox to be controlled.
	toggleCompleted = e => {
		console.log(this.props.todo.id, this.props.todo.completed, this.state.completed);

		//	this.props.todo.completed = !this.props.todo.completed;
		// this.setState({
		// 	//use e.target.value if not 'checkbox'
		// 	completed: e.target.checked
		// });
		this.props.todo.completed = !this.props.todo.completed;
		this.props.toggleCompleted(this.props.todo).then(() => {
			//this.setState(this.state);
		});
	};

	render() {
		return (
			<div className="todo-item">
				<input type="checkbox" className="toggle-completed" onChange={this.toggleCompleted} checked={this.props.todo.completed}></input>
				<span>
					&nbsp;&nbsp;<span className={this.props.todo.completed ? 'completed' : ''}>{this.props.todo.title}</span>&nbsp;&nbsp;
				</span>
				<button className="delete-todo-btn" onClick={this.props.deleteTodo.bind(this, this.props.todo.id)}>
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
