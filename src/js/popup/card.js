import React from "react";
import {hot} from "react-hot-loader";
import moment from 'moment';
import {array} from 'lodash';
import {getBread} from './util'
import bookmark from '../service/chrome';
import {Button} from 'antd';

var self;
const dateFormat="YYYY-MM-DD HH:mm:ss";
class ContentCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
        self=this;
    }





    async handleClick(node){
        let children=await bookmark.getChildren(node.id);
        if(children.length>0){
            let bread=await getBread(node);
            this.props.handleClick({urls:children,bread:bread});
        }
    }


    render() {
        let {urls=[]} = this.props;
        let {colNum}=self.props;
        var va=[];
        for(var i=0;i<urls.length;i=i+colNum){
            va.push(urls.slice(i,i+colNum));
        }
        let colWidth=parseInt(100/colNum);
        let td=(v)=><td style={{width:colWidth+"%"}}>
            <div style={{marginBottom:"1em"}}>
                {v.url&&<Button size="small" onClick={self.props.filter.bind(this,v)}>网站</Button>}
                <Button size="small">删除</Button>
                <Button size="small">编辑</Button>
            </div>
            <a onClick={self.handleClick.bind(self,v)} target="_blank" href={v.url}><img src={`chrome://favicon/size/16@1x/${v.url}`} style={{marginRight:'1em'}} />
                <span>{v.title}</span>
            </a>
            <div className="label">
                <span>添加时间:{moment(v.dateAdded).format(dateFormat)}</span>
            </div>
            {v.dateGroupModified&&
            <div>修改时间:{moment(v.dateGroupModified).format(dateFormat)}</div>
            }

        </td>;
        return <table cellSpacing="10px" className="card">
            {va.map(k=><tbody><tr>{k.map(v=>td(v))}</tr></tbody>)}
        </table>;
    }
};

export default hot(module)(ContentCard)