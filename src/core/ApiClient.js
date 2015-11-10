import request from 'superagent';
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';
import config from '../config';

import authHolder from './AuthHolder';

//API сервер
const apiPath = config.apiPath;

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
//Немного разный вид запросов данных для клиента и сервера
//на сервере нужно явно передавать SSID, иначе будет 401 - не авторизован
const ApiClient = {
    get: (path, params) => new Promise((resolve, reject) => {
        function getResult(err, res) {
            if (err) {
                if (err.status === 404) {
                    resolve(null);
                } else {
                    reject(err);
                }
            } else {
                resolve(res.body);
            }
        }

        //запросы с клиента
        if (canUseDOM) {
            request
                .get(getUrl(path))
                .withCredentials() //используем куки, полученные при авторизации
                .query(params)
                .accept('application/json')
                .end(getResult);
        }
        else {
            console.log('api get, authHolder', authHolder);
            //серверные запросы
            request
                .get(getUrl(path))
                .set('Cookie', `SSID=${authHolder.sessionId}`)//проставляем куки SSID, полученные при авторизации явным образом
                .query(params)
                .accept('application/json')
                .end(getResult);
        }
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
                    resolve(res.text);
                }
            });
    }),

    //запрос авторизации
    auth: (path, params) => new Promise((resolve, reject) => {
        function authResult(err, res) {
            if (err) {
                if (err.status === 404) {
                    resolve(null);
                } else {
                    reject(err);
                }
            } else {
                if (res && res.text) {
                    var data = JSON.parse(res.text);

                    //прошел успешно - сохраняем данные авторизации
                    authHolder.sessionId = data.sessionId;
                    authHolder.userId = data.userId;
                    authHolder.accountId = data.accountId;

                    resolve(data);
                }
                else {
                    reject(err);
                }
            }
        }

        if (canUseDOM) {
            request
                .post(getUrl(path))
                .send(params)
                .accept('application/json')
                .withCredentials()
                .end(authResult);
        }
        else {
            request
                .post(getUrl(path))
                .send(params)
                .accept('application/json')
                .end(authResult);
        }
    })
};

export default ApiClient;
