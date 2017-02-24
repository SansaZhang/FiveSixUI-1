/**
* @file 提示组件
* @author 谢天
* @version 0.0.1
*/
/* eslint import/no-unresolved: 0*/
import React, { Component, PropTypes } from 'react';
/**
 * 组件属性申明
 *
 * @property {bool} show
 * @property {(string|object)} text
 * @property {object} style
 */
const propTypes = {
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  show: PropTypes.bool,
  style: PropTypes.object,
};
/**
 * 展示组件
 * @export
 * @class Tips
 * @extends {React.Component}
 */
class Tips extends Component {
  constructor(props) {
    super(props);
    this.initClassName = ' wl-tooltip-hidden';
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.show !== nextProps.show && this.initClassName) {
      this.initClassName = false;
    }
  }
  componentDidUpdate() {
    this.initClassName = ' wl-tooltip-hidden';
  }
  render() {
    return (
      <div styleName={`wl-tooltip wl-tooltip-placement-right${this.props.show ? ' wl-fadeInDown' : this.initClassName || ' wl-fadeOutUp'}`} style={this.props.style}>
        <div styleName="wl-tooltip-content">
          <div styleName="wl-tooltip-arrow" />
          <div styleName="wl-tooltip-inner">
                {this.props.text}
          </div>
        </div>
      </div>
    );
  }
}

Tips.propTypes = propTypes;

export default Tips;
