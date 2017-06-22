/**
* @file 画商圈组件
*       modified by wangjuan01 <wangjuan01@iwaimai.baidu.com>
*
* @author lishaoyi<lishaoyi@iwaimai.baidu.com>
* @version 0.0.1
*
*/
import React, { Component, PropTypes } from 'react';
import { Button, Dropdown, Menu, Icon } from 'antd';
import { MapCircle, getMercator } from './mapcircle';
import './styles.less';

/**
 * 组件属性申明
 *
 * @property {string} className               组件样式类名                        defaultValue:''
 * @property {string} className               组件地图容器的id                    defaultValue:'aoimap-id'
 * @property {object} mapStyle                地图样式                            defaultValue:{ height: '450px',  width: '100%' }
 * @property {object} center                  地图定位中心                        defaultValue:'北京市'
 * @property {array}  points                  多地点数组                          defaultValue:[]
 * @property {array}  regions                 多区域数组                          defaultValue:[]
 * @property {array}  backRegions             背景多区域数组                      defaultValue:[]
 * @property {array}  regionTools             区域工具按钮组                      defaultValue:['add', 'clear', 'reset', 'delete']
 * @property {array}  pointTools              地点工具按钮组                      defaultValue:['add', 'clear', 'reset', 'delete']
 * @property {array}  commonTools             通用工具按钮组                      defaultValue:['save', 'viewAll']
 * @property {bool}   enableEditRegions       能否编辑区域                        defaultValue:true
 * @property {bool}   enableEditPoints        能否编辑点                          defaultValue:true
 * @property {number|string}   maxPointsLen   标记点的最大长度                    defaultValue:Infinity
 * @property {number|string}   maxRegionsLen  区域的最大长度                      defaultValue:Infinity
 * @property {func}   onSave                  点击保存按钮之后的回调
 * @property {func}   onDeleteRegions         点击删除按钮的区域之后的回调
 * @property {func}   onDeletePoints          点击删除按钮的标记点之后的回调
 * @property {func}   onDeleteAll             点击删除按钮的全部之后的回调
 * @property {func}   onChange                组件值更改之后的回调
 */
const propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  mapStyle: PropTypes.object,
  center: PropTypes.string,
  points: PropTypes.array,
  regions: PropTypes.array,
  backRegions: PropTypes.array,
  regionTools: PropTypes.array,
  pointTools: PropTypes.array,
  commonTools: PropTypes.array,
  enableEditPoints: PropTypes.bool,
  enableEditRegions: PropTypes.bool,
  maxPointsLen: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf(['Infinity']),
  ]),
  maxRegionsLen: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf(['Infinity']),
  ]),
  onSave: React.PropTypes.func,
  onDeleteRegions: React.PropTypes.func,
  onDeletePoints: React.PropTypes.func,
  onDeleteAll: React.PropTypes.func,
  onChange: React.PropTypes.func,
};

/**
 * 主组件
 *
 * @export
 * @class AoiMap
 * @extends {React.Component}
 */
export default class AoiMap extends Component {
  static propTypes = propTypes;

  static defaultProps = {
    className: '',
    id: 'aoimap-con',
    mapStyle: {
      height: '450px',
      width: '100%',
    },
    center: '北京市',
    points: [],
    regions: [],
    backRegions: [],
    pointTools: ['add', 'clear', 'reset', 'delete'],
    regionTools: ['add', 'clear', 'reset', 'delete'],
    commonTools: ['save', 'viewAll'],
    enableEditPoints: true,
    enableEditRegions: true,
    maxPointsLen: 'Infinity',
    maxRegionsLen: 'Infinity',
  };

  /**
   * 计算区块坐标值, pure
   *
   * @param {array} polygons 多边形对象数组
   *
   * @return {array} 多区块坐标数组
   *
   * @memberOf AoiMap
   */
  static getRegions = (polygons, revertFunc) => {
    const regions = [];

    for (let i = 0; i < polygons.length; i++) {
      const polygon = polygons[i];
      const path = polygon.getPath();
      const points = [];
      for (let j = 0; j < path.length; j++) {
        const mercatorObj = revertFunc(path[j]);
        const point = {
          lng: path[j].lng,
          lat: path[j].lat,
          longitude: path[j].lng,
          latitude: path[j].lat,
          x: mercatorObj.x,
          y: mercatorObj.y,
        };

        points.push(point);
      }
      regions.push(points);
    }

    return regions;
  }

  /**
   * 计算地点坐标值, pure
   *
   * @param {array} markers 标记点对象数组
   *
   * @return {array} 地点坐标数组
   *
   * @memberOf AoiMap
   */
  static getPoints = (markers, revertFunc) => {
    const points = [];

    for (let i = 0; i < markers.length; i++) {
      const point = markers[i].getPosition();
      const mercatorObj = revertFunc(point);

      points.push({
        lng: point.lng,
        lat: point.lat,
        longitude: point.lng,
        latitude: point.lat,
        x: mercatorObj.x,
        y: mercatorObj.y,
      });
    }

    return points;
  }

  constructor(props) {
    super(props);

    this.state = {
      isPointAdding: false,
      isRegionAdding: false,
      disableAddPoints: props.maxPointsLen !== 'Infinity' && props.points.length === props.maxPointsLen,
      disableAddRegions: props.maxRegionsLen !== 'Infinity' && props.regions.length === props.maxRegionsLen,
    };

    this.handleAddRegion = () => {
      const isRegionAdding = !this.state.isRegionAdding;

      if (isRegionAdding) {
        this.aoimap.openDrawingPolygon();
      } else {
        this.aoimap.closeDrawingPolygon();
      }
      this.setState({ isPointAdding: false, isRegionAdding });
    };

    this.handleAddPoint = () => {
      const isPointAdding = !this.state.isPointAdding;

      if (isPointAdding) {
        this.aoimap.openDrawingMarker();
      } else {
        this.aoimap.closeDrawingMarker();
      }

      this.setState({ isRegionAdding: false, isPointAdding });
    };

    this.handleClear = (e) => {
      const { maxRegionsLen, maxPointsLen, onChange } = this.props;

      switch (e.key) {
        case 'all':
          this.aoimap.clearAll();
          break;
        case 'points':
          this.aoimap.clearMarkers();
          break;
        default:
          this.aoimap.clearPolygons();
          break;
      }

      onChange && onChange(this.recountValue());
      this.setState({
        disableAddRegions: maxRegionsLen !== 'Infinity' && this.aoimap.getPolygons().length === maxRegionsLen,
        disableAddPoints: maxPointsLen !== 'Infinity' && this.aoimap.getMarkers().length === maxPointsLen,
      });
    };

    this.handleReset = (e) => {
      const { regions, enableEditRegions, maxRegionsLen, points, enableEditPoints, maxPointsLen, onChange } = this.props;

      switch (e.key) {
        case 'all':
          this.aoimap.clearAll();
          this.aoimap.drawPolygons(regions, enableEditRegions);
          this.aoimap.drawMarkers(points, enableEditPoints);
          break;
        case 'points':
          this.aoimap.clearMarkers();
          this.aoimap.drawMarkers(points, enableEditPoints);
          break;
        default:
          this.aoimap.clearPolygons();
          this.aoimap.drawPolygons(regions, enableEditRegions);
          break;
      }

      onChange && onChange(this.recountValue());
      this.setState({
        disableAddRegions: maxRegionsLen !== 'Infinity' && this.aoimap.getPolygons().length === maxRegionsLen,
        disableAddPoints: maxPointsLen !== 'Infinity' && this.aoimap.getMarkers().length === maxPointsLen,
      });
    };

    this.handleDelete = (e) => {
      const { onDeleteRegions, onDeleteAll, onDeletePoints } = this.props;
      switch (e.key) {
        case 'all':
          onDeleteAll && onDeleteAll();
          break;
        case 'points':
          onDeletePoints && onDeletePoints();
          break;
        default:
          onDeleteRegions && onDeleteRegions();
          break;
      }
    };

    this.handleSave = () => {
      this.props.onSave && this.props.onSave(this.recountValue());
    };

    this.handleViewAll = () => {
      this.aoimap.resetViewport();
    };
  }

  componentDidMount() {
    const { points, regions, backRegions, enableEditRegions, enableEditPoints, maxRegionsLen, maxPointsLen, center, id, onChange } = this.props;


    this.aoimap = new MapCircle(id);
    this.aoimap.drawBackPolygons(backRegions);
    this.aoimap.drawPolygons(regions, enableEditRegions);
    this.aoimap.drawMarkers(points, enableEditPoints);
    (!regions || regions.length === 0) && (!points || points.length === 0) && this.aoimap.setCenter(center);

    const me = this;

    this.aoimap.map.addEventListener('polygonsUpdate', () => {
      onChange && onChange(me.recountValue.apply(me));
    });
    this.aoimap.map.addEventListener('polygonsAdded', () => {
      me.setState({
        isRegionAdding: false,
        disableAddRegions: maxRegionsLen !== 'Infinity' && me.aoimap.getPolygons().length === maxRegionsLen,
      });
    });
    this.aoimap.map.addEventListener('markersUpdate', () => {
      onChange && onChange(me.recountValue.apply(me));
    });
    this.aoimap.map.addEventListener('markersAdded', () => {
      me.setState({
        isPointAdding: false,
        disableAddPoints: maxPointsLen !== 'Infinity' && me.aoimap.getMarkers().length === maxPointsLen,
      });
    });
  }

  /**
   * 重新计算组件值
   *
   * @return {object} 组件值
   *
   * @memberOf AoiMap
   */
  recountValue() {
    return {
      regions: AoiMap.getRegions(this.aoimap.getPolygons(), getMercator),
      points: AoiMap.getPoints(this.aoimap.getMarkers(), getMercator),
    };
  }

  render() {
    const { mapStyle, className, regionTools, pointTools, commonTools, id } = this.props;
    const { isRegionAdding, isPointAdding, disableAddRegions, disableAddPoints } = this.state;
    const clearMenu = (
      <Menu onClick={this.handleClear}>
        <Menu.Item key="all">全部</Menu.Item>
        <Menu.Item key="regions" disabled={regionTools.indexOf('clear') === -1}><Icon type="appstore" /> 区域</Menu.Item>
        <Menu.Item key="points" disabled={pointTools.indexOf('clear') === -1}><Icon type="environment" /> 地点</Menu.Item>
      </Menu>
    );

    const resetMenu = (
      <Menu onClick={this.handleReset}>
        <Menu.Item key="all">全部</Menu.Item>
        <Menu.Item key="regions" disabled={regionTools.indexOf('reset') === -1}><Icon type="appstore" /> 区域</Menu.Item>
        <Menu.Item key="points" disabled={pointTools.indexOf('reset') === -1}><Icon type="environment" /> 地点</Menu.Item>
      </Menu>
    );

    const deleteMenu = (
      <Menu onClick={this.handleDelete}>
        <Menu.Item key="all">全部</Menu.Item>
        <Menu.Item key="region" disabled={regionTools.indexOf('delete') === -1}><Icon type="appstore" /> 区域</Menu.Item>
        <Menu.Item key="point" disabled={pointTools.indexOf('delete') === -1}><Icon type="environment" /> 地点</Menu.Item>
      </Menu>
    );

    return (<div className={'wl-aoimap-con ' + className}>
      <div className="wl-aoimap-toolbar">
        {regionTools.indexOf('add') !== -1 && <Button
          icon="plus"
          type={isRegionAdding ? 'primary' : 'ghost'}
          disabled={disableAddRegions}
          onClick={this.handleAddRegion}
        >添加区域</Button>
        }
        {pointTools.indexOf('add') !== -1 &&
          <Button
            icon="plus"
            type={isPointAdding ? 'primary' : 'ghost'}
            disabled={disableAddPoints}
            onClick={this.handleAddPoint}
          >添加地点</Button>
        }
        {regionTools.indexOf('clear') !== -1 || pointTools.indexOf('clear') !== -1 ?
          <Dropdown overlay={clearMenu}>
            <Button icon="delete" type="ghost">
              清空 ...
            </Button>
          </Dropdown> : ''
        }
        {regionTools.indexOf('reset') !== -1 || pointTools.indexOf('reset') !== -1 ?
          <Dropdown overlay={resetMenu}>
            <Button icon="rollback" type="ghost">
              重置 ...
            </Button>
          </Dropdown> : ''
        }
        {regionTools.indexOf('delete') !== -1 || pointTools.indexOf('delete') !== -1 ?
          <Dropdown overlay={deleteMenu}>
            <Button icon="close" type="ghost">
              删除 ...
            </Button>
          </Dropdown> : ''
        }
        {commonTools.indexOf('save') !== -1 &&
          <Button
            type="ghost"
            icon="check"
            onClick={this.handleSave}
          >保存</Button>
        }
        {commonTools.indexOf('viewAll') !== -1 &&
          <Button
            type="ghost"
            icon="scan"
            onClick={this.handleViewAll}
          >视野</Button>
        }
      </div>
      <div id={id} style={mapStyle}>{''}</div>
    </div>);
  }
}