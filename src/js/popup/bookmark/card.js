import React from "react";
import {hot} from "react-hot-loader";
import Tr from "./tr"
import {Pagination} from 'antd';

class ContentCard extends React.Component {
    constructor(props) {
        super(props);
    }




    render() {
        let {urls=[],page,size,flatBookmarks} = this.props;
        let newUrls=urls.slice((page-1)*size,page*size)
        newUrls.forEach((v,index)=>{
            if(!v.url){
                v.children=flatBookmarks.find(k=>k.id==v.id).children;
            }
        })

        return <div><table className="table"  ><tbody>
        {newUrls.map((row,rowindex)=> <Tr key={row.id} row={row}  {...this.props} rowIndex={rowindex} ></Tr>)}
        </tbody></table></div>;
    }
};

export default hot(module)(ContentCard)
