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
    static unifyResultValidator(axiosResponse, suppressAlert = false) {
        if (!axiosResponse || !axiosResponse.data || axiosResponse.data.success) return axiosResponse;
        if (axiosResponse.data.unifyHandled) return axiosResponse;

        if (suppressAlert) {
            axiosResponse.data.unifyHandled = true;
            return axiosResponse;
        }

        //fixme: pop error message - don't use built in alert func and no repeat alerts within x amount of time
        if (Utility.notEmpty(axiosResponse.data.message)) {
            alert(axiosResponse.data.message);
            axiosResponse.data.unifyHandled = true;
        } else if (Utility.notEmpty(axiosResponse.data)) {
            alert(`error message: ${JSON.stringify(axiosResponse.data)}`);
            if (typeof axiosResponse.data === 'object') {
                axiosResponse.data.unifyHandled = true;
            } else {
                const data = axiosResponse.data;
                axiosResponse.data = {};
                axiosResponse.data.unifyHandled = true;
                axiosResponse.data.originalData = data;
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

    static unifyAjaxErrorHandling(error, suppressAlert = false) {
        //todo: unify error handling
        console.log(error);

        if (suppressAlert) return;

        if (error && error.response && error.response.data) {
            const data = error.response.data;

            if (data.Message) {
                return alert('Error: ' + (typeof data.Message == 'object' ? JSON.stringify(data.Message) : data.Message));
            }

            return alert('Error: ' + (typeof data == 'object' ? JSON.stringify(data) : data));
        }

        return alert(error);
    }
}

export default Utility;
