import React, { Component } from 'react';
import styles from './LikeCtrl.css';
import withStyles from '../../decorators/withStyles';
import Link from '../Link';
import Location from '../../core/Location';

import dataClient from '../../core/DataClient';
import apiUrls from '../../constants/ApiUrls';

@withStyles(styles)
class LikeCtrl extends Component {

    likeUnlikeMoment(e, item) {
        e.preventDefault();

        if (item && item.objectPreview) {
            var storyId = item.objectPreview.storyId;
            var momentId = item.objectPreview.id;

            var isLiked = this.isLiked(item);
            if (isLiked) {
                console.log('unlike');
                item.objectPreview.context.liked = false;
                item.objectPreview.stats.likes -= 1;
            }
            else {
                console.log('like');
                item.objectPreview.context.liked = true;
                item.objectPreview.stats.likes += 1;
            }

            //запрос в апи
            dataClient.like(storyId, momentId, !isLiked);

            //принудительно обновляем, т.к. меняли вне стейта
            this.forceUpdate();
        }
    }

    getLikesCount(item) {
        if (item.objectPreview && item.objectPreview.stats) {
            return item.objectPreview.stats.likes;
        }

        return 0;
    }

    isLiked(item) {
        if (item.objectPreview && item.objectPreview.context) {
            return item.objectPreview.context.liked;
        }

        return false;
    }

    render() {
        var item = this.props.data;

        if (item) {
            var isLiked = this.isLiked(item);

            return (
                <a href="#" onClick={(e)=>this.likeUnlikeMoment(e,item)}
                   className={`MomentItem-likes ${isLiked ? 'liked' : ''}`}>
                    <span className="glyphicon glyphicon-heart"></span>
                    <span className="MomentItem-likes-count">{this.getLikesCount(item)}</span>
                </a>
            )
        }

        return null;
    }
}

export default LikeCtrl;
