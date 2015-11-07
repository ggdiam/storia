import React, { Component } from 'react';
import styles from './MomentsList.css';
import withStyles from '../../decorators/withStyles';
import Link from '../Link';
import Location from '../../core/Location';

import dataClient from '../../core/DataClient';
import apiUrls from '../../constants/ApiUrls';

import MomentItem from '../MomentItem';

@withStyles(styles)
class MomentsList extends Component {

    renderItem(item, ix) {
        return (
            <MomentItem key={ix} data={item} ix={ix} />
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
