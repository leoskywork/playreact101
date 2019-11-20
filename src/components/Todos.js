import React from 'react';
import { TodoItem } from './TodoItem';
import PropTypes from 'prop-types';

class Todos extends React.Component {
	state = {
		todoList: [
			{ id: 11, title: 'wash clothes', completed: false },
			{ id: 12, title: 'buy water', completed: true },
			{ id: 14, title: 'learn react', completed: false }
		]
	};

	render() {
		console.log('Todos.render', this.state.todoList, this.props.deadline);

		let dueHour = Math.floor(this.props.deadline.getTime() / 1000 / 60 / 60) * 1000 * 60 * 60;

		//note[fixed]??? why react still warning even if added the key prop?
		//  - need wrap entire jsx within an elem (div or React.Fragment) if result is a mapped list + some html elements
		//  - no need to wrap if the result only is a mapped list
		// let caption = <h2>Todos Due {new Date(dueHour).toLocaleString().replace(',', ' ')}</h2>;
		// let list = this.state.todoList.map(t => {
		// 	return <TodoItem key={t.id.toString() + 'test'} todo={t} toggleCompleted={this.toggleCompleted} deleteTodo={this.deleteTodo}></TodoItem>;
		// });
		// list.unshift(<br />);
		// list.unshift(caption);
		// return list;

		return (
			<React.Fragment>
				<h2>Todo List Due {new Date(dueHour).toLocaleString().replace(',', ' ')}</h2>
				<br></br>
				{this.state.todoList.map(t => (
					<TodoItem key={t.id.toString() + 'test'} todo={t} toggleCompleted={this.toggleCompleted} deleteTodo={this.deleteTodo}></TodoItem>
				))}
			</React.Fragment>
		);
	}

	//note: this has to be arrow function, in order to get the right 'this'
	//  - i.e point to the current class
	toggleCompleted = id => {
		console.log('toggle completed: ', id);
		let todoItem = this.state.todoList.find(t => t.id === id);

		if (todoItem) {
			todoItem.completed = !todoItem.completed;
			this.setState(this.state); //fire UI repaint
		}
	};

	deleteTodo = id => {
		console.log('delete todo: ', id);

		this.setState({
			todoList: this.state.todoList.filter(t => t.id !== id)
		});
	};
}

Todos.propTypes = {
	deadline: PropTypes.object.isRequired
};

export default Todos;
