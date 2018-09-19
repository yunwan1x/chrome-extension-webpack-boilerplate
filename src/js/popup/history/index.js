import React from "react";
import {hot} from "react-hot-loader";
import Tr from "js/popup/history/tr"
const dateFormat="YYYY-MM-DD HH:mm:ss";
import {getBread,getHtml,loadSize} from 'js/popup/util';
import {bookmark,indexDb,storage,history} from 'js/service/chrome';


class Hitory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loadSize:loadSize,items:[]
        }
        let self=this;
        this.intersectionObserver = new IntersectionObserver(function (entries) {
            if (entries[0].intersectionRatio < 0) return;
            self.setState({loadSize: self.state.loadSize + loadSize});
        }, {threshold: [0]});
    }


    componentWillReceiveProps(nextProps){
        this.setState({loadSize:loadSize});
    }


    async componentDidMount() {
        let items=await history.search("");
        console.log(items);
        this.setState({items:items})
    }


    render() {
        let {loadSize,items}=this.state;
        return <div style={{background:"#f0f2f5",padding:'1em'}}><table  ><tbody>
        <tr><td>访问记录</td><td>访问次数</td><td>最后访问时间</td></tr>
        {items.map((row,rowindex)=>rowindex<loadSize&& <Tr key={row.id} row={row} loadSize={loadSize} {...this.props} rowIndex={rowindex} ></Tr>)}
        </tbody></table>

            <div   style={{textAlign: 'center',padding:'2em 0em'}}>
                Professional Bookmark Manager ©2018 Created By changhui.wy
                <div ref={(dom)=>{
                    dom&&this.intersectionObserver.observe(dom);
                }} ><a  href="mailto:512458266@qq.com" target="_blank">给changhui.wy发送邮件</a></div>
            </div>

        </div>;
    }
};

export default hot(module)(Hitory)