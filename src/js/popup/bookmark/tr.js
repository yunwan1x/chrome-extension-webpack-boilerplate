import React from "react";
import ReactDom from 'react-dom';
import {hot} from "react-hot-loader";
import moment from 'moment';
import {getBread, getTag, splitTitle} from '../util'
import {bookmark,indexDb,storage,history} from '../../service/chrome';
import EditableTagGroup from './tag'
import {Button,Icon,Popconfirm, message,Row,Col,Menu, Dropdown,Input} from 'antd';
var self=this;
const dateFormat="YY/MM/DD HH:mm";

class Tr extends React.Component {
    constructor(props) {
        super(props);
        self=this;
        this.state={edit:false,update:false,title:this.props.row.title};
    }




    shouldComponentUpdate(nextProps, nextState){
        if(this.state.update==true)return true;
        if(nextProps.action&&nextProps.action=='search')return true;
        if(nextProps.row.id==this.props.row.id)return false;
        return true;
    }




    deleteCallback(v){
        let tr=v.dom.parentNode;
        let tbody=tr.parentNode;
        tbody.removeChild(tr);
    }

    async handleClick(node){
        let children=await bookmark.getChildren(node.id);
        if(children.length>0){
            let bread=await getBread(node);
            this.props.handleClick({node:node,urls:children,bread:bread});
        }
    }

    cancleEdit(row,e){
        let value=e.target.value;
        this.setState({edit:false},()=>value&&bookmark.update(row.id,value))
    }


    render(){
        let {row,search}=this.props;
        let {filter,deleteItem,handleClick}=this.props;
        let {edit,title}=this.state;
        let _this=this;
        const menu =(row)=> (
            <Menu style={{width:200}} >

                {row.url&&<Menu.Item><a  onClick={filter.bind(this,row,"site")}>site</a></Menu.Item>}
                {row.url&&<Menu.Item><a  onClick={filter.bind(this,row,"domain")}>domain</a></Menu.Item>}
                <Menu.Item >
                        <a size="small" onClick={deleteItem.bind(this,row,this.deleteCallback.bind(this,row))}>delete</a>
                </Menu.Item>
                <Menu.Item>
                    <a size="small" onClick={()=>_this.setState({update:true},()=>this.setState({edit:true},()=>{
                        let dom=ReactDom.findDOMNode(this.refs.input);
                        dom.focus();
                    }))}>edit</a>
                </Menu.Item>
                {row.url&&<Menu.Item>
                    <a size="small">view history</a>
                </Menu.Item>}
            </Menu>
        );
        console.log(this.props.search);
        let newTitle=this.props.search&&splitTitle(row.title).title.replace(new RegExp("("+search+")","ig"),"<span style='color: red'>$1</span>");

        const trContent=(row)=>(
            <tr>
                <td    ref={(dom)=>{row.dom=dom;}} >
                    {!edit&&<a style={{marginRight:"2em"}}  target="_blank" href={row.url} onClick={this.handleClick.bind(self,row)}>{row.url&&<span style={{width:16,height:16,backgroundImage:`-webkit-image-set(url("chrome://favicon/size/16@1x/${row.url}") 1x, url("chrome://favicon/size/16@2x/${row.url}") 2x)`}}  className="img" ></span>||<Icon  className="img" type="folder" theme="outlined" />}
                        {<span className="wy_title" dangerouslySetInnerHTML={{ __html: newTitle||splitTitle(row.title).title}}></span>}
                    </a>||<div style={{marginRight:"2em"}}>
                        <Input ref="input" style={{lineHeight:2,padding:'0.3em'}} size="small" value={title} onChange={(e)=>this.setState({title:e.target.value})}  onPressEnter={this.cancleEdit.bind(this,row)} onBlur={this.cancleEdit.bind(this,row)}/>
                    </div>}

                    {!edit&&<EditableTagGroup {...this.props} node={row}/>}
                </td>
                <td  className="wy_cmd">
                    <Dropdown overlay={menu(row)} trigger={['click']}>
                        <span style={{cursor:'pointer'}} ><span style={{marginRight:"1em"}}>{moment(row.dateAdded).format(dateFormat)}</span> <Icon type="ellipsis" theme="outlined" /></span>
                    </Dropdown>
                </td>
            </tr>
        )

        return trContent(row)
    }
}
export default hot(module)(Tr);
