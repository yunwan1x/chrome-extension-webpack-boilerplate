import React from "react";
import {hot} from "react-hot-loader";
import Tr from "./tr"

class ContentCard extends React.Component {
    constructor(props) {
        super(props);
    }




    render() {
        let {urls=[],loadSize,flatBookmarks} = this.props;
        urls.forEach((v,index)=>{
            if(!v.url&&index<loadSize){
                v.children=flatBookmarks.find(k=>k.id==v.id).children;
            }
        })
        return <table className="table"  ><tbody>
        {urls.map((row,rowindex)=>rowindex<loadSize&& <Tr key={row.id} row={row}  {...this.props} rowIndex={rowindex} ></Tr>)}
        </tbody></table>;
    }
};

export default hot(module)(ContentCard)
