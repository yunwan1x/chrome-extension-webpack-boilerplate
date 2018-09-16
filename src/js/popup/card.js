import React from "react";
import {hot} from "react-hot-loader";
import {array} from 'lodash';
import Tr from "./tr"
const dateFormat="YYYY-MM-DD HH:mm:ss";
import {getBread,getHtml,loadSize} from './util';

class ContentCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loadSize:loadSize,
        }
    }


    componentWillReceiveProps(nextProps){
        this.setState({loadSize:loadSize});
    }


    componentDidMount() {
        this.props.onRef(this);
    }


    render() {
        let {urls=[]} = this.props;
        let {loadSize}=this.state;
        return <table  ><tbody>
        {urls.map((row,rowindex)=>rowindex<loadSize&& <Tr key={row.id} row={row} loadSize={loadSize} {...this.props} rowIndex={rowindex} ></Tr>)}
        </tbody></table>;
    }
};

export default hot(module)(ContentCard)
