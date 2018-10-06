var bookmark={};
var history={};
var storage={};


bookmark.update=function (id,title){
    return new Promise((resolve, reject) => {
        chrome.bookmarks.update(id, {title:title},(treeNode)=>{
            resolve(treeNode);
        })
    });}
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
        chrome.bookmarks.remove(id,(e)=>{
            resolve(e)
        })
    })
}

bookmark.removeTree=function(id){
    return new Promise((resolve, reject) => {
        chrome.bookmarks.removeTree(id,(e)=>{
            resolve(e)
        })
    })
}


//A free-text query to the history service. Leave empty to retrieve all pages.

history.search=function(text,startTime,endTime){
    return new Promise((resolve, reject) => {
        var microsecondsPerWeek = 1000 * 60 * 60 * 24 * 30;
        var oneWeekAgo = (new Date).getTime() - microsecondsPerWeek;
        let query={text:text,maxResults  :10000};
        startTime&&(query.startTime=startTime);
        endTime&&(query.endTime=endTime);
        chrome.history.search({text:'',startTime:oneWeekAgo,maxResults:10000},( HistoryItems)=>{
            resolve(HistoryItems.filter(v=> !v.url.startsWith("chrome-extension://")
            ))
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
        chrome.storage.local.set(data, function() {
            resolve(true);
        });
    })

}

storage.getChanges=function(keys) {
    return new Promise((resolve,reject)=>{
        chrome.storage.local.get(keys, function(items) {
            if(items){
                resolve(items[keys])
            }
            else {
                resolve(null);
            }
        });
    })
}

storage.getBytes=function () {
    return new Promise((resolve, reject)=>{
        chrome.storage.local.getBytesInUse(null, (bytes)=>{
            resolve(bytes);
        })
    })

}

var topSites={};
topSites.get=function () {
    return new Promise((resolve, reject)=>{
        chrome.topSites.get( (items)=>{
            resolve(items);
        })
    })

}






export   {bookmark,storage,history,topSites};
