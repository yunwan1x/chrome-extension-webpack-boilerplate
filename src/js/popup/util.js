import {bookmark, storage} from "../service/chrome";
import React from 'react'
import Color from 'color-js'
import {Icon,Tooltip} from 'antd'
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

function getDomain(url) {
    if(!url)return;
    var reg=/https?:\/\/([^\/]*)\/?/;
    reg.exec(url);
    let catchDomain=RegExp.$1;
    var arr=catchDomain.split(".");
    var length=arr.length;
    if(length>2){
        catchDomain=arr[length-2]+"."+arr[length-1]
    }
    return catchDomain;
}
function getHtml() {
    var a=`aaa`
    return a;
}
var loadSize=20;

function ColorTag(props) {
    let color=Color({hue: (props.tag.charCodeAt()%26)*(360/26), saturation: 0.5, lightness: 0.5});
    let style={backgroundColor:color.toString(),color:'white',borderColor:color.toString()};
    return <span  onClick={props.onClick} className="left_tag" style={style}>{props.tag}{ props.close&&<Icon type="close" theme="outlined" style={{cursor:'pointer'}}  className="close" onClick={props.close}/>}</span>
}

function splitTitle(title) {
    let split="\u00a0\u00a0";
    let tags=[];
    let sTitle=title;
    let index=title.lastIndexOf(split);
    if(index>-1){
        sTitle=title.substr(0,index);
        let tagStr=title.substr(index+split.length);
        tagStr&&(tags=tagStr.split("|"));
    }
    return {title:sTitle,tags:tags,split:split}
}

function colorText(text) {
    let color=["#4285F4","#EA4335","#FBBC05","#34A853"]
   return text.split("").map((v,index)=>{
       return <span style={{color:color[index%4]}}>{index==0&&(v.codePointAt()>96&&v.codePointAt()<123)?v.toUpperCase():v}</span>
    })
}
export  {getBread,getHtml,loadSize,ColorTag,Color,splitTitle,colorText,getDomain}
