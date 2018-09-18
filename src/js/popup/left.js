import React from "react";
import {hot} from "react-hot-loader";
import {bookmark,indexDb,storage,history} from '../service/chrome';
const confirm = Modal.confirm;
import { Modal,Tree,Icon,Anchor,Breadcrumb,Button,Input, AutoComplete} from 'antd';
import {ColorTag, splitTitle} from './util'
import { Menu, Switch,Tag } from 'antd';
const SubMenu = Menu.SubMenu;
const TreeNode = Tree.TreeNode;
const DirectoryTree = Tree.DirectoryTree;
class Left extends React.Component{
    constructor(props){
        super(props);
        this.state={
            key:'tree',
            tags:[]
        }
    }
    async getUrls(tagName,tagChildren,index){
        let node={title:'标签-'+tagName,children:tagChildren,id:tagName,category:"tag"};
        this.props.parent.nodeSelect(node)
    }


    render(){
        let {key}=this.state;
        let {parent,bookmarks,tagMaps}=this.props;
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
                        <Icon type="bars" theme="outlined" />树形
                    </Menu.Item>
                    <Menu.Item key="tag">
                        <Icon type="tag" theme="outlined" />标签
                    </Menu.Item>
                </Menu>
                {key=='tree'&&<DirectoryTree
                    onSelect={parent.treeNodeHandleClick}
                >
                    {parent.renderTreeNodes(bookmarks)}
                </DirectoryTree>}
                {key=='tag'&&<div style={{padding:'1em',lineHeight:2}}>{Object.entries(tagMaps).map((tag,index)=>{
                    let tagName=tag[0];
                    let tagChildren=tag[1];
                    return <ColorTag tag={tagName} onClick={this.getUrls.bind(this,tagName,tagChildren,index)}  />
                })}</div>}

            </div>
        )
    }
}
export default hot(module)(Left)
