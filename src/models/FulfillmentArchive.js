export class FulfillmentArchive {
    constructor(parentUid, uid, remark, time) {
        this.parentUid = parentUid;
        this.uid = uid;
        this.remark = remark;

        if (time) {
            this._rawTime = time;
            this.time = new Date(time);
        }
    }
}

export default FulfillmentArchive;