/**
* @file 带搜索按钮的输入框组件
* @author 谢天
* @version 0.0.1
*/
/* eslint import/no-unresolved: 0*/
import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
/**
 * 组件属性申明
 *
 * @property {function} onChange
 * @property {string} value
 * @property {(string|number)} width
 */
const propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
/**
 * 展示组件
 * @export
 * @class SearchInput
 * @extends {React.Component}
 */
class SearchInput extends Component {
  constructor(props) {
    super(props);
        /**
         * @inner {bool} focus
         */
    this.state = {
      focus: false,
    };
        /**
         * 点击事件，动画效果 impure
         */
    this.handleClick = () => {
      findDOMNode(this.button).styleName = findDOMNode(this.button).styleName.replace(' wl-myBtn-clicked', '');
      this.clickedTimeout = setTimeout(() => { findDOMNode(this.button).styleName += ' wl-myBtn-clicked'; }, 10);
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        findDOMNode(this.button).styleName = findDOMNode(this.button).styleName.replace(' wl-myBtn-clicked', '');
      }, 500);
    };
        /**
         * 兼容chrome impure
         */
    this.handleMouseUp = () => {
      findDOMNode(this.button).blur();
    };
        /**
         * 取得焦点 impure
         */
    this.handleFocus = () => {
      this.setState(
        {
          focus: true,
        }
            );
    };
        /**
         * 失去焦点 impure
         */
    this.handleBlur = () => {
      this.setState(
        {
          focus: false,
        }
            );
    };
  }
  render() {
    return (
      <div styleName="wl-search-input-wrapper" style={{ marginTop: '1px', marginBottom: '2px', width: this.props.width }}>
        <span styleName="wl-input-group">
          <div styleName="wl-select">
            <div styleName={`wl-select-selection wl-select-selection--search${this.state.focus ? ' wl-select-selection-focus' : ''}`}>
              <div styleName="wl-select-selection__rendered--search">
                <div styleName="wl-select-selection__placeholder" style={{ display: this.state.focus || this.props.value ? 'none' : '' }}>
                    {'search..'}
                </div>
                <ul style={{ marginBottom: '0px' }}>
                  <li styleName="wl-select-search--inline">
                    <div styleName="wl-select-search__field__wrap">
                      <input styleName="wl-select-search__field" value={this.props.value} onChange={this.props.onChange} onFocus={this.handleFocus} onBlur={this.handleBlur} />
                      <span styleName="wl-select-search__field__mirror" />
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div styleName="wl-input-group-wrap">
            <button
              ref={(c) => {
                this.button = c;
              }} type="button" onClick={this.handleClick} onMouseUp={this.handleMouseUp} styleName="wl-myBtn wl-search-btn"
            >
              <i styleName="wl-icon wl-icon-search">
              </i>
            </button>
          </div>
        </span>
      </div>
    );
  }
}

SearchInput.propTypes = propTypes;
SearchInput.defaultProps = {
};

export default SearchInput;
