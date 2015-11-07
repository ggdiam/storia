import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';

var LocalStorageHelper = (function () {
    function setItem(key, value) {
        try {
            localStorage.setItem(key, value);
        }
        catch(e) {
            //QuotaExceededError - очищаем
            clearAll();

            //пробуем записать еще раз
            try {
                localStorage.setItem(key, value);
            }
            catch(e) {

            }
        }
    }

    function getItem(key) {
        return localStorage.getItem(key);
    }

    function clearAll() {
        console.log('localStorage clearAll');
        var i = localStorage.length;
        while(i--) {
            var key = localStorage.key(i);
            localStorage.removeItem(key);
        }
    }

    return {
        setItem: setItem,
        getItem: getItem
    }
})();

export default LocalStorageHelper;