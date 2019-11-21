export class Common {
	static get IsDev() {
		return true;
	}

	static get AppName() {
		return Common.IsDev ? 'Dev React 101' : 'Pilot React 101';
	}

	static get CreatedAt() {
		return new Date('2019-11-20 GMT+0800');
	}

	static get ApiBaseUrl() {
		return Common.IsDev ? 'http://localhost:5000/public/' : 'not implemented';
	}
}

export default Common;
