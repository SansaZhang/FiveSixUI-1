/**
* @file 提示组件
* @author 谢天
* @version 0.0.1
*/
/* eslint import/no-unresolved: 0*/
import React, { Component, PropTypes } from 'react';
import LazyLoad from 'react-lazy-load';
import $ from 'jquery';

/**
 * 组件属性申明
 *
 * @property {bool} show
 * @property {(string|object)} text
 * @property {object} style
 */
const propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  value: PropTypes.string.isRequired,
  selected: PropTypes.bool,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  lazyload: PropTypes.bool,
};
/**
 * 展示组件
 * @export
 * @class Option
 * @extends {React.Component}
 */
class Option extends Component {
  constructor(props) {
    super(props);
        /**
         * 点击事件，返回对应value及text impure
         */
    this.handleClick = () => {
      this.props.onClick && this.props.onClick(
        {
          value: this.props.value,
          text: this.props.label,
        }
            );
    };
        /**
         * 鼠标移入事件，返回对应的位置信息及text impure
         */
    this.handleMouseEnter = (e) => {
      // $(e.target).position().top + 33,
      if (e.target.clientWidth < e.target.scrollWidth) {
        this.props.onMouseEnter && this.props.onMouseEnter({
          style: {
            top: e.target.offsetTop + 33,
            left: 150,
          },
          text: this.props.label,
        });
      }
    };
        /**
         * 鼠标移出事件，返回false
         */
    this.handleMouseLeave = (e) => {
      if (e.target.clientWidth < e.target.scrollWidth) {
        this.props.onMouseLeave && this.props.onMouseLeave(false);
      }
    };
  }
    /**
     * get方法
     * @return {element} <li>
     */
  get getLi() {
    return (<li
      onClick={this.props.disabled ? null : this.handleClick}
      onMouseEnter={this.handleMouseEnter}
      onMouseLeave={this.handleMouseLeave}
      styleName={`wl-select-dropdown-menu-item${this.props.disabled ? ' wl-select-dropdown-menu-item-disabled' : ''}${this.props.selected ? ' wl-select-dropdown-menu-item-selected' : ''}`}
      ref={
              c => {
                this.option = c;
              }
          }
    >
            {this.props.label}
    </li>);
  }
  render() {
    return this.props.lazyload ? <LazyLoad offsetVertical={32} throttle={0}>{this.getLi}</LazyLoad> : this.getLi;
  }
}

Option.propTypes = propTypes;
Option.defaultProps = {
  disabled: false,
  selected: false,
};

export default Option;
