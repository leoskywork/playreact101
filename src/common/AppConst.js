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
        return AppConst.isDev ? 'http://localhost:5000/public/' : 'http://118.31.35.69:1080/api/mock/'; //'https://leoskywork.com/api/mock/';
    }

    //.net framework api
    static get netApiBaseUrl() {
        return AppConst.isDev ? 'http://localhost:57005/' : 'https://leoskywork.com/api/'; //'http://118.31.35.69:1080/api/';
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

    static get DefaultFulfillDay() {
        return '0';
    }

    static get HeartBeatInterval() {
        return 1000 * 60 * 60;
    }
}

export default AppConst;
