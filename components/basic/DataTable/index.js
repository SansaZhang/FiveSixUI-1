/* eslint import/no-unresolved: 0*/
import React, { PropTypes } from 'react';
import { Table, Dropdown, Icon, Menu } from 'antd';
import _ from 'lodash';
import ReactDOM from 'react-dom';
import CSSModules from 'react-css-modules'; 
import styles from './styles.less';

/**
 * 组件属性说明
 *
 * @property {function} changePage 服务端分页时的切换页方法（服务端分页必填）
 * @property {object} rowSelection 列选择配置
 * @property {object} initSortedInfo 初始排序
 * @property {function} expandedRowRender 可展开行配置
 * @property {object} config 配置项 （必填），配置分页器、样式、数据、表头等
 */
/* eslint no-script-url: 0*/
const propTypes = {
  config: PropTypes.object.isRequired,
  rowSelection: PropTypes.object,
  changePage: PropTypes.func,
  initSortedInfo: PropTypes.object,
  expandedRowRender: PropTypes.func,
};

/**
 * 数据表 对antd表格进行了进一步的封装
 * TODO: 表格切页后需滚至顶部；
 *       表格首次加载loading效果;
 *       待验证，表格重新检索后，翻页、数据显示是否正常；
 *       服务端changePage需手动添加；
 *       当前页码需从props.config中读取；
 */
class DataTable extends React.Component {
  constructor(props) {
    super(props);
    this.defaultConfig = {
      id: 'id',
      columns: [],
      data: [],
      filters: {}, // 检索条件
      pagination: {
        paging: true,
        serverSide: true, // 后端分页为true; 前端分页为false; 默认后端分页
        pageSize: 50,
      },
      total: 0,
      page: 0, // 当前页码，后端分页changePage时需更新此值
      top: 250,
      minHeight: 200,
    };
    this.initConfig = this.getInitConfig(props.config);
    const { data } = this.initConfig;
    this.state = {
      height: {},
      loading: true,
      data: this.getData(data),
      sortedInfo: {
        order: this.props.initSortedInfo ? this.props.initSortedInfo.order : '',
        columnKey: this.props.initSortedInfo ? this.props.initSortedInfo.columnKey : '',
      },
    };
    this.initWidth = (e) => {
      let initWidth = 0;
      e.forEach(
            (item) => {
              if (item.width) {
                initWidth += item.width;
              } else {
                initWidth += 100;
              }
            }
            );
      return initWidth;
    };
  }
  componentDidMount() {
    this.resetTableheight();
    this.bindEvent();
    const me = this;
    me.$table = $(ReactDOM.findDOMNode(me.table));
    me.$table.off('click', '[data-type="order"]').on('click', '[data-type="order"]', (e) => {
      const $target = $(e.currentTarget);
      if ($target.data('id') === me.state.sortedInfo.columnKey) {
        me.setState(
          {
            sortedInfo: {
              columnKey: $target.data('id'),
              order: me.state.sortedInfo.order === 'descend' ? 'ascend' : 'descend',
            },
          }
                );
      } else {
        me.setState(
          {
            sortedInfo: {
              columnKey: $target.data('id'),
              order: 'descend',
            },
          }
                );
      }
    });
  }
      // 数据更新
  componentWillReceiveProps(nextProps) {
    this.initConfig = this.getInitConfig(nextProps.config);
    this.setState({
      loading: false,
      data: this.getData(nextProps.config.data, nextProps.config.page),
      current: nextProps.config.page,
      height: this.calculateTableHeight(ReactDOM.findDOMNode(this).offsetTop + 43, this.initConfig.minHeight),
      width: this.calculateTableWidth(),
    });
  }
    // componentWillUpdate(nextProps, nextState) {
    //     if (nextState.current !== this.state.current) {
    //         const $tableBody = $(ReactDOM.findDOMNode(this)).find('div.ant-table-body');
    //         const $tableheader = $(ReactDOM.findDOMNode(this)).find('div.ant-table-header').css('overflow-y', 'hidden');
    //         if ($tableBody.height() > $tableBody.find('table').height()) {
    //             $tableheader.css('overflow-y', 'scroll');
    //         } else {
    //             $tableheader.css('overflow-y', 'hidden');
    //         }
    //     }
    // }
    // 获取表格数据，主要区分客户端分页还是服务端分页
  getInitConfig(config) {
    if (config.pagination && config.pagination.paging && config.pagination.serverSide === false) { // 客户端分页
      return _.defaultsDeep(
        { ...config,
          total: config.data.length,
        },
        { ...this.defaultConfig });
    }
    return _.defaultsDeep(config, { ...this.defaultConfig });
  }
  getInitColumns(columns) {
    const initcolumns = [];
    columns.map(
            (col) => {
              let newcol = { ...col };
              if (this.initConfig.align) {
                newcol = { ...newcol, ...col,
                  styleName: 'column',
                };
              }
              if (col.sort && !col.sorter) {
                newcol = { ...newcol, ...col,
                  sorter: (a, b) => {
                    const INFINITE = this.state.sortedInfo.order === 'descend' ? -100000 : 100000;
                    const newA = a[col.dataIndex] !== col.fix ? a[col.dataIndex] : INFINITE;
                    const newB = b[col.dataIndex] !== col.fix ? b[col.dataIndex] : INFINITE;
                    return newA - newB;
                  },
                  sortOrder: this.state.sortedInfo.columnKey === col.key ? this.state.sortedInfo.order : false,
                };
              }
              if (typeof col.title !== 'object') {
                if (col.tips && col.sort) {
                  newcol = { ...newcol, ...col,
                    title:
                      <div
                        style={{ display: 'inline' }}
                      >
                        <b
                          data-id={col.key}
                          data-type="order"
                          style={{ cursor: 'pointer', userSelect: 'none', WebkitUserSelect: 'none' }}
                        >
                          {col.title}
                        </b>
                        <Dropdown overlay={this.showTips(col.tips)}>
                          <a className="ant-dropdown-link" href="javascript:void(0)" style={{ marginLeft: '6px', color: '#ff2b4d', cursor: 'help' }}>
                            <Icon
                              type="question-circle-o"
                            />
                          </a>
                        </Dropdown>
                      </div>,
                  };
                } else if (!col.tips && col.sort) {
                  newcol = { ...newcol, ...col,
                    title:
                      <b
                        data-id={col.key}
                        data-type="order"
                        style={{ cursor: 'pointer', userSelect: 'none', WebkitUserSelect: 'none' }}
                      >
                       {col.title}
                      </b>,
                  };
                } else if (col.tips && !col.sort) {
                  newcol = { ...newcol, ...col,
                    title:
                      <div
                        style={{ display: 'inline' }}
                      >
                        {col.title}
                        <Dropdown overlay={this.showTips(col.tips)}>
                          <a className="ant-dropdown-link" href="javascript:void(0)" style={{ cursor: 'help', color: '#ff2b4d', marginLeft: '6px' }}>
                            <Icon
                              type="question-circle-o"
                            />
                          </a>
                        </Dropdown>
                      </div>,
                  };
                }
              }
              if (col.fixed && !this.state.width) {
                delete newcol.fixed;
              }
              initcolumns.push(newcol);
              return 0;
            }
        );
    return initcolumns;
  }
  getData(data, page = 1) {
    const { pagination } = this.initConfig;
    if (pagination.paging && !pagination.serverSide) {
      if (data) {
        return data.slice((page - 1) * pagination.pageSize, this.min(page * pagination.pageSize, data.length));
      }
      return [];
    }
    return data;
  }
  changeHandel(pag, fil, sort) {
    this.setState({
      sortedInfo: sort,
    });
  }
  showTips(tips) {
    return (
      <Menu>
        <Menu.Item disabled style={{ color: '#000000' }}>{tips}</Menu.Item>
      </Menu>
    );
  }
  min(num1, num2) {
    return num1 < num2 ? num1 : num2;
  }
  bindEvent() {
    $(window).off('resize.table').on('resize.table',
            $.function.debounce(() => {
              this.resetTableheight();
            }, 500)
        );
  }
    /**
     * 表格自适应高度【read me!!!!!!】
     * 如果要修改计算方法，请务必仔细阅读各种注释
     */
  resetTableheight() {
    const { minHeight } = this.initConfig;
    const height = this.calculateTableHeight(ReactDOM.findDOMNode(this).offsetTop + 43, minHeight);
        // 这里使用原生属性计算offsetTop，jquery无法处理页面本身已有scrollbar的情况，使得在有scrollbar的页面跳转时，会使得自适应出问题
        // + 43是因为，offsetTop没有计算通知栏的高度
    this.setState({
      height,
      width: this.calculateTableWidth(),
    });
  }

  calculateTableWidth() {
        // 表格的可滚动区域，由columns中的每一列决定，如果没设置，则视为100
        // 此处不设置宽度，只是在可视区域较大时，清空掉fixed，以避免bug
        // columns的width决定了一切，好好设置，不能只看当前屏幕哦！
    const domWidth = $(ReactDOM.findDOMNode(this)).width() - 12;
        // 12是scrollbar的宽度，因为overflow-y: sroll，所以这个12永远存在
    if (domWidth < this.initWidth(this.initConfig.columns)) {
      return true;
    }
    return false;
  }

  calculateTableHeight(top, minHeight) {
    const bodyHeight = $(document).height();
    let tableHeight = bodyHeight - top;
        // 此时的tableHeight，是表格能够使用的高度，在以下两种情况，我们必须使用minHeight
    if (tableHeight < minHeight) {
      tableHeight = minHeight;// 【1】tableHeight实在太小了，放弃他，滚动条出现吧
    }
    if (top - 43 === 0) {
      tableHeight = minHeight;// 【2】其他元素已经挤满了整个可视窗口了(已经加过43了，所以减掉才行)
    }
    tableHeight -= $('.datatable-module').parent().outerHeight(true) - $('.datatable-module').parent().height();
        // 必须减去父元素的margin和padding，但是如果套了很多层，就没办法了
        // 这时候的tableHeight就是dataTable的可用高度
    let scrollHeight;
        // 这是antd table的可滚动区域，必须除去表头和分页器等
    scrollHeight = tableHeight - $('.datatable-module .ant-table-header').outerHeight(true);
        // antd会动态给header配一个marginBottom，所以这里不能写死
    let paggingHeight;
       // debugger
    if (this.initConfig.pagination.paging) {
      paggingHeight = $('.datatable-module .ant-pagination').outerHeight(true) ? $('.datatable-module .ant-pagination').outerHeight(true) - 14 : 32;
            // 减14，是为了让分页器探底，他有个16的padding，没要留那么多，2就行了
    } else {
      paggingHeight = 0;
    }
        // 分页器高度，一般情况取dom值，第一次render时为了避免样式问题，设为32，这样的可能存在与resize的样式有差异，所以在willReceiveProps中加入样式的重计算，减少问题出现的可能性,准确的说，只要你的datatable加了storeloading，就不会有这个问题
    scrollHeight = scrollHeight - paggingHeight;
    return {
      table: tableHeight,
      scroll: scrollHeight,
    };
  }
  changePage(page) {
    const { data, pagination } = this.initConfig;
    const { changePage } = this.props;
    if (pagination.serverSide) {
      this.setState({
        current: page,
        loading: true,
      });
            // 仅为服务端分页提供changePage事件
      changePage && changePage(page);
    } else {
      this.setState({
        current: page,
        data: this.getData(data, page),
        loading: false,
      });
    }
  }
  render() {
    const { id, columns, total, pagination, storeLoading } = this.initConfig;
    const { data, height, current, loading } = this.state;
    const { rowSelection, expandedRowRender } = this.props;
    return (
      <div className="datatable-module" styleName="datatable-module" style={{ height: this.initConfig.height === 'auto' ? 'auto' : height.table }}>
        <Table
          ref={(c) => {
            this.table = c;
          }}
          rowSelection={rowSelection}
          size="middle"
          loading={storeLoading || loading}
          columns={this.getInitColumns(columns)}
          dataSource={data}
          rowKey={record => record[id]}
          scroll={this.initConfig.height === 'auto' ? { x: this.initWidth(columns) } : { x: this.initWidth(columns), y: height.scroll }}
          expandedRowRender={expandedRowRender || false}
          pagination={pagination.paging ? {
            total: pagination.serverSide && data.length > pagination.pageSize ? Math.round((data.length - pagination.pageSize) * total / pagination.pageSize + total) : total,
            current,
            onChange: (page) => this.changePage(page),
            showTotal: () => `共 ${total} 条`,
            pageSize: pagination.serverSide && data.length > pagination.pageSize ? data.length : pagination.pageSize,
          } : false}
        />
      </div>
    );
  }
}

DataTable.propTypes = propTypes;

export default CSSModules(DataTable, styles);
