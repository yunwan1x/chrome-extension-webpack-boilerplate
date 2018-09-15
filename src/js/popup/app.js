import React from "react";
import {hot} from "react-hot-loader";
import ContentCard   from "./card"
import styles from './index.css'
import 'antd/dist/antd.css';
import bookmark from '../service/chrome';
import {getBread,getHtml,loadSize} from './util';
import markImg from '../../img/mark.svg';
import {Layout, Modal,Tree,Row,Col,Icon,Anchor,Breadcrumb,Button,Input, AutoComplete,Popconfirm, message} from 'antd';
const confirm = Modal.confirm;
import { Menu, Switch } from 'antd';
const SubMenu = Menu.SubMenu;
const TreeNode = Tree.TreeNode;
const DirectoryTree = Tree.DirectoryTree;
var _this;
const {Header, Footer, Sider, Content} = Layout;
const dateFormat="YYYY-MM-DD HH:mm:ss";
class GreetingComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bookmarks: [],
            urls:[],
            current:'bookmark',
            colNum:1,
            bread:[],
            flatBookmarks:[],
            search:"",
            selectedNode:'',

        }
        this.historyInfo={
            history:[],
            historyIndex:0
        }
        _this=this;
        _this.intersectionObserver = new IntersectionObserver(function(entries) {
            if (entries[0].intersectionRatio < 0) return;
            let child=_this.contentCard;
            child.setState({loadSize:child.state.loadSize+loadSize});
        },{threshold:[0]});
    }

    reduceState(obj){
        let {selectedNode}=obj;
        if(selectedNode.id==_this.state.selectedNode.id){
            return;
        }
        var newState={..._this.state,...obj};
        let {history,historyIndex}=_this.historyInfo;
        if(history.length>100){
            history.shift();
        }
        // history.push(newState);
        // _this.historyInfo.historyIndex=history.length-1;
        console.log("ss");
        _this.setState({...newState},()=>_this.content.scrollTop=0);
    }
    forword(){
        let {historyIndex,history}=_this.historyInfo;
        if(historyIndex==history.length-1)return;
        let state=history[++_this.historyInfo.historyIndex]
        _this.setState({...state});
    }
    back(){
        let {historyIndex,history}=_this.historyInfo;
        if(historyIndex==0)return;
        let state=history[--_this.historyInfo.historyIndex]
        _this.setState({...state});
    }



    componentDidMount() {
        bookmark.getTree().then(async (r) => {
            let bookmarks=r[0].children;
            let recent=await bookmark.getRecent();
            let bread= await getBread(bookmarks[0]);
            _this.state.flatBookmarks =_this.flatBookmarks(bookmarks);
            // let category=_this.state.flatBookmarks.filter(v=>v.children&&v.children.length>=0)
            bookmarks.push({title:'最近书签',children:recent,id:-1});
            // bookmarks.push({title:'文件夹',children:category,id:-2});
            _this.reduceState({selectedNode:bookmarks[0], bookmarks: bookmarks,urls:bookmarks[0].children,bread:bread});
        })
    }
    flatBookmarks(bk){
        var a=[];
        a=a.concat(bk);
        bk.forEach(item=>{
            if(item.children&&item.children.length>0){
                a=a.concat(_this.flatBookmarks(item.children))
            }
        });
        return a;
    }

    treeNodeHandleClick(selectedKeys, {selected, selectedNodes, node, event}){
        _this.nodeSelect(node.props.dataRef);
    }
    async searchBookmark(str,a,b){
        console.log("ss")
        let word=str.target.value;
        if(!word)return;
        let children= await bookmark.search(word);
        _this.reduceState({selectedNode:{id:word},urls:children,search:word});
    }


    renderTreeNodes(bookmarks) {
        return bookmarks.map((item) => {
            if (item.children) {
                return (
                    <TreeNode icon={null} title={item.title}  dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return null;
        });
    }

    async nodeSelect(node){
        let children=[];
        if(node.id<0){
            children=node.children;
            _this.reduceState({selectedNode:{id:node.id},urls:children});
        }else {
            children=await  bookmark.getChildren(node.id)
            if(children.length>0){
                let bread=await getBread(node);
                _this.reduceState({selectedNode:{id:node.id},urls:children,bread:bread});
            }
        }
    }

    filter(node,type){
        let {flatBookmarks}=_this.state;
        let {url,title}=node;
        if(!url)return;
        var reg=/https?:\/\/([^\/]*)\/?/;
        reg.exec(url);
        let catchDomain=RegExp.$1;
        var arr=catchDomain.split(".");
        var length=arr.length;
        if(length>2&&type=='domain'){
            catchDomain=arr[length-2]+"."+arr[length-1]
        }
        let marks=flatBookmarks.filter(v=>v.url).filter(v=>v.url.indexOf(catchDomain)>0);
        _this.reduceState({selectedNode:{id:catchDomain},urls:marks})
    }
    async deleteItem(v,callback){
        if(v.children&&v.children.length>0){
            confirm({
                title: '文件夹下还有书签，确定删除吗?',
                async onOk() {
                    let res=await bookmark.remove(v.id);Tree
                    callback();
                }
            });
        }
        else {
            confirm({
                title: '你确定确定删除吗?',
                async onOk() {
                    let res=await bookmark.remove(v.id);
                    callback();
                }
            });
        }
    }

    render() {
        let {bookmarks,urls=[],bread,colNum,search,current} = this.state;
        let {history,historyIndex}=_this.historyInfo
        return <React.Fragment>

            <Anchor style={{boxShadow:'2px 2px 10px rgba(0,0,0,0.1)'}}><div className="header" style={{background: '#fff', height:"50px"}}><img className="logo" src={markImg}  height="32"/>
                <Menu  mode="horizontal" selectedKeys={[current]} style={{display:"inline-block"}} onClick={({ item, key, keyPath })=>_this.setState({current:key})}>
                <Menu.Item key="bookmark" ><Icon type="mail" />书签</Menu.Item>
                <Menu.Item key="history"><Icon type="mail" />浏览历史</Menu.Item>
                <Menu.Item key="search"><Icon type="mail" />我的搜索</Menu.Item>
            </Menu>
                <AutoComplete
                    className="global-search"
                    size="middle"

                    // onSelect={onSelect}
                    // onSearch={this.handleSearch}
                    placeholder="请输入"
                    optionLabelProp="text"
                >
                    <Input onPressEnter={_this.searchBookmark} value={search}
                        suffix={(
                            <Button  className="search-btn" size="middle" type="primary">
                                <Icon type="search" />
                            </Button>
                        )}
                    />
                </AutoComplete>
            </div></Anchor>
            {current == 'bookmark' &&


                <div className="flex-container">
                    <div className="left"    >
                        <DirectoryTree
                            multiple
                            onSelect={this.treeNodeHandleClick}
                        >
                            {this.renderTreeNodes(bookmarks)}
                        </DirectoryTree>
                    </div>

                    <div  className="right" ref={(dom)=>{_this.content=dom}} >
                        <div className="wy_toolbar">
                            <Breadcrumb >
                                {bread.map(v => <Breadcrumb.Item style={{cursor: "pointer"}}
                                                                 onClick={_this.nodeSelect.bind(this, v)}>{v.title}</Breadcrumb.Item>)}
                            </Breadcrumb>

                        </div>
                        <ContentCard onRef={(contentCard)=>{
                            this.contentCard=contentCard;
                        }}  {...this.state} style={{minHeight:'calc(100vh - 230px)'}}
                                     handleClick={({node,urls, bread}) => _this.reduceState({selectedNode:{id:node.id},urls: urls, bread: bread})}
                                     deleteItem={_this.deleteItem}
                                     filter={_this.filter}/>
                        <Footer  style={{textAlign: 'center'}}>
                            Professional Bookmark Manager ©2018 Created By changhui.wy
                            <div ref={(dom)=>{
                                dom&&_this.intersectionObserver.observe(dom);
                            }} ><a  href="mailto:512458266@qq.com" target="_blank">给changhui.wy发送邮件</a></div>
                        </Footer>
                    </div>
                </div>
            }
            {
                current == 'history'&&
                <Layout style={{overflow: 'hidden'}}>
                    <Content style={{overflow: 'auto', height: "calc(100vh - 80px)"}}>

                        <img src={markImg} />
                    </Content>
                </Layout>
            }
            {
                current == 'search'&&
                <Layout style={{overflow: 'hidden'}}>
                    <Content style={{overflow: 'hidden', height: "calc(100vh - 80px)"}}>
                        <iframe framespacing="0" frameBorder="NO" scrolling="yes" width="100%" height="100%" noresize=""  src="https://www.google.com.hk/imghp?hl=zh-CN&tab=wi&gws_rd=cr"></iframe>

                    </Content>
                </Layout>
            }
            </React.Fragment>
    }

};

export default hot(module)(GreetingComponent)
