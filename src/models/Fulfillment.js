export class Fulfillment {
	constructor(uid, name, lastFulfill, history, createBy, createAt) {
		this.id = uid;
		this.name = name;

		// if (lastFulfill) {
		//     this.lastFulfill = new Date(lastFulfill);
		// }
		this.lastFulfill = lastFulfill;

		this.historyFulfillments = history;
		this.createBy = createBy;
		this.createAt = createAt;
	}
}

export default Fulfillment;
