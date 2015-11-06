import request from 'superagent';
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
//import SessionStorageHelper from './SessionStorageHelper.js';

const apiPath = 'https://storia.me/api';
const getUrl = (path) => {
    if (path.startsWith('http') || path.startsWith('https')) {
        return path;
    }
    else {
        return `${apiPath}${path}`;
    }
};

const ApiClient = {

    get: (path, params) => new Promise((resolve, reject) => {
        request
            .get(getUrl(path))
            .query(params)
            .accept('application/json')
            .withCredentials()
            .end((err, res) => {
                if (err) {
                    if (err.status === 404) {
                        resolve(null);
                    } else {
                        reject(err);
                    }
                } else {
                    resolve(res.body);
                }
            });
    }),

    post: (path, params) => new Promise((resolve, reject) => {
        request
            .post(getUrl(path))
            .send(params)
            .accept('application/json')
            .withCredentials()
            .end((err, res) => {
                if (err) {
                    if (err.status === 404) {
                        resolve(null);
                    } else {
                        reject(err);
                    }
                } else {
                    resolve(res.text);
                }
            });
    }),

    auth: (path, params) => new Promise((resolve, reject) => {
        request
            .post(getUrl(path))
            .send(params)
            .accept('application/json')
            .withCredentials()
            .end((err, res) => {
                if (err) {
                    if (err.status === 404) {
                        resolve(null);
                    } else {
                        reject(err);
                    }
                } else {
                    if (res && res.text) {
                        resolve(JSON.parse(res.text));
                    }
                    else {
                        reject(err);
                    }
                }
            });
    }),

    //cachedGet: (path, params) => new Promise((resolve, reject) => {
    //    var key = getKey(path, params);
    //    var res = SessionStorageHelper.getItem(key);
    //    if (res) {
    //        resolve(JSON.parse(res));
    //    }
    //    else {
    //        request
    //            .get(getUrl(path))
    //            .query(params)
    //            .accept('application/json')
    //            .end((err, res) => {
    //                if (err) {
    //                    if (err.status === 404) {
    //                        resolve(null);
    //                    } else {
    //                        reject(err);
    //                    }
    //                } else {
    //                    SessionStorageHelper.setItem(key, JSON.stringify(res.body));
    //                    resolve(res.body);
    //                }
    //            });
    //    }
    //})
};

function getKey(path, params) {
    let prms = [];
    if (params) {
        Object.keys(params).forEach((key)=>{
            prms.push(key + '=' + params[key]);
        });
    }
    return path + prms.join('&');
}

export default ApiClient;
