
export class Fulfillment {
    constructor(uid, name, lastFulfill, history, createBy, createAt, lastRemark, hasArchived, isDeleted, deleteReason) {
        this.id = uid;
        this.name = name;

        if (lastFulfill) {
            this._rawLastFulfill = lastFulfill; //is this necessary??
            this.lastFulfill = new Date(lastFulfill);
            this.lastRemark = lastRemark;
        }


        this.createBy = createBy;
        if (createAt) {
            this._rawCreateAt = createAt; //is this necessary??S
            this.createAt = new Date(createAt);
        }

        this.historyFulfillments = history;
        this.hasArchived = hasArchived;

        //for UI part //moved to state{}
        //this.isLoadingHistoryRecords = false;
        //this.isLoadingMoreHistory = false;
        //this.showLoadMore = false;

        if (isDeleted) {
            this.isDeleted = isDeleted;
            this.deleteReason = deleteReason;
        }
    }


}

export default Fulfillment;
