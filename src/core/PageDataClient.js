import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';
import api from './ApiClient';
import dataClient from './DataClient';

var PageDataClient = (function () {

    function getPageData(context, url) {
        return new Promise((resolve, reject)=> {
            if (canUseDOM && window.__INITIAL_STATE__) {
                console.log('getPageData from initial state');
                //если на клиенте, и есть данные для страницы - сразу возвращаем
                var data = null;
                try {
                    var state = window.__INITIAL_STATE__;
                    state = state.replace(/\\\'/gm, '\''); //преобразуем обратно \' в '
                    state = decodeURIComponent(state);
                    var stateData = JSON.parse(state);

                    if (url == stateData.url) {
                        data = stateData.data;
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