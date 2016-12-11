var manifest = chrome.runtime.getManifest(); 
var storage = chrome.storage.sync;
$(".navbar-brand").append(manifest.version);

$("#blacklist_box").change(function() {
    if(this.checked) {
        $("#blacklist_textarea").prop('disabled',false);
    } else {
    	$("#blacklist_textarea").prop('disabled',true);
    }
});

function save_options() {
    storage.set({
		blacklist_enable: $('#blacklist_box').is(':checked'),
		blacklist_textarea: $('#blacklist_textarea').val()
    }, function() {
    	console.log("Setting saved!");
    	$('#settingSaved').show();
        setTimeout(function () {
           $('#settingSaved').hide();
        }, 7500);
    });
}

function restore_options() {
	storage.get({
		blacklist_enable: false,
		blacklist_textarea: ''
	}, function(item) {
		$('#blacklist_box').prop('checked', item.blacklist_enable);
		$('#blacklist_textarea').val(item.blacklist_textarea);
		$("#blacklist_textarea").prop('disabled',!item.blacklist_enable);
		document.dispatchEvent(new CustomEvent('FH_getChromeOptions'));
	});
}
document.addEventListener('DOMContentLoaded', restore_options);
$("#save-options").click(save_options);
