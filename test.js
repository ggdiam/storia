import request from 'superagent';

function loadData(authData) {
    //console.log('authData', authData);
    //var cookie = `SSID=${authData.sessionId}; userId=${authData.userId}; accountId=${authData.accountId};`;
    var cookie = `SSID=${authData.sessionId}`;
    console.log('auth cookie', cookie);
    request
        .get('https://storia.me/api/feed/content')
        //.set('Cookie', cookie)
        //.withCredentials()
        .accept('application/json')
        .end((err, res) => {
            console.log('data', res.status);
            console.log('data', res.text);
        });

}

function auth() {
    request
        .post('https://storia.me/api/acl/auth/Selfish/test_task@example.com')
        .set('Access-Control-Allow-Credentials', true)
        .send({
            "password": "qwe123",
            "remember": false,
            "token": ""
        })
        .accept('application/json')
        //.withCredentials()
        .end((err, res) => {
            //console.log(err, res);
            console.log('auth', res.status);
            //console.log('auth', res.headers);

            var authData = JSON.parse(res.text);
            loadData(authData);
        });
}

auth();