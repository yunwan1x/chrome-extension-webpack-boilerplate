import bookmark from "../service/chrome";

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
export  {getBread,getHtml,loadSize}
