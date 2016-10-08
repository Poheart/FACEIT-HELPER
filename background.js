var bEanble = false;
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (tab.url && tab.url.indexOf('https://www.faceit.com/') === 0) {
        chrome.pageAction.show(tabId);
        bEanble = true;
    } else {
    	bEanble = false;
    }
});
// Thanks faceit!
chrome.webRequest.onBeforeRequest.addListener(
    function(requestDetails) {
        return {cancel: bEanble};
    },
    {
        urls: ["*://*.jquery.com/jquery-migrate-*.js"]
    },
    ["blocking"]
);