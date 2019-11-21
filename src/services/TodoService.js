import axios from 'axios';
import AppConst from '../common/AppConst';
import Utility from '../common/Utility';
// import ApiResult from '../models/ApiResult';

export class TodoService {
	getTodos(limit) {
		let queryString = limit > 0 ? 'limit=' + limit : '';

		return axios
			.get(`${AppConst.ApiBaseUrl}todos?${queryString}`)
			.then(result => this.unifyResultValidator(result))
			.then(result => {
				const apiResult = result.data;

				if (apiResult && apiResult.success && Array.isArray(apiResult.data)) {
					apiResult.data = apiResult.data.map(t => TodoService.mapFromDtoTodo(t));
				}

				return apiResult;
			})
			.catch(error => {
				// todo: unify error handling
				console.log(error);
			});
	}

	addTodo(todo) {
		return axios
			.put(`${AppConst.ApiBaseUrl}todos/`, todo)
			.then(result => this.unifyResultValidator(result))
			.then(result => {
				const apiResult = result.data;

				if (apiResult && apiResult.success && apiResult.data) {
					apiResult.data = TodoService.mapFromDtoTodo(apiResult.data);
				}
				return apiResult;
			})
			.catch(error => {
				//todo: unify error handling
				console.log(error);
			});
	}

	deleteTodo(id) {
		return axios
			.delete(`${AppConst.ApiBaseUrl}todos/${id}`)
			.then(result => this.unifyResultValidator(result))
			.then(result => {
				return result.data;
			})
			.catch(error => {
				// todo: unify error handling
				console.log(error);
			});
	}

	updateTodo(todo) {
		return axios
			.post(`${AppConst.ApiBaseUrl}todos/${todo.id}`, todo)
			.then(result => this.unifyResultValidator(result))
			.then(result => {
				const apiResult = result.data;

				if (apiResult && apiResult.success && apiResult.data) {
					apiResult.data = TodoService.mapFromDtoTodo(apiResult.data);
				}
				return apiResult;
			})
			.catch(error => {
				// todo: unify error handling
				console.log(error);
			});
	}

	static mapFromDtoTodo(dto) {
		dto.id = dto._id;
		delete dto._id;
		delete dto.__v;
		return dto;
	}

	//fixme: impl notification system
	unifyResultValidator(axiosResponse) {
		if (!axiosResponse || !axiosResponse.data) return axiosResponse;

		const data = axiosResponse.data;

		if (!data.success && Utility.notEmpty(data.message)) {
			alert(data.message);
			data.unifyHandled = true;
		}

		return axiosResponse;
	}
}

const todoService = new TodoService();

export default todoService;
