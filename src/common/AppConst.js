export class AppConst {
	static get isDev() {
		return false;
	}

	static get appName() {
		return AppConst.isDev ? 'Dev React 101' : 'Pilot React 101';
	}

	static get createdAt() {
		return new Date('2019-11-20 GMT+0800');
	}

	static get apiBaseUrl() {
		return AppConst.isDev ? 'http://localhost:5000/public/' : 'http://leoskywork.com/api/mock/';
	}

	static get netApiBaseUrl() {
		return AppConst.isDev ? 'http://localhost:57005/' : 'http://leoskywork.com/api/';
	}

	static get frontendBaseUrl() {
		return process.env.PUBLIC_URL;
	}

	static get headers() {
		return {
			get lskIntrospection() {
				return 'lsk-introspection-god';
			}
		};
	}
}

export default AppConst;
