/**
* @file 是否展示组件
*       modified by wangjuan01 <wangjuan01@iwaimai.baidu.com>
*
* @author zhangyinhui <498821924@qq.com>
* @version 0.0.1
*
*/
import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules'; 
import styles from './styles.less';

/**
 * 组件属性申明
 *
 * @property {bool}    isShow   是否显示           defaultValue:true
 * @property {bool}    isDelDom 是否消除dom子节点  defaultValue:false
 * @property {bool}    isInline 是否是行内元素     defaultValue:false
 * @property {element} children 子节点（必填）
 */
const propTypes = {
  isShow: PropTypes.bool,
  isDelDom: PropTypes.bool,
  isInline: PropTypes.bool,
  children: PropTypes.element.isRequired,
};

/**
 * 主组件
 *
 * @export
 * @class Show
 * @extends {React.Component}
 */
class Show extends React.Component {
  static defaultProps = {
    isShow: true,
    isDelDom: false,
    isInline: false,
  };

  static propTypes = propTypes;

  /**
   * 获取元素display值, pure
   * @param {bool}    isShow   是否显示
   * @param {bool}    isInline 是否是行内元素
   *
   * @return {string} display值
   *
   * @memberOf Show
   */
  static getDisplay(isShow, isInline) {
    if (isShow) {
      if (isInline) {
        return 'inline-block';
      }
      return 'block';
    }
    return 'none';
  }

  render() {
    const { isShow, isDelDom, isInline } = this.props;

    /**
     * isDelDom逻辑判断说明
     *
     * isDelDom为true时，isShow为true返回该组件，false时返回null，即消除该dom
     * isDelDom为false时，isShow为true返回该组件，false时更改display为none
     */
    return (<div
      style={{ display: Show.getDisplay(isShow, isInline) }}
      styleName="wl-show-animated wl-show-slideInUp"
    >
      { (isDelDom && isShow === false) ? '' : this.props.children }
    </div>);
  }
}
export default CSSModules(Show, styles,{allowMultiple: true});