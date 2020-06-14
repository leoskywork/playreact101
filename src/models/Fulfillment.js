import FulfillmentArchive from "./FulfillmentArchive";

export class Fulfillment {
    constructor(uid, name, lastFulfill, history, createBy, createAt, lastRemark, hasArchived) {
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
        this.archivedFulfillments = null;

        //for UI part
        this.isLoadingHistoryRecords = false;
        this.isLoadingMoreHistory = false;
        this.showLoadMore = false;
    }

    get hasRecords() {
        if (this.historyFulfillments && this.historyFulfillments.length > 0) return true;
        if (this.lastFulfill) return true;
        return false;
    }

    getAllRecords() {
        const allRecords = [];

        if (this.archivedFulfillments && this.archivedFulfillments.length > 0) {
            allRecords.push(...this.archivedFulfillments);
        }

        if (this.historyFulfillments && this.historyFulfillments.length > 0) {
            allRecords.push(...this.historyFulfillments);
        }

        if (this.lastFulfill) {
            allRecords.push(new FulfillmentArchive(this.uid, 'mock-last-fulfill', this.lastRemark, this.lastFulfill));
        }

        return allRecords.length > 0 ? allRecords : null;
    }
}

export default Fulfillment;
