import React from "react";
import {hot} from "react-hot-loader";
import moment from 'moment';
import {array} from 'lodash';
import {getBread} from './util'
import bookmark from '../service/chrome';
import {Button,Icon,Popconfirm, message} from 'antd';
import Tr from "./tr"
var self;
const dateFormat="YYYY-MM-DD HH:mm:ss";
const loadsizeNum=20;
class ContentCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loadSize:loadsizeNum,
        }
        self=this;
        window.card=this;
    }


    componentWillReceiveProps(nextProps){
        this.setState({loadSize:loadsizeNum});
    }


    componentDidMount() {
        this.props.onRef(this);
    }


    render() {
        let {urls=[]} = this.props;
        let {loadSize}=this.state;
        let {colNum}=self.props;
        var newData=[];
        for(var i=0;i<urls.length;i=i+colNum){
            newData.push(urls.slice(i,i+colNum));
        }
        return <table cellSpacing="10px" className="card"><tbody>
            {newData.map((row,rowindex)=>rowindex<=loadSize/colNum&&<Tr row={row} loadSize={loadSize} {...this.props} colNum={colNum} rowIndex={rowindex} ></Tr>||null)}
        </tbody></table>;
    }
};

export default hot(module)(ContentCard)
