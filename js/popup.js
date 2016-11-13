$(function(){
    chrome.storage.local.get('lstMapOrder', function(items) {
        if(items.lstMapOrder) {
			lstMapOrder = items.lstMapOrder;
        } else {
			lstMapOrder = "de_dust2>de_cache>de_mirage>de_nuke>de_cbble>de_inferno>de_train>de_overpass>";
		}
		var arrayMapOrder = lstMapOrder.split(">");
		for(i=0;i < arrayMapOrder.length - 1;i++) {
            // Is this an error or are faceit weird?
            var mapImgName = arrayMapOrder[i] == "de_cbble" ? "de_cbbl" : arrayMapOrder[i];
			$('#maps').append('<li id="list_'+arrayMapOrder[i]+'"><div class="items" style="background:url(https://s3.amazonaws.com/faceit-frontend-prod/stats_assets/csgo/maps/110x55/csgo-votable-maps-'+mapImgName+'-110x55.jpg) no-repeat;background-size:contain;background-position:right 0px top;">' + arrayMapOrder[i] + '</div></li>');
		}
		dragula([document.querySelector('#maps')]).on('out', function(){
			var mapOrder = "";
			for (var i=0;i<$("#maps li").length;i++) {
				mapOrder = mapOrder + $("#maps li").eq(i).text() + ">";
			}

			chrome.storage.local.set({'lstMapOrder': mapOrder});

			$('.status').html($('<strong>').text("Setting saved!"));
            $('.title').hide();
            $('.status').show();
			setTimeout(function() {
                $('.status').hide();
                $('.title').show();
				$('.status').empty();
			}, 2500);
		});
    });

    var manifest = chrome.runtime.getManifest();
    $('.version').text(manifest.version);
});
