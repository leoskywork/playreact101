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

    static get version() {
        return AppConst.historyVersions[AppConst.historyVersions.length - 1][0];
    }

    static get versionDetails() {
        return 'v' + AppConst.historyVersions[AppConst.historyVersions.length - 1].join(' - ');
    }

    static get historyVersions() {
        return [
            ['1.0.0', '2019.11.20'],
            ['1.1.0', '2020.6.15'],
            ['1.1.1', '2020.6.17']
        ]
    }

    static get apiBaseUrl() {
        // return AppConst.isDev ? 'http://localhost:5000/public/' : 'http://118.31.35.69:1080/api/mock/'; 
        return AppConst.isDev ? 'http://localhost:5000/public/' : 'https://leoskywork.com/api/mock/';
    }

    //.net framework api
    static get netApiBaseUrl() {
        // return AppConst.isDev ? 'http://localhost:57005/' : 'http://118.31.35.69:1080/api/';
        return AppConst.isDev ? 'http://localhost:57005/' : 'https://leoskywork.com/api/';
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

    static get StagedHistory() {
        return 'staged';
    }

    static get ArchivedHistory() {
        return 'archived';
    }

    static get maxFulfillmentLength() {
        return 128;
    }

}

export default AppConst;
