import React from "react";
import {hot} from "react-hot-loader";
import moment from 'moment';
import {array} from 'lodash';
import {getBread,getTag} from './util'
import {bookmark,indexDb,storage,history} from '../service/chrome';
import EditableTagGroup from './tag'
import {Button,Icon,Popconfirm, message,Row,Col,Menu, Dropdown} from 'antd';
var self=this;
const dateFormat="YY/MM/DD HH:mm";

class Tr extends React.Component {
    constructor(props) {
        super(props);
        self=this;
    }




    shouldComponentUpdate(nextProps, nextState){
        if(nextProps.row.id==this.props.row.id)
        {
            return false;
        }
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


    render(){
        let {row,rowIndex,loadSize,search}=this.props;
        let {filter,deleteItem}=this.props;

        const menu =(row)=> (
            <Menu style={{width:200}} >

                {row.url&&<Menu.Item><a  onClick={filter.bind(this,row,"site")}>网站</a></Menu.Item>}
                {row.url&&<Menu.Item><a  onClick={filter.bind(this,row,"domain")}>域名</a></Menu.Item>}
                <Menu.Item >
                        <a size="small" onClick={deleteItem.bind(this,row,this.deleteCallback.bind(this,row))}>删除</a>
                </Menu.Item>
                <Menu.Item>
                    <a size="small">编辑</a>
                </Menu.Item>
            </Menu>
        );
        let newTitle=this.props.search&&row.title.replace(new RegExp("("+search+")","ig"),"<span style='color: red'>$1</span>");

        const trContent=(row)=>(
            <tr>

                <td    ref={(dom)=>{row.dom=dom;}} >

                    <a style={{marginRight:"2em"}} onClick={self.handleClick.bind(self,row)} target="_blank" href={row.url}>{row.url&&<span style={{width:16,height:16,backgroundImage:`-webkit-image-set(url("chrome://favicon/size/16@1x/${row.url}") 1x, url("chrome://favicon/size/16@2x/${row.url}") 2x)`}}  className="img" ></span>||<Icon  className="img" type="folder" theme="outlined" />}
                        <span className="wy_title" dangerouslySetInnerHTML={{ __html: newTitle||row.title}}></span>
                    </a>
                    <EditableTagGroup node={row}/>
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
