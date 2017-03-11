/*
File: main.js
Author: Poheart
Description: FACEIT HELPER main function
*/
/*
    Function
*/
var injectScript = function(script) {
    var s = document.createElement('script');
    s.src = chrome.extension.getURL(script);
    (document.head||document.documentElement).appendChild(s);
    s.onload = function() {
        s.parentNode.removeChild(s);
    };
}
/*
    Web execute
*/

$(document).ready(function() {
    var url = window.location.host;
    if(url === 'www.faceit.com') {
        injectScript('js/inject.js');
        $('[ng-if="version"] small').attr("class", "helperDebug").append(',HELPER v <strong>' + chrome.runtime.getManifest().version + '</strong>');
    } else if(url === 'www.poheart.net') {
        injectScript('js/webmodule.js')

        $('.helper-version').text(chrome.runtime.getManifest().version);
    }
});

document.addEventListener('FH_getMapsPreference', function(e) {
	chrome.storage.local.get('lstMapOrder', function(items) {
        document.dispatchEvent(new CustomEvent('FH_returnMapsPreference', {
	        detail:  { arrayMapOrder : items.lstMapOrder }
    	}));
    });
});

chrome.storage.sync.get({
    blacklist_enable: false,
    blacklist_textarea: '' 
}, function(items) {
    localStorage.bBlackList = items.blacklist_enable;
    localStorage.BlackList = items.blacklist_textarea;
});

document.addEventListener('FH_copyServerIP', function(e) {
    copyToClipboard(e.detail.serverIP);
});

document.addEventListener('FH_acceptMatch', function() {
    chrome.runtime.sendMessage(
        {method:"accept-match"}
    );
});


document.addEventListener('FH_closeWindow', function() {
    chrome.runtime.sendMessage(
        {method:"closeWindow"}
    );
});
document.addEventListener('FH_request', function(e) {
    chrome.runtime.sendMessage(
        {method: "openpage", detail: e.detail.match}
    );
});
document.addEventListener('FH_sendMatchData', function(e) {
    chrome.runtime.sendMessage(
        {
            method: "sendMatchData", 
            detail: { 
                joinedplayers: e.detail.joined_players, 
                checkedinplayers: e.detail.checkedin_players,
                timeRemaining: e.detail.timeRemaining,
                currentState: e.detail.currentState,
                userid: e.detail.userid
            }
        }
    );
});


var copyToClipboard = function( text ){
    var copyDiv = document.createElement('div');
    copyDiv.contentEditable = true;
    document.body.appendChild(copyDiv);
    copyDiv.innerText = text;
    copyDiv.unselectable = "off";
    copyDiv.focus();
    document.execCommand('SelectAll');
    document.execCommand("Copy", false, null);
    document.body.removeChild(copyDiv);
}
