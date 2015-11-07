import React, { Component } from 'react';
import styles from './MomentPage.css';
import withStyles from '../../decorators/withStyles';
import Link from '../Link';

import dataClient from '../../core/DataClient';
import cachedDataClient from '../../core/CachedDataClient';
import apiUrls from '../../constants/ApiUrls';

import MomentItem from '../MomentItem';

@withStyles(styles)
class MomentPage extends Component {

    componentDidMount() {
        console.log('navigator.onLine', navigator.onLine);
        this.getFeedContent();
    }

    getFeedContent() {
        var routeParams = this.props ? this.props.routeParams : null;
        if (routeParams) {
            var storyId = routeParams.storyId;
            var momentId = routeParams.momentId;
            var url = apiUrls.MomentContent;
            url = url.replace('{storyId}', storyId);
            url = url.replace('{momentId}', momentId);
            cachedDataClient.get(url).then((data) => {
                console.log(data);

                //ToDo: debug
                //data.items[1].objectPreview.attachments = [
                //    {file: {title: 'my_fav_img.png'}},
                //    {file: {title: 'my_fav_img_two.png'}},
                //    {file: {title: 'my_fav_img_3.png'}}
                //];

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
                    <MomentItem data={data} ix={0} />
                </div>
            </div>
        );
    }

}

export default MomentPage;
