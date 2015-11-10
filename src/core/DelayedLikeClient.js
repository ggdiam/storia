
import SessionStorageHelper from './SessionStorageHelper.js';
import dataClient from './DataClient';

//сущность, в которой содержится логика простановки лайка после потери соединения
//и также обновляем данные после восстановления соединения
var DelayedLikeClient = (function () {

    var currentPageDataReloadCallback = null;

    //пытается проставить лайк / unlike, и если ошибка - то сохраняем признак в SessionStorage
    function like (storyId, momentId, setLike) {
        return new Promise((resolve, reject) => {
            dataClient.like(storyId, momentId, setLike)
                .then(resolve) //если запрос отработал успешно
                .catch((err) => {
                    var key = likeKey(storyId, momentId);
                    //сохраняем отложенный лайк
                    var obj = {
                        storyId: storyId,
                        momentId: momentId,
                        setLike: setLike
                    };

                    //сохраняем признак отложенного лайка
                    SessionStorageHelper.setItem(key, JSON.stringify(obj));

                    //отдаем ошибку
                    reject(err);
                })
        })
    }

    function checkDelayedAndSet () {
        new Promise((resolve, reject) => {
            var i = sessionStorage.length;

            while (i--) {
                var key = sessionStorage.key(i);
                console.log('DelayedLikeClient enum keys:', key);
            }

            //массив промисов для ожидания окончания всех запросов к api
            var waitList = [];

            i = sessionStorage.length;
            //пробегаемся по всем ключам отложенных лайков
            while (i--) {
                var key = sessionStorage.key(i);
                if (key.indexOf('DelayedLike_') > -1) {
                    try {
                        var obj = JSON.parse(sessionStorage[key]);
                        if (obj) {
                            var waitPromise = new Promise((resolve, reject) => {
                                //просто сохраняем ключ тут, он нам понадобится ниже
                                obj.key = key;

                                //пробуем проставить лайк / unlike
                                dataClient.like(obj.storyId, obj.momentId, obj.setLike)
                                    .then((data) => {
                                        console.log('DelayedLikeClient removing like key', obj.key);
                                        //лайк прошел успешно - то удаляем ключ
                                        sessionStorage.removeItem(obj.key);

                                        resolve();
                                    }).catch(reject)
                            });
                            //добавляем в список ожидания
                            waitList.push(waitPromise);
                        }
                    }
                    catch (e) {
                    }
                }
            }

            Promise.all(waitList).then(() => {
                console.log('DelayedLikeClient Promise.all complete');

                if (currentPageDataReloadCallback) {
                    //вызываем обновление данных на странице
                    currentPageDataReloadCallback();
                }

                resolve();
            }).catch((err) => {
                console.log('DelayedLikeClient Promise.all error', err);
                reject(err);
            });
        })
    }

    return {
        like: like,
        checkDelayedAndSet: checkDelayedAndSet,
        setReloadDataCallback: (cb) => {
            currentPageDataReloadCallback = cb;
        }
    }
})();

function likeKey(storyId, momentId) {
    return `DelayedLike_${storyId}_${momentId}}`;
}

export default DelayedLikeClient;