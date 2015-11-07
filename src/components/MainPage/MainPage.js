import React, { Component } from 'react';
import styles from './MainPage.css';
import withStyles from '../../decorators/withStyles';
import Link from '../Link';

import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';

import dataClient from '../../core/DataClient';
import cachedDataClient from '../../core/CachedDataClient';
import apiUrls from '../../constants/ApiUrls';
import localStorageHelper from '../../core/LocalStorageHelper';

import MomentsList from '../MomentsList';
import FilterType from '../../constants/FilterType';

@withStyles(styles)
class MainPage extends React.Component {

    constructor(props) {
        super(props);

        //начальное состояние
        this.state = {
            data: null,
            filteredData: null,
            filterType: this.loadFilterState()
        }
    }

    componentDidMount() {
        console.log('navigator.onLine', navigator.onLine);
        //получаем данные
        this.getFeedContent();
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

    filterData(data, filterType) {
        //deep copy
        var filteredData = JSON.parse(JSON.stringify(data));
        var items = filteredData.items;

        //console.log('filterData before count:', items.length);

        if (filterType == FilterType.WithPictures) {
            //фильтруем с каритнками
            filteredData.items = items.filter((item, ix)=>{
                return item.objectPreview.attachments.length > 0;
            });
        }
        else if (filterType == FilterType.WithOutPictures) {
            //фильтруем без каритнок
            filteredData.items = items.filter((item, ix)=>{
                return item.objectPreview.attachments.length == 0;
            });
        }
        //console.log('filterData after count:', filteredData.items.length);

        return filteredData;
    }

    getFeedContent() {
        //получаем ленту
        cachedDataClient.get(apiUrls.FeedContent).then((data) => {
            console.log(data);

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

        return (
            <div className="MainPage">
                <div className="container">
                    { this.renderFilter() }
                    <MomentsList data={data} />
                </div>
            </div>
        );
    }

}

export default MainPage;
