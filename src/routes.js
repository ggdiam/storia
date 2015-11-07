/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React from 'react';
import Router from 'react-routing/src/Router';
import http from './core/HttpClient';
import App from './components/App';
import ContentPage from './components/ContentPage';
import ContactPage from './components/ContactPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import NotFoundPage from './components/NotFoundPage';
import ErrorPage from './components/ErrorPage';

import MainPage from './components/MainPage';
import MomentPage from './components/MomentPage';

const router = new Router(on => {
    on('*', async (state, next) => {
        const component = await next();
        return component && <App context={state.context}>{component}</App>;
    });

    //главная страница
    on('/', async (state) => {
        //let data = await Storage.getPageData(state.context, [`${apiUrls.SectionGet}${sectionId}`]);
        var data = null;
        return <MainPage data={data}/>
    });

    //story/081e2b2aff070000/moment/092c2fb8d0070000
    on('/story/:storyId/moment/:momentId', async (state) => {
        //let data = await Storage.getPageData(state.context, [`${apiUrls.SectionGet}${sectionId}`]);
        var data = null;
        return <MomentPage routeParams={state.params} data={data}/>
    });

    on('/contact', async () => <ContactPage />);

    on('/login', async () => <LoginPage />);

    on('/register', async () => <RegisterPage />);

    on('*', async (state) => {
        const content = await http.get(`/api/content?path=${state.path}`);
        return content && <ContentPage {...content} />;
    });

    on('error', (state, error) => state.statusCode === 404 ?
        <App context={state.context} error={error}><NotFoundPage /></App> :
        <App context={state.context} error={error}><ErrorPage /></App>
    );
});

export default router;
