import React from "react";
import {hot} from "react-hot-loader";
import Tr from "js/popup/history/tr"
const dateFormat="YYYY-MM-DD HH:mm:ss";
import {getBread, getHtml, loadSize, splitTitle} from 'js/popup/util';
import {bookmark,indexDb,storage,history} from 'js/service/chrome';
import style from "./index.less"
import { DatePicker ,Tree,Icon,Modal,Row,Col,Radio,Button,Input,Select,AutoComplete,message,Tooltip} from 'antd';
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const TreeNode = Tree.TreeNode;
const DirectoryTree = Tree.DirectoryTree;
class Hitory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loadSize:loadSize,items:[],addBookmarkVisible:false,bookmarks:[],
            addTitle:"",addParentId:'',addUrl:'',modalMode:'common',
            treeNode:[],flatBookmarks:[],
        }
    }



    searchDir(e){
        let{bookmarks}=this.state;
        let dir=e.target.value;
        let treeNodes=this.searchTreeNodes(dir);
    }




    flatBookmarks(bk){
        var a=[];
        let _this=this;
        a=a.concat(bk);
        bk.forEach(item=>{
            if(item.children&&item.children.length>0){
                a=a.concat(_this.flatBookmarks(item.children))
            }
        });
        return a;
    }

    async componentDidMount() {
        let {modalMode}=this.state;
        let items=await history.search("");
        storage.saveChanges("history",items)
        let r=await bookmark.getTree();
        let bookmarks=r[0].children;

        let treeNode= await storage.getChanges("bookmarks")||[];
        let newTreeNode=[];
        for(let item of treeNode){
            let bread=await getBread(item);
            let titleTip=bread.map(d=>d.title).join(" / ");
            let title=splitTitle(item.title).title;
            newTreeNode.push (
                <TreeNode  icon={null} title={<Tooltip placement="right" title={titleTip}>{title}</Tooltip>}  dataRef={item}>
                </TreeNode>
            );
        }
        treeNode=newTreeNode;

        if(modalMode!='common')treeNode=this.renderTreeNodes(bookmarks);
        let flatBookmarks=this.flatBookmarks(bookmarks);
        this.setState({items:items,bookmarks:bookmarks,treeNode:treeNode,flatBookmarks:flatBookmarks});

    }
    searchOnChange(e){
        let {bookmarks}=this.state;
       if(e.target.value==''){
           let treeNode=this.renderTreeNodes(bookmarks);
           this.setState({treeNode:treeNode});
       }
    }



     async searchTreeNodes(searchDir) {
        let {flatBookmarks}=this.state;
        let ret=[];
        let filterMarks= flatBookmarks.filter(v=>v.children&&v.title.indexOf(searchDir)>=0);
        for(let item of filterMarks){
            let bread=await getBread(item);
            let titleTip=bread.map(d=>d.title).join(" / ");
            ret.push (
                <TreeNode  icon={null} title={<Tooltip placement="right" title={titleTip}>{splitTitle(item.title).title}</Tooltip>}  dataRef={item}>
                </TreeNode>
            );
        }
         this.setState({treeNode:ret});



    }

    renderTreeNodes(bookmarks) {
        let _this=this;
        return bookmarks.map((item) => {
            if (item.children) {
                return (
                    <TreeNode  icon={null} title={splitTitle(item.title).title}  dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return null;
        });
    }




    async changeModal(e){
        let modal=e.target.value;
        let {bookmarks}=this.state;
        let treeNode= await storage.getChanges("bookmarks")||[];
        let newTreeNode=[];
        for(let item of treeNode){
            let bread=await getBread(item);
            let titleTip=bread.map(d=>d.title).join(" / ");
            let title=splitTitle(item.title).title;
            newTreeNode.push (
                <TreeNode  icon={null} title={<Tooltip placement="right" title={titleTip}>{title}</Tooltip>}  dataRef={item}>
                </TreeNode>
            );
        }
        treeNode=newTreeNode;
        if(modal!='common')treeNode=this.renderTreeNodes(bookmarks);
        this.setState({modalMode:modal,treeNode: treeNode });
    }



    render() {
        let {loadSize,items,addBookmarkVisible,bookmarks,modalMode}=this.state;
        let {addTitle,addParentId,addUrl,treeNode}=this.state;
        return <div className="container" style={{background:"#f0f2f5",padding:'1em',height:600}}>
            <Row >
                <Col span={24}>
                    <Radio.Group size="small" value={modalMode} onChange={ this.changeModal.bind(this)} className={style.selectNode}>
                        <Radio.Button size="small"  value="common">常用</Radio.Button>
                        <Radio.Button size="small" value="search">搜索</Radio.Button>
                    </Radio.Group>
                </Col>
            </Row>
            <Row className={style.row}>
                <Col span={3}>Title</Col>
                <Col span={21}><Input size="small" value={addTitle} onChange={(e)=>this.setState({addTitle:e.target.value})} /></Col>
            </Row>
            {modalMode=='search'&&<Row className={style.row}>
                <Col span={3}>Search</Col>
                <Col span={21}>
                    <Input size="small" onChange={this.searchOnChange.bind(this)} onPressEnter={this.searchDir.bind(this)} placeholder="please input search" /></Col>
            </Row>}
            <Row className={style.row}>
                <div className={style.tree}>
                    {treeNode.length>0&&<DirectoryTree onSelect={(selectedKeys, {selected, selectedNodes, node, event})=>{
                        let {dataRef:{id}}=node.props;
                        this.setState({addParentId:id});
                    }}>
                        {treeNode}
                    </DirectoryTree>||<div className={style.nodata}>请增加一个书签</div>}
                </div>

            </Row>
            {modalMode=='search'&&<Row className={style.row}>
                <Col span={24}>   <Button type="primary" size="small">
                    新建文件夹
                </Button></Col>
            </Row>}

            <Row>
                <Col>
                    <a href="#" onClick={()=>{
                        chrome.management.getSelf(function (res) {
                            let url='chrome-extension://' + res.id + '/popup.html';
                            window.url=url;
                            chrome.tabs.create({ url: url});
                        });
                    }
                    }>书签管理器</a>
                </Col>
            </Row>
        </div>;
    }
};

export default hot(module)(Hitory)
