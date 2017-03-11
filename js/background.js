var bEnable = false;
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (tab.url && (tab.url.indexOf('https://www.faceit.com/') === 0 || tab.url.indexOf('https://www.poheart.net/') === 0 )) {
        chrome.pageAction.show(tabId);
        bEnable = true;
    } else {
    	bEnable = false;
    }
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.method == "accept-match") {
            chrome.tabs.query({url: "https://www.faceit.com/*"}, function(tabs) {
                chrome.tabs.executeScript(tabs[0].id,{
                    code: "document.dispatchEvent(new CustomEvent('FH_acceptActiveTab'));"
                });
            });
        } else if(request.method == "openpage") {
            chrome.tabs.query({url: "https://www.poheart.net/room/*"}, function(results) {
                if (results.length == 0) {
                    chrome.tabs.create({url: 'https://www.poheart.net/room/' + request.detail});
                } else {
                    chrome.tabs.update(results[0].id, {url: 'https://www.poheart.net/room/' + request.detail, active: false});
                }
            });
        } else if(request.method == "sendMatchData") {
            chrome.tabs.query({url: "https://www.poheart.net/room/*"}, function(tabs) {
                if (tabs.length > 0) {
                     chrome.tabs.executeScript(tabs[0].id,{
                        // Should implement this in better way
                        code: "document.dispatchEvent(new CustomEvent('FH_updateMatchData', {'detail': { "+
                        "checkedinplayers: " + JSON.stringify(request.detail.checkedinplayers) +
                        ", joinedplayers: " + JSON.stringify(request.detail.joinedplayers) +
                        ", timer: " + JSON.stringify(request.detail.timeRemaining)+ 
                        ", currentState: " + JSON.stringify(request.detail.currentState)+
                        ", userid: " + JSON.stringify(request.detail.userid)+
                        " }}));"
                    });
                }
            });
        } else if(request.method == "closeWindow") {
            chrome.tabs.remove(sender.tab.id);
        }
    }
);

// Thanks faceit!
chrome.webRequest.onBeforeRequest.addListener(
    function(requestDetails) {
        return {cancel: bEnable};
    },
    {
        urls: ["*://*.jquery.com/jquery-migrate-*.js"]
    },
    ["blocking"]
);