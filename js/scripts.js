/**
	* 
	* m@rtlin, 28.7.2017
	*/

var oic = {};

var SVG_SIZE = 100;
///////////////////////////////////////////////////////////////////////////////
oic.begin = function() {
	this.changeZoom();

	var img = this.inferFromUrl('img');
	//console.log("image: " + img);

	if (img) {
		var imgInput = document.getElementById('input-url');
		imgInput.value = img;
		this.loadInputImage();
	}
}


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
	this.performCrop();
	this.performRound();
	this.setupImage();
	return this.generateOutput();
	
}

oic.setupImage = function() {
	var imgInput = document.getElementById('input-image');
	var imgOutput = document.getElementById('output-image');

	var cropped = document.getElementById('image-to-crop');	

	var imageSrc = imgInput.src;
	cropped.setAttribute('xlink:href', imageSrc);
}

oic.generateOutput = function() {
	//TODO
	return "im://ag.e";
}

///////////////////////////////////////////////////////////////////////////////



oic.performCrop = function() {
	var inputCropTop = document.getElementById('input-crop-top');
	var inputCropBottom = document.getElementById('input-crop-bottom');
	var inputCropLeft = document.getElementById('input-crop-left');
	var inputCropRight = document.getElementById('input-crop-right');
	

	var cropTop = parseInt(inputCropTop.value);
	var cropBottom = parseInt(inputCropBottom.value);
	var cropLeft = parseInt(inputCropLeft.value);
	var cropRight = parseInt(inputCropRight.value);

	if (cropTop >= cropBottom) {
		console.warn("T-B: " + cropTop + " - " + cropBottom);
		return;
	}

	if (cropLeft >= cropRight) {
		console.warn("L-R: " + cropLeft + " - " + cropRight);
		return;
	}

	this.setCrop(cropTop, cropBottom, cropLeft, cropRight);
}

oic.performRound = function() {
	var inputRoundCorners = document.getElementById('input-round-corners');
	
	var roundCorners = parseInt(inputRoundCorners.value) / 2;

	this.setRound(roundCorners);
}
///////////////////////////////////////////////////////////////////////////////

oic.setCrop = function(cropTop, cropBottom, cropLeft, cropRight) {
	console.log('Cropping  t' + cropTop + ",  b" + cropBottom + ",  l" + cropLeft + ",  r" + cropRight);
	var cropper = document.getElementById('total-crop-rect');

	cropper.setAttribute('y', cropTop);
	cropper.setAttribute('height', cropBottom - cropTop);
	cropper.setAttribute('x', cropLeft);
	cropper.setAttribute('width', cropRight - cropLeft);
}

oic.setRound = function(roundCorners) {
	console.log('Rounding r' + roundCorners);

	var cropper = document.getElementById('total-crop-rect');

	cropper.setAttribute('rx', roundCorners);
	cropper.setAttribute('ry', roundCorners);
}
	
///////////////////////////////////////////////////////////////////////////////

oic.inferFromUrl = function(key) {
	var query = location.search;
	var tuples = query.split(/[&?]/);
	//console.log(tuples);

	for (var i = 0; i < tuples.length; i++) {
		var tuple = tuples[i];
		var parts = tuple.split('=');

		if (parts[0] == key) {
			return parts[1];
		}
	}

	return null;
}
