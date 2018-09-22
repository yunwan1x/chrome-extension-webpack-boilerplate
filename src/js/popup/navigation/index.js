import React from "react";
import {hot} from "react-hot-loader";
import Tr from "js/popup/history/tr"
const dateFormat="YYYY-MM-DD HH:mm:ss";
import {getBread,getHtml,loadSize} from 'js/popup/util';
import {bookmark,indexDb,storage,history} from 'js/service/chrome';
import style from "./index.less"
import { DatePicker ,Icon} from 'antd';
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
import Color from 'color-js'

class Hitory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loadSize:loadSize,items:[]
        }
        let self=this;
        this.intersectionObserver = new IntersectionObserver(function (entries) {
            if (entries[0].intersectionRatio < 0) return;
            self.setState({loadSize: self.state.loadSize + loadSize});
        }, {threshold: [0]});
    }


    componentWillReceiveProps(nextProps){
        this.setState({loadSize:loadSize});
    }


    async componentDidMount() {
        let items=await history.search("");
        console.log(items);
        this.setState({items:items})
    }

    getDomain(url){
        var reg=/https?:\/\/([^\/]*)\/?/;
        reg.exec(url);
        let catchDomain=RegExp.$1;
        if(!catchDomain)return url
        var arr=catchDomain.split(".");
        var length=arr.length;
        if(length>=2){
            return arr[length-2];
        }
        else {
            return arr[length-1];
        }

    }

    render() {
        let color=["#4285F4","#EA4335","#FBBC05","#34A853"]
        let {loadSize,items}=this.state;
        console.log(items)

        let gfont=(v)=>v.split("").map((v,index)=>{
            // return <span style={{color:`hsl(${v.charCodeAt()%7*60},50%,50%)`}}>{index==0?v.toUpperCase():v}</span>
            return <span style={{color:color[index%4]}}>{index==0?v.toUpperCase():v}</span>
        })
        return (
            <div className="container">
            <div className={style.header}><span><Icon type="project" theme="outlined" />&nbsp;历史记录</span>
        <RangePicker></RangePicker>
            </div>
                <div> {items.slice(0,4).map(v=><span className={style.label}>{gfont(this.getDomain(v.title))}</span>)}</div>
            <div   style={{textAlign: 'center',padding:'2em 0em'}}>
                Professional Bookmark Manager ©2018 Created By changhui.wy
                <div ref={(dom)=>{
                    dom&&this.intersectionObserver.observe(dom);
                }} ><a  href="mailto:512458266@qq.com" target="_blank">给changhui.wy发送邮件</a></div>
            </div>

        </div>)
    }
};

export default hot(module)(Hitory)
