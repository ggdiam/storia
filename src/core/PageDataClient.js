import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';
import api from './ApiClient';
import dataClient from './DataClient';
import cachedDataClient from './CachedDataClient';

//import delayedLikeClient from './DelayedLikeClient';

//клиент для запроса данных страниц
//Логика работы:
//если в окружении браузера - потаемся получить данные из __INITIAL_STATE__ (пришли с сервера при серверном рендеринге)
//если получили - сохраняем в кэш и отдаем
//если не получили - то пытаемся запросить из API
var PageDataClient = (function () {
    function getPageData(context, url) {
        return new Promise((resolve, reject)=> {

            //если на клиенте, и есть данные для страницы в __INITIAL_STATE__ - возвращаем
            if (canUseDOM && window.__INITIAL_STATE__) {
                console.log('getPageData from initial state');

                var data = null;
                try {
                    var state = window.__INITIAL_STATE__;
                    state = state.replace(/\\\'/gm, '\''); //преобразуем обратно \' в '
                    state = decodeURIComponent(state);
                    var stateData = JSON.parse(state);

                    //проверяем что наш урл
                    if (url == stateData.url) {
                        data = stateData.data;

                        //также сохраним данные в кэш
                        cachedDataClient.saveDataForRequest(url, null, data);

                        //обнуляем, чтобы дальнейшие запросы были в API
                        window.__INITIAL_STATE__ = null;
                    }
                    //console.log('getPageData data:', data);
                }
                catch (e) {
                    console.error('getPageData err:', e);
                }

                resolve(data);
            }
            else {
                //делаем запрос в api
                cachedDataClient.get(url).then((data)=> {
                    if (!canUseDOM && context && context.onSetInitialState) {
                        context.onSetInitialState(JSON.stringify({
                            url: url,
                            data: data
                        }));
                    }
                    //возвращаем
                    resolve(data);
                }).catch(reject);
            }
        });
    }

    return {
        getPageData: getPageData,
    }
})();

export default PageDataClient;