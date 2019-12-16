export class Fulfillment {
	constructor(uid, name, lastFulfill, history, createBy, createAt) {
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
	}
}

export default Fulfillment;
