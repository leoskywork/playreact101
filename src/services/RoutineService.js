import axios from 'axios';
import AppConst from '../common/AppConst';
import Utility from '../common/Utility';
import DtoMapper from './DtoMapper';

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
            .then(result => Utility.unifyArrayMapper(result.data, DtoMapper.fromDtoRoutine))
            .catch(error => Utility.unifyAjaxErrorHandling(error));
    }

    getHistoryRecords(lsk, id, historyKind) {
        const config = {
            headers: {
                [AppConst.headers.lskIntrospection]: lsk
            }
        };

        if (historyKind === AppConst.ArchivedHistory) {
            return axios.get(`${AppConst.netApiBaseUrl}introspection/${id}?history=archived`, config)
                .then(result => Utility.unifyResultValidator(result))
                .then(result => Utility.unifyArrayMapper(result.data, DtoMapper.fromDtoFulfillmentArchive))
                .catch(error => Utility.unifyAjaxErrorHandling(error));
        }

        return axios.get(`${AppConst.netApiBaseUrl}introspection/${id}`, config)
            .then(result => Utility.unifyResultValidator(result))
            .then(result => Utility.unifyObjectMapper(result.data, DtoMapper.fromDtoRoutine))
            .catch(error => Utility.unifyAjaxErrorHandling(error));
    }

    fulfillRoutine(fulfillment, lsk, remark) {
        const config = {
            headers: {
                [AppConst.headers.lskIntrospection]: lsk
            }
        };

        const dtoFulfillment = {
            Name: fulfillment.name,
            LastFulfill: fulfillment.lastFulfill,
            LastRemark: remark
        }

        return axios
            .put(`${AppConst.netApiBaseUrl}introspection/${fulfillment.id}`, dtoFulfillment, config)
            .then(result => Utility.unifyResultValidator(result))
            .then(result => Utility.unifyObjectMapper(result.data, DtoMapper.fromDtoRoutine))
            .catch(error => Utility.unifyAjaxErrorHandling(error));
    }

    getHeartBeat(lsk, user) {
        const config = {
            headers: {
                [AppConst.headers.lskIntrospection]: lsk
            }
        };

        return axios.get(`${AppConst.netApiBaseUrl}introspection/heartbeat?user=${encodeURI(user)}`, config)
            .then(result => Utility.unifyResultValidator(result, true))
            .catch(error => Utility.unifyAjaxErrorHandling(error, true));
    }

}

export default new RoutineService();
