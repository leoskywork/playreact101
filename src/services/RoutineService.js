import axios from 'axios';
import AppConst from '../common/AppConst';
import Utility from '../common/Utility';
import DtoMapper from './DtoMapper';

export class RoutineService {
    getRoutines(lsk) {
        const config = this.createHttpConfig(lsk);

        return axios
            .get(`${AppConst.netApiBaseUrl}introspection`, config)
            .then(result => Utility.unifyResultValidator(result))
            .then(result => Utility.unifyArrayMapper(result.data, DtoMapper.fromDtoRoutine))
            .catch(error => Utility.unifyAjaxErrorHandling(error));
    }

    getHistoryRecords(lsk, id, historyKind) {
        const config = this.createHttpConfig(lsk);

        if (historyKind === AppConst.archivedHistory) {
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


    getHeartBeat(lsk, user) {
        const config = this.createHttpConfig(lsk);

        return axios.get(`${AppConst.netApiBaseUrl}introspection/heartbeat?user=${encodeURI(user)}`, config)
            .then(result => Utility.unifyResultValidator(result, true))
            .catch(error => Utility.unifyAjaxErrorHandling(error, true));
    }

    fulfillRoutine(fulfillment, lsk, remark) {
        const config = this.createHttpConfig(lsk);

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

    deleteRoutine(fulfillment, deleteReason, lsk) {
        const config = this.createHttpConfig(lsk);
        // const dtoDeleteBody = {
        //     Name: fulfillment.name,
        //     Reason: deleteReason
        // }

        //axios doesn't support delete with body, use query paramter here
        return axios
            .delete(`${AppConst.netApiBaseUrl}introspection/${fulfillment.id}?reason=${encodeURI(deleteReason)}`, config)
            .then(result => Utility.unifyResultValidator(result))
            .then(result => Utility.unifyObjectMapper(result.data, DtoMapper.fromDtoRoutine))
            .catch(error => Utility.unifyResultValidator(error));
    }

    deleteRoutineHistory(fulfillmentHistory, deleteReason, kind, lsk) {
        const config = this.createHttpConfig(lsk);
        // const dtoDeleteBody = {
        //     Name: fulfillmentHistory.name,
        //     Reason: deleteReason,
        //     Kind: kind
        // }
        const parentId = fulfillmentHistory.parentId;

        //axios doesn't support delete with body
        return axios
            .delete(`${AppConst.netApiBaseUrl}introspection/${parentId}/history/${fulfillmentHistory.id}?reason=${deleteReason}&kind=${kind}`, config)
            .then(result => Utility.unifyResultValidator(result))
            .catch(error => Utility.unifyResultValidator(error));
    }

    createHttpConfig(lsk) {
        return {
            headers: {
                [AppConst.headers.lskIntrospection]: encodeURI(lsk)
            }
        }
    }

}

export default new RoutineService();
