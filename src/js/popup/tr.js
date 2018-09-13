import React from "react";
import {hot} from "react-hot-loader";
import moment from 'moment';
import {array} from 'lodash';
import {getBread} from './util'
import bookmark from '../service/chrome';
import EditableTagGroup from './tag'
import {Button,Icon,Popconfirm, message,Row,Col} from 'antd';
var self=this;
const dateFormat="YY/MM/DD";

class Tr extends React.Component {
    constructor(props) {
        super(props);
        self=this;
    }




    shouldComponentUpdate(nextProps, nextState){
        if(nextProps.row.id==this.props.row.id)return false;
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
        let {row,rowIndex,loadSize,search}=this.props;
        let {filter,deleteItem}=this.props;
        return <tr>

            <td    ref={(dom)=>{row.dom=dom;}} >


                <Row>
                    <Col><div className="wy_cmd"><a>{moment(row.dateAdded).format(dateFormat)}</a>   {row.url&&<a  onClick={filter.bind(this,row,"site")}>网站</a>}
                        {row.url&&<a  onClick={filter.bind(this,row,"domain")}>域名</a>}
                        <Popconfirm title="确定删除这个吗？" onConfirm={deleteItem.bind(this,row,this.deleteCallback.bind(this,row))}  okText="Yes" cancelText="No">
                            <a size="small" >删除</a>
                        </Popconfirm>
                        <a size="small">编辑</a></div></Col>
                    <Col ><a style={{marginRight:"2em"}} onClick={self.handleClick.bind(self,row)} target="_blank" href={row.url}>{row.url&&<img src={`chrome://favicon/size/16@1x/${row.url}`} className="img" />||<Icon  className="img" type="folder" theme="outlined" />}
                        <span className="wy_title" dangerouslySetInnerHTML={{ __html: this.props.search&&row.title.split(new RegExp(search,"i")).join(`<span style="color: red">${search}</span>`)||row.title}}></span>
                    </a> <EditableTagGroup/></Col>
                </Row>
                {/*<Row><Col></Col></Row>*/}
            </td>



        </tr>
    }
}
export default hot(module)(Tr);
