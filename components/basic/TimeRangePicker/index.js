/**
 * @file 复合组件，时间段选择器组件
 *       modified by lihuan<lihuan@iwaimai.baidu.com>
 *
 * @author lishaoyi <lishaoyi@iwaimai.baidu.com>
 * @version 0.0.1
 *
 */
import CSSModules from 'react-css-modules';
import React, { PropTypes } from 'react';
import { TimePicker } from 'antd';
import moment from 'moment';
import styles from './styles.less';


/**
 * 组件属性申明
 *
 * @property {array} value 起止时间{strat:Moment, end:Moment}
 * @property {string} separator 起止时间间隔号 defaultValue: '至'
 * @property {function} onChange 时间change事件
 * @property {bool} ordered 是否是按序的 defaultValue: true
 * @property {object} startConfig TimePicker组件的扩展属性支持
 * @property {object} endConfig TimePicker组件的扩展属性支持
 */
const propTypes = {
  value: PropTypes.object,
  separator: PropTypes.string,
  onChange: PropTypes.func,
  ordered: PropTypes.bool,
  startConfig: PropTypes.object,
  endConfig: PropTypes.object,
};

/**
 * 主组件
 *
 * @export
 * @class TimeRangePicker
 * @extends {React.Component}
 */

class TimeRangePicker extends React.Component {
  handleChange(type, value) {
    const { onChange } = this.props;
    onChange && onChange({
      start: this.start,
      end: this.end,
      [type]: value,
    });
  }

  disabledHours(min, max) {
    const hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
    let result = [];
    if (min) {
      const minHour = min.hour();
      result = hours.splice(0, minHour);
    }
    if (max) {
      const maxHour = max.hour();
      result = hours.splice(maxHour + 1);
    }
    return result;
  }

  disabledMinutes(hour, min, max) {
    const minutes = Array.from({ length: 60 }, (v, k) => k);
    let result = [];
    if (min) {
      const minHour = min.hour();
      const minMinute = min.minute();
      result = minHour === hour ? minutes.splice(0, minMinute) : [];
    }
    if (max) {
      const maxHour = max.hour();
      const maxMinute = max.minute();
      result = maxHour === hour ? minutes.splice(maxMinute + 1) : [];
    }
    return result;
  }

  disabledSeconds(hour, minute, min, max) {
    const second = Array.from({ length: 60 }, (v, k) => k);
    let result = [];
    if (min) {
      const minHour = min.hour();
      const minMinute = min.minute();
      const minSecond = min.second();
      result = (minHour === hour && minMinute === minute) ? second.splice(0, minSecond) : [];
    }
    if (max) {
      const maxHour = max.hour();
      const maxMinute = max.minute();
      const maxSecond = max.second();
      result = (maxHour === hour && maxMinute === minute) ? second.splice(maxSecond + 1) : [];
    }
    return result;
  }

  render() {
    const { value, separator, startConfig, endConfig, ordered } = this.props;
    this.start = value ? value.start : moment();
    this.end = value ? value.end : moment();

    return (
      <div className="wl-timerangepicker-wrapper">
        <TimePicker
          className="wl-timerangepicker-start-time"
          disabledHours={ordered ? () => this.disabledHours(null, this.end) : () => []}
          disabledMinutes={ordered ? hour => this.disabledMinutes(hour, null, this.end) : () => []}
          disabledSeconds={ordered ? (hour, minute) => this.disabledSeconds(hour, minute, null, this.end) : () => []}
          value={this.start}
          onChange={(start) => { this.handleChange('start', start); }}
          {...startConfig}
        />
        {separator || ' 至 '}
        <TimePicker
          className="wl-timerangepicker-end-time"
          value={this.end}
          disabledHours={ordered ? () => this.disabledHours(this.start) : () => []}
          disabledMinutes={ordered ? hour => this.disabledMinutes(hour, this.start) : () => []}
          disabledSeconds={ordered ? (hour, minute) => this.disabledSeconds(hour, minute, this.start) : () => []}
          onChange={(end) => { this.handleChange('end', end); }}
          {...endConfig}
        />
      </div>
    );
  }
}
TimeRangePicker.propTypes = propTypes;
export default CSSModules(TimeRangePicker, styles);
