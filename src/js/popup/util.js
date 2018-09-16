import {bookmark} from "../service/chrome";
import React from 'react'
import Color from 'color-js'
import {Icon} from 'antd'
async function getBread(node){
    var a=[];
    let a1=node;
    while(a1&&a1.id){
        a.push(a1);
        if(a1.id=="0")break;
        let id=  a1.parentId;
        a1=await bookmark.get(id)
        a1=a1[0];
    }
    return a.reverse();
}
function getHtml() {
    var a=`aaa`
    return a;
}
var loadSize=50;
function ColorTag(props) {
    let color=Color({hue: props.tag.charCodeAt()%360, saturation: 0.5, lightness: 0.5});
    let style={backgroundColor:color.toString(),color:'white',borderColor:color.toString()};
    return <span  onClick={props.onClick} className="left_tag" style={style}>{props.tag}{ props.close&&<Icon type="close" theme="outlined" style={{cursor:'pointer'}}  className="close" onClick={props.close}/>}</span>
}
export  {getBread,getHtml,loadSize,ColorTag,Color}
