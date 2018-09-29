import React from "react";
import {hot} from "react-hot-loader";

import Left from './left';
import ContentCard from './card';

import styles from './index.less'
import {debounce} from "lodash"
import 'antd/dist/antd.css';
import {bookmark,indexDb,storage,history} from 'js/service/chrome';
import {getBread,getHtml,loadSize,splitTitle,colorText} from 'js/popup/util';
import { Modal,Tree,Icon,Anchor,Breadcrumb,Button,Input, AutoComplete} from 'antd';
const confirm = Modal.confirm;
const TreeNode = Tree.TreeNode;
let _this;
class BookMark extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            bookmarks: [],
            urls: [],
            colNum: 1,
            bread: [],
            flatBookmarks: [],
            selectedNode: '',
            tagMaps:{},
            parent:this,
            loadSize:loadSize
        }
        _this=this;
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
        let {current,selectedNode}=this.state;
        let state={selectedId:selectedNode.id,current:current,category:node.category}
        storage.saveChanges("state",state);
    }

    reduceState(obj){
        let {selectedNode}=obj;
        if((selectedNode.id==_this.state.selectedNode.id)){
            return;
        }
        var newState={..._this.state,...obj};
        _this.setState({...newState,loadSize:loadSize},()=>{
            _this.content.scrollTop=0;
            _this.saveState(obj);
        });
    }

    showMore(){
        this.setState({loadSize: this.state.loadSize + loadSize});
    }

    async search(word){
        let children= await bookmark.search(word);
        this.reduceState({selectedNode:{id:word},category:"search",urls:children});
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
        let {selectedId="",current="bookmark",category}=stateObj.state||{};
        if(category=='tag'){
            selectedNode={id:selectedId,category:category}
            urls=tagMaps[selectedId]||[];
            bread=[selectedNode]
        }
        else if(category=='recent'){
            urls=recent;
            selectedNode={title:'recent',children:recent,id:-1,category:'recent'};
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
        bookmarks.push({title:'recent',children:recent,id:-1,category:'recent'});
        _this.reduceState({current:current,tagMaps:tagMaps,selectedNode:selectedNode, bookmarks: bookmarks,urls:urls,bread:bread,category:category});
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
            if(children.length>=0){
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
        v.children=await bookmark.getChildren(v.id);
        if(v.children&&v.children.length>0){
            confirm({
                title: 'it has not empty child directory,are you sure to delete it?',
                async onOk() {
                    let res=await bookmark.remove(v.id);
                    let {urls}=_this.state;
                    _this.setState({urls:urls.filter(k=>v.id!=k.id)})
                }
            });
        }
        else {
            confirm({
                title: 'are you sure to delete it?',
                async onOk() {
                    let res=await bookmark.remove(v.id);
                    let {urls}=_this.state;
                    _this.setState({urls:urls.filter(k=>v.id!=k.id)})

                }
            });
        }
    }

    render(){
        let {bread}=this.state;
        return <div className="flex-container">
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
                }} {...this.state} {...this.props}   style={{minHeight:'calc(100vh - 230px)'}}
                             handleClick={({node,urls, bread}) => _this.reduceState({selectedNode:{id:node.id},urls: urls, bread: bread})}
                             dealTag={_this.dealTag}
                             deleteItem={_this.deleteItem}
                             filter={_this.filter}>

                </ContentCard>

                {this.props.footer}

            </div>
        </div>
    }
}

export default hot(module)(BookMark);
