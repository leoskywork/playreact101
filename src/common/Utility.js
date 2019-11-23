export class Utility {
	//closure + IIFE
	static genInteger = (() => {
		let seed = 100;

		return () => seed++;
	})();

	static notEmpty(value) {
		return value && String(value).trim().length > 0;
	}

	//fixme: impl notification system
	static unifyResultValidator(axiosResponse) {
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

	static unifyArrayMapper(apiResult, itemMapper) {
		if (itemMapper == null) {
			return apiResult;
		}

		if (apiResult && apiResult.success && Array.isArray(apiResult.data)) {
			apiResult.data = apiResult.data.map(t => itemMapper(t));
		}

		return apiResult;
	}

	static unifyObjectMapper(apiResult, itemMapper) {
		if (itemMapper == null) {
			return apiResult;
		}

		if (apiResult && apiResult.success && apiResult.data) {
			apiResult.data = itemMapper(apiResult.data);
		}

		return apiResult;
	}

	static unifyAjaxErrorHandling(error) {
		//todo: unify error handling
		console.log(error);

		if (error && error.response && error.response.data) {
			const data = error.response.data;

			if (data.Message) {
				return alert('Error: ' + (typeof data.Message == 'object' ? JSON.stringify(data.Message) : data.Message));
			}

			return alert('Error: ' + (typeof data == 'object' ? JSON.stringify(data) : data));
		}

		alert(error);
	}
}

export default Utility;
