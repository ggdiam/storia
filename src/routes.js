/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React from 'react';
import Router from 'react-routing/src/Router';
import http from './core/HttpClient';
import App from './components/App';
import NotFoundPage from './components/NotFoundPage';
import ErrorPage from './components/ErrorPage';

import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';

import apiUrls from './constants/ApiUrls';
import dataClient from './core/DataClient';
import pageDataClient from './core/PageDataClient';

import MainPage from './components/MainPage';
import MomentPage from './components/MomentPage';

const router = new Router(on => {
    on('*', async (state, next) => {
        const component = await next();
        return component && <App context={state.context}>{component}</App>;
    });

    //главная страница
    on('/', async (state) => {
        var data = await pageDataClient.getPageData(state.context, apiUrls.FeedContent);
        //var data = null;
        return <MainPage data={data}/>
    });

    //story/081e2b2aff070000/moment/092c2fb8d0070000
    on('/story/:storyId/moment/:momentId', async (state) => {
        var storyId = state.params.storyId;
        var momentId = state.params.momentId;
        var url = apiUrls.MomentContent;
        url = url.replace('{storyId}', storyId);
        url = url.replace('{momentId}', momentId);
        var data = await pageDataClient.getPageData(state.context, url);
        //var data = null;
        return <MomentPage routeParams={state.params} data={data}/>
    });

    on('error', (state, error) => state.statusCode === 404 ?
        <App context={state.context} error={error}><NotFoundPage /></App> :
        <App context={state.context} error={error}><ErrorPage /></App>
    );
});

export default router;
