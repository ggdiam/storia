import React, { Component } from 'react';
import styles from './LikeCtrl.css';
import withStyles from '../../decorators/withStyles';
import Link from '../Link';
import Location from '../../core/Location';

import dataClient from '../../core/DataClient';
import apiUrls from '../../constants/ApiUrls';

@withStyles(styles)
class LikeCtrl extends Component {

    //проставляет / убирает лайк
    likeUnlikeMoment(e, item) {
        e.preventDefault();

        if (item && item) {
            var storyId = item.storyId;
            var momentId = item.id;

            var isLiked = this.isLiked(item);
            if (isLiked) {
                //console.log('unlike');
                item.context.liked = false;
                item.stats.likes -= 1;
            }
            else {
                //console.log('like');
                item.context.liked = true;
                item.stats.likes += 1;
            }

            //запрос в апи
            dataClient.like(storyId, momentId, !isLiked).then((data)=>{
                if (isLiked) {
                    console.log('set unlike success');
                }
                else {
                    console.log('set like success');
                }
            }).catch((err) => {
                if (isLiked) {
                    console.log('set unlike fails');
                }
                else {
                    console.log('set like fails');
                }
            });

            //принудительно обновляем, т.к. меняли вне стейта
            this.forceUpdate();
        }
    }

    getLikesCount(item) {
        if (item && item.stats) {
            return item.stats.likes;
        }

        return 0;
    }

    isLiked(item) {
        if (item && item.context) {
            return item.context.liked;
        }

        return false;
    }

    render() {
        var item = this.props.data;

        if (item) {
            var isLiked = this.isLiked(item);

            return (
                <a href="#" onClick={(e)=>this.likeUnlikeMoment(e,item)}
                   className={`LikeCtrl-likes ${isLiked ? 'liked' : ''}`}>
                    <span className="glyphicon glyphicon-heart"></span>
                    <span className="LikeCtrl-likes-count">{this.getLikesCount(item)}</span>
                </a>
            )
        }

        return null;
    }
}

export default LikeCtrl;
