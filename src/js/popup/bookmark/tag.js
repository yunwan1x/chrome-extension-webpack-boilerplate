import React from "react";
import {hot} from "react-hot-loader";
import moment from 'moment';
import {ColorTag, getBread,splitTitle} from '../util'
import {bookmark,indexDb,storage,history} from '../../service/chrome';
import {Button,Icon,Popconfirm, message} from 'antd';
import { Tag, Input, Tooltip } from 'antd';
import { Collapse } from 'antd';

const Panel = Collapse.Panel;
const dateFormat="YYYY-MM-DD HH:mm:ss";

class EditableTagGroup extends React.Component {
    constructor(props,context){
        super(props,context);
        this.state = {
            tags: [],
            inputVisible: false,
            inputValue: '',
        };
        this.handleClose=this.handleClose.bind(this);
        this.showInput=this.showInput.bind(this);
        this.handleInputChange=this.handleInputChange.bind(this);
        this.handleInputConfirm=this.handleInputConfirm.bind(this);
        this.saveInputRef=this.saveInputRef.bind(this);


    }


    handleClose (removedTag)  {
        let {id,title}=this.props.node;
        let {node,dealTag}=this.props;
        let obj=splitTitle(title);
        const tags = this.state.tags.filter(tag => tag !== removedTag);
        this.setState({ tags },async()=>{
            let newTitle=obj.title+obj.split+tags.join("|");
            await bookmark.update(id,newTitle);
            node.title=newTitle;
            dealTag(removedTag,node,"del");
        });
    }

    showInput(){
        this.setState({ inputVisible: true },()=>this.input.focus());
    }

    handleInputChange (e)  {
        this.setState({ inputValue: e.target.value });
    }
    componentDidMount(){
        let {title,id}=this.props.node;
        this.setState({tags:splitTitle(title).tags})
    }

    tagClick(tagName){
        let {tagMaps}=this.props;
        let tagChildren=tagMaps[tagName];
        let node={title:'标签-'+tagName,children:tagChildren,id:tagName,category:"tag"};
        this.props.parent.nodeSelect(node)
    }


    async handleInputConfirm  ()  {
        const state = this.state;
        let  inputValue = state.inputValue;
        let tags = state.tags;
        inputValue=inputValue.replace(/^\s+|\|/g,"");
        if (inputValue && tags.indexOf(inputValue) === -1) {
            tags = [...tags, inputValue];
        }
        let {title,id}=this.props.node;
        let {node,dealTag}=this.props;
        let titleObj=splitTitle(title);
        this.setState({
            tags,
            inputVisible: false,
            inputValue: '',
        },async()=>
        {
            if(inputValue){
                let newTitle=titleObj.title+titleObj.split+tags.join("|");
                await bookmark.update(id,newTitle);
                node.title=newTitle;
                dealTag(inputValue,node,"add");
            }
        });
    }

    saveInputRef (input){ this.input = input}

    render() {
        const { tags, inputVisible, inputValue } = this.state;

        return (
            <div className="wy_tag_container">
                {tags.map((tag, index) => {
                    const isLongTag = tag.length > 10;

                    const tagElem = (

                        <ColorTag onClick={this.tagClick.bind(this,tag)} close={this.handleClose.bind(this,tag)}  tag={isLongTag ? `${tag.slice(0, 10)}...` : tag} />


                    );
                    return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
                })}
                {inputVisible && (
                    <Input
                        ref={this.saveInputRef}
                        type="text"
                        size="small"
                        style={{ width: 78 }}
                        value={inputValue}
                        onChange={this.handleInputChange}
                        onBlur={this.handleInputConfirm}
                        onPressEnter={this.handleInputConfirm}
                    />
                )}
                {!inputVisible && (
                    <span className="left_tag"
                        onClick={this.showInput}
                        style={{ background: '#fff', borderStyle: 'dashed' }}
                    >
                        <Icon type="plus" /> New Tag
                    </span>
                )}

            </div>
        );
    }
}
export default hot(module)(EditableTagGroup)
