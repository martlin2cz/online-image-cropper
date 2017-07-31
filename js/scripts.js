/**
	* 
	* m@rtlin, 28.7.2017
	*/

var oic = {};

var SVG_SIZE = 400;

var DOMURL = window.URL || window.webkitURL || window;
///////////////////////////////////////////////////////////////////////////////
oic.begin = function() {
	this.initializeForm();
	this.initializeSvg();

	var imgStr = this.inferFromUrl('img');
	var specStr = this.inferFromUrl('spec');
	var redirectStr = this.inferFromUrl('redirect');

	if (imgStr) {
		var imgInput = document.getElementById('input-url');
		imgInput.value = imgStr;
		this.loadInputImage();
	}

	if (specStr) {
		var unesc = decodeURI(specStr);
		var spec = JSON.parse(unesc);
		this.specToFormAndSvg(spec);
	}

	if (redirectStr) {
		var urlInput = document.getElementById('output-url');
		var url = urlInput.value;
		location.href = url;
	}
}

oic.initializeForm = function() {
	var inputCropTop = document.getElementById('input-crop-top');
	var inputCropBot = document.getElementById('input-crop-bottom');
	var inputCropLeft = document.getElementById('input-crop-left');
	var inputCropRight = document.getElementById('input-crop-right');

	inputCropTop.max = SVG_SIZE;
	inputCropBot.max = SVG_SIZE;
	inputCropBot.value = SVG_SIZE;

	inputCropLeft.max = SVG_SIZE;
	inputCropRight.max = SVG_SIZE;
	inputCropRight.value = SVG_SIZE;
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
	var oic = this;
	
	var img = new Image();
	img.onload = function() {
		
		var handler = function(data) {
			console.info("Image loaded.");
		
			var toCrop = document.getElementById('image-to-crop');
			toCrop.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', data);
	
			oic.formToSvg();
		};

		oic.imageToDataURL(url, handler);
	};

	img.src = url;
}

///////////////////////////////////////////////////////////////////////////////
oic.formToSvg = function() {
	var spec = this.formToSpec();
	this.specToSvg(spec);
}

oic.specToSvgAndForm = function(spec) {
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
	var svg = document.getElementById('svg-elem');
	var wrapper = document.getElementById('svg-wrapper');
	var cropper = document.getElementById('total-crop-rect');
	var cropped = document.getElementById('image-to-crop');

	wrapper.style.paddingTop = crop.top + "px";
	wrapper.style.paddingLeft = crop.left + "px";
	wrapper.style.paddingBottom = (SVG_SIZE - crop.bot) + "px";
	wrapper.style.paddingRight = (SVG_SIZE - crop.right) + "px";
	
	var height = crop.bot - crop.top;
	var width = crop.right - crop.left;

	svg.setAttribute('height', height);
	svg.setAttribute('width', width);

	cropper.setAttribute('height', height);
	cropper.setAttribute('width', width);
	
	var transformRev = "translate(" + (- crop.left) + ", " + (- crop.top) + ")"; 
	cropped.setAttribute('transform', transformRev);

	var transform = "translate(" + crop.left + ", " + crop.top + ")"; 
	cropper.setAttribute('transform', transform);
}

oic.roundToSvg = function(round) {
	var cropper = document.getElementById('total-crop-rect');

	var rndX = (round.round / 100) * cropper.getAttribute('width');
	var rndY = (round.round / 100) * cropper.getAttribute('height');

	cropper.setAttribute('rx', rndX);
	cropper.setAttribute('ry', rndY);
}
	
///////////////////////////////////////////////////////////////////////////////
oic.specToFormAndSvg = function(spec) {
	this.specToForm(spec);
	this.specToSvg(spec);
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
	var handler = function(url) {			
		var outlinkInput = document.getElementById('output-url');
		outlinkInput.value = url;
	}

	this.generatePNGoutlink(handler);
/*	
	var url = this.generateSVGoutlink();
	var outlinkInput = document.getElementById('output-url');
	outlinkInput.value = url;
*/
}

oic.generateSVGoutlink = function() {
	var svg = document.getElementById('svg-elem');
	var serializer = new XMLSerializer();                                                                                                
	var xml = serializer.serializeToString(svg);
		
//	var url = "data:image/svg+xml," + encodeURIComponent(xml);
//	var url = "data:image/svg+xml;utf8," + xml;
	var url = "data:image/svg+xml;base64," + btoa(xml);

	return url;
}

oic.generatePNGoutlink = function(handler) {
	// based on https://stackoverflow.com/questions/28226677/save-inline-svg-as-jpeg-png-svg
	var svg = document.getElementById('svg-elem');
		

	var data = (new XMLSerializer()).serializeToString(svg);

  var img = new Image();
  var svgBlob = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
  var url = DOMURL.createObjectURL(svgBlob);

	this.imageToDataURL(url, handler);
  }

oic.imageToDataURL =  function(url, handler) {
	var img = new Image();
	img.crossOrigin="anonymous";

	var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  
	img.onload = function () {
    ctx.drawImage(img, 0, 0);
    DOMURL.revokeObjectURL(url);

    var imgURI = canvas.toDataURL('image/png');

		handler(imgURI);  
	};

  img.src = url;

 
}


oic.copyOutlink = function() {
	var outlinkInput = document.getElementById('output-url');

	outlinkInput.focus();
	outlinkInput.setSelectionRange(0, outlinkInput.value.length);

	try {
		document.execCommand('copy');
	} catch (e) {
		console.error("Copy failed: " + e);
	}
}
