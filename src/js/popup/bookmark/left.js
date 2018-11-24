import React from "react";
import {hot} from "react-hot-loader";
import {bookmark,indexDb,storage,history} from '../../service/chrome';
const confirm = Modal.confirm;
import { Modal,Tree,Icon,Anchor,Breadcrumb,Button,Input, AutoComplete,Tooltip} from 'antd';
import {ColorTag, splitTitle} from '../util'
import { Menu, Switch,Tag } from 'antd';
const SubMenu = Menu.SubMenu;
const TreeNode = Tree.TreeNode;
const DirectoryTree = Tree.DirectoryTree;
class Left extends React.Component{
     constructor(props){
        super(props);

        this.state={
            key:'tree',
            tags:[],
            expandedKeys:[]
        }
    }
    async componentDidMount(){
        let {expandedKeys=[]}=await storage.getChanges("leftTree")||{};
        this.setState({expandedKeys:expandedKeys});
    }
    async getUrls(tagName,tagChildren,index){
        let node={title:'tag-'+tagName,children:tagChildren,id:tagName,category:"tag"};
        this.props.parent.nodeSelect(node)
    }


    onExpandedKey(expandedKeys, {expanded: bool, node}){
         this.setState({
             expandedKeys:expandedKeys
         },async()=>{
             await storage.saveChanges("leftTree",{expandedKeys:expandedKeys});
         });

    }

    render(){
        let {key,expandedKeys}=this.state;
        let {parent,bookmarks,tagMaps}=this.props;
        let tagEntries=Object.entries(tagMaps);
        tagEntries.sort((a,b)=>{
            return b[1].length-a[1].length;
        });
        return(
            <div className="left"    >
                <Menu
                    selectedKeys={[key]}
                    mode="horizontal"
                    onClick={({item, key, selectedKeys})=>{
                        this.setState({key:key})
                    }}
                >

                    <Menu.Item key="tree" >
                        <Icon type="bars" theme="outlined" />tree
                    </Menu.Item>
                    <Menu.Item key="tag">
                        <Icon type="tag" theme="outlined" />tags
                    </Menu.Item>
                </Menu>
                {key=='tree'&&<DirectoryTree onExpand={this.onExpandedKey.bind(this)} expandedKeys={expandedKeys} draggable={true} onDrop={({event, node, dragNode, dragNodesKeys})=>{
                }} onRightClick={(e)=>{}}
                    onSelect={parent.treeNodeHandleClick}
                >
                    {parent.renderTreeNodes(bookmarks)}
                </DirectoryTree>}
                {key=='tag'&&<div style={{padding:'1em',lineHeight:2}}>{tagEntries.map((tag,index)=>{
                    let tagName=tag[0];
                    let tagChildren=tag[1];
                    return <ColorTag tag={tagName} onClick={this.getUrls.bind(this,tagName,tagChildren,index)}  />
                })}</div>}

            </div>
        )
    }
}
export default hot(module)(Left)
