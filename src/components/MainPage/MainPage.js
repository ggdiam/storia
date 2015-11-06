import React, { Component } from 'react';
import styles from './MainPage.css';
import withStyles from '../../decorators/withStyles';
import Link from '../Link';

import dataClient from '../../core/DataClient';
import apiUrls from '../../constants/ApiUrls';

import MomentsList from '../MomentsList';

@withStyles(styles)
class MainPage extends Component {

    componentDidMount() {
        this.getFeedContent();
    }

    getFeedContent() {
        dataClient.get(apiUrls.FeedContent).then((data) => {
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

    render() {
        var data = this.state ? this.state.data : null;

        return (
            <div className="MainPage">
                <div className="container">
                    <MomentsList data={data} />
                </div>
            </div>
        );
    }

}

export default MainPage;
