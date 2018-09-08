import React from "react";
import {hot} from "react-hot-loader";
import 'ant-design-pro/dist/ant-design-pro.css';
import ContentCard   from "./card"
import styles from './index.css'
import 'antd/dist/antd.css';
import bookmark from '../service/chrome';
import {getBread} from './util';

import {Layout, Tree,Row,Col,Menu,Icon,Anchor,Breadcrumb} from 'antd';
const TreeNode = Tree.TreeNode;
var self;
const {Header, Footer, Sider, Content} = Layout;
const dateFormat="YYYY-MM-DD HH:mm:ss";
class GreetingComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bookmarks: [],
            urls:[],
            current:'mail',
            colNum:6,
            bread:[],
        }
        self=this;
    }


    componentDidMount() {
        bookmark.getTree().then(async (r) => {
            let bookmarks=r[0].children;
            let bread= await getBread(bookmarks[0]);
            this.setState({bookmarks: bookmarks,urls:bookmarks[0].children,bread:bread});
        })
    }

    treeNodeHandleClick(selectedKeys, {selected, selectedNodes, node, event}){
        self.nodeSelect(node.props.dataRef);
    }


    renderTreeNodes(bookmarks) {
        return bookmarks.map((item) => {
            if (item.children) {
                return (
                    <TreeNode title={item.title} key={item.id} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return null;
        });
    }

    async nodeSelect(node){
        let children=await bookmark.getChildren(node.id);
        if(children.length>0){
            let bread=await getBread(node);
            self.setState({urls:children,bread:bread});
        }
    }



    render() {
        let {bookmarks,urls=[],bread,colNum} = this.state;
        return <Layout style={{overflow: 'hidden'}}>
            <Anchor><Header className="header" style={{background: '#fff', padding: "1em"}}>
            </Header></Anchor>
            <Layout style={{overflow: 'hidden'}}>
                <Sider style={{overflow: 'auto', backgroundColor: "white",height:"calc(100vh - 68px)"}}>
                    <Tree showLine onSelect={this.treeNodeHandleClick}>
                        {this.renderTreeNodes(bookmarks)}
                    </Tree>
                </Sider>
                <Content style={{overflow: 'auto', height:"calc(100vh - 68px)"}}>
                    <div style={{padding:"1em"}}>
                        <Breadcrumb>
                            {bread.reverse().map(v=><Breadcrumb.Item style={{cursor:"pointer"}} onClick={self.nodeSelect.bind(this,v)}>{v.title}</Breadcrumb.Item>)}
                        </Breadcrumb>
                    </div>
                    <ContentCard {...this.state} handleClick={({urls,bread})=>self.setState({urls:urls,bread:bread})}/>
                    <Footer style={{ textAlign: 'center' }}>
                        Ant Design ©2016 Created by Ant UED
                    </Footer>
                </Content>
            </Layout>
        </Layout>
    }
};

export default hot(module)(GreetingComponent)
