
import SessionStorageHelper from './SessionStorageHelper.js';
import dataClient from './DataClient';

const DelayedLikeClient = {
    like: (storyId, momentId, setLike) => Promise((resolve, reject) => {
        dataClient.like(storyId, momentId, setLike)
            .then(resolve) //если запрос отработал успешно
            .catch((err) => {
                var key = getKey(storyId, momentId);
                //сохраняем отложенный лайк
                var obj = {
                    storyId: storyId,
                    momentId: momentId,
                    setLike: setLike
                };
                SessionStorageHelper.setItem(key, JSON.stringify(obj));

                //отдаем ошибку
                reject(err);
        })
    }),
    checkDelayedAndSet: () => Promise((resolve, reject) => {
        var i = sessionStorage.length;
        //пробегаемся по всем ключам отложенных лайков
        while(i--) {
            var key = sessionStorage.key(i);
            if (key.indexOf('DelayedLike_') > -1) {
                try {
                    var obj = JSON.parse(sessionStorage[key]);
                    if (obj) {
                        //пробуем проставить лайк
                        dataClient.like(obj.storyId, obj.momentId, obj.setLike)
                            .then((data) => {
                                //лайк прошел успешно - то удаляем ключ
                                sessionStorage.removeItem(key);
                            })
                    }
                }
                catch (e) {
                }
            }
        }

        resolve();
    })
};

function getKey(storyId, momentId) {
    return `DelayedLike_${storyId}_${momentId}}`;
}

export default DelayedLikeClient;