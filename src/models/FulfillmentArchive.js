export class FulfillmentArchive {
    constructor(parentUid, uid, remark, time, isDeleted, deleteReason) {
        this.parentUid = parentUid;
        this.uid = uid;
        this.remark = remark;

        if (time) {
            this._rawTime = time;
            this.time = new Date(time);
        }

        if (isDeleted) {
            this.isDeleted = isDeleted;
            this.deleteReason = deleteReason;
        }
    }

}

export default FulfillmentArchive;