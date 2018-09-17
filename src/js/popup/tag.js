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
        let {title,id}=this.props.node;
        var split="  ";
        let tags=[];
        let index=title.lastIndexOf(split);
        if(index>-1){
            tags=title.substr(index+2);
            tags=tags.split("|")
            console.log(tags);
        }
        this.setState({tags:tags})
    }

    async handleInputConfirm  ()  {
        const state = this.state;
        let  inputValue = state.inputValue;
        let tags = state.tags;
        inputValue=inputValue.replace(/^\s+|\|/g,"");
        if (inputValue && tags.indexOf(inputValue) === -1) {
            tags = [...tags, inputValue];
        }
        else {
            this.setState({
                inputVisible: false,
                inputValue: '',
            });
            return;
        }

        let {title,id}=this.props.node;
        var split="  ";
        let oldTags="";
        let index=title.lastIndexOf(split);
        if(index>-1){
            oldTags=title.substr(index+2);
            title=title.substr(0,index);
            bookmark.update(id,title+split+tags.join("|"))
        }
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
