import React, { Component } from 'react';
import styles from './MomentItem.css';
import withStyles from '../../decorators/withStyles';
import Link from '../Link';
import Location from '../../core/Location';

import dataClient from '../../core/DataClient';
import apiUrls from '../../constants/ApiUrls';

import LikeCtrl from '../LikeCtrl';

@withStyles(styles)
class MomentItem extends Component {

    gotoMoment(e, item) {
        e.preventDefault();

        var storyId = item.objectPreview.storyId;
        var momentId = item.objectPreview.id;
        Location.pushState(null, `/story/${storyId}/moment/${momentId}`);
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

    getAvatar(item) {
        if (item.objectPreview && item.objectPreview.owner && item.objectPreview.owner.avatar) {
            return `${item.objectPreview.owner.avatar.path}/tn/50x50`;
        }

        return null;
    }

    render() {
        var item = this.props.data;
        var ix = this.props.ix;

        if (item) {
            var img = this.getImageSrc(item, ix);
            var avatar = this.getAvatar(item);

            return (
                <div className="MomentItem well well-lg">
                    <div className="media">
                        <div className="media-left">
                        <span className="MomentItem-avatar">
                            <img className="media-object" src={avatar} alt="аватар"/>
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

                    <div className="MomentItem-link" onClick={(e)=>this.gotoMoment(e, item)}>
                        <h3>{this.getMomentTitle(item)}</h3>

                        {
                            img ? [<img key={ix} className="MomentItem-img img-responsive" alt={img.title}
                                        src={img.src}/>] : null
                        }
                    </div>

                    <LikeCtrl data={item} />
                </div>
            )
        }

        return null;
    }
}

export default MomentItem;
