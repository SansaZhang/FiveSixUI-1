/**
 * @file 面包屑组件, 对antd的面包屑组件进行了简单的封装
 *       modified by zhangcongfeng<zhangcongfeng@iwaimai.baidu.com>
 *
 * @author lichun <lichun@iwaimai.baidu.com>
 * @version 0.1.0
 *
 */
import React, { PropTypes } from 'react';
import { Breadcrumb } from 'antd';
import CSSModules from 'react-css-modules'; 
import styles from './styles.less';
/**
 * 组件属性说明
 * @property {array} data 面包屑数组(必填) defaultValue: [{title: '骑士管理', link: ''},{title: '装备管理'}]
 */
const propTypes = {
  data: PropTypes.array.isRequired,
};

/**
 * 主组件
 *
 * @export
 * @class Crumb
 * @extends {React.Component}
 */
class Crumb extends React.Component {
    /**
     * 获取Breadcrumb.Item数组
     * @param {config} 面包屑数组
     * @memberOf Crumb
     */
  getItems(config) {
    return config.map((item, index) =>
      <Breadcrumb.Item key={index} >
        { item.link ? <a href={item.link}>{ item.title }</a> : item.title }
      </Breadcrumb.Item>,
    );
  }
  render() {
    return (
      <div className="wl-crumb">
        <span>当前位置：</span>
        <Breadcrumb>
          { this.getItems(this.props.data) }
        </Breadcrumb>
      </div>
    );
  }
}
Crumb.propTypes = propTypes;

export default CSSModules(Crumb, styles);
