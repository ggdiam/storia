import request from 'superagent';
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';
import config from '../config';

import delayedLikeClient from './DelayedLikeClient';

//const pingUrl = canUseDOM ? `${location.protocol}//${location.host}${config.pingPath}` : 'https://storia.me';
const pingUrl = 'https://storia.me';

//сервис - проверяет доступность сети
//Логика работы:
//проверка вызывается после любого неудачного обращения к API
//каждые 3 сек делается запрос на ping url
//как только получили успешный ответ - прекращаем пинг
//запускаем проверку для отложенных лайков
var IsOnlineService = (function () {
    var inProgress = false;

    var isOnline = true;

    //запускает проверку
    function check() {
        setTimeout(runCheck, 3000);
    }

    //пинг
    function runCheck() {
        //пингуем
        ping().then((res) => {
            //если успешно - есть коннект - прекращаем пинговать
            isOnline = true;
            console.log('IsOnline true, stop check');

            //запускаем проверку отложенных лайков
            delayedLikeClient.checkDelayedAndSet();

            inProgress = false;
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

            console.log('IsOnline ping request', reqUrl);
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
        check: function () {
            if (!inProgress) {
                inProgress = true;
                check();
            }
        },
        isOnline: function () {
            return isOnline
        },
        ping: ping
    }
})();

export default IsOnlineService;