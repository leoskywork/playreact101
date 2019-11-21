import React from 'react';
import { TodoItem } from './TodoItem';
import PropTypes from 'prop-types';
import { AddTodo } from './AddTodo';
import Utility from '../common/Utility';
import todoService from '../services/TodoService';

class Todos extends React.Component {
	state = {
		//todoList: [new Todo(11, 'wash clothes', false), new Todo(12, 'buy water', true), new Todo(14, 'learn react', false)]
		todoList: []
	};

	componentDidMount() {
		this.reload('component did mount');
	}

	reload(source) {
		console.log('reload data, source: ', source);
		return todoService.getTodos().then(result => {
			if (result && result.success) {
				return this.setState({
					todoList: result.data || []
				});
			}

			if (result) {
				//fixme: pop error message
				return alert(`source: ${source}, message: ` + result.message);
			}

			alert('api result is null, source: ' + source);
		});
	}

	//note: this function has to be arrow function, in order to get the right 'this'
	//  - i.e point to the current class
	toggleCompleted = todo => {
		console.log('toggle completed: ', todo.id);
		//return Promise.resolve();

		return todoService.updateTodo(todo).then(result => {
			if (result.success) {
				const index = this.state.todoList.indexOf(todo);

				if (index !== -1) {
					this.state.todoList.splice(index, 1, result.data);
					// this.state.todoList[index] = result.data;
					this.setState({
						todoList: this.state.todoList
					});
				} else {
					this.reload('data changed after toggle todo completed');
				}
			} else {
				this.reload('toggle todo completed fail');
			}
		});
	};

	deleteTodo = id => {
		console.log('delete todo: ', id);

		todoService.deleteTodo(id).then(result => {
			if (result.success) {
				this.setState({
					todoList: this.state.todoList.filter(t => t.id !== id)
				});
			} else {
				this.reload('delete todo error');
			}
		});
	};

	addTodo = newTodo => {
		console.log('add todo: ', newTodo);
		if (!newTodo || !newTodo.title) return Promise.reject('blank todo item');

		newTodo.id = Utility.genInteger();
		console.log('new todo id ', newTodo.id);
		// this.setState({ todoList: [...this.state.todoList, newTodo] });

		return todoService.addTodo(newTodo).then(result => {
			if (result.success) {
				// this.setState({ todoList: [...this.state.todoList.filter(t => t.id === new)]})
				this.setState({ todoList: [result.data, ...this.state.todoList] });
				return true;
			}

			this.reload('add todo error');
			return false;
		});
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
