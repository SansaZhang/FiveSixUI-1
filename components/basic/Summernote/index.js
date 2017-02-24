/**
 * @file 富文本编辑器Summernote组件
 *       modified by wangjuan01 <wangjuan01@iwaimai.baidu.com>
 *
 * @author lichun<lichun@iwaimai.baidu.com>
 * @version 0.0.1
 *
 */
import CSSModules from 'react-css-modules';
import React, { PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import styles from './styles.less';

require('bootstrap/js/modal.js');
require('bootstrap/js/dropdown.js');
require('bootstrap/js/tooltip.js');
require('./libs/summernote.min.js');

const DEFAULT_CONFIG = {
  height: 300,
  toolbar: [
    ['style', ['bold', 'italic', 'underline', 'clear']],
    // ['font', ['strikethrough', 'superscript', 'subscript']],
    ['fontsize', ['fontsize']],
    ['color', ['color']],
    ['para', ['ul', 'ol', 'paragraph']],
    ['height', ['height']],
    ['Insert', ['picture', 'link', 'table']],
    ['Misc', ['fullscreen']],
  ],
};

/**
 * 组件属性申明
 *
 * @property {string}        name              组件名                defaultValue:''
 * @property {string}        value             组件值                defaultValue:''
 * @property {bool}          disabled          是否可编辑            defaultValue:false
 * @property {string}        uploadImgUrl      上传图片url           defaultValue:''
 * @property {object}        config            summernote配置
 * @property {func}          onChange          变化时回调函数
 */
const propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  uploadImgUrl: PropTypes.string,
  config: PropTypes.object,
  onChange: PropTypes.func,
};

/**
 * 主组件
 *
 * @export
 * @class Summernote
 * @extends {React.Component}
 */
class Summernote extends React.Component {
  static defaultProps = {
    name: 'summernote',
    value: '',
    disabled: false,
    uploadImgUrl: '',
    config: DEFAULT_CONFIG,
  };

  static propTypes = propTypes;

  constructor(props) {
    super(props);

    /**
     * 上传图片
     *
     * @param {object} $el  包裹元素
     * @param {object} file 文件
     * @param {string} url  请求url
     *
     * @memberOf Summernote
     */
    this.uploadImg = ($el, file, url) => {
      const formData = new FormData();
      formData.append('file', file);

      $.ajax({
        url,
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        dataType: 'json',
        type: 'POST',
        success: (data) => {
          $el.summernote('insertImage', data.data);
        },
      });
    };
  }

  componentDidMount() {
    const { name, config, uploadImgUrl, onChange, value, disabled } = this.props;

    this.$summernote = $(findDOMNode(this['summernote' + name]));
    this.$summernote.summernote({
      ...DEFAULT_CONFIG,
      ...config,
      callbacks: {
        onImageUpload: (files) => {
          for (let i = 0; i < files.length; i++) {
            this.uploadImg(this.$summernote, files[i], uploadImgUrl);
          }
        },
        onChange: content => onChange && onChange(content),
      },
    });

    this.$summernote.summernote('code', value);

    if (disabled) {
      this.$summernote.summernote('disable');
    }
  }

  componentWillReceiveProps(nextProps) {
    const oldValue = this.props.value;
    const newValue = nextProps.value;

    if (oldValue !== newValue) {
      this.$summernote.summernote('code', newValue);
    }

    if (!this.props.disabled && nextProps.disabled) {
      this.$summernote.summernote('disable');
    }
  }

  render() {
    return (<div className="wl-summernote-con">
      <input ref={(ref) => { this['summernote' + this.props.name] = ref; }} />
    </div>);
  }
}

export default CSSModules(Summernote, styles);
