import React, { Component } from 'react';
import styles from './MomentPage.css';
import withStyles from '../../decorators/withStyles';
import Link from '../Link';

import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';

import dataClient from '../../core/DataClient';
import cachedDataClient from '../../core/CachedDataClient';
import apiUrls from '../../constants/ApiUrls';

import MomentItem from '../MomentItem';
import MomentViewType from '../../constants/MomentViewType';

@withStyles(styles)
class MomentPage extends Component {

    constructor(props) {
        super(props);

        var data = props && props.data ? props.data : null;

        if (canUseDOM) {
            console.log('MomentPage ctor', data);
        }

        //начальное состояние
        this.state = {
            data: data
        }
    }

    componentDidMount() {
        var data = this.state.data;

        if (!data) {
            //получаем данные
            this.getMomentContent();
        }
    }

    //получает данные момента
    getMomentContent() {
        //параметры из урла
        var routeParams = this.props ? this.props.routeParams : null;
        if (routeParams) {
            var storyId = routeParams.storyId;
            var momentId = routeParams.momentId;
            var url = apiUrls.MomentContent;
            url = url.replace('{storyId}', storyId);
            url = url.replace('{momentId}', momentId);

            //запрос в кэш или апи
            cachedDataClient.get(url).then((data) => {
                console.log(data);

                this.setState({
                    data: data
                })
            }).catch((err) => {
                console.error('getFeedContent err', err);
            })
        }
    }

    render() {
        var data = this.state && this.state.data ? this.state.data.moment : null;

        return (
            <div className="MomentPage">
                <div className="container">
                    <MomentItem viewType={MomentViewType.details} data={data} />
                </div>
            </div>
        );
    }

}

export default MomentPage;
