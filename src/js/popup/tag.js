import React from "react";
import {hot} from "react-hot-loader";
import moment from 'moment';
import {array} from 'lodash';
import {ColorTag, getBread} from './util'
import {bookmark,indexDb,storage,history} from '../service/chrome';
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
        const tags = this.state.tags.filter(tag => tag !== removedTag);
        this.setState({ tags });
    }

    showInput(){
        this.setState({ inputVisible: true },()=>this.input.focus());
    }

    handleInputChange (e)  {
        this.setState({ inputValue: e.target.value });
    }
    componentDidMount(){
        this.props.node.id&&indexDb.get(this.props.node.id,(e,value)=>{
            value&&this.setState({
                tags:value
            })
        })
    }

    async handleInputConfirm  ()  {
        const state = this.state;
        let  inputValue = state.inputValue;
        let tags = state.tags;
        inputValue=inputValue.replace(/^\s+/g,"");
        if (inputValue && tags.indexOf(inputValue) === -1) {
            tags = [...tags, inputValue];
        }

        let {node}=this.props;
        indexDb.set(node.id,tags,(e)=>{console.log(e)});
        indexDb.get(inputValue,(e,value)=>{
            let newNode={id:node.id,title:node.title,dateAdded:node.dateAdded,parentId:node.parentId};
            if(node.url)newNode.url=node.url;
            if(node.dateGroupModified)newNode.dateGroupModified=node.dateGroupModified;
            if(value&&!value.includes(node)){
                value.push(newNode);
                indexDb.set(inputValue,value);
            }
            else {
                indexDb.set(inputValue,[newNode]);
            }
        })


        this.setState({
            tags,
            inputVisible: false,
            inputValue: '',
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

                        <ColorTag close={this.handleClose.bind(this,tag)}  tag={isLongTag ? `${tag.slice(0, 10)}...` : tag} />


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
