    $(document).ready(function(){
         //chrome.storage.local.clear();
            $('.sortable').nestedSortable({
                handle: 'div',
                items: 'li',
                toleranceElement: '> div',
                disableParentChange: true,
                relocate: OnSortableChange
            });

        chrome.storage.local.get('lstMapOrder', function(items) {
            if(items.lstMapOrder) {
                    lstMapOrder = items.lstMapOrder;
                    var arrayMapOrder = lstMapOrder.split(">");
                    for(i=0;i < arrayMapOrder.length - 1;i++) {
                        $('.sortable').append('<li id="list_'+arrayMapOrder[i]+'"><div class="items btn btn-default">' + arrayMapOrder[i] + '</div></li>');
                    }
            } else {
                $('.sortable').append('<li id="list_dust2"><div class="items btn btn-default">de_dust2</div></li>'+
                    '<li id="list_cache"><div class="items btn btn-default">de_cache</div></li>'+
                    '<li id="list_mirage"><div class="items btn btn-default">de_mirage</div></li>'+
                    '<li id="list_nuke"><div class="items btn btn-default">de_nuke</div></li>'+
                    '<li id="list_cbble"><div class="items btn btn-default">de_cbble</div></li>'+
                    '<li id="list_inferno"><div class="items btn btn-default">de_inferno</div></li>'+
                    '<li id="list_train"><div class="items btn btn-default">de_train</div></li>'+
                    '<li id="list_overpass"><div class="items btn btn-default">de_overpass</div></li>');


            }

        });
        var manifest = chrome.runtime.getManifest();
        $('#title').html("<strong>FACEIT HELPER v" + manifest.version + "</strong> - Auto map-veto preferences <sup>BETA</sup>");
    });

    function OnSortableChange() {
    	$('#state').html('<span class="text-success"><strong>Setting saved!</strong></span>');
    	OutputToList();

		setTimeout(function() { 
    		$('#state').empty(); 
    	}, 5000);
    }
    function OutputToList() {
    	var arraied = $('.sortable').nestedSortable('toArray', {startDepthCount: 0});
    	var map_order = "";
    	for(i = 1; i < arraied.length; i++) {
    		map_order += "de_" + arraied[i].id + ">";
    	}
    	chrome.storage.local.set({'lstMapOrder': map_order}, function() {
                	//console.log("Map order saved to local storage");
        });
    	$('#toArrayOutput')[0].innerText = map_order;
    }