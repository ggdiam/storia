import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';

//хелпер для работы с SessionStorage
var SessionStorageHelper = (function () {
    function setItem(key, value) {
        try {
            sessionStorage.setItem(key, value);
        }
        catch(e) {
            //QuotaExceededError - очищаем
            clearAll();

            //пробуем записать еще раз
            try {
                sessionStorage.setItem(key, value);
            }
            catch(e) {

            }
        }
    }

    function getItem(key) {
        return sessionStorage.getItem(key);
    }

    //удаляет все записи
    function clearAll() {
        console.log('sessionStorage clearAll');
        var i = sessionStorage.length;
        while(i--) {
            var key = sessionStorage.key(i);
            sessionStorage.removeItem(key);
        }
    }

    return {
        setItem: setItem,
        getItem: getItem
    }
})();

export default SessionStorageHelper;