import request from 'superagent';

//API сервер
const apiPath = 'https://storia.me/api';

//преобразует относительные урлы в абсолютные
const getUrl = (path) => {
    if (path.startsWith('http') || path.startsWith('https')) {
        return path;
    }
    else {
        return `${apiPath}${path}`;
    }
};

//Клиент для запросов в API
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

    del: (path) => new Promise((resolve, reject) => {
        request
            .del(getUrl(path))
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
                    resolve(res);
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
    })
};

export default ApiClient;
