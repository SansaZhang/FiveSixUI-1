/**
* @file 连续区间输入组件
*
* @author wangjuan01<wangjuan01@iwaimai.baidu.com>
* @version 0.0.1
*
*/
import React, { PropTypes } from 'react';
import { InputNumber, Input, Icon, Button } from 'antd';
import './styles.less';

/**
 * 组件属性申明
 *
 * @property {array}          defaultValue     默认值                  defaultValue:[]
 * @property {array}          value            当前值                  defaultValue:[]
 * @property {number|string}  min              最小值                  defaultValue:-Infinity
 * @property {number|string}  max              最大值                  defaultValue:Infinity
 * @property {number}         maxSerialLength  最大序列长度             defaultValue:Infinity
 * @property {number}         step             步数                    defaultValue:1
 * @property {bool}           disabled         是否可编辑              defaultValue:false 可选值：'start','end','startEnd','all', false
 * @property {func}           onChange         变化时回调函数
 */
const propTypes = {
  defaultValue: PropTypes.array,
  min: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf(['-Infinity']),
  ]),
  max: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf(['Infinity']),
  ]),
  maxSerialLength: PropTypes.number,
  step: PropTypes.number,
  disabled: PropTypes.oneOf(['start', 'end', 'startEnd', 'all', false]),
  onChange: PropTypes.func,
};

/**
 * 主组件
 *
 * @export
 * @class SerialInput
 * @extends {React.Component}
 */
export default class SerialInput extends React.Component {
  static defaultProps = {
    min: '-Infinity',
    max: 'Infinity',
    step: 1,
    disabled: false,
  };

  static propTypes = propTypes;

  constructor(props) {
    super(props);

    /**
     * state属性申明
     *
     * @property {array}        serials      当前的序列值
     */
    this.state = {
      serials: props.defaultValue || [props.min, props.max],
    };

    /**
     * 更改输入框类型的回调函数
     *
     * @param {number}        index  输入框id
     * @param {string|number} value  输入框当前值
     *
     * @memberOf SerialInput
     */
    this.revertInput = (index, value) => {
      const { onChange, step } = this.props;
      const serials = [...this.state.serials];
      if (index === 0) {
        if (value === '-Infinity') {
          serials[index] = serials[index + 1] !== 'Infinity' ? (serials[index + 1] - step) : 0;
        } else {
          serials[index] = '-Infinity';
        }
      } else if (index === serials.length - 1) {
        if (value === 'Infinity') {
          serials[index] = serials[index - 1] !== '-Infinity' ? (serials[index - 1] + step) : 0;
        } else {
          serials[index] = 'Infinity';
        }
      }

      this.setState({ serials });
      onChange && onChange(serials);
    };

    /**
     * 删除输入框时的回调函数
     *
     * @param {number} index 输入框id
     *
     * @memberOf SerialInput
     */
    this.deleteInput = (index) => {
      const { onChange } = this.props;
      const serials = [...this.state.serials];

      serials.splice(index, 1);

      this.setState({ serials });
      onChange && onChange(serials);
    };

    /**
     * 添加输入框时的回调函数
     *
     * @param {number} index 输入框id
     *
     * @memberOf SerialInput
     */
    this.addInput = (index) => {
      const { step, onChange } = this.props;
      const serials = [...this.state.serials];
      let addValue;
      if (serials[index] === '-Infinity') {
        addValue = serials[index + 1] !== 'Infinity' ? (serials[index + 1] - step) : 0;
      } else {
        addValue = serials[index] + step;
      }

      serials.splice(index + 1, 0, addValue);

      this.setState({ serials });

      onChange && onChange(serials);
    };

    /**
     * 更改输入框值时的回调函数
     *
     * @param {number}  index      输入框id
     * @param {number}  newValue   输入框新值
     *
     * @memberOf SerialInput
     */
    this.changeInput = (index, newValue) => {
      const { onChange } = this.props;
      const serials = [...this.state.serials];

      serials[index] = newValue;

      this.setState({ serials });

      onChange && onChange(serials);
    };
  }
  render() {
    const { serials } = this.state;
    const { min, max, step, disabled, maxSerialLength } = this.props;

    return (<div className="wl-serialinput-con">
      {serials.map((item, index, arr) => {
        if (index === 0) {
          return (<span key={index} className="wl-serialinput-input">
            {
              item === '-Infinity' ? <Input value={item} disabled /> : <InputNumber
                value={+item}
                step={step}
                max={arr[index + 1] === Infinity ? Infinity : (arr[index + 1] - step)}
                key={index}
                disabled={'start,startEnd,all,'.indexOf(disabled + ',') !== -1}
                onChange={value => this.changeInput(index, value)}
              />
            }
            {
              'start,startEnd,all,'.indexOf(disabled + ',') === -1 && min === '-Infinity' ? <Icon
                type="retweet"
                onClick={() => this.revertInput(index, item)}
              /> : ''
            }
            <span className="wl-serialinput-line">
              <Button
                type="ghost"
                shape="circle"
                icon="caret-right"
                disabled={disabled === 'all' || maxSerialLength <= arr.length || item + step === arr[index + 1]}
                onClick={() => this.addInput(index)}
              />
            </span>
          </span>);
        } else if (index === arr.length - 1) {
          return (<span key={index} className="wl-serialinput-input">
            {
              item === 'Infinity' ? <Input value={item} disabled /> : <InputNumber
                value={+item}
                step={step}
                min={arr[index - 1] === -Infinity ? -Infinity : (arr[index - 1] + step)}
                key={index}
                disabled={'end,startEnd,all,'.indexOf(disabled + ',') !== -1}
                onChange={value => this.changeInput(index, value)}
              />
            }
            {
              'end,startEnd,all,'.indexOf(disabled + ',') === -1 && max === 'Infinity' ? <Icon
                type="retweet"
                onClick={() => this.revertInput(index, item)}
              /> : ''
            }
          </span>);
        }
        return (<span key={index} className="wl-serialinput-input">
          <InputNumber
            value={+item}
            step={step}
            min={arr[index - 1] === -Infinity ? -Infinity : (arr[index - 1] + step)}
            max={arr[index + 1] === Infinity ? Infinity : (arr[index + 1] - step)}
            key={index}
            disabled={disabled === 'all' || item + step === arr[index + 1]}
            onChange={value => this.changeInput(index, value)}
          />
          {
            disabled !== 'all' ? <Icon
              type="close-circle"
              onClick={() => this.deleteInput(index)}
            /> : ''
          }
          <span className="wl-serialinput-line">
            <Button
              type="ghost"
              shape="circle"
              icon="caret-right"
              disabled={disabled === 'all' || maxSerialLength <= arr.length || item + step === arr[index + 1]}
              onClick={() => this.addInput(index)}
            />
          </span>
        </span>);
      })}
    </div>);
  }
}