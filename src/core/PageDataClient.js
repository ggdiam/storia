import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';
import api from './ApiClient';
import dataClient from './DataClient';

//клиент для запроса данных страниц
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
                dataClient.get(url).then((data)=> {
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