import React, { Component } from 'react';
import styles from './MomentsList.css';
import withStyles from '../../decorators/withStyles';
import Link from '../Link';

import dataClient from '../../core/DataClient';
import apiUrls from '../../constants/ApiUrls';

@withStyles(styles)
class MomentsList extends Component {

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

    getAuthor(item) {
        if (item.objectPreview && item.objectPreview.owner) {
            return item.objectPreview.owner.name;
        }
        else {
            return 'нет автора';
        }
    }

    getStoryTitle(item) {
        if (item.objectPreview) {
            return item.objectPreview.storyTitle;
        }
        else {
            return 'нет названия';
        }
    }

    getMomentTitle(item) {
        if (item.objectPreview && item.objectPreview.title && item.objectPreview.title.length > 0) {
            return item.objectPreview.title;
        }
        else {
            return 'нет названия';
        }
    }

    getImageSrc(item, ix) {
        function returnResult(img) {
            if (img.file.path) {
                return {
                    src: img.file.path,
                    title: img.file.title
                }
            }

            return null;
        }

        //console.log('item', ix, 'img count:', item.objectPreview.attachments.length);
        if (item.objectPreview && item.objectPreview.attachments && item.objectPreview.attachments.length > 0) {
            //console.log('item', ix,'images:');

            //наши картинки
            var images = item.objectPreview.attachments;

            //images.forEach((img)=>{
            //    console.log('img:', 'title:', img.file.title, 'path:', img.file.path);
            //});

            //Выборочная картинка из момента должна соответствовать следующему критерию:
            //это должна быть либо первая картинка с конца не имеющая цифр в поле file.title,
            //либо последняя картинка, если таких картинок нет.

            //идем с конца
            for(let i=images.length-1; i>=0; i--) {
                let img = images[i];
                //если file.title не содержит цифр
                if (img.file && img.file.title && !(/\d/.test(img.file.title))) {
                    //console.log('return img', i, img.file.title);
                    //возвращаем картинку
                    return returnResult(img);
                }
            }

            //возвращаем последнюю картинку
            let img = images[images.length - 1];
            if (img && img.file && img.file.path) {
                //console.log('return last', img.file.title);
                return returnResult(img);
            }
        }

        return null;
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

    getAvatar(item) {
        if (item.objectPreview && item.objectPreview.owner && item.objectPreview.owner.avatar) {
            return `${item.objectPreview.owner.avatar.path}/tn/50x50`;
        }

        return null;
    }

    renderItem(item, ix) {
        var img = this.getImageSrc(item, ix);
        var avatar = this.getAvatar(item);
        var isLiked = this.isLiked(item);

        return (
            <div key={item.id} className="MomentItem well well-lg">
                <div className="media">
                    <div className="media-left">
                        <span className="MomentItem-avatar">
                            <img className="media-object" src={avatar} alt="аватар" />
                        </span>
                    </div>
                    <div className="media-body media-middle">
                        <div className="media">
                            <div className="media-left">
                                <h4 className="media-heading">{this.getAuthor(item)}</h4>
                            </div>
                            <div className="media-body media-middle">
                                <div className="MomentItem-title media-heading">{this.getStoryTitle(item)}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <h3>{this.getMomentTitle(item)}</h3>

                {
                    img ? [<img key={ix} className="MomentItem-img img-responsive" alt={img.title} src={img.src} />] : null
                }

                <a href="#" onClick={(e)=>this.likeUnlikeMoment(e,item)} className={`MomentItem-likes ${isLiked ? 'liked' : ''}`}>
                    <span className="glyphicon glyphicon-heart"></span>
                    <span className="MomentItem-likes-count">{this.getLikesCount(item)}</span>
                </a>
            </div>
        )
    }

    render() {
        var data = this.props ? this.props.data : null;

        if (data) {
            return (
                <div className="MomentsList">
                    {data.items.map(this.renderItem, this)}
                </div>
            );
        }

        return null;
    }

}

export default MomentsList;
