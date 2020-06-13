import axios from 'axios';
import AppConst from '../common/AppConst';
import Utility from '../common/Utility';
import Fulfillment from '../models/Fulfillment';

export class RoutineService {
    getRoutines(lsk) {
        const config = {
            headers: {
                [AppConst.headers.lskIntrospection]: lsk
            }
        };

        return axios
            .get(`${AppConst.netApiBaseUrl}introspection`, config)
            .then(result => Utility.unifyResultValidator(result))
            .then(result => Utility.unifyArrayMapper(result.data, RoutineService.mapFromDtoRoutine))
            .catch(error => Utility.unifyAjaxErrorHandling(error));
    }

    getHistoryRecords(lsk, id) {
        const config = {
            headers: {
                [AppConst.headers.lskIntrospection]: lsk
            }
        };

        return axios.get(`${AppConst.netApiBaseUrl}introspection/${id}`, config)
            .then(result => Utility.unifyResultValidator(result))
            .then(result => Utility.unifyObjectMapper(result.data, RoutineService.mapFromDtoRoutine))
            .catch(error => Utility.unifyAjaxErrorHandling(error));
    }

    fulfillRoutine(fulfillment, lsk) {
        const config = {
            headers: {
                [AppConst.headers.lskIntrospection]: lsk
            }
        };

        return axios
            .put(`${AppConst.netApiBaseUrl}introspection/${fulfillment.id}`, fulfillment, config)
            .then(result => Utility.unifyResultValidator(result))
            .then(result => Utility.unifyObjectMapper(result.data, RoutineService.mapFromDtoRoutine))
            .catch(error => Utility.unifyAjaxErrorHandling(error));
    }

    getHeartBeat(lsk, user) {
        const config = {
            headers: {
                [AppConst.headers.lskIntrospection]: lsk
            }
        };

        return axios.get(`${AppConst.netApiBaseUrl}introspection/heartbeat?user=${encodeURI(user)}`, config)
            .then(result => Utility.unifyResultValidator(result))
            .catch(error => Utility.unifyAjaxErrorHandling(error));
    }

    static mapFromDtoRoutine(dto) {
        return new Fulfillment(dto.Uid, dto.Name, dto.LastFulfill, dto.HistoryFulfillments, dto.CreateBy, dto.CreateAt);
    }
}

export default new RoutineService();
