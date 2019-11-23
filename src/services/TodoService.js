import axios from 'axios';
import AppConst from '../common/AppConst';
import Utility from '../common/Utility';
// import ApiResult from '../models/ApiResult';

export class TodoService {
	getTodos(limit) {
		let queryString = limit > 0 ? '?limit=' + limit : '';

		return axios
			.get(`${AppConst.apiBaseUrl}todos${queryString}`)
			.then(result => Utility.unifyResultValidator(result))
			.then(result => Utility.unifyArrayMapper(result.data, todoService.mapFromDtoTodo))
			.catch(error => Utility.unifyAjaxErrorHandling(error));
	}

	addTodo(todo) {
		return axios
			.post(`${AppConst.apiBaseUrl}todos/`, todo)
			.then(result => Utility.unifyResultValidator(result))
			.then(result => Utility.unifyObjectMapper(result.data, todoService.mapFromDtoTodo))
			.catch(error => Utility.unifyAjaxErrorHandling(error));
	}

	deleteTodo(id) {
		return axios
			.delete(`${AppConst.apiBaseUrl}todos/${id}`)
			.then(result => Utility.unifyResultValidator(result))
			.then(result => result.data)
			.catch(error => Utility.unifyAjaxErrorHandling(error));
	}

	updateTodo(todo) {
		return axios
			.put(`${AppConst.apiBaseUrl}todos/${todo.id}`, todo)
			.then(result => Utility.unifyResultValidator(result))
			.then(result => Utility.unifyObjectMapper(result.data, todoService.mapFromDtoTodo))
			.catch(error => Utility.unifyAjaxErrorHandling(error));
	}

	static mapFromDtoTodo(dto) {
		if (dto._id) {
			dto.id = dto._id;
			delete dto._id;
		}

		delete dto.__v;
		return dto;
	}
}

const todoService = new TodoService();

export default todoService;
