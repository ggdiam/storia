import api from './ApiClient';
import apiUrls from '../constants/ApiUrls';
import config from '../config';

const DataClient = {
    get: (path, params) => new Promise((resolve, reject) => {
        console.log('DataClient get');
        //запрос данных
        api.get(path, params).then((data) => {
            console.log('DataClient success');
            //данные ок - возвращаем
            resolve(data);
        }).catch((err) => {
            //ошибка
            if (err.status === 401) {
                console.log('DataClient 401 - not auth');
                //если 401 - не авторизован - то делаем авторизацию, затем снова данные
                api.auth(apiUrls.Auth, config.auth.params).then(() => {
                    console.log('DataClient auth success');
                    //авторизовались - снова запрос данных
                    api.get(path, params).then((data) => {
                        console.log('DataClient success');
                        //данные ок - возвращаем
                        resolve(data);
                    }).catch((err) => {
                        console.log('DataClient data err');
                        //ошибка запроса данных
                        reject(err);
                    });
                }).catch((err) => {
                    console.log('DataClient auth err');
                    //ошибка авторизации
                    reject(err);
                })
            }
            else {
                console.log('DataClient data err');
                //ошибка запроса данных
                reject(err);
            }
        })
    })
};

export default DataClient;