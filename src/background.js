chrome.browserAction.onClicked.addListener(function(tab) {
    var viewTabUrl = chrome.extension.getURL('popup.html');
    console.log(viewTabUrl)
}