import axios from 'axios';
import AppConst from '../common/AppConst';
import Utility from '../common/Utility';
// import ApiResult from '../models/ApiResult';

export class TodoService {
	getTodos(limit) {
		let queryString = limit > 0 ? '?limit=' + limit : '';

		return axios
			.get(`${AppConst.apiBaseUrl}public/todos${queryString}`)
			.then(result => Utility.unifyResultValidator(result))
			.then(result => Utility.unifyArrayMapper(result.data, todoService.mapFromDtoTodo))
			.catch(error => Utility.unifyAjaxErrorHandling(error));
	}

	addTodo(todo) {
		return axios
			.post(`${AppConst.apiBaseUrl}public/todos/`, todo)
			.then(result => Utility.unifyResultValidator(result))
			.then(result => Utility.unifyObjectMapper(result.data, todoService.mapFromDtoTodo))
			.catch(error => Utility.unifyAjaxErrorHandling(error));
	}

	deleteTodo(id) {
		return axios
			.delete(`${AppConst.apiBaseUrl}public/todos/${id}`)
			.then(result => Utility.unifyResultValidator(result))
			.then(result => result.data)
			.catch(error => Utility.unifyAjaxErrorHandling(error));
	}

	updateTodo(todo) {
		return axios
			.put(`${AppConst.apiBaseUrl}public/todos/${todo.id}`, todo)
			.then(result => Utility.unifyResultValidator(result))
			.then(result => Utility.unifyObjectMapper(result.data, todoService.mapFromDtoTodo))
			.catch(error => Utility.unifyAjaxErrorHandling(error));
    }
    
    createHttpConfig() {
        return {
            headers: {
                //[ref](https://stackoverflow.com/questions/15945118/detecting-ajax-requests-on-nodejs-with-express)
                //sometimes, need add the following header to ensure backend 'req.xhr' checking works
                "X-Request-With": "XMLHttpRequest"
            }
        }
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
