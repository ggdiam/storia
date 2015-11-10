/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React from 'react';
import Router from 'react-routing/src/Router';
import App from './components/App';
import NotFoundPage from './components/NotFoundPage';
import ErrorPage from './components/ErrorPage';

import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';

import apiUrls from './constants/ApiUrls';
import dataClient from './core/DataClient';
import pageDataClient from './core/PageDataClient';

import MainPage from './components/MainPage';
import MomentPage from './components/MomentPage';

//Клиентский и серверный роутинг приложения
const router = new Router(on => {
    on('*', async (state, next) => {
        const component = await next();
        return component && <App context={state.context}>{component}</App>;
    });

    //главная страница
    on('/', async (state) => {
        var data = null;

        //потаемся получить данные для страницы
        try {
            data = await pageDataClient.getPageData(state.context, apiUrls.FeedContent);
            if (canUseDOM) console.log('route /', data);
        }
        catch (err) {
            console.log('route / err', err);
        }

        //отдаем данные в главную страницу
        return <MainPage data={data}/>
    });

    //story/081e2b2aff070000/moment/092c2fb8d0070000
    on('/story/:storyId/moment/:momentId', async (state) => {
        var data = null;

        //формируем урл для API
        var storyId = state.params.storyId;
        var momentId = state.params.momentId;
        var url = apiUrls.MomentContent;
        url = url.replace('{storyId}', storyId);
        url = url.replace('{momentId}', momentId);

        //пытаемся получить данные для страницы момента
        try {
            data = await pageDataClient.getPageData(state.context, url);
            if (canUseDOM) console.log('route /story', data);
        }
        catch (err) {
            console.log('route /story err', err);
        }

        //отдаем данные
        return <MomentPage routeParams={state.params} data={data}/>
    });

    on('error', (state, error) => state.statusCode === 404 ?
        <App context={state.context} error={error}><NotFoundPage /></App> :
        <App context={state.context} error={error}><ErrorPage /></App>
    );
});

export default router;
