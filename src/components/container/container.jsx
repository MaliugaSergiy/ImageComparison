import React, { Component } from 'react';
import './container.css';
import classNames from 'classnames';

class Container extends Component {
  render() {
    const { min, noWidth, narrow, children } = this.props;
    return (
      <div
        className={classNames('Container', {
          'Container--min': min,
          'Container--noWidth': noWidth,
          'Container--narrow': narrow
        })}
      >
        {children}
      </div>
    );
  }
}

export default Container;
