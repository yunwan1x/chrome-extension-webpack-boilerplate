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
        return <table  ><tbody>
        {urls.map((row,rowindex)=>rowindex<loadSize&& <Tr row={row} loadSize={loadSize} {...this.props} rowIndex={rowindex} ></Tr>)}
        </tbody></table>;
    }
};

export default hot(module)(ContentCard)
