import Fulfillment from '../models/Fulfillment';
import FulfillmentArchive from '../models/FulfillmentArchive';

export class DtoMapper {

    static fromDtoRoutine(dto) {
        let historyRecords = null;
        if (Array.isArray(dto.HistoryFulfillments)) {
            historyRecords = dto.HistoryFulfillments.map(h => DtoMapper.fromDtoFulfillmentArchive(h));
        }

        return new Fulfillment(dto.Uid, dto.Name, dto.LastFulfill, historyRecords, dto.CreateBy, dto.CreateAt, dto.LastRemark, dto.HasArchived, dto.IsDeleted, dto.DeleteReason);
    }

    static fromDtoFulfillmentArchive(dto) {
        return new FulfillmentArchive(dto.ParentUid, dto.Uid, dto.Remark, dto.Time, dto.IsDeleted, dto.DeleteReason);
    }
}

export default DtoMapper;