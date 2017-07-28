/**
	* 
	* m@rtlin, 28.7.2017
	*/

var oic = {};

///////////////////////////////////////////////////////////////////////////////

oic.changeZoom = function() {
	var zoomInput = document.getElementById('input-zoom');
	var imgInput = document.getElementById('input-image');
	var imgOutput = document.getElementById('output-image');

	var zoom = zoomInput.value;
	//console.log("changing zoom to " + zoom);
	var percent = zoom + "%";

	imgInput.style.width = percent;
	imgOutput.style.width = percent;
}

	
oic.loadInputImage =  function() {
	var urlInput = document.getElementById('input-url');
	var imgInput = document.getElementById('input-image');

	imgInput.src = urlInput.value;
	this.update();
}

///////////////////////////////////////////////////////////////////////////////

oic.update = function() {
	var imgInput = document.getElementById('input-image');
	var imgOutput = document.getElementById('output-image');

	var inputCropTop = document.getElementById('input-crop-top');
	var inputRoundCorners = document.getElementById('input-round-corners');

	var cropTop = inputCropTop.value;
	var roundCorners = inputRoundCorners.value;

	var imageSrc = imgInput.src;
	var newImageSrc = this.cropImage(imageSrc, cropTop, roundCorners);

	imgOutput.src = newImageSrc;
}


///////////////////////////////////////////////////////////////////////////////

oic.cropImage = function(imageSrc, cropTop, roundCorners) {
	//TODO
	return imageSrc;
}
