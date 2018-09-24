import React from "react";
import {hot} from "react-hot-loader";
import BookMark   from "js/popup/bookmark/index";
import History from "js/popup/history/index";
import Navigation from "js/popup/navigation/index";

import styles from './index.less'
import {debounce} from "lodash"
import 'antd/dist/antd.css';
import {bookmark,indexDb,storage,history} from '../service/chrome';
import {getBread,getHtml,loadSize,splitTitle,colorText} from './util';
import { Modal,Tree,Icon,Anchor,Breadcrumb,Button,Input, AutoComplete} from 'antd';
const confirm = Modal.confirm;
import { Menu, Switch } from 'antd';
const SubMenu = Menu.SubMenu;
const TreeNode = Tree.TreeNode;
const DirectoryTree = Tree.DirectoryTree;
const dateFormat="YYYY-MM-DD HH:mm:ss";
let _this ;
class GreetingComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 'bookmark',
            search: "",
            parent:this,
            action:'search',
        }
        _this=this;
        _this.intersectionObserver = new IntersectionObserver(function (entries) {
            if (entries[0].intersectionRatio < 0) return;
            let {bookmark}=_this.refs;
            _this.setState({action:"showMore"},()=>bookmark.showMore())
        }, {threshold: [0]});
    }

    async search(){
        let {search,current}=this.state;
        if(!search)return;
        this.setState({action:'search',search:search},()=>this.refs.bookmark.search(search))
    }


    render() {
        let {search,current} = this.state;
        let footer= (
            <div   style={{textAlign: 'center',padding:'2em 0em'}}>
            Professional Bookmark Manager ©2018 Created By changhui.wy
            <div ref={(dom)=>{
                dom&&_this.intersectionObserver.observe(dom);
            }} ><a  href="mailto:512458266@qq.com" target="_blank">给changhui.wy发送邮件</a></div>
            </div>);
        return <React.Fragment>

            <Anchor style={{boxShadow:'2px 2px 10px rgba(0,0,0,0.1)'}}><div className="header" style={{background: '#fff', height:"50px"}}><span className={styles.logo}>{colorText("babel")}</span>
                <Menu  mode="horizontal" selectedKeys={[current]} style={{display:"inline-block",verticalAlign: 'top'}} onClick={({ item, key, keyPath })=>this.setState({current:key})}>
                <Menu.Item key="bookmark" ><Icon type="profile" theme="outlined"  style={{fontSize:'1.2em',verticalAlign:'middle'}}/>书签</Menu.Item>
                <Menu.Item key="history"><Icon type="table" style={{fontSize:'1.2em',verticalAlign:'middle'}} />浏览历史</Menu.Item>
            </Menu>
                <AutoComplete
                    className="global-search"
                    size="middle"
                    placeholder="请输入"
                    value={search}
                    onSearch={(e)=>this.setState({search:e})}
                >
                    <Input    style={{borderRadius:0}}
                           onPressEnter={this.search.bind(this)}
                              value={search}
                           suffix={(
                            <Button style={{borderRadius:0}}
                                    onClick={this.search.bind(this)}

                                    className="search-btn" size="middle" type="primary">
                                <Icon type="search" />
                            </Button>
                        )}
                    />
                </AutoComplete>
            </div></Anchor>
            {current == 'bookmark' &&<BookMark ref="bookmark" {...this.state} footer={footer} />


            }
            {
                current == 'history'&& <History ref="bookmark" footer={footer}/>

            }
            {
                current == 'search'&&<Navigation></Navigation>
            }


            </React.Fragment>
    }

};

export default hot(module)(GreetingComponent)
