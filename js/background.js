var bEnable = false;
/*
    FACEIT HELPER ICON
*/
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (tab.url && (tab.url.indexOf('https://www.faceit.com/') === 0 || tab.url.indexOf('https://www.poheart.net/') === 0 )) {
        chrome.pageAction.show(tabId);
        bEnable = true;
    } else {
    	bEnable = false;
    }
});

/*
    On receving message from content script
    Background.js act as medium of communication between different tabs
*/
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        // When receiving accept match request [Called on user action]
        if (request.method == "accept-match") {
            chrome.tabs.query({
                url: "https://www.faceit.com/*"
            }, function(tabs) {
                chrome.tabs.executeScript(tabs[0].id, {
                    code: "document.dispatchEvent(new CustomEvent('FH_acceptActiveTab'));"
                });
            });
            // When receiving create a new tab request [Called on new match found]
        } else if (request.method == "openpage") {
            chrome.tabs.query({
                url: "https://www.poheart.net/room/*"
            }, function(results) {
                // When no such page is found
                if (results.length == 0) {
                    chrome.tabs.create({
                        url: 'https://www.poheart.net/room/' + request.detail,
                        active: request.forceFocus
                    });
                } else {
                    // When a page found with same match ID, change active window
                    console.log(results[0].url + " vs " + request.detail);
                    if(results[0].url == 'https://www.poheart.net/room/' + request.detail) {
                        chrome.tabs.update(results[0].id, {
                            active: request.forceFocus
                        });
                    } else {
                    // When a page found but not the same match ID, update to new page
                        chrome.tabs.update(results[0].id, {
                            url: 'https://www.poheart.net/room/' + request.detail,
                            active: request.forceFocus
                        });
                    }
                }
            });
            // Match information relay
        } else if (request.method == "sendMatchData") {
            chrome.tabs.query({
                url: "https://www.poheart.net/room/*"
            }, function(tabs) {
                if (tabs.length > 0) {
                    chrome.tabs.executeScript(tabs[0].id, {
                        // Should implement this in better way
                        code: "document.dispatchEvent(new CustomEvent('FH_updateMatchData', {'detail': { " +
                            "checkedinplayers: " + JSON.stringify(request.detail.checkedinplayers) +
                            ", joinedplayers: " + JSON.stringify(request.detail.joinedplayers) +
                            ", timer: " + JSON.stringify(request.detail.timeRemaining) +
                            ", currentState: " + JSON.stringify(request.detail.currentState) +
                            ", userid: " + JSON.stringify(request.detail.userid) +
                            " }}));"
                    });
                }
            });
            // When receiving close window request [Called on user action]
        } else if (request.method == "closeWindow") {
            chrome.tabs.remove(sender.tab.id);
        }
    }
);

/*
    Blocking JQuery Migrate script when on faceit.com
*/
chrome.webRequest.onBeforeRequest.addListener(
    function(requestDetails) {
        return {cancel: bEnable};
    },
    {
        urls: ["*://*.jquery.com/jquery-migrate-*.js"]
    },
    ["blocking"]
);