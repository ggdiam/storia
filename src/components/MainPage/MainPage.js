import React, { Component } from 'react';
import styles from './MainPage.css';
import withStyles from '../../decorators/withStyles';
import Link from '../Link';

import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';

import dataClient from '../../core/DataClient';
import cachedDataClient from '../../core/CachedDataClient';
import apiUrls from '../../constants/ApiUrls';
import localStorageHelper from '../../core/LocalStorageHelper';
import delayedLikeClient from '../../core/DelayedLikeClient';

import MomentsList from '../MomentsList';
import FilterType from '../../constants/FilterType';

@withStyles(styles) class MainPage extends Component {

    constructor(props) {
        super(props);

        this.loadMoreInProgress = false;
        this.loadedPages = 0;

        var filteredData = null;
        var data = props && props.data ? props.data : null;
        var filterType = this.loadFilterState();

        if (data) {
            this.loadedPages = 1;
            //фильтруем данные
            filteredData = this.filterData(data, filterType);
        }

        //if (canUseDOM) {
        //    console.log('MainPage ctor', data, filteredData, filterType);
        //}

        //начальное состояние
        this.state = {
            data: data,
            filteredData: filteredData,
            filterType: filterType
        };

        //колбек на перезагрузку данных
        //не очень красиво, пока не придумал куда перенести
        delayedLikeClient.setReloadDataCallback(this.reloadData.bind(this));
    }

    //нужно перезагрузить данные после лайка / unlike, чтобы синхронизировать состояние
    reloadData() {
        console.log('MainPage data reloading...');

        if (this.loadedPages <= 1) {
            this.getFeedContent();
        }
        else {
            var maxPages = this.loadedPages;
            var curPage = 0;

            function res(data) {
                curPage += 1;

                if (curPage < maxPages) {
                    console.log('loadNextPage data loaded, curPage', curPage, 'loading more...');
                    this.loadNextPage(data).then(res.bind(this));
                }
                else {
                    //фильтруем данные
                    var filteredData = this.filterData(data, this.state.filterType);
                    //записываем в стейт
                    this.setState({
                        data: data,
                        filteredData: filteredData
                    });

                    console.log('loadNextPage data loaded, curPage', curPage, 'reload finished');
                }
            }

            this.loadNextPage(null, null, true).then(res.bind(this))
        }
    }

    //загружает данные следующей страницы
    loadNextPage(currentData, minId, first) {
        return new Promise((resolve, reject) => {
            var url = '';
            if (first) {
                url = apiUrls.FeedContent;
            }
            else {
                var min = minId ? minId : currentData.minId;
                url = `${apiUrls.FeedContent}?limit=20&until=${currentData.minId}`;
            }

            //получаем ленту
            cachedDataClient.get(url).then((data) => {

                if (currentData) {
                    //мерджим данные item'ов с уже имеющимися
                    data.items = currentData.items.concat(data.items);
                }
                currentData = data;

                //обновляем кэш
                cachedDataClient.saveDataForRequest(apiUrls.FeedContent, null, currentData);

                resolve(currentData);
            }).catch((err) => {
                console.error('loadNextPage err', err);
                reject(err);
            })
        })
    }

    //загрузить следующие страницы
    loadMore() {
        console.log('loadMore click');

        if (this.state.data && !this.loadMoreInProgress) {
            this.loadMoreInProgress = true;

            this.loadNextPage(this.state.data).then((data) => {
                this.loadedPages += 1;
                console.log('loadMore, loadedPages', this.loadedPages);

                //фильтруем данные
                var filteredData = this.filterData(data, this.state.filterType);
                //записываем в стейт
                this.setState({
                    data: data,
                    filteredData: filteredData
                });

                this.loadMoreInProgress = false;
            }).catch((err) => {
                console.log('load more err', err);
            })
        }
    }

    componentDidMount() {
        var data = this.state.data;

        if (!data) {
            //получаем данные
            this.getFeedContent();
        }
    }

    loadFilterState() {
        if (canUseDOM) {
            //если в браузере - получаем фильтр
            var filter = localStorageHelper.getItem('filter');
            if (filter) {
                return filter;
            }
        }

        //по-умолчанию - выводим все
        return FilterType.All;
    }

    setFilter(filterType) {
        //сохраняем фильтр в localStorage
        localStorageHelper.setItem('filter', filterType);

        var data = this.state.data ? this.state.data : null;
        //фильтруем данные
        var filteredData = this.filterData(data, filterType);
        //записываем в стейт
        this.setState({
            filterType: filterType,
            filteredData: filteredData
        })
    }

    //Фильтрует список моментов согласно фильтру
    filterData(data, filterType) {
        //deep copy
        var filteredData = JSON.parse(JSON.stringify(data));
        var items = filteredData.items;

        //console.log('filterData before count:', items.length);

        if (filterType == FilterType.WithPictures) {
            //фильтруем с каритнками
            filteredData.items = items.filter((item, ix)=> {
                return item.objectPreview.attachments.length > 0;
            });
        }
        else if (filterType == FilterType.WithOutPictures) {
            //фильтруем без каритнок
            filteredData.items = items.filter((item, ix)=> {
                return item.objectPreview.attachments.length == 0;
            });
        }
        //console.log('filterData after count:', filteredData.items.length);

        return filteredData;
    }

    //Получает данные
    getFeedContent() {
        //получаем ленту
        cachedDataClient.get(apiUrls.FeedContent).then((data) => {
            //console.log(data);

            //ToDo: debug
            //data.items[1].objectPreview.attachments = [
            //    {file: {title: 'my_fav_img.png'}},
            //    {file: {title: 'my_fav_img_two.png'}},
            //    {file: {title: 'my_fav_img_3.png'}}
            //];

            //фильтруем данные
            var filteredData = this.filterData(data, this.state.filterType);
            //записываем в стейт
            this.setState({
                data: data,
                filteredData: filteredData
            })
        }).catch((err) => {
            console.error('getFeedContent err', err);
        })
    }

    renderFilter() {
        var data = this.state ? this.state.data : null;

        var filterType = this.state.filterType;
        var defaultClassName = "btn btn-default";
        var activeClassName = "btn btn-default active";

        if (data) {
            return (
                <div className="MainPage-toolbar btn-toolbar" role="toolbar">
                    <div className="btn-group">
                        <button title="Все моменты" type="button"
                                onClick={(e)=>this.setFilter(FilterType.All)}
                                className={filterType == FilterType.All ? activeClassName : defaultClassName}>
                            <span className="glyphicon glyphicon-asterisk"></span>
                        </button>
                        <button title="Моменты с картинками" type="button"
                                onClick={(e)=>this.setFilter(FilterType.WithPictures)}
                                className={filterType == FilterType.WithPictures ? activeClassName : defaultClassName}>
                            <span className="glyphicon glyphicon-picture"></span>
                        </button>
                        <button title="Моменты без картинок" type="button"
                                onClick={(e)=>this.setFilter(FilterType.WithOutPictures)}
                                className={filterType == FilterType.WithOutPictures ? activeClassName : defaultClassName}>
                            <span className="glyphicon glyphicon-th-list"></span>
                        </button>
                    </div>
                </div>
            )
        }

        return null;
    }

    render() {
        var data = this.state ? this.state.filteredData : null;

        if (data) {
            var filterType = this.state.filterType;
            console.log('render', filterType, 'data items length', data.items.length);
        }

        if (data) {
            //флаг загрузки еще
            var loadMoreAvailable = data.moreAvailable;

            return (
                <div className="MainPage">
                    <div className="container">
                        { this.renderFilter() }
                        <MomentsList data={data} reloadData={this.reloadData.bind(this)}/>

                        {
                            loadMoreAvailable ?
                                <button onClick={this.loadMore.bind(this)} className="btn btn-default">Load More</button>
                            : null
                        }

                        <button onClick={this.reloadData.bind(this)} className="btn btn-default">Reload data</button>

                    </div>
                </div>
            );
        }
        else {
            return (
                <div className="MainPage">
                    <div className="container">
                        <br />
                        <br />
                        Loading...
                        <br />
                        <br />
                    </div>
                </div>
            )
        }
    }

}

export default MainPage;
