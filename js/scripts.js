/**
	* 
	* m@rtlin, 28.7.2017
	*/

var oic = {};

var SVG_SIZE = 400;
///////////////////////////////////////////////////////////////////////////////
oic.begin = function() {
	this.initializeForm();
	this.initializeSvg();

	var img = this.inferFromUrl('img');
	//console.log("image: " + img);

	if (img) {
		var imgInput = document.getElementById('input-url');
		imgInput.value = img;
		this.loadInputImage();
	}
}

oic.initializeForm = function() {
	var inputCropTop = document.getElementById('input-crop-top');
	var inputCropBot = document.getElementById('input-crop-bottom');
	var inputCropLeft = document.getElementById('input-crop-left');
	var inputCropRight = document.getElementById('input-crop-right');

	var inputRoundCorners = document.getElementById('input-round-corners');
	
	inputCropTop.max = SVG_SIZE;
	inputCropBot.max = SVG_SIZE;
	inputCropBot.value = SVG_SIZE;

	inputCropLeft.max = SVG_SIZE;
	inputCropRight.max = SVG_SIZE;
	inputCropRight.value = SVG_SIZE;

	inputRoundCorners.max = SVG_SIZE / 2;
}


oic.initializeSvg = function() {
	var svg = document.getElementById('svg-elem');

	svg.setAttribute('width', SVG_SIZE);
	svg.setAttribute('height', SVG_SIZE);

	var rect = document.getElementById('total-crop-rect');

	rect.setAttribute('width', SVG_SIZE);
	rect.setAttribute('height', SVG_SIZE);

	var img = document.getElementById('image-to-crop');

	img.setAttribute('width', SVG_SIZE);
	img.setAttribute('height', SVG_SIZE);
}
	
oic.loadInputImage = function() {
	var urlInput = document.getElementById('input-url');
	var url = urlInput.value;

	console.info("Image loading");

	var img = new Image();
	img.onload = function() {
		console.info("Image loaded.");
	};

	img.src = url;

	var toCrop = document.getElementById('image-to-crop');
	toCrop.setAttribute('xlink:href', url);
	
	this.formToSvg();
}

///////////////////////////////////////////////////////////////////////////////
oic.formToSvg = function() {
	var spec = this.formToSpec();
	this.specToSvg(spec);
}

oic.spocToSvgAndForm = function(spec) {
	this.specToForm(spec);
	this.specToSvg(spec);
}


///////////////////////////////////////////////////////////////////////////////
oic.formToSpec = function() {
	var crop = this.formToCrop();
	var round = this.formToRound();

	return { 'crop': crop, 'round': round };
}

oic.formToCrop = function() {
	var inputCropTop = document.getElementById('input-crop-top');
	var inputCropBot = document.getElementById('input-crop-bottom');
	var inputCropLeft = document.getElementById('input-crop-left');
	var inputCropRight = document.getElementById('input-crop-right');
	
	var cropTop = parseInt(inputCropTop.value);
	var cropBot = parseInt(inputCropBot.value);
	var cropLeft = parseInt(inputCropLeft.value);
	var cropRight = parseInt(inputCropRight.value);

	if (cropTop >= cropBot) {
		console.warn("T-B: " + cropTop + " - " + cropBot);
		return null;
	}

	if (cropLeft >= cropRight) {
		console.warn("L-R: " + cropLeft + " - " + cropRight);
		return null;
	}

	return { 'top': cropTop, 'bot': cropBot, 'left': cropLeft, 'right': cropRight };
}

oic.formToRound = function() {
	var inputRoundCorners = document.getElementById('input-round-corners');
	
	var roundCorners = parseInt(inputRoundCorners.value);

	return { 'round': roundCorners };
}

///////////////////////////////////////////////////////////////////////////////
oic.specToForm = function(spec) {
	if (spec.crop) {
		this.cropToForm(spec.crop);
	}

	if (spec.round) {
		this.roundToForm(spec.round);
	}
}

oic.cropToForm = function(crop) {
	var inputCropTop = document.getElementById('input-crop-top');
	var inputCropBot = document.getElementById('input-crop-bottom');
	var inputCropLeft = document.getElementById('input-crop-left');
	var inputCropRight = document.getElementById('input-crop-right');
	
	inputCropTop.value = crop.top;
	inputCropBot.value = crop.bot;
	inputCropLeft.value = crop.left;
	inputCropRight.value = crop.right;
}

oic.roundToForm = function(round) {
	var inputRoundCorners = document.getElementById('input-round-corners');
	
	inputRoundCorners.value = round.round;
}

///////////////////////////////////////////////////////////////////////////////
oic.specToSvg = function(spec) {
	if (spec.crop) {
		this.cropToSvg(spec.crop);
	}

	if (spec.round) {
		this.roundToSvg(spec.round);
	}

	this.updateOutlink();
}

oic.cropToSvg = function(crop) {
	var cropper = document.getElementById('total-crop-rect');

	cropper.setAttribute('y', crop.top);
	cropper.setAttribute('height', crop.bot - crop.top);
	cropper.setAttribute('x', crop.left);
	cropper.setAttribute('width', crop.right - crop.left);
}


oic.roundToSvg = function(round) {
	var cropper = document.getElementById('total-crop-rect');

	cropper.setAttribute('rx', round.round);
	cropper.setAttribute('ry', round.round);
}
	
///////////////////////////////////////////////////////////////////////////////
oic.specToFormAndSvg = function(spec) {
	this.specToForm(spec);
	this.specToSvg(spec);
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


oic.updateOutlink = function() {
	var svg = document.getElementById('svg-elem');
	var outlinkInput = document.getElementById('output-url');

	var serializer = new XMLSerializer();                                                                                                
	var xml = serializer.serializeToString(svg);
		
	var url = "data:image/svg+xml;base64," + btoa(xml);
	outlinkInput.value = url;
}


///////////////////////////////////////////////////////////////////////////////

oic.toSquare = function(size) {
	this.cropToSquare(size);
}

oic.toCircle = function(size) {
	this.roundToCircle(size);
}

oic.cropToSquare = function(size) {
	var less = SVG_SIZE * (size / 2);
	var least  = SVG_SIZE * (1 - (size / 2));

	var crop = { 'top': less, 'bot': least, 'left': less, 'right': least };
	var spec = { 'crop': crop, 'round': null };

	this.specToFormAndSvg(spec);
}

oic.roundToCircle = function(size) {
	var rad = (SVG_SIZE / 2) * size;

	var round = { 'round': rad };
	var spec = { 'spec': null, 'round': round };
	
	this.specToFormAndSvg(spec);
}
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////






/*
oic.update = function() {
	this.performCrop();
	this.performRound();
	this.setupImage();
	return this.generateOutput();
	
}

oic.setupImage = function() {
	//var cropped = document.getElementById('image-to-crop');	
	//cropped.setAttribute('xlink:href', imageSrc);
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

*/
