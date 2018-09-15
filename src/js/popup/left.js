import React from "react";
import {hot} from "react-hot-loader";
import bookmark from '../service/chrome';
const confirm = Modal.confirm;
import { Modal,Tree,Icon,Anchor,Breadcrumb,Button,Input, AutoComplete} from 'antd';
import {Color} from './util'
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
    async getUrls(tag,index){
        let children = await bookmark.store.get(tag);
        let node={title:'标签-'+tag,children:children,id:-1-index};
        this.props.parent.nodeSelect(node)
    }

    async componentDidMount(){
        let tags=  await bookmark.store.keys(IDBKeyRange.lowerBound("A"));
        this.setState({tags:tags})
    }

    render(){
        let {key,tags}=this.state;
        let {parent,bookmarks}=this.props;
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
                {key=='tag'&&<div style={{padding:'1em'}}>{tags.map((v,index)=>{

                    let color=Color({hue: v.charCodeAt()%360, saturation: 1, lightness: 0.5});
                    let style={backgroundColor:color.toString(),color:'white',borderColor:color.toString()};
                    return <span style={style}  className="left_tag" onClick={this.getUrls.bind(this,v,index)}>{v}</span>
                })}</div>}

            </div>
        )
    }
}
export default hot(module)(Left)
