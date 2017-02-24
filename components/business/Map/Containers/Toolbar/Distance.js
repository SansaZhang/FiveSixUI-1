import CSSModules from 'react-css-modules';
import React, {Component, PropTypes} from 'react';
import {Button} from 'antd';
import styles from './styles.less';

let myDis;
class Distance extends Component {
  componentDidMount() {
    if (this.props.map) {
      myDis = new BMapLib.DistanceTool(this.props.map, {
        followText: '单击确定地点，双击结束，右键取消'
      });
    }
  }
  componentDidUpdate(prevProps, prevState, prevContext) {
    if (this.props.map !== prevProps.map) {
      myDis = new BMapLib.DistanceTool(this.props.map, {
        followText: '单击确定地点，双击结束，右键取消'
      });
    }
  }
  render() {
    return (
      <Button onClick={() => myDis.open()} {...this.props}>
        {this.props.children}
      </Button>
    );
  }
}

Distance.propTypes = {

};

export default CSSModules(Distance, styles);
