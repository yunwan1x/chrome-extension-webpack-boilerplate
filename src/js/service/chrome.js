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

bookmarks.remove=function(id){
    return new Promise((resolve, reject) => {
        chrome.bookmarks.remove(id,()=>{
            resolve()
        })
    })
}

bookmarks.removeTree=function(id){
    return new Promise((resolve, reject) => {
        chrome.bookmarks.removeTree(id,()=>{
            resolve()
        })
    })
}


//A free-text query to the history service. Leave empty to retrieve all pages.
history.search=function(text){
    return new Promise((resolve, reject) => {
        chrome.history.search({text:text,maxResults :1000});
    })

}
history.search=function(text){
    return new Promise((resolve, reject) => {
        chrome.history.search({text:text,maxResults :1000},( HistoryItems)=>{
            resolve(HistoryItems)
        });
    })

}
history.getVisits=function(url){
    return new Promise((resolve, reject) => {
        chrome.history.getVisits({url :url},(VisitItems)=>{
            resolve(VisitItems)
        })
    })

}





export default bookmarks;
