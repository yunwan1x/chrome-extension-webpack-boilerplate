import React from "react";
import {hot} from "react-hot-loader";
import moment from 'moment';
import {array} from 'lodash';
import {getBread} from './util'
import bookmark from '../service/chrome';
import EditableTagGroup from './tag'
import {Button,Icon,Popconfirm, message} from 'antd';
var self=this;
const dateFormat="YYYY-MM-DD HH:mm:ss";

class Tr extends React.Component {
    constructor(props) {
        super(props);
        self=this;
    }




    shouldComponentUpdate(nextProps, nextState){
        var nextIds=nextProps.row.map(d=>d.id).join();
        var thisIds=this.props.row.map(d=>d.id).join();
        if(nextIds==thisIds)return false;
        return true;
    }


    deleteCallback(v){
        v.dom.parentNode.removeChild(v.dom);
    }

    async handleClick(node){
        let children=await bookmark.getChildren(node.id);
        if(children.length>0){
            let bread=await getBread(node);
            this.props.handleClick({node:node,urls:children,bread:bread});
        }
    }


    render(){
        let {row,rowIndex,colNum,loadSize,search}=this.props;
        let colWidth=parseInt(100/colNum);
        let {filter,deleteItem}=this.props;
        return <tr>{row.map((v,colIndex)=>rowIndex*colNum+colIndex<loadSize&&<td   ref={(dom)=>{v.dom=dom;}} style={{width:colWidth+"%"}}>
            <div>
                <div style={{marginBottom:"1em"}}>
                    {v.url&&<Button size="small" onClick={filter.bind(this,v,"site")}>网站</Button>}
                    {v.url&&<Button size="small" onClick={filter.bind(this,v,"domain")}>域名</Button>}
                    <Popconfirm title="确定删除这个吗？" onConfirm={deleteItem.bind(this,v,this.deleteCallback.bind(this,v))}  okText="Yes" cancelText="No">
                        <Button size="small" >删除</Button>
                    </Popconfirm>

                    <Button size="small">编辑</Button>
                </div>
                <a onClick={self.handleClick.bind(self,v)} target="_blank" href={v.url}>{v.url&&<img src={`chrome://favicon/size/16@2x/${v.url}`} style={{marginRight:'0.5em'}} />||<Icon className="fold" type="folder" theme="outlined" />}
                    <span className="wy_title" dangerouslySetInnerHTML={{ __html: this.props.search&&v.title.split(new RegExp(search,"i")).join(`<span style="color: red">${search}</span>`)||v.title}}></span>
                </a>
                <div className="label">
                    <span>添加时间:{moment(v.dateAdded).format(dateFormat)}</span>
                </div>
                <div style={{marginTop:'1em'}}><EditableTagGroup></EditableTagGroup></div>
            </div>
        </td>||null)} </tr>
    }
}
export default hot(module)(Tr);
