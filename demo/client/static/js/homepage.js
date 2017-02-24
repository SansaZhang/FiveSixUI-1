import React, { Component, PropTypes} from 'react';
import { TenDaysSelect,BankSelect, Crumb, ImageModal, SearchPeriod, Show, TimeRangePicker,
    Select,TagsField,Tag,UserPassWordInput,AsynDownloadBtn,DownloadList,TeamTypeRadio } from 'fivesix';
import { DropdownMenu, OptGroup, Option, SearchInput,
 SelectInput, Tips } from '../../../../components/basic/Select/Components'; 
import { Button,TimePicker } from 'antd';
import moment from 'moment';
const addon=(panel) => (
  <Button size="small" type="primary" onClick={() => panel.close()}>
    Ok
  </Button>
);
export default class Homepage extends Component {
    constructor(props){
        super(props);
        this.state={
            searchinputValue: '',
            value: ['1','2','3','4','5'],
              bank: '招商银行',
            date: {start:moment('01:01:01', 'HH:mm:ss'), end:moment('11:11:11', 'HH:mm:ss')}
        }
        this.changeValue = (value) => {
            this.setState({
                value: value,
            });
        }
        this.radioChange = (e) => {
            console.log(e);
        }
        this.onTest = (e)=>{
            console.log('test');
            console.log(e);
        };
        this.changeDate = (obj) => {
            let current = {};
            current.start = obj.startCurrent || obj.start;
            current.end = obj.endCurrent || obj.end;
            console.log(obj);
            this.setState({
                    date: current,
            });
        };
        this.handleChangeBank = this.handleChangeBank.bind(this);
        this.TenDaysSelectChange = (value) => {
            console.log(value);
        };
    }
    handleChange(obj) {
    }

        handleChangeBank(value) {
                // console.log('value', value);
                this.setState({
                bank: value
            });
        }
    render() {
        const startTime = moment('01:01:01', 'HH:mm:ss');
        const endTime = moment('11:11:11', 'HH:mm:ss');
        const handleChange = (e)=>{
            this.setState({
                searchinputValue: e.target.value
            });
        };
        const data = [
            {status: 0,name: '配送费1',create_time: 1318781876.721},
            {status: 1,name: '配送费2',create_time: 1318781876.721},
            {status: 2,name: '配送费3',download_url: 'www.baidu.com',create_time: 1318781876.721},
            {status: 3,name: '配送费4',create_time: 1318781876.721},
            ];
        const selectData = [
            {text:'1',value:'1'},
            {text:'2',value:'2'},
            {text:'3',value:'3'},
            {text:'4',value:'4'},
            {text:'5',value:'5'},
            {text:'6',value:'6'},
            {text:'7',value:'7'},
            {text:'8',value:'8'},
            {text:'9',value:'9'},
            {text:'10',value:'10'},
            {text:'11',value:'11'},
            {text:'12',value:'12'}
        ];
        return (
            <div style={{height: 800}}>
                <BankSelect
                        style={{ width: 200 }}
                        placeholder="请选择银行"
                        optionFilterProp="children"
                        value = {this.state.bank}
                        onChange={this.handleChangeBank}
                />
                <TenDaysSelect 
                value={{month: '2017-02', month_type: '1'}}
                onChange={this.TenDaysSelectChange} 
                startMoment={moment('2016-01')} 
                endMoment={moment('2017-05')} 
                monthFormat={'YYYY.MM'}
                />
                <Crumb
                    data = {[{title: '骑士管理', link: 'www.baidu.com'},{title: '装备管理'}]}
                />
                <UserPassWordInput value="******"/>
                <Show
                    isShow = { false }
                    isInline = { true }
                    isDelay = { false }
                >
                    <Button>测试</Button>
                </Show>
                <Button>测试</Button>
                
                 <Select
                data={selectData} 
                value={this.state.value}
                showSearch={true}
                showAll={true}
                allowClear={true}
                onChange={this.changeValue}
                style={{position: 'absolute', top: 400}}
                multiple = {true}
            ></Select>
            <TagsField
            tags={[{value: 1, label: 'label1'},{value: 2,label: 'label2'}]}
            ></TagsField>
            <Tag
                key = { 'zcf' }
                onClick = { (value,bool)=>{console.log(value,bool)} }
                onClose = { (value)=>{console.log(value)} }
                value = { 'zcf' }
                selected = { true }
                closable={true}
                >
                zhangcongfeng
            </Tag>
            <div>
                <AsynDownloadBtn />
                
                <TimeRangePicker 
                value={this.state.date} 
                ordered={true} 
                onChange={this.changeDate}
                />
                <TeamTypeRadio onChange={this.radioChange} test={this.onTest}/>
            </div>
            <SearchInput
              width={'150px'}
              style={{ left: 0, top: 500 }}
              onChange={handleChange}
              value={this.state.searchinputValue}
              key="searchinput"
            />
            <SearchPeriod
            />
            <ImageModal show={false}/>
            </div>
        )

    }
}
