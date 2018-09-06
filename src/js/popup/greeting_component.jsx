import React from "react";
import {hot} from "react-hot-loader";
import 'ant-design-pro/dist/ant-design-pro.css';
import 'antd/dist/antd.css';
import bookmark from '../service/chrome';
import {Layout,Card, Tree,Row,Col,Menu,Icon,Anchor,Breadcrumb} from 'antd';
import menu from './menu'
const TreeNode = Tree.TreeNode;
let self;
const {Header, Footer, Sider, Content} = Layout;

class GreetingComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bookmarks: [],
            urls:[],
            current:'mail',
            colNum:4,
            bread:[],
        }
        self=this;
    }

    componentDidMount() {
        bookmark.getTree().then(async (r) => {
            let bookmarks=r[0].children;
            let bread= await self.getBread(bookmarks[0]);
            this.setState({bookmarks: bookmarks,urls:bookmarks[0].children,bread:bread});
        })
    }

    async handleClick(node){
        let children=await bookmark.getChildren(node.id);
        if(children.length>0){
            let bread=await self.getBread(node);
            this.setState({urls:children,bread:bread});
        }
    }

    async getBread(node){
        var a=[];
        let a1=node;
        while(a1&&a1.id){
            a.push(a1);
            if(a1.id=="0")break;
            let id=  a1.parentId;
            a1=await bookmark.get(id)
            a1=a1[0];
        }
        return a;
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
    async nodeSelect(selectedKeys, {selected, selectedNodes, node, event}){
        let {dataRef}=node.props;
        self.handleClick(dataRef)
    }

     generateCard(urls){
         let {colNum}=self.state;

        var va=[];
        for(var i=0;i<urls.length;i=i+colNum){
            va.push(urls.slice(i,i+colNum));
        }
        let colWidth=parseInt(100/colNum);
         return <table cellSpacing="10px" style={{borderCollapse: "separate",width:"100%"}}> {va.map(k=><tr>{k.map(v=><td style={{width:"25%",backgroundColor:"white",padding:"1em"}}><a onClick={self.handleClick.bind(self,v)} target="_blank" href={v.url}><img src={`chrome://favicon/size/16@1x/${v.url}`} style={{marginRight:'1em'}} />{v.title}</a></td>)}</tr>)}</table>;
    }

    render() {
        let {bookmarks,urls=[],bread} = this.state;
        return <Layout style={{overflow: 'hidden'}}>
            <Anchor><Header style={{background: '#fff', padding: "1em"}}>{menu}
            </Header></Anchor>
            <Layout style={{overflow: 'hidden'}}>
                <Sider style={{overflow: 'auto', backgroundColor: "white",height:"calc(100vh - 68px)"}}>
                    <Tree showLine onSelect={this.nodeSelect}>
                        {this.renderTreeNodes(bookmarks)}
                    </Tree>
                </Sider>
                <Content style={{overflow: 'auto', height:"calc(100vh - 68px)"}}>
                    <div style={{padding:"1em"}}>
                        <Breadcrumb>
                            {bread.reverse().map(v=><Breadcrumb.Item style={{cursor:"pointer"}} onClick={self.handleClick.bind(this,v)}>{v.title}</Breadcrumb.Item>)}
                        </Breadcrumb>
                    </div>

                    {this.generateCard(urls)}
                </Content>
            </Layout>
        </Layout>
    }
};

export default hot(module)(GreetingComponent)
