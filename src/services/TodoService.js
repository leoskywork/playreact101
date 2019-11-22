import axios from 'axios';
import AppConst from '../common/AppConst';
import Utility from '../common/Utility';
// import ApiResult from '../models/ApiResult';

export class TodoService {
	getTodos(limit) {
		let queryString = limit > 0 ? 'limit=' + limit : '';

		return axios
			.get(`${AppConst.ApiBaseUrl}todos${queryString ? '?' + queryString : ''}`)
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
			.post(`${AppConst.ApiBaseUrl}todos/`, todo)
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
			.put(`${AppConst.ApiBaseUrl}todos/${todo.id}`, todo)
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
		if (dto._id) {
			dto.id = dto._id;
			delete dto._id;
		}

		delete dto.__v;
		return dto;
	}

	//fixme: impl notification system
	unifyResultValidator(axiosResponse) {
		if (!axiosResponse || !axiosResponse.data || axiosResponse.data.success) return axiosResponse;

		const data = axiosResponse.data;

		//fixme: pop error message - don't use built in alert func and no repeat alerts within x amount of time
		if (Utility.notEmpty(data.message)) {
			alert(data.message);
			data.unifyHandled = true;
		} else if (Utility.notEmpty(data)) {
			alert(`error message: ${JSON.stringify(data)}`);
			if (typeof data === 'object') {
				data.unifyHandled = true;
			} else {
				axiosResponse.data = {};
				axiosResponse.data.unifyHandled = true;
				axiosResponse.data.data = data;
			}
		}

		return axiosResponse;
	}
}

const todoService = new TodoService();

export default todoService;
