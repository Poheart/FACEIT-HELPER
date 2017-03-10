$('.not-installed').addClass("hidden");
$('.installed').removeClass("hidden");
$('.accept-match').click(function() {
  	document.dispatchEvent(new CustomEvent('FH_acceptMatch'));
});
$('.close-windows').click(function() {
  	document.dispatchEvent(new CustomEvent('FH_closeWindow'));
});