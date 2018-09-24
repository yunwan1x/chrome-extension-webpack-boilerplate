import React from "react";
import {hot} from "react-hot-loader";
import Tr from "js/popup/history/tr"
const dateFormat="YYYY-MM-DD HH:mm:ss";
import {getBread,getHtml,loadSize} from 'js/popup/util';
import {bookmark,indexDb,storage,history} from 'js/service/chrome';
import style from "./index.less"
import { DatePicker ,Icon} from 'antd';
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

class Hitory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loadSize:loadSize,items:[]
        }
    }



    showMore(){
        let self=this;
        self.setState({loadSize: self.state.loadSize + loadSize});
    }


    async componentDidMount() {
        let items=await history.search("");
        this.setState({items:items})
    }



    render() {
        let {loadSize,items}=this.state;
        return <div className="container" style={{background:"#f0f2f5",padding:'1em'}}><div className={style.header}><span><Icon type="project" theme="outlined" />&nbsp;历史记录</span>
        <RangePicker></RangePicker></div><table  ><tbody>
        {items.map((row,rowindex)=>rowindex<loadSize&& <Tr key={row.id} row={row}  {...this.props} rowIndex={rowindex} ></Tr>)}
        </tbody></table>
            {this.props.footer}
        </div>;
    }
};

export default hot(module)(Hitory)
