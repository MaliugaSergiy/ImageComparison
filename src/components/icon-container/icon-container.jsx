import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import './icon-container.css';
import classNames from 'classnames';

class IconContainer extends Component {
  static propTypes = {
    size: PropTypes.oneOf([
      'tiny',
      'xsmall',
      'small',
      'medium',
      'mediumPlus',
      'large',
      'xlarge',
      'huge'
    ]),
    inline: PropTypes.bool
  };

  static defaultProps = {
    size: 'small',
    inline: false
  };

  render() {
    const { size, inline, children } = this.props;
    const childrenAmount = Children.count(children);

    return (
      <span
        className={classNames('IconContainer', `IconContainer--size-${size}`, {
          'IconContainer--inline': inline
        })}
      >
        {childrenAmount === 1
          ? React.cloneElement(children, { size, inline })
          : children}
      </span>
    );
  }
}

export default IconContainer;
