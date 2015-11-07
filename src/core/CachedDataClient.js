import api from './ApiClient';
import apiUrls from '../constants/ApiUrls';
import config from '../config';
import dataClient from './DataClient';
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';
import SessionStorageHelper from './SessionStorageHelper.js';

//Клиент для запроса данных из API с кэшированием в SessionStorage
const CachedDataClient = {
    get: (path, params) => new Promise((resolve, reject) => {
        console.log('CachedDataClient get');

        //окружение браузера
        if (canUseDOM) {
            var key = getKey(path, params);
            //получаем значение из кэша
            var res = SessionStorageHelper.getItem(key);
            //если офлайн режим и есть в кэше - отдаем
            if (!window.navigator.onLine && res) {
                console.log('CachedDataClient result from cache');
                resolve(JSON.parse(res));
            }
            else {
                //если нет - то отдаем из API
                dataClient.get(path, params).then((data) => {
                    console.log('CachedDataClient result from api');
                    //результат сохраняем в кэш
                    SessionStorageHelper.setItem(key, JSON.stringify(data));
                    resolve(data);
                }, reject);
            }
        }
        else {
            dataClient.get(path, params).then(resolve, reject);
        }
    }),

    like: (storyId, momentId, setLike) => new Promise((resolve, reject) => {
    })
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