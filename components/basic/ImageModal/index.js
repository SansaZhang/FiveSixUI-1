/**
 * @file 复合组件，图片查看器，可放大、缩小、顺时针和逆时针旋转
 *       modified by lichun<lichun@iwaimai.baidu.com> 修改为使用包裹子元素的方式，修改旋转主体；
 * @author lihuan <lihuan@iwaimai.baidu.com>
 * @version 0.1.0
 */
import React, { PropTypes } from 'react';
import { Modal, Button } from 'antd';
import CSSModules from 'react-css-modules'; 
import styles from './styles.less';

/**
 * 组件属性申明
 *
 * @property {string} src 图片跳转链接
 * @property {bool} show 是否显示组件 defaultValue: false
 * @property {function} onClose 关闭查看器组件事件后钩子，会传入图片src值
 * @property {function} onOpen 打开查看器组件事件后钩子，会传入图片src值
 */
const propTypes = {
  show: PropTypes.bool,
  src: PropTypes.string,
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
};

const ButtonGroup = Button.Group;
const DEFAULT_WIDTH = 300;
const MAX_WIDTH = 1000;
const ZOOM_FACTOR = 0.2;
/**
 * 主组件
 *
 * @export
 * @class ImageModal
 * @extends {React.Component}
 *
 */
class ImageModal extends React.Component {
  /**
   * Creates an instance of ImageModal.
   *
   * @param {any} props
   *
   * @memberOf ImageModal
   */
  constructor(props) {
    super(props);
    this.state = {
      width: DEFAULT_WIDTH,
      deg: 0,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { onOpen } = this.props;
    if (nextProps.show === true && this.props.show === false) {
      onOpen && onOpen(this.props.src);
    }
  }

  /**
   * 缩小图片
   *
   * @memberOf ImageModal
   */
  zoominImg() {
    const { width } = this.state;
    if (width > DEFAULT_WIDTH) {
      this.setState({
        width: width * (1 - ZOOM_FACTOR),
      });
    }
  }

  /**
   * 放大图片
   *
   * @memberOf ImageModal
   */
  zoomoutImg() {
    const { width } = this.state;
    if (width < MAX_WIDTH) {
      this.setState({
        width: width * (1 + ZOOM_FACTOR),
      });
    }
  }

  /**
   * 逆时针旋转图片
   *
   * @memberOf ImageModal
   */
  counterclockImg() {
    const { deg } = this.state;
    this.setState({
      deg: (deg + 270) % 360,
    });
  }

  /**
   * 顺时针旋转图片
   *
   * @memberOf ImageModal
   */
  clockwiseImg() {
    const { deg } = this.state;
    this.setState({
      deg: (deg + 90) % 360,
    });
  }

  handleClose(onClose) {
    onClose && onClose(this.props.src);
  }

  render() {
    const { width, deg } = this.state;
    const { src, onClose, show } = this.props;
    return (
      <div styleName="wl-imagemodal-wrapper">
        { show ? (
          <Modal
            visible={show}
            onCancel={() => this.handleClose(onClose)}
            footer={null}
            width={width + 32}
          >
            <div style={{ width }}>
              <img
                alt={src}
                src={src}
                style={{ width, transform: 'rotate(' + deg + 'deg)' }}
              />
            </div>
          </Modal>
        ) : ''}
        { show ? (
          <div style={{ position: 'fixed', left: 100, top: 70, zIndex: 9999 }}>
            <ButtonGroup style={{ left: '50%', marginLeft: -110 }}>
              <Button onClick={() => this.zoominImg()} >缩小</Button>
              <Button onClick={() => this.zoomoutImg()} >放大</Button>
              <Button onClick={() => this.counterclockImg()} >逆时针</Button>
              <Button onClick={() => this.clockwiseImg()}>顺时针</Button>
            </ButtonGroup>
          </div>
        ) : ''}
      </div>
    );
  }
}

ImageModal.propTypes = propTypes;

ImageModal.defaultProps = {
  show: false,
};
export default CSSModules(ImageModal, styles);
