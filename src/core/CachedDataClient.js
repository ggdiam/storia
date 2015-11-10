import api from './ApiClient';
import apiUrls from '../constants/ApiUrls';
import config from '../config';
import dataClient from './DataClient';
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';
import SessionStorageHelper from './SessionStorageHelper.js';
import IsOnlineService from './IsOnlineService';

//Клиент для запроса данных из API с кэшированием в SessionStorage
//Логика работы:
//делается запрос к API
//если оттуда получили ошибку - отдаем из кэша
//если нет и в кэше - то возвращаем ошибку
const CachedDataClient = {
    get: (path, params) => new Promise((resolve, reject) => {
        console.log('CachedDataClient get');
        //окружение браузера
        if (canUseDOM) {
            var key = getKey(path, params);

            dataClient.get(path, params).then((data) => {
                console.log('CachedDataClient result from api');
                //результат сохраняем в кэш
                SessionStorageHelper.setItem(key, JSON.stringify(data));
                resolve(data);
            }).catch((err) => {
                //если из API получить не удалось - отдаем из кэша
                //получаем значение из кэша
                var res = SessionStorageHelper.getItem(key);
                if (res) {
                    console.log('CachedDataClient result from cache');
                    resolve(JSON.parse(res));
                }
                else {
                    //иначе - отдаем ошибку
                    reject(err);
                }
            });
        }
        else {
            dataClient.get(path, params).then(resolve, reject);
        }
    }),
};

//получает ключ из пути и параметорв
function getKey(path, params) {
    let prms = [];
    if (params) {
        Object.keys(params).forEach((key)=>{
            prms.push(key + '=' + params[key]);
        });
    }
    return path + prms.join('&');
}

export default CachedDataClient;