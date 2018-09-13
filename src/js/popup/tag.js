import React from "react";
import {hot} from "react-hot-loader";
import moment from 'moment';
import {array} from 'lodash';
import {getBread} from './util'
import bookmark from '../service/chrome';
import {Button,Icon,Popconfirm, message} from 'antd';
import { Tag, Input, Tooltip } from 'antd';
import { Collapse } from 'antd';

const Panel = Collapse.Panel;
const dateFormat="YYYY-MM-DD HH:mm:ss";

class EditableTagGroup extends React.Component {
    constructor(props,context){
        super(props,context);
        this.state = {
            tags: Array.from({length:1}).map((v,index)=>'java技术'+index),
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
        console.log(tags);
        self.setState({ tags });
    }

    showInput(){
        this.setState({ inputVisible: true },()=>this.input.focus());
    }

    handleInputChange (e)  {
        this.setState({ inputValue: e.target.value });
    }

    handleInputConfirm  ()  {
        const state = this.state;
        const inputValue = state.inputValue;
        let tags = state.tags;
        if (inputValue && tags.indexOf(inputValue) === -1) {
            tags = [...tags, inputValue];
        }
        console.log(tags);
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
                    const isLongTag = tag.length > 20;
                    const tagElem = (
                        <Tag color="#108ee9" key={tag} closable={index !== 0} afterClose={() => this.handleClose(tag)}>
                            {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                        </Tag>
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
                    <Tag
                        onClick={this.showInput}
                        style={{ background: '#fff', borderStyle: 'dashed' }}
                    >
                        <Icon type="plus" /> New Tag
                    </Tag>
                )}

            </div>
        );
    }
}
export default hot(module)(EditableTagGroup)
