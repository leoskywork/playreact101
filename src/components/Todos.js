import React from 'react';
import { TodoItem } from './TodoItem';
import PropTypes from 'prop-types';
import { Todo } from '../models/Todo';
import { AddTodo } from './AddTodo';
import Utility from '../common/Utility';

class Todos extends React.Component {
	state = {
		todoList: [new Todo(11, 'wash clothes', false), new Todo(12, 'buy water', true), new Todo(14, 'learn react', false)]
	};

	//note: this function has to be arrow function, in order to get the right 'this'
	//  - i.e point to the current class
	toggleCompleted = todo => {
		console.log('toggle completed: ', todo.id);
		// let todoItem = this.state.todoList.find(t => t.id === id);

		// if (todoItem) {
		// 	todoItem.completed = !todoItem.completed;
		// 	this.setState(this.state); //fire UI repaint
		// }
		// this.setState({
		// 	todoList: this.state.todoList.map(t => {
		// 		if (t.id === id) {
		// 			t.completed = !t.completed;
		// 		}
		// 		return t;
		// 	})
		// });

		return Promise.resolve();
	};

	deleteTodo = id => {
		console.log('delete todo: ', id);

		this.setState({
			todoList: this.state.todoList.filter(t => t.id !== id)
		});
	};

	addTodo = newTodo => {
		console.log('add todo: ', newTodo);
		if (!newTodo || !newTodo.title) return Promise.reject('blank todo item');

		newTodo.id = Utility.genInteger();
		this.setState({ todoList: [...this.state.todoList, newTodo] });

		return Promise.resolve();
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
				<AddTodo addTodo={this.addTodo}></AddTodo>
				<br></br>
				{this.state.todoList.map(t => (
					<TodoItem key={t.id.toString() + 'test'} todo={t} toggleCompleted={this.toggleCompleted} deleteTodo={this.deleteTodo}></TodoItem>
				))}
			</React.Fragment>
		);
	}
}

Todos.propTypes = {
	deadline: PropTypes.object.isRequired
};

export default Todos;
