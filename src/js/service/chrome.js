var bookmarks={};
bookmarks.getTree=function (){
    return new Promise((resolve, reject) => {
    chrome.bookmarks.getTree((treeNode)=>{
        resolve(treeNode);
    })
});}
bookmarks.getChildren=function (id) {
    return new Promise((resolve, reject) => {
        chrome.bookmarks.getChildren(id,(treeNode)=>{
            resolve(treeNode);
        })})
}
bookmarks.get=function (id) {
    return new Promise((resolve, reject) => {
        chrome.bookmarks.get(id,(treeNode)=>{
            resolve(treeNode);
        })})
}
bookmarks.getRecent=function(){
    return new Promise((resolve, reject) => {
        chrome.bookmarks.getRecent(100, (b)=>resolve(b))
    })

}
bookmarks.search=function(str){
    return new Promise((resolve, reject) => {
        chrome.bookmarks.search(str, (r)=>resolve(r))
    })

}



export default bookmarks;
