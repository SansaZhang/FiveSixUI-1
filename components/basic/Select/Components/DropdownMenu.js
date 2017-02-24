/**
* @file 下拉菜单组件 for Select
* @author 谢天
* @version 0.0.1
*/
/* eslint import/no-unresolved: 0*/
import React, { Component, PropTypes } from 'react';
import Option from './Option';
/**
 * 组件属性申明
 *
 * @property {array} children
 * @property {bool} open
 * @property {(string|number)} width
 * @property {(string|number)} maxHeight
 * @property {bool} showAll
 * @property {bool} showSearch
 */
const propTypes = {
  children: PropTypes.arrayOf(PropTypes.element),
  open: PropTypes.bool.isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  maxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  showAll: PropTypes.bool,
  showSearch: PropTypes.bool,
};
/**
 * 容器组件
 * @export
 * @class DropdownMenu
 * @extends {React.Component}
 */
class DropdownMenu extends Component {
  constructor(props) {
    super(props);
        /**
         * 如果包含全选或筛选，给出它们所在index pure
         *
         * @param {object} props
         * @return {number} index
         *
         * @memberOf DropdownMenu
         */
    this.getChildren = (p) => {
      let flag = 0;
      if (p.showSearch) {
        flag++;
      }
      if (p.showAll) {
        flag++;
      }
      return flag;
    };
    this.initClassName = ' wl-select-dropdown-hidden';
  }
  componentWillReceiveProps(nextProps) {
    if (this.initClassName && nextProps.open !== this.props.open) {
      this.initClassName = false;
    }
  }
  componentDidUpdate() {
    this.initClassName = ' wl-select-dropdown-hidden';
  }
  render() {
    return (
      <div
        styleName={`wl-select-dropdown${this.props.open ? ' wl-fadeInDown' : this.initClassName || ' wl-fadeOutUp'}`}
        style={{ left: 0, top: 34, width: this.props.width }}
      >
          {React.Children.toArray(this.props.children).slice(0, this.getChildren(this.props))}
        <div style={{ overflowY: 'auto', overflowX: 'hidden' }}>
          <ul styleName="wl-select-dropdown-menu" style={{ maxHeight: this.props.maxHeight }}>
                {this.props.children ? React.Children.toArray(this.props.children).slice(this.getChildren(this.props))
                  : <Option disabled label="No Data" />
            }
          </ul>
        </div>
      </div>
    );
  }
}

DropdownMenu.propTypes = propTypes;
DropdownMenu.defaultProps = {
  maxHeight: '250px',
};

export default DropdownMenu;
