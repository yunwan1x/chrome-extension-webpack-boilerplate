import React from "react";
import {hot} from "react-hot-loader";
import moment from 'moment';
import {getBread, getTag, splitTitle} from 'js/popup/util'
import {bookmark,indexDb,storage,history} from 'js/service/chrome';
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






    render(){
        let {row,search}=this.props;

        let newTitle=this.props.search&&splitTitle(row.title).title.replace(new RegExp("("+search+")","ig"),"<span style='color: red'>$1</span>");

        const trContent=(row)=>(
            <tr>
                <td    ref={(dom)=>{row.dom=dom;}} >
                    <a style={{marginRight:"2em"}}  target="_blank" href={row.url}>{row.url&&<span style={{width:16,height:16,backgroundImage:`-webkit-image-set(url("chrome://favicon/size/16@1x/${row.url}") 1x, url("chrome://favicon/size/16@2x/${row.url}") 2x)`}}  className="img" ></span>||<Icon  className="img" type="folder" theme="outlined" />}
                        <span className="wy_title" dangerouslySetInnerHTML={{ __html: newTitle||splitTitle(row.title).title}}></span>
                    </a>
                </td>
                <td>{row.visitCount}</td>
                <td  className="wy_cmd">
                    <span>{moment(row.lastVisitTime).format(dateFormat)}</span>
                </td>
            </tr>
        )

        return trContent(row)
    }
}
export default hot(module)(Tr);
