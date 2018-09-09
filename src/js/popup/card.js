import React from "react";
import {hot} from "react-hot-loader";
import moment from 'moment';
import {array} from 'lodash';
import {getBread} from './util'
import bookmark from '../service/chrome';
import {Button,Icon,Popconfirm, message} from 'antd';

var self;
const dateFormat="YYYY-MM-DD HH:mm:ss";
class ContentCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

            showMore:false,
            loadSize:20,
        }
        self=this;
    }


    componentWillReceiveProps(nextProps){
        this.setState({showMore:false});
    }

    componentWillUnmount(){

    }

    deleteCallback(v){
        v.dom.parentNode.removeChild(v.dom);
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
        let {loadSize,showMore}=this.state;
        let {colNum}=self.props;
        var va=[];
        for(var i=0;i<urls.length;i=i+colNum){
            va.push(urls.slice(i,i+colNum));
        }
        let colWidth=parseInt(100/colNum);
        let td=(v,rowindex,colIndex)=>{
            if(rowindex*colNum+colIndex==loadSize&&!showMore){
                return <td onClick={()=>this.setState({showMore:true})}><span >显示更多</span></td>
            }
            return (rowindex*colNum+colIndex<loadSize||showMore)&&<td ref={(dom)=>{v.dom=dom;}} style={{width:colWidth+"%"}}>
            <div>
                <div style={{marginBottom:"1em"}}>
                    {v.url&&<Button size="small" onClick={self.props.filter.bind(this,v,"site")}>网站</Button>}
                    {v.url&&<Button size="small" onClick={self.props.filter.bind(this,v,"domain")}>域名</Button>}
                    <Popconfirm title="确定删除这个吗？" onConfirm={this.props.deleteItem.bind(this,v,this.deleteCallback.bind(this,v))}  okText="Yes" cancelText="No">
                        <Button size="small" >删除</Button>
                    </Popconfirm>

                    <Button size="small">编辑</Button>
                </div>
                <a onClick={self.handleClick.bind(self,v)} target="_blank" href={v.url}>{v.url&&<img src={`chrome://favicon/size/16@2x/${v.url}`} style={{marginRight:'1em'}} />||<Icon className="fold" type="folder" theme="outlined" />}
                    <span className="wy_title" dangerouslySetInnerHTML={{ __html: this.props.search&&v.title.split(new RegExp(this.props.search,"i")).join(`<span style="color: red">${this.props.search}</span>`)||v.title}}></span>
                </a>
                <div className="label">
                    <span>添加时间:{moment(v.dateAdded).format(dateFormat)}</span>
                </div>
            </div>
        </td>||null;
        }
        return <table cellSpacing="10px" className="card">
            {va.map((row,rowindex)=><tbody><tr>{row.map((col,colindex)=>td(col,rowindex,colindex))}</tr></tbody>)}
        </table>;
    }
};

export default hot(module)(ContentCard)