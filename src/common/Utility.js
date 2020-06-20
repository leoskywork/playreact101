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

    static unifyArrayMapper(apiResultData, itemMapper) {
        if (itemMapper == null) {
            return apiResultData;
        }

        if (apiResultData && apiResultData.success && Array.isArray(apiResultData.data)) {
            apiResultData.data = apiResultData.data.map(t => itemMapper(t));
        }

        return apiResultData;
    }

    static unifyObjectMapper(apiResultData, itemMapper) {
        if (itemMapper == null) {
            return apiResultData;
        }

        if (apiResultData && apiResultData.success && apiResultData.data) {
            apiResultData.data = itemMapper(apiResultData.data);
        }

        return apiResultData;
    }

    static unifyDirectDataMapper(apiResult) {
        return apiResult.data;
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

    static getDaysBetween(currentDate, priorDate) {
        //fixme, should 1 day diff when [Sun Jun 14 2020 00:55:14 GMT+0800 (China Standard Time)] 
        //and prior to [Sat Jun 13 2020 22: 57: 54 GMT + 0800(China Standard Time)]
        //but get 0 here, following is a temp hack
        let daysSincePrior = Math.floor(currentDate.getTime() / 1000 / 60 / 60 / 24) - Math.floor(priorDate.getTime() / 1000 / 60 / 60 / 24);

        if (daysSincePrior === 0 && currentDate.getDate() !== priorDate.getDate()) return 1;

        if (daysSincePrior < 28 && currentDate.getMonth() === priorDate.getMonth()) {
            const localDaysDiff = currentDate.getDate() - priorDate.getDate();
            if (localDaysDiff !== daysSincePrior) {
                return localDaysDiff;
            }
        }

        return daysSincePrior;
    }
}

export default Utility;
