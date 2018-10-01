import React from "react";
import {hot} from "react-hot-loader";
import Tr from "js/popup/history/tr"
const dateFormat="YYYY-MM-DD HH:mm:ss";
import {getBread, getHtml, loadSize, splitTitle} from 'js/popup/util';
import {bookmark,indexDb,storage,history} from 'js/service/chrome';
import style from "./index.less"
import { DatePicker ,Tree,Icon,Modal,Row,Col,Radio,Button,Input,Select,AutoComplete} from 'antd';
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const TreeNode = Tree.TreeNode;
const DirectoryTree = Tree.DirectoryTree;
class Hitory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loadSize:loadSize,items:[],addBookmarkVisible:false,bookmarks:[],
            addTitle:"",addParentId:'',addUrl:''
        }
    }

    async search(word){
        let items=await history.search(word);
        this.setState({items:items})
    }

    showMore(){
        let self=this;
        self.setState({loadSize: self.state.loadSize + loadSize});
    }
    showModal(row){
        let {title,url}=row;
        this.setState({addBookmarkVisible:true,addTitle:title,addUrl:url});
    }

    async componentDidMount() {
        let items=await history.search("");
        storage.saveChanges("history",items)
        let r=await bookmark.getTree();
        let bookmarks=r[0].children;
        this.setState({items:items,bookmarks:bookmarks})

    }


    renderTreeNodes(bookmarks) {
        return bookmarks.map((item) => {
            if (item.children) {
                return (
                    <TreeNode icon={null} title={splitTitle(item.title).title}  dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return null;
        });
    }

    async searchChange(word){
        if(!word){
            let items=await storage.getChanges("history");
            this.setState({items:items});
        }
    }

    render() {
        let {loadSize,items,addBookmarkVisible,bookmarks}=this.state;
        let {addTitle,addParentId,addUrl}=this.state;
        return <div className="container" style={{background:"#f0f2f5",padding:'1em'}}>
            <Modal className={style.modal}
                title="Add bookmark"
                visible={addBookmarkVisible}
                onOk={()=>{}}
                onCancel={()=>this.setState({addBookmarkVisible:false})}
            >
                <Row >
                    <Col span={24}>
                    <Radio.Group size="small" className={style.selectNode}>
                        <Radio.Button size="small"  value="large">常用</Radio.Button>
                        <Radio.Button size="small" value="default">搜索</Radio.Button>
                    </Radio.Group>
                </Col>
                </Row>
                <Row className={style.row}>
                    <Col span={3}>Title</Col>
                    <Col span={21}><Input size="small" value={addTitle} onChange={(e)=>this.setState({addTitle:e.target.value})} /></Col>
                </Row>
                <Row className={style.row}>
                    <Col span={3}>Search</Col>
                    <Col span={21}><Input size="small" placeholder="please input search" /></Col>
                </Row>
                <Row className={style.row}>
                    <div className={style.tree}>
                        <DirectoryTree>
                            {this.renderTreeNodes(bookmarks)}
                        </DirectoryTree>
                    </div>

                </Row>
                <Row className={style.row}>
                    <Col span={24}>   <Button type="primary" size="small">

                        新建文件夹
                    </Button></Col>
                </Row>
            </Modal>
            <div className={style.header}><span><Icon type="project" theme="outlined" />&nbsp;hitory</span>
        </div><table className="table"  ><tbody>
        {items.map((row,rowindex)=>rowindex<loadSize&& <Tr key={row.id} showModal={this.showModal.bind(this,row)} row={row}  {...this.props} rowIndex={rowindex} ></Tr>)}
        </tbody></table>
            {this.props.footer}
        </div>;
    }
};

export default hot(module)(Hitory)
