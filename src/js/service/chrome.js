import IdbKvStore from 'idb-kv-store'
var bookmark={};
var indexDb = new IdbKvStore('wy_bookmark');
var history={};
var storage={};


bookmark.getTree=function (){
    return new Promise((resolve, reject) => {
    chrome.bookmarks.getTree((treeNode)=>{
        resolve(treeNode);
    })
});}
bookmark.getChildren=function (id) {
    return new Promise((resolve, reject) => {
        chrome.bookmarks.getChildren(id,(treeNode)=>{
            resolve(treeNode);
        })})
}
bookmark.get=function (id) {
    return new Promise((resolve, reject) => {
        chrome.bookmarks.get(id,(treeNode)=>{
            resolve(treeNode);
        })})
}
bookmark.getRecent=function(){
    return new Promise((resolve, reject) => {
        chrome.bookmarks.getRecent(10000, (b)=>resolve(b))
    })

}
bookmark.search=function(str){
    return new Promise((resolve, reject) => {
        chrome.bookmarks.search(str, (r)=>resolve(r))
    })

}

bookmark.remove=function(id){
    return new Promise((resolve, reject) => {
        chrome.bookmarks.remove(id,()=>{
            resolve()
        })
    })
}

bookmark.removeTree=function(id){
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

storage.saveChanges=function (key,value) {
    let data={};
    data[key]=value;
    return new Promise((resolve,reject)=>{
        chrome.storage.sync.set(data, function() {
            resolve(true);
            console.log(chrome.runtime.lastError)
        });
    })

}

storage.getChanges=function(keys) {
    return new Promise((resolve,reject)=>{
        chrome.storage.sync.get(keys, function(items) {
            resolve(items)
            console.log(items)
        });
    })
}

storage.getBytes=function () {
    return new Promise((resolve, reject)=>{
        chrome.storage.sync.getBytesInUse(null, (bytes)=>{
            resolve(bytes);
            console.log(bytes+' bytes used')
        })
    })

}

var topSites={};
topSites.get=function () {
    return new Promise((resolve, reject)=>{
        chrome.topSites.get( (items)=>{
            resolve(items);
            console.log(items);
        })
    })

}






export   {bookmark,indexDb,storage,history,topSites};
