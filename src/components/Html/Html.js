/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { Component, PropTypes } from 'react';

class Html extends Component {

    static propTypes = {
        title: PropTypes.string,
        description: PropTypes.string,
        css: PropTypes.string,
        body: PropTypes.string.isRequired,
        initialState: PropTypes.string.isRequired,
    };

    static defaultProps = {
        title: '',
        description: '',
        initialState: ''
    };

    render() {

        var state = this.props.initialState;
        state = encodeURIComponent(state);
        state = state.replace(/\'/g, '\\\''); //экранируем ' в строке
        var scriptInitState = `window.__INITIAL_STATE__ = '${state}';`;

        return (
            <html className="no-js" lang="">
            <head>
                <meta charSet="utf-8"/>
                <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
                <title>{this.props.title}</title>
                <meta name="description" content={this.props.description}/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="apple-touch-icon" href="apple-touch-icon.png"/>
                <link rel="stylesheet" href="/css/bootstrap.min.css" />
                <style id="css" dangerouslySetInnerHTML={{__html: this.props.css}}/>
            </head>
            <body>
            <script dangerouslySetInnerHTML={{__html: scriptInitState}} />
            <div id="app" dangerouslySetInnerHTML={{__html: this.props.body}}/>
            <script src="/app.js"></script>
            </body>
            </html>
        );
    }

}

export default Html;
