$(function(){
    chrome.storage.local.get('lstMapOrder', function(items) {
        if(items.lstMapOrder) {
			lstMapOrder = items.lstMapOrder;
        } else {
			lstMapOrder = "de_dust2>de_cache>de_mirage>de_nuke>de_cbble>de_inferno>de_train>de_overpass>";
		}
		var arrayMapOrder = lstMapOrder.split(">");
		for(i=0;i < arrayMapOrder.length - 1;i++) {
			$('#maps').append('<li id="list_'+arrayMapOrder[i]+'"><div class="items">' + arrayMapOrder[i] + '</div></li>');
		}
		dragula([document.querySelector('#maps')]).on('out', function(){
			var mapOrder = "";
			for (var i=0;i<$("#maps li").length;i++) {
				mapOrder = mapOrder + $("#maps li").eq(i).text() + ">";
			}

			chrome.storage.local.set({'lstMapOrder': mapOrder});

			$('#state').html('<span class="text-success"><strong>Setting saved!</strong></span>');
			setTimeout(function() {
				$('#state').empty();
			}, 2500);
		});
    });

    var manifest = chrome.runtime.getManifest();
    $('#title').html("<strong>FACEIT HELPER v" + manifest.version + "</strong> - Auto map-veto preferences <sup>BETA</sup>");
});
