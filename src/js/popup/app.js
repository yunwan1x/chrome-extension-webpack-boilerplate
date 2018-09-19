import React from "react";
import {hot} from "react-hot-loader";
import ContentCard   from "./card";
import History from "js/popup/history/index";
import styles from './index.css'
import Left from './left'
import {debounce} from "lodash"
import 'antd/dist/antd.css';
import {bookmark,indexDb,storage,history} from '../service/chrome';
import {getBread,getHtml,loadSize,splitTitle} from './util';
import markImg from '../../img/mark.svg';
import { Modal,Tree,Icon,Anchor,Breadcrumb,Button,Input, AutoComplete} from 'antd';
const confirm = Modal.confirm;
import { Menu, Switch } from 'antd';
const SubMenu = Menu.SubMenu;
const TreeNode = Tree.TreeNode;
const DirectoryTree = Tree.DirectoryTree;
var _this;
const dateFormat="YYYY-MM-DD HH:mm:ss";
class GreetingComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bookmarks: [],
            urls: [],
            current: 'bookmark',
            colNum: 1,
            bread: [],
            flatBookmarks: [],
            search: "",
            selectedNode: '',
            tagMaps:{},
            parent:this
        }
        this.historyInfo = {
            history: [],
            historyIndex: 0
        }
        _this = this;
        _this.intersectionObserver = new IntersectionObserver(function (entries) {
            if (entries[0].intersectionRatio < 0) return;
            let child = _this.contentCard;
            child.setState({loadSize: child.state.loadSize + loadSize});
        }, {threshold: [0]});
    }

    dealTag(tagName,node,optype){
        let {tagMaps}=_this.state;
        let tagChildren=tagMaps[tagName]||[];
        if(optype=='add'){
            tagChildren.push(node);
            tagMaps[tagName]=tagChildren;
        }
        if(optype=='del'){
            tagChildren.splice(tagChildren.indexOf(node),1);
        }
        if(tagChildren.length==0)delete tagMaps[tagName];
        _this.setState({tagMaps:tagMaps});
    }

    saveState(node){
        let {search,current,selectedNode}=this.state;
        let state={selectedId:selectedNode.id,search:search,current:current,category:node.category}
        storage.saveChanges("state",state);
    }

    reduceState(obj){
        let {selectedNode}=obj;
        if((selectedNode.id==_this.state.selectedNode.id)){
            return;
        }
        var newState={..._this.state,...obj};
        let {history,historyIndex}=_this.historyInfo;
        if(history.length>100){
            history.shift();
        }
        // history.push(newState);
        // _this.historyInfo.historyIndex=history.length-1;

        _this.setState({...newState},()=>{
            _this.content.scrollTop=0;
            _this.saveState(obj);
        });

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



    async componentDidMount() {
        let r=await bookmark.getTree();
        let bookmarks=r[0].children;
        let selectedNode=bookmarks[0];
        let urls=selectedNode.children;
        let recent=await bookmark.getRecent();
        let bread= await getBread(selectedNode);
        _this.state.flatBookmarks =_this.flatBookmarks(bookmarks);
        let tagMaps=_this.state.flatBookmarks.reduce((map,node)=>{
            let {title,tags}=splitTitle(node.title);
            tags.forEach(tag=>{
                let container=map[tag]||[];
                container.push(node)
                map[tag]=container;
            })
            return map;
        },{});
        let stateObj=await storage.getChanges("state");
        let {selectedId="",search="",current="bookmark",category}=stateObj.state||{};
        if(category=='tag'){
            selectedNode={id:selectedId,category:category}
            urls=tagMaps[selectedId]||[];
            bread=[selectedNode]
        }
        else if(category=='search'){
            selectedNode={id:selectedId,category:category}
            urls= await bookmark.search(search);
            bread=[selectedNode]
        }
        else if(category=='recent'){
            urls=recent;
            selectedNode={title:'最近书签',children:recent,id:-1,category:'recent'};
            bread=[selectedNode];
        }
        else {
            let node=selectedId&&await bookmark.get(selectedId);
            if(node&&node.length>0){
                node=node[0];
                selectedNode=node;
                urls=await bookmark.getChildren(node.id);
                bread=await getBread(selectedNode);
            }
        }
        bookmarks.push({title:'最近书签',children:recent,id:-1,category:'recent'});
        _this.reduceState({current:current,tagMaps:tagMaps,selectedNode:selectedNode, bookmarks: bookmarks,urls:urls,bread:bread,search:search,category:category});
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

    nodeHandleClick(node){
        _this.nodeSelect(node);
    }

    async searchBookmark(){
        let {search}=this.state;
        if(!search)return;
        let children= await bookmark.search(search);
        _this.reduceState({selectedNode:{id:search},category:"search",urls:children,search:search});
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

    async nodeSelect(node){
        let children=[];
        if(node.category){
            children=node.children;
            let bread=[];
            bread.push(node)
            _this.reduceState({selectedNode:node,urls:children,bread,category:node.category});
        }
        else {
            children=await  bookmark.getChildren(node.id)
            if(children.length>0){
                let bread=await getBread(node);
                _this.reduceState({selectedNode:node,urls:children,bread:bread});
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
        _this.setState({selectedNode:{id:catchDomain},category:'search',urls:marks})
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
        let {bookmarks,urls=[],bread,search,current} = this.state;
        let {history,historyIndex}=_this.historyInfo;
        return <React.Fragment>

            <Anchor style={{boxShadow:'2px 2px 10px rgba(0,0,0,0.1)'}}><div className="header" style={{background: '#fff', height:"50px"}}><img className="logo" src={markImg}  height="32"/>
                <Menu  mode="horizontal" selectedKeys={[current]} style={{display:"inline-block"}} onClick={({ item, key, keyPath })=>_this.setState({current:key})}>
                <Menu.Item key="bookmark" ><Icon type="profile" theme="outlined"  style={{fontSize:'1.2em',verticalAlign:'middle'}}/>书签</Menu.Item>
                <Menu.Item key="history"><Icon type="table" style={{fontSize:'1.2em',verticalAlign:'middle'}} />浏览历史</Menu.Item>
                <Menu.Item key="search"><Icon style={{fontSize:'1.2em',verticalAlign:'middle'}} type="idcard" theme="outlined" />我的搜索</Menu.Item>
            </Menu>
                <AutoComplete
                    className="global-search"
                    size="middle"
                    placeholder="请输入"
                    value={search}
                    onSearch={(e)=>this.setState({search:e})}
                >
                    <Input    style={{borderRadius:0}}
                           onPressEnter={_this.searchBookmark.bind(this)}
                              value={search}
                           suffix={(
                            <Button style={{borderRadius:0}}
                                    onClick={_this.searchBookmark.bind(this)}

                                    className="search-btn" size="middle" type="primary">
                                <Icon type="search" />
                            </Button>
                        )}
                    />
                </AutoComplete>
            </div></Anchor>
            {current == 'bookmark' &&


                <div className="flex-container">
                    <Left {...this.state}   />

                    <div  className="right" ref={(dom)=>{_this.content=dom}} >
                        <div className="wy_toolbar" ref={(dom)=>{

                        }
                        }>
                            <span >
                                  <Icon type="book" theme="outlined" />
                                &nbsp;
                                <Breadcrumb style={{display: 'inline-block'}}>
                                {bread.map(v => <Breadcrumb.Item style={{cursor: "pointer"}}
                                                                 onClick={_this.nodeSelect.bind(this, v)}>{v.title}</Breadcrumb.Item>)}
                            </Breadcrumb>
                            </span>
                          <span style={{float:'right'}}>




                          </span>

                        </div>
                        <ContentCard onRef={(contentCard)=>{
                            this.contentCard=contentCard;
                        }}  {...this.state} style={{minHeight:'calc(100vh - 230px)'}}
                                     handleClick={({node,urls, bread}) => _this.reduceState({selectedNode:{id:node.id},urls: urls, bread: bread})}
                                     dealTag={_this.dealTag}
                                     deleteItem={_this.deleteItem}
                                     filter={_this.filter}/>
                        <div   style={{textAlign: 'center',padding:'2em 0em'}}>
                            Professional Bookmark Manager ©2018 Created By changhui.wy
                            <div ref={(dom)=>{
                                dom&&_this.intersectionObserver.observe(dom);
                            }} ><a  href="mailto:512458266@qq.com" target="_blank">给changhui.wy发送邮件</a></div>
                        </div>
                    </div>
                </div>
            }
            {
                current == 'history'&& <History/>

            }
            {
                current == 'search'
            }
            </React.Fragment>
    }

};

export default hot(module)(GreetingComponent)
