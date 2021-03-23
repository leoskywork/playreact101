export class AppConst {
    static get isDev() {
        return true;
    }

    static get useNodeBackend() {
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
            ['1.1.1', '2020.6.17'],
            ['1.1.2', '2020.6.21'],
            ['1.1.3', '2020.6.21'],
            //support recursive routines
            ['1.1.4', '2020.6.21']
        ]
    }

    static get apiBaseUrl() {
    //     // return AppConst.isDev ? 'http://localhost:5000/public/' : 'http://118.31.35.69:1080/api/mock/'; 
    //     return AppConst.isDev ? 'http://localhost:5000/public/' : 'https://leoskywork.com/api/mock/';
    //static get netApiBaseUrl() {
        
        if (AppConst.useNodeBackend) {
            return AppConst.isDev ? 'http://localhost:5000/' : 'https://leoskywork.com/nodeapi/';
        }
        
        //.net framework api
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

    static get defaultFulfillDay() {
        return '0';
    }

    static get heartBeatInterval() {
        return 1000 * 60 * 60; //in ms
    }

    static get dayRolloverCheckingRate() {
        return 1000 * 60; //in ms
    }

    static get stagedHistory() {
        return 'staged';
    }

    static get archivedHistory() {
        return 'archived';
    }

    static get maxFulfillmentLength() {
        return 128;
    }

    static get maxNumberLength() {
        return 9;
    }

    static get defaultRecursiveDays() {
        return 7;
    }

    static get comma() {
        return ";";
    }

    static get commaCN() {
        return "；";
    }

}

export default AppConst;
