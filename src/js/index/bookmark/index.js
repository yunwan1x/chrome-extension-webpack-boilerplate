import React from "react";
import {hot} from "react-hot-loader";
import Tr from "js/popup/history/tr"
import { Menu, Item, Separator, Submenu, MenuProvider,contextMenu } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.min.css';
const dateFormat="YYYY-MM-DD HH:mm:ss";
import {getBread, getHtml, loadSize, splitTitle} from 'js/popup/util';
import {bookmark,indexDb,storage,history,tabs} from 'js/service/chrome';
import style from "./index.less"
import { DatePicker ,Tree,Icon,Modal,Row,Col,Radio,Button,Input,AutoComplete,message,Tooltip,Select} from 'antd';
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const TreeNode = Tree.TreeNode;
const DirectoryTree = Tree.DirectoryTree;
const MyMenu = () => (
    <Menu id='menu_id'>
        <Item onClick={({ event, props })=>{

        }}>Click Me</Item>
    </Menu>
);
class Hitory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loadSize:loadSize,items:[],addBookmarkVisible:false,bookmarks:[],
            addTitle:"",addParentId:'',addUrl:'',modalMode:'common',
            treeNode:[],flatBookmarks:[],tags:[],selectedTags:[],expandedKeys:[],selectedKeys:[],addedId:''
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

    selectParent(selectedKeys, {selected, selectedNodes, node, event}){


    }

    async componentDidMount() {
        let {modalMode}=this.state;
        let items=await history.search("");
        storage.saveChanges("history",items)
        let r=await bookmark.getTree();
        let bookmarks=r[0].children;

        let tab=await bookmark.getCurrentTab();
        let {title="",url=""}=tab;
        let oldBm=await bookmark.search(url);
        let selectedTags=[];
        if(oldBm&&oldBm.length>0){
            oldBm=oldBm[0];
            title=oldBm.title;
            selectedTags=splitTitle(title).tags
        }
        let treeNode= await storage.getChanges("bookmarks")||[];
        let newTreeNode=[];
        for(let item of treeNode){
            let bread=await getBread(item);
            let titleTip=bread.map(d=>d.title).join(" / ");
            let title=splitTitle(item.title).title;
            newTreeNode.push (
                <TreeNode   icon={null} title={<Tooltip placement="right" title={titleTip}>{title}</Tooltip>}  dataRef={item}>
                </TreeNode>
            );
        }
        treeNode=newTreeNode;

        if(modalMode!='common')treeNode=this.renderTreeNodes(bookmarks);
        let flatBookmarks=this.flatBookmarks(bookmarks);
        let tagMaps=flatBookmarks.reduce((map,node)=>{
            let {title,tags}=splitTitle(node.title);
            tags.forEach(tag=>{
                let container=map[tag]||[];
                container.push(node)
                map[tag]=container;
            })
            return map;
        },{});
        this.setState({addTitle:title,addUrl:url,items:items,bookmarks:bookmarks,treeNode:treeNode,flatBookmarks:flatBookmarks,tags:Object.keys(tagMaps),selectedTags:selectedTags});

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
                <TreeNode   icon={null} title={<Tooltip placement="right" title={titleTip}>{splitTitle(item.title).title}</Tooltip>}  dataRef={item}>
                </TreeNode>
            );
        }
         this.setState({treeNode:ret});



    }

    renderTreeNodes(bookmarks,addedId) {
        return bookmarks.map((item) => {
            let title=splitTitle(item.title).title;
            if (!item.url) {
                return (
                    <TreeNode    icon={null} title={addedId==item.id?<Input defaultValue={title} onPressEnter={async (e)=>{
                        let value=e.target.value;
                        await bookmark.update(item.id,value);
                        let r=await bookmark.getTree();
                        let bookmarkRef=r[0].children;
                        let treeNode=this.renderTreeNodes(bookmarkRef,"");
                        this.setState({treeNode:treeNode})
                    }} size="small" />:title}  dataRef={item}>
                        {this.renderTreeNodes(item.children,addedId)}
                    </TreeNode>
                );
            }
            return null;
        });
    }

    async addBookMark(callback){
        let {addParentId,addUrl,addTitle,selectedTags}=this.state;
        let oldBm=await bookmark.search(addUrl);
        if(addParentId){
            if(oldBm&&oldBm.length>0){
                oldBm=oldBm[0];
                let {split,title,tags}=splitTitle(oldBm.title);
                let newTitle=title+split+selectedTags.join("|");
                await bookmark.update(oldBm.id,newTitle);
                addParentId&&await bookmark.move(oldBm.id,addParentId);
            }else {
                let {split,title,tags}=splitTitle(addTitle);
                let newTitle=title+split+selectedTags.join("|");
                addParentId&&await bookmark.create(addParentId,newTitle,addUrl);
            }
            let commonBooks=await storage.getChanges("bookmarks")||[]
            if(commonBooks.length>20)commonBooks.shift();
            let  addedBookmark=await bookmark.get(addParentId);
            addedBookmark.length>0&&(!commonBooks.find(b=>b.id==addParentId))&&commonBooks.push( addedBookmark[0]);
            await storage.saveChanges("bookmarks",commonBooks)
            callback();
        }else {
            if(oldBm&&oldBm.length>0){
                oldBm=oldBm[0];
                let {split,title,tags}=splitTitle(oldBm.title);
                let newTitle=title+split+selectedTags.join("|");
                await bookmark.update(oldBm.id,newTitle);
                callback();
            }else {
                message.error('please select a directory');
            }
        }
    }


    onRightClick({event, node}){
        event.preventDefault();
        contextMenu.show({
            id: 'menu_id',
            event: event,
            props: {
                msg: 'hello'
            }
        });
    }
    async changeModal(e){
        let modal=e.target.value;
        let {bookmarks,addedId}=this.state;
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
        let {loadSize,items,addBookmarkVisible,bookmarks,modalMode,tags,selectedTags,selectedKeys,expandedKeys,addedId}=this.state;
        let {addTitle,addParentId,addUrl,treeNode}=this.state;
        let isSearchTab=modalMode=='search';
        return <div className="container" onContextMenu={(e)=>{e.preventDefault()}} style={{padding:'1em',paddingTop:'0.5em'}}>
            <div style={{textAlign:'right',marginBottom:'0.3em'}}><span onClick={()=>{
                window.close()
            }}  style={{cursor:'pointer'}}><Icon  type="close" /></span></div>
            <Row >
                <Col span={24}>
                    <Radio.Group size="small" value={modalMode} onChange={ this.changeModal.bind(this)} className={style.selectNode}>
                        <Radio.Button size="small"  value="common">常用</Radio.Button>
                        <Radio.Button size="small" value="search">搜索</Radio.Button>
                    </Radio.Group>
                    <a style={{float:'right'}} href="#" onClick={  ()=>{
                        chrome.management.getSelf(async (res)=>{
                            let url='chrome-extension://' + res.id + '/popup.html';
                            let exsitTab=await tabs.query(url);
                            if(exsitTab&&exsitTab.length>0){
                                exsitTab=exsitTab[0];
                                await tabs.update(exsitTab.id)
                                window.close();
                            }else {
                                chrome.tabs.create({ url: url});
                            }
                        });
                    }
                    }>书签管理器</a>
                </Col>
            </Row>
            <Row className={style.row}>
                <Col span={3}>Title</Col>
                <Col span={21}><Input value={addTitle} onChange={(e)=>this.setState({addTitle:e.target.value})} /></Col>
            </Row>
            {modalMode=='search'&&<Row className={style.row}>
                <Col span={3}>Search</Col>
                <Col span={21}>
                    <Input  onChange={this.searchOnChange.bind(this)} onPressEnter={this.searchDir.bind(this)} placeholder="please input search" /></Col>
            </Row>}
            <Row className={style.row}>
                <Col span={3}>tags</Col>
                <Col span={21}>
                    <Select
                        mode="tags"
                        maxTagCount={50}
                        style={{ width: '100%' }}
                        value={selectedTags}
                        onChange={(value)=>{
                            this.setState({selectedTags:value});
                        }}
                        placeholder="input tags">
                        {tags.map(v=><Select.Option value={v}>{v}</Select.Option>)}
                    </Select>
                </Col>
            </Row>
            <Row className={style.row}>
                <div className={style.tree} >
                    {treeNode.length>0&&(isSearchTab?<DirectoryTree  onRightClick={this.onRightClick.bind(this)} selectedKeys={selectedKeys} expandedKeys={expandedKeys} onExpand={(expandedKeys, {expanded: bool, node})=>{
                        this.setState({expandedKeys:expandedKeys})
                    }} onSelect={(selectedKeys, {selected, selectedNodes, node, event})=>{
                        let {dataRef:{id}}=node.props;
                        this.setState({addParentId:id,selectedKeys:selectedKeys});
                    }}>
                        {treeNode}
                    </DirectoryTree>:<DirectoryTree  onSelect={(selectedKeys, {selected, selectedNodes, node, event})=>{
                        let {dataRef:{id}}=node.props;
                        this.setState({addParentId:id,selectedKeys:selectedKeys});
                    }}>
                        {treeNode}
                    </DirectoryTree>)||<div className={style.nodata}>请增加一个书签</div>}
                </div>

            </Row>
            <Row className={style.row}>
                <Col span={24}>   {modalMode=='search'&&<Button type="primary" size="small" onClick={async()=>{
                    if(!addParentId){
                        message.error('please select a directory');
                        return;
                    }
                    let bk=await bookmark.create(addParentId,"新建文件夹");
                    let {id,title,url}=bk;
                    let r=await bookmark.getTree();
                    let bookmarkRef=r[0].children;
                    let treeNode=this.renderTreeNodes(bookmarkRef,id);
                    this.setState({treeNode:treeNode})
                }}>
                    新建文件夹
                </Button> }<div style={{float:'right'}}><Button onClick={()=>{
                    this.addBookMark(()=>{window.close()})
                }} type="primary" size="small" style={{marginRight:'1em'
                }}>
                    保存
                </Button><Button  size="small" onClick={()=>window.close()}>
                    取消
                </Button></div></Col>
            </Row>
            <MyMenu></MyMenu>
        </div>;
    }
};

export default hot(module)(Hitory)
