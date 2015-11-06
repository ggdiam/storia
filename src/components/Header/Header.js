/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { Component } from 'react';
import styles from './Header.css';
import withStyles from '../../decorators/withStyles';
import Link from '../Link';
//import Navigation from '../Navigation';

//<Navigation className="Header-nav"/>

@withStyles(styles)
class Header extends Component {

    render() {
        return (
            <div className="Header">
                <div className="Header-container">
                    <a className="Header-brand" href="/" onClick={Link.handleClick}>
                    </a>
                    <div className="Header-banner">
                        <h1 className="Header-bannerTitle">Тестовое задание</h1>
                        <p className="Header-bannerDesc">Свешников Александр</p>
                    </div>
                </div>
            </div>
        );
    }

}

export default Header;
