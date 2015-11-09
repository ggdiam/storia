import api from './ApiClient';
import apiUrls from '../constants/ApiUrls';
import config from '../config';

//Клиент работы с данными

//Тут зашита логика авторизации при вызове любого get, post, del метода API
//Логика простая: если get запрос вернул 401 - то выполняем авторизацию
//и повторяем запрос к API

const DataClient = {
    //get запрос к API
    get: (path, params) => {
        return makeRequest('GET', path, params);
    },

    //Проставление / удаление лайка
    like: (storyId, momentId, setLike) => new Promise((resolve, reject) => {
        var url = setLike ? apiUrls.Like : apiUrls.UnLike;
        url = url.replace('{storyId}', storyId);
        url = url.replace('{momentId}', momentId);
        if (setLike) {
            console.log('DataClient like');
            //запрос проставление лайка
            makeRequest('POST', url).then(resolve, reject);
        }
        else {
            console.log('DataClient unlike');
            //запрос удаления лайка
            makeRequest('DEL', url).then(resolve, reject);
        }
    })
};

//get запрос к API
function makeRequest(verb, path, params) {
    function req(verb, path, params) {
        verb = verb.toUpperCase();
        switch (verb) {
            case 'GET': return api.get(path, params);
            case 'POST': return api.post(path, params);
            case 'DEL': return api.del(path, params);
        }

        //default
        return api.get(path, params);
    }

    //логика авторизации при неудачном запросе
    return new Promise((resolve, reject) => {
        console.log('DataClient get');
        //запрос данных в API
        req(verb, path, params).then((data) => {
            console.log('DataClient success');
            //данные ок - возвращаем
            resolve(data);
        }).catch((err) => {
            //ошибка 401 - не авторизован - то делаем авторизацию, затем снова запрашиваем данные
            if (err.status === 401) {
                console.log('DataClient 401 - not auth');
                //запрос авторизации
                api.auth(apiUrls.Auth, config.auth.params).then(() => {
                    console.log('DataClient auth success');
                    //авторизовались успешно - снова запрос данных
                    req(verb, path, params).then((data) => {
                        console.log('DataClient success');
                        //данные ок - возвращаем данные
                        resolve(data);
                    }).catch((err) => {
                        console.log('DataClient data err');
                        //ошибка запроса данных - возвращаем ошибку
                        reject(err);
                    });
                }).catch((err) => {
                    console.log('DataClient auth err');
                    //ошибка авторизации - возвращаем ошибку
                    reject(err);
                })
            }
            else {
                console.log('DataClient data err');
                //ошибка запроса данных - возвращаем ошибку
                reject(err);
            }
        })
    })
}

export default DataClient;