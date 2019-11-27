export class Fulfillment {
	constructor(uid, name, lastFulfill, history, createBy, createAt) {
		this.id = uid;
		this.name = name;

		if (lastFulfill) {
			this.lastFulfill = new Date(lastFulfill);
		}

		this.historyFulfillments = history;
		this.createBy = createBy;

		if (createAt) {
			this.createAt = new Date(createAt);
		}
	}
}

export default Fulfillment;
