import request from 'superagent';
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';
import config from '../config';

import delayedLikeClient from './DelayedLikeClient';

//const pingUrl = canUseDOM ? `${location.protocol}//${location.host}${config.pingPath}` : 'https://storia.me';
const pingUrl = 'https://storia.me';

//сервис - проверяет доступность сети
var IsOnlineService = (function () {
    var isOnline = true;

    //запускает проверку
    function check() {
        console.log('IsOnline check');
        setTimeout(checkResult, 3000);
    }

    //обработка результата пинга
    function checkResult() {
        //пингуем
        ping().then((res) => {
            //если успешно - есть коннект - прекращаем пинговать
            isOnline = true;
            console.log('IsOnline true, stop check');

            //запускаем проверку отложенных лайков
            delayedLikeClient.checkDelayedAndSet();
        }).catch((res) => {
            //если не достучались - то нет коннекта - пингуем снова через 3 сек
            isOnline = false;
            check();
        });
    }

    function setOfflineAndCheck() {
        isOnline = false;
    }

    //пингует заданный урл
    function ping() {
        return new Promise((resolve, reject) => {
            var random = Math.random();
            var ms = new Date().getTime();
            var reqUrl = pingUrl + `?rnd=${ms}_${random}`;

            request
                .get(reqUrl)
                .end((err, res) => {
                    if (err) {
                        console.log('IsOnline false');
                        reject(false);
                    } else {
                        console.log('IsOnline true');
                        resolve(true);
                    }
                });
        })
    }

    return {
        check: check,
        isOnline: function () {
            return isOnline
        },
        ping: ping
    }
})();

export default IsOnlineService;