export class AppConst {
    static get isDev() {
        return false;
    }

    static get useNodeBackend() {
        return false;
    }

    static get appName() {
        return AppConst.isDev ? 'Dev React 101' : 'Not-dev React 101';
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
            ['1.1.4', '2020.6.21'],
            //use local host
            ['1.1.5', '2021.11.19'],
            //migrate to node v18.1.0
            ['1.2.0', '2022.5.14'],
        ]
    }

    // todos api ------ node
    // routines api --- asp.net
    static get apiBaseUrl() {
        
        if (AppConst.useNodeBackend) {
            return AppConst.isDev ? 'http://localhost:5000/' : 'https://leoskywork.com/nodeapi/';
        }
        
        //.net framework api
        //return AppConst.isDev ? 'http://localhost:57005/' : 'https://leoskywork.com/api/';  //remote
        //return AppConst.isDev ? 'http://localhost:57005/' : 'http://leo-asus:8080/api6/';   //LAN web api
        return AppConst.isDev ? 'http://localhost:57005/' : 'http://localhost:8080/api6/';    //same pc
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
