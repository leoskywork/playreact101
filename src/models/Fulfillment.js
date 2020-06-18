
export class Fulfillment {
    constructor(uid, name, lastFulfill, history, createBy, createAt, lastRemark, hasArchived, isDeleted, deleteReason) {
        this.id = uid;
        this.name = name;

        if (lastFulfill) {
            this._rawLastFulfill = lastFulfill; //is this necessary??
            this.lastFulfill = new Date(lastFulfill);
        }

        this.historyFulfillments = history;
        this.createBy = createBy;

        if (createAt) {
            this._rawCreateAt = createAt; //is this necessary??S
            this.createAt = new Date(createAt);
        }

        this.lastRemark = lastRemark;
        this.hasArchived = hasArchived;
        // this.archivedFulfillments = null;

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
