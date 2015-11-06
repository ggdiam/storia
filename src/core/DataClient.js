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
    }),

    like: (storyId, momentId, setLike) => new Promise((resolve, reject) => {
        var url = setLike ? apiUrls.Like : apiUrls.UnLike;
        url = url.replace('{storyId}', storyId);
        url = url.replace('{momentId}', momentId);
        if (setLike) {
            console.log('DataClient like');
            api.post(url).then(resolve, reject);
        }
        else {
            console.log('DataClient unlike');
            api.del(url).then(resolve, reject);
        }
    })
};

export default DataClient;