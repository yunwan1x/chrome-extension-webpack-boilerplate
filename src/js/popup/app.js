import React from "react";
import {hot} from "react-hot-loader";
import 'ant-design-pro/dist/ant-design-pro.css';
import ContentCard   from "./card"
import styles from './index.css'
import 'antd/dist/antd.css';
import bookmark from '../service/chrome';
import {getBread} from './util';
import markImg from '../../img/mark.svg'
import {Layout, Tree,Row,Col,Icon,Anchor,Breadcrumb,Button,Input, AutoComplete} from 'antd';
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
            current:'mail',
            colNum:4,
            bread:[],
            flatBookmarks:[],
            search:"",

        }
        this.historyInfo={
            history:[],
            historyIndex:0
        }
        _this=this;
    }

    reduceState(obj){
        var newState={..._this.state,...obj};
        let {history,historyIndex}=_this.historyInfo;
        if(history.length>100){
            history.shift();
        }
        history.push(newState);
        _this.historyInfo.historyIndex=history.length-1;
        _this.setState({...newState});
    }
    forword(){
        let {historyIndex,history}=_this.historyInfo;
        if(historyIndex==history.length-1)return;
        let state=history[++_this.historyInfo.historyIndex]
        _this.setState({...state});
    }
    back(){
        console.log("back")
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
            let category=_this.state.flatBookmarks.filter(v=>v.children&&v.children.length>=0)


            bookmarks.push({title:'最近书签',children:recent,id:-1});
            bookmarks.push({title:'文件夹',children:category,id:-2});
            _this.reduceState({bookmarks: bookmarks,urls:bookmarks[0].children,bread:bread});

            console.log(_this.flatBookmarks)
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
        let word=str.target.value;
        if(!word)return;
        let children= await bookmark.search(word);
        _this.reduceState({urls:children,search:word});
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
            _this.reduceState({urls:children});
        }else {
            children=await  bookmark.getChildren(node.id)
            if(children.length>0){
                let bread=await getBread(node);
                _this.reduceState({urls:children,bread:bread});
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
        console.log(catchDomain);
        let marks=flatBookmarks.filter(v=>v.url).filter(v=>v.url.indexOf(catchDomain)>0);
        _this.reduceState({urls:marks})
    }


    render() {
        let {bookmarks,urls=[],bread,colNum,search} = this.state;
        return <Layout style={{overflow: 'hidden'}}>
            <Anchor><Header className="header" style={{background: '#fff', padding: "1em",height:"80px"}}><img src={markImg}  height="48"/>
                <Menu  mode="horizontal" style={{display:"inline-block"}}>
                <Menu.Item>书签</Menu.Item>
                <Menu.Item>浏览历史</Menu.Item>
                <Menu.Item>我的搜索</Menu.Item>
            </Menu>
                <AutoComplete
                    className="global-search"
                    size="large"
                    // dataSource={dataSource.map(renderOption)}
                    // onSelect={onSelect}
                    // onSearch={this.handleSearch}
                    placeholder="请输入"
                    optionLabelProp="text"
                >
                    <Input onPressEnter={_this.searchBookmark} value={search}
                        suffix={(
                            <Button  className="search-btn" size="large" type="primary">
                                <Icon type="search" />
                            </Button>
                        )}
                    />
                </AutoComplete>
            </Header></Anchor>
            <Layout style={{overflow: 'hidden'}}>
                <Sider style={{overflow: 'auto', backgroundColor: "white",height:"calc(100vh - 80px)"}}>
                    <DirectoryTree
                        multiple
                        onSelect={this.treeNodeHandleClick}
                    >
                        {this.renderTreeNodes(bookmarks)}
                    </DirectoryTree>
                </Sider>
                <Content style={{overflow: 'auto', height:"calc(100vh - 80px)"}}>
                    <div style={{padding:"1em"}}>
                        <Breadcrumb style={{float:"left"}}>
                            {bread.map(v=><Breadcrumb.Item style={{cursor:"pointer"}} onClick={_this.nodeSelect.bind(this,v)}>{v.title}</Breadcrumb.Item>)}
                        </Breadcrumb>
                        <div style={{float:"right"}}><Button onClick={_this.back}>后退</Button><Button onClick={_this.forword}>前进</Button><Button>时间正序</Button><Button>时间倒序</Button></div>
                    </div>
                    <ContentCard {...this.state} handleClick={({urls,bread})=>_this.reduceState({urls:urls,bread:bread})} filter={_this.filter}       />
                    <Footer style={{ textAlign: 'center' }}>
                        Ant Design ©2016 Created by Ant UED
                    </Footer>
                </Content>
            </Layout>
        </Layout>
    }
};

export default hot(module)(GreetingComponent)
