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
	var manifest = chrome.runtime.getManifest();
    injectScript('inject.js');
     $('[ng-if="version"] small').attr("id", "helperDebug").append('<br>HELPER v <strong>' + manifest.version + '</strong>');
});

document.addEventListener('FH_getMapsPreference', function(e) {
	chrome.storage.local.get('lstMapOrder', function(items) {
        document.dispatchEvent(new CustomEvent('FH_returnMapsPreference', {
	        detail:  { arrayMapOrder : items.lstMapOrder }
    	}));
    });
});

document.addEventListener('FH_copyServerIP', function(e) {
    copyToClipboard(e.detail.serverIP);
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
