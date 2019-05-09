	
	/*------------------------------------------------------------------------------------
		Webberly v1.0 JS code was written by Tobi Makinde(4relic Limited)
		Feel free to use it for your web/app projects but kindly
		leave this credit comment for legal purposes, if you intend to
		use it for commercial purposes kindly send an email to tob_kerly4life@yahoo.ca or 
		geeklucas01@gmail.com for necessary negotiations.
	-------------------------------------------------------------------------------------*/

var wby = {
	webberly : null,//Property to store the target element object
	requestDir : '',
	/*
	* This configuration preset setting assumes that webberly folder is placed on the home directory of your web/app, 
	* change this setting to the absolute path of webberly folder e.g https://www.4relic.com/webberly/ or to the 
	* relative path in reference to the target page e.g webberly/ , plugin/webberly/
	*/
	useJSOnly : true,//Set to false if you prefer images to load from php script
	wbyHeight : 400,//Height of the gallery viewer
	wbyImageReel : null,//Property to store the image reel object
	wbyReelWidth : null,//Property to store width of the image reel
	reelEndposition : null,//Property to store the end position of the image reel
	wbyImg : '',//Property to store the html of the images
	wbyThumb : '',//Property to store the html of the thumbnails
	wbyOverlay : null,//Property to store expanded image dark overlay div object
	reelAnimateStep : null,//Property to store the step for the scroll effect of the image reel
	setIntervalVar : null,//Property to store the setInterval object for the animated scroll effect of image reel 
	setTimeoutVar : null,//Property to store the XMLHttpRequest setTimeout object
	goToPosition : null,//Property to store reel position of selected image
	eventCache : null,//Property to cache touch event
	pointerPosX : null,//Property to store horizontal pointer or touch position
	pointerPosY : null,//Property to store vertical touch position to determine if we will prevent touchstart and touchmove default events based on the vertical and horizontal movement variation 
	touch : false,//Property set to true if the image reel is held with mouse or touch
	touchDown : false,//Property set to true if the image reel is held with touch
	allowDefault : null,//Property that stores the state of the touchmove event to determine if we will prevent the default touchmove listener based on the vertical and horizontal touch movements after the touchstart event[ = null(if the touchmove event has not been fired after the touchstart event); = 1(if the touchmove is more vertical); = 2(if the touchmove is more horizontal)
	currTagNumber : 1,//Property to store the serial number of current image
	thumbSize : 70,//Property to store the value for the width and height of the thumbnails
	thumbReelWidth : null,//Property to store width of the thumbnail reel
	wbyThumbReel : null,//Property to store the thumbnail reel object
	goToPositionThumbReel : null,//Property to store the position of the current viewable area of the thumbnail reel
	reelAnimateStepThumbReel : null,//Property to store the step for the scroll effect of the thumbnail reel
	setIntervalVarThumbReel : null,//Property to store the setInterval object for the animated scroll effect of the thumbnail reel
	xmlHttp : null,//Property to store the XMLHttpRequest object
	init : function(){
		//This method initialises webberly image gallery on page load
		wby.webberly = document.getElementById('webberly');
		if(wby.webberly && typeof wbyArray !== 'undefined'){
			wby.wbyReelWidth = wby.webberly.offsetWidth * wbyArray.length;
			wby.reelEndposition = 0 - wby.webberly.offsetWidth * (wbyArray.length - 1);
			wby.webberly.style.height = wby.wbyHeight+'px';
			wby.thumbReelWidth = wby.thumbSize * wbyArray.length;
			for(var i = 0;i < wbyArray.length;i++){
				var tagNumber = i + 1;var reelPosition = 0 - (i * wby.webberly.offsetWidth);
				wbyArray[i][3] = reelPosition;
				var thumbPreview = new Image();
				thumbPreview.src = wbyArray[i][1];
				wby.wbyImg += '<div id="webberly-image-parent-'+tagNumber+'" class="wby-main-image-frame" style="width:'+wby.webberly.offsetWidth+'px;height:'+wby.wbyHeight+'px;"></div>';
				wby.wbyThumb += '<div class="wby-thumbnail-frame wby-responsive-width"><a id="webberly-thumb-'+tagNumber+'" href="javascript:void(0);" onclick="wby.selectImage('+tagNumber+')"><img src="'+wbyArray[i][1]+'" alt="'+wbyArray[i][2]+'"></a></div>';
			}
			wby.webberly.innerHTML = '<div class="wby-gallery-frame" style="height:'+wby.wbyHeight+'px"><div class="wby-alt"><i class="icon-images"></i><span id="webberly-alt">'+wbyArray.length+'</span></div><a href="javascript:void(0);" class="wby-gallery-tools" onclick="wby.enlargeView()"><i  class="icon-enlarge2"></i></a><div id="webberly-image-reel" class="wby-main-image-reel" style="width:'+wby.wbyReelWidth+'px;height:'+wby.wbyHeight+'px;left:0px;">'+wby.wbyImg+'</div><div id="webberly-thumbnail-reel-frame" class="wby-thumbnail-reel-frame"><div id="webberly-thumbnail-reel" class="wby-thumbnail-reel" style="width:'+wby.thumbReelWidth+'px;left:0px;">'+wby.wbyThumb+'</div><a href="javascript:void(0);" onclick="wby.scrollThumbReel(\'left\');" id="webberly-thumb-left" class="wby-nav-btn" style="left:0px;display:none;"><i class="icon-arrow-left"></i></a><a href="javascript:void(0);" onclick="wby.scrollThumbReel(\'right\');" id="webberly-thumb-right" class="wby-nav-btn" style="right:0px;display:none;"><i class="icon-arrow-right"></i></a></div></div>';
			/*This method was used to ensure that no parentNode styles affects the overlay
			*Overlay was appended to the body
			*/
			wby.wbyOverlay = document.createElement('div');
			wby.wbyOverlay.setAttribute('id', 'webberly-overlay');
			wby.wbyOverlay.setAttribute('align', 'center');
			wby.wbyOverlay.setAttribute('class', 'wby-overlay');
			wby.wbyOverlay.setAttribute('style', 'display:none;');
			wby.wbyOverlay.innerHTML = '<a href="javascript:void(0);" class="wby-gallery-tools" onclick="this.parentNode.style.display=\'none\'"><i  class="icon-shrink2"></i></a>';
			document.body.appendChild(wby.wbyOverlay);
			wby.wbyImageReel = document.getElementById('webberly-image-reel');
			wby.wbyThumbReel = document.getElementById('webberly-thumbnail-reel');
			wby.scaleThumbnails();
			wby.toggleThumbNav();
			wby.selectImage(wby.currTagNumber);
			/*Adding event handlers needed*/
			wby.addEventHandler(window, 'resize', wby.wbyResize);
			wby.addEventHandler(window, 'touchmove', wby.moveReel);
			wby.addEventHandler(window, 'mousemove', wby.moveReel);
			wby.addEventHandler(window, 'touchend', wby.releaseReel);
			wby.addEventHandler(window, 'mouseup', wby.releaseReel);
			wby.addEventHandler(wby.wbyImageReel, 'touchstart', wby.touchReel);
			wby.addEventHandler(wby.wbyImageReel, 'mousedown', wby.holdReel);
		}
	},
	
	addEventHandler : function(obj, evt, handler){
		/*This method was written thanks to 
		*JS written by Esau Silver(Codepen) 
		*drag and drop image file preview
		*/
		if (obj.addEventListener){
			// W3C method
			obj.addEventListener(evt, handler, false);
		}else if(obj.attachEvent) {
			// IE method.
			obj.attachEvent('on' + evt, handler);
		}else {
			// Old school method.
			obj['on' + evt] = handler;
		}
	},
	
	toggleThumbNav : function(){
		var wbyThumbReelFrame = document.getElementById('webberly-thumbnail-reel-frame');
		var webberlyThumbLeft = document.getElementById('webberly-thumb-left');
		var webberlyThumbRight = document.getElementById('webberly-thumb-right');
		if(parseFloat(this.wbyThumbReel.offsetWidth) > parseFloat(wbyThumbReelFrame.offsetWidth)){
			var wbyOverflow = 0 - (parseFloat(this.wbyThumbReel.offsetWidth) - parseFloat(wbyThumbReelFrame.offsetWidth));
			if(this.wbyThumbReel.style.left.replace('px','') < 0){
				webberlyThumbLeft.style.display = '';
			}else{
				webberlyThumbLeft.style.display = 'none';
			}
			if(this.wbyThumbReel.style.left.replace('px','') > wbyOverflow){
				webberlyThumbRight.style.display = '';
			}else{
				webberlyThumbRight.style.display = 'none';
			}
		}else{
			webberlyThumbLeft.style.display = 'none';
			webberlyThumbRight.style.display = 'none';
			
			this.wbyThumbReel.style.left = '0px';
		}
		
		var realBound = 0 - (parseFloat(this.wbyThumbReel.offsetWidth) - parseFloat(wbyThumbReelFrame.offsetWidth));
		var wbyThumbReelPos = this.wbyThumbReel.style.left.replace('px','');
		if(wbyThumbReelPos < realBound && realBound <= 0){
			this.wbyThumbReel.style.left = realBound+'px';
		}
		if(wbyThumbReelPos > 0){
			this.wbyThumbReel.style.left = '0px';
		}
	},

	wbyResize : function(){
		wby.wbyReelWidth = wby.webberly.offsetWidth * wbyArray.length;
		wby.reelEndposition = 0 - wby.webberly.offsetWidth * (wbyArray.length - 1);
		wby.wbyImageReel.style.width = wby.wbyReelWidth+'px';
		for(var i = 0;i < wbyArray.length;i++){
			var tagNumber = i + 1;var reelPosition = 0 - (i * wby.webberly.offsetWidth);
			wbyArray[i][3] = reelPosition;
			var imageFrame = document.getElementById('webberly-image-parent-'+tagNumber);
			imageFrame.style.width = wby.webberly.offsetWidth+'px';
			var wbyThumbImage = document.getElementById('webberly-thumb-'+tagNumber);
			wbyThumbImage.setAttribute('onclick', 'wby.selectImage('+tagNumber+')');
			var imageObj = document.getElementById('webberly-image-'+tagNumber);
			if(imageObj){
				var imageObjResRatio = imageObj.width / imageObj.height;
				if(imageObj.width >= imageObj.height){
					var newImageWidth = parseInt(imageFrame.offsetWidth);
					var newImageHeight = parseInt(newImageWidth / imageObjResRatio);
					if(newImageHeight > imageFrame.offsetHeight){
						newImageHeight = parseInt(newImageHeight - (newImageHeight - imageFrame.offsetHeight));
						newImageWidth = parseInt(newImageHeight * imageObjResRatio);
					}
				}else{
					var newImageHeight = parseInt(imageFrame.offsetHeight);
					var newImageWidth = parseInt(newImageHeight * imageObjResRatio);
					if(newImageWidth > imageFrame.offsetWidth){
						newImageWidth = parseInt(newImageWidth - (newImageWidth - imageFrame.offsetWidth));
						newImageHeight = parseInt(newImageWidth / imageObjResRatio);
					} 
				}
				imageObj.width = newImageWidth;
				imageObj.height = newImageHeight;
			}
		}
		wby.toggleThumbNav();
		if(wby.currTagNumber != ''){
			wby.selectImage(wby.currTagNumber);
		}
		if(wby.wbyOverlay.style.display == ''){
			wby.enlargeView();
		}
	},
	
	scaleThumbnails : function(){
		var wbyThumbReelImgs = this.wbyThumbReel.getElementsByTagName('img');
		for(var i = 0;i < wbyThumbReelImgs.length;i++){
			wbyThumbReelImgs[i].onload = function(){	
				if(this.naturalWidth < this.naturalHeight){
					this.parentNode.parentNode.setAttribute('class', 'wby-thumbnail-frame wby-responsive-width');
				}else{
					this.parentNode.parentNode.setAttribute('class', 'wby-thumbnail-frame wby-responsive-height');
				}
			}
		}
	},
	
	selectImage : function(tagNumber){
		this.hideError();
		var i = tagNumber - 1;
		this.currTagNumber = tagNumber;
		var webberlyAlt = document.getElementById('webberly-alt');
		webberlyAlt.innerHTML = this.currTagNumber+' of '+wbyArray.length;
		var imgUrl = wbyArray[i][0];
		var position = 0 - (i * this.webberly.offsetWidth);
		var targetImageObj = document.getElementById('webberly-image-'+tagNumber);
		wby.gotoAnimate(position);
		this.highlightThumb(tagNumber);
		if(!targetImageObj){
			if(this.useJSOnly === true){
				this.appendImage(tagNumber);
			}else{
				this.createXmlHttpRequest();
				this.setTimeoutVar = setTimeout(this.stopRequest, 10000);
				if(this.xmlHttp != null) {
					this.xmlHttp.open('GET', this.requestDir+'webberly.php?url='+encodeURIComponent(imgUrl)+'&tagnumber='+encodeURIComponent(tagNumber), true);
					this.xmlHttp.onreadystatechange = this.handleImageResponse;
					this.xmlHttp.send();
				}
			}
		}
	},
	
	createXmlHttpRequest : function(){
		try{
			this.xmlHttp = new XMLHttpRequest();
		}catch(e){
			this.xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
		}
		if (this.xmlHttp == null){
			console.log('Cant create object!');
		}
	},
	
	handleImageResponse : function() {
		if(this.readyState==4){
			if(this.status==200 || this.status==304) {
				clearTimeout(wby.setTimeoutVar);
				responseXML = this.responseXML;
				if(responseXML){
					var image = responseXML.getElementsByTagName('imageData');
					var tagNumber = responseXML.getElementsByTagName('tagnumber');
					if(image.length > 0){
						var imageData = image[0].firstChild.nodeValue;
						tagNumber = tagNumber[0].firstChild.nodeValue;
						wby.appendImage(tagNumber,imageData);
					}
				}else{
					wby.displayError('An error occured, media not found');
				}
			}
		}
	},
	
	appendImage : function(tagNumber,url){
		var imageFrame = document.getElementById('webberly-image-parent-'+tagNumber);
		var img = new Image();
		if(!url){
			img.src = wbyArray[tagNumber-1][0];
		}else{
			img.src = url;
		}
		img.onload = function(){
			var imgResRatio = img.width / img.height;
			if(img.width >= img.height){
				var newImageWidth = parseInt(imageFrame.offsetWidth);
				var newImageHeight = parseInt(newImageWidth / imgResRatio);
				if(newImageHeight > imageFrame.offsetHeight){
					newImageHeight = parseInt(newImageHeight - (newImageHeight - imageFrame.offsetHeight));
					newImageWidth = parseInt(newImageHeight * imgResRatio);
				}
			}else{
				var newImageHeight = parseInt(imageFrame.offsetHeight);
				var newImageWidth = parseInt(newImageHeight * imgResRatio);
				if(newImageWidth > imageFrame.offsetWidth){
					newImageWidth = parseInt(newImageWidth - (newImageWidth - imageFrame.offsetWidth));
					newImageHeight = parseInt(newImageWidth / imgResRatio);
				} 
			}
			img.width = newImageWidth;
			img.height = newImageHeight;
			img.setAttribute('id', 'webberly-image-'+tagNumber);
			imageFrame.appendChild(img);
		}
	},

	stopRequest : function(){
		if(wby.xmlHttp.readyState!=4 || (wby.xmlHttp.status!=200 && wby.xmlHttp.status!=304)){
			wby.xmlHttp.abort();
			//hideLoader();
			wby.displayError('No Internet connection');
		}
	},

	displayError : function(errMsg){
		var errorObj = document.getElementById('webberly-error');
		if(errorObj){
			errorObj.innerHTML = '<i class="icon-notification"></i>&nbsp;'+errMsg;
			errorObj.style.display = '';
		}else{
			errorObj = document.createElement('div');
			errorObj.setAttribute('id', 'webberly-error');
			errorObj.setAttribute('class', 'wby-error');
			errorObj.innerHTML = '<i class="icon-notification"></i>&nbsp;'+errMsg;
			this.webberly.childNodes[0].appendChild(errorObj);
		}
	},

	hideError : function(){
		var errorObj = document.getElementById('webberly-error');
		if(errorObj){
			errorObj.style.display = 'none';
		}
		clearTimeout(this.setTimeoutVar);
	},

	highlightThumb : function(tagNumber){
		var thumbObjs = this.wbyThumbReel.getElementsByTagName('img');
		if(thumbObjs.length > 0){
			for(var i = 0;i < thumbObjs.length;i++){
				thumbObjs[i].style.opacity = '';
			}
		}
		var thumbObjParent = document.getElementById('webberly-thumb-'+tagNumber);
		var thumbObj = thumbObjParent.getElementsByTagName('img');
		if(thumbObj.length > 0){
			thumbObj[0].style.opacity = 1;
		}
	},

	enlargeView : function(){
		var img = document.getElementById('webberly-image-'+this.currTagNumber);
		if(img){
			if(this.wbyOverlay.childNodes.length > 1){
				this.wbyOverlay.removeChild(this.wbyOverlay.childNodes[1]);
			}
			this.wbyOverlay.style.display = '';
			var newImg = new Image();
			newImg.src = img.src;
			/** This was replaced by css max-width property in webberly.css **
			if(newImg.naturalWidth > this.wbyOverlay.offsetWidth){
				newImg.style.width = '98%';
				newImg.style.height = 'auto';
			}*/
			newImg.onload = function(){
				wby.wbyOverlay.appendChild(newImg);
			}
		}
	},

	gotoAnimate : function(newPos){
		if(this.setIntervalVar != null){
			clearInterval(this.setIntervalVar);
		}
		var wbyImageReelPos = this.wbyImageReel.style.left.replace('px', '');
		var diff = parseFloat(wbyImageReelPos) - parseFloat(newPos);
		diff = Math.abs(diff);
		this.reelAnimateStep = diff/10;
		this.goToPosition = newPos;
		this.setIntervalVar = setInterval(this._gotoAnimate,5);
	},

	_gotoAnimate : function(){
		var wbyImageReelPos = wby.wbyImageReel.style.left.replace('px', '');
		var curDiff = parseFloat(wbyImageReelPos) - parseFloat(wby.goToPosition);
		curDiff = Math.abs(curDiff);
		if(parseFloat(wby.reelAnimateStep) >= curDiff){
			wby.wbyImageReel.style.left = parseFloat(wby.goToPosition)+'px';
			clearInterval(wby.setIntervalVar);
		}else{
			if(parseFloat(wbyImageReelPos) > parseFloat(wby.goToPosition)){
				var currentPos = parseFloat(wbyImageReelPos) - parseFloat(wby.reelAnimateStep);
			}else if(parseFloat(wbyImageReelPos) < parseFloat(wby.goToPosition)){
				var currentPos = parseFloat(wbyImageReelPos) + parseFloat(wby.reelAnimateStep);
			}
			wby.wbyImageReel.style.left = currentPos+'px';
		}
	},

	scrollThumbReel : function(dir){
		if(this.setIntervalVarThumbReel != ''){
			clearInterval(this.setIntervalVarThumbReel);
		}
		var wbyThumbReelFrame = document.getElementById('webberly-thumbnail-reel-frame');
		this.wbyThumbReel = document.getElementById('webberly-thumbnail-reel');
		var bound = parseFloat(this.wbyThumbReel.offsetWidth) - parseFloat(wbyThumbReelFrame.offsetWidth);
		var wbyThumbReelPos = this.wbyThumbReel.style.left.replace('px', '');
		if(dir == 'right'){
			var step = parseFloat(wbyThumbReelPos) - parseFloat(wbyThumbReelFrame.offsetWidth);
		}else{
			var step = parseFloat(wbyThumbReelPos) + parseFloat(wbyThumbReelFrame.offsetWidth);
		}
		var realBound = 0 - bound;
		if(step > realBound && step < 0){
			this.goToPositionThumbReel = step;
		}else{
			if(step <= realBound){
				this.goToPositionThumbReel = realBound;
			}else{
				this.goToPositionThumbReel = 0;
			}
		}
		var diff = parseFloat(wbyThumbReelPos) - parseFloat(this.goToPositionThumbReel);
		diff = Math.abs(diff);
		this.reelAnimateStepThumbReel = diff/10;
		this.setIntervalVarThumbReel = setInterval(this._gotoAnimateThumbReel,10);
	},

	_gotoAnimateThumbReel : function(){
		wby.wbyThumbReel = document.getElementById('webberly-thumbnail-reel');
		var wbyThumbReelPos = wby.wbyThumbReel.style.left.replace('px', '');
		var curDiff = parseFloat(wbyThumbReelPos) - parseFloat(wby.goToPositionThumbReel);
		curDiff = Math.abs(curDiff);
		if(parseFloat(wby.reelAnimateStepThumbReel) >= curDiff){
			wby.wbyThumbReel.style.left = parseFloat(wby.goToPositionThumbReel)+'px';
			clearInterval(wby.setIntervalVarThumbReel);
		}else{
			if(parseFloat(wbyThumbReelPos) > parseFloat(wby.goToPositionThumbReel)){
				var currentPos = parseFloat(wbyThumbReelPos) - parseFloat(wby.reelAnimateStepThumbReel);
			}else if(parseFloat(wbyThumbReelPos) < parseFloat(wby.goToPositionThumbReel)){
				var currentPos = parseFloat(wbyThumbReelPos) + parseFloat(wby.reelAnimateStepThumbReel);
			}
			wby.wbyThumbReel.style.left = currentPos+'px';
		}
		wby.toggleThumbNav();
	},

	moveReel : function(e){
		if(wby.touchDown === true){
			e = e || window.event;
			if(wby.touch === true){//Check to see whether handler was initiated by touch event in order to assign appropriate pointer position object
				/*Calculate the distance between the previous and current touch position*/
				var pointerMovX = wby.pointerPosX - e.changedTouches[0].clientX;
				var pointerMovY = wby.pointerPosY - e.changedTouches[0].clientY;
				/*Save the current position*/
				wby.pointerPosX = e.changedTouches[0].clientX;
				wby.pointerPosY = e.changedTouches[0].clientY;
				if(Math.abs(pointerMovY) > Math.abs(pointerMovX)){
					if(wby.allowDefault == null){
						wby.allowDefault = 1;
					}
				}else{
					if(wby.allowDefault == null){
						wby.allowDefault = 2;
						wby.eventCache.preventDefault();
						e.preventDefault();
					}
				}
			}else{
				e.preventDefault();
				/*Calculate the distance between the previous and current pointer position*/
				var pointerMovX = wby.pointerPosX - e.clientX;
				/*Save the current position*/
				wby.pointerPosX = e.clientX;
			}
			/*Calculate the new image reel coordinates from the left of the positioned parent container*/
			var reelPosition = parseFloat(wby.wbyImageReel.style.left.replace('px', '')) - pointerMovX;//Left
			
			
			/*Restrict image reel movement to image viewer bounds*/
			if(reelPosition <= 0 && reelPosition >= wby.reelEndposition && (wby.allowDefault == null || wby.allowDefault == 2)){	
				wby.wbyImageReel.style.left = reelPosition+'px';//Set css left property of the image reel
			}
		}
	},
	
	holdReel : function(e){
		e = e || window.event;
		e.preventDefault();
		wby.pointerPosX = e.clientX;
		wby.touchDown = true;
		wby.wbyImageReel.style.cursor = 'grab';
	},
	
	touchReel : function(e){
		e = e || window.event;
		wby.eventCache = e;
		wby.pointerPosX = e.touches[0].clientX;
		wby.pointerPosY = e.touches[0].clientY;
		wby.touchDown = true;
		wby.touch = true;
	},
	
	releaseReel : function(){
		wby.touch = false;
		wby.allowDefault = null;
		wby.wbyImageReel.style.cursor = 'default';
		if(wby.touchDown === true){
			wby.releaseGoTo();
			wby.touchDown = false;
		}
	},
	
	releaseGoTo : function(){
		var wbyMidPoint = this.webberly.offsetWidth/2;
		var wbyImageReelPos = this.wbyImageReel.style.left.replace('px', '');
		for(var i = 0;i < wbyArray.length;i++){
			var distance = parseFloat(wbyImageReelPos) - wbyArray[i][3];
			distance = Math.abs(distance);
			if(distance <= wbyMidPoint){
				var tagNumber = i + 1;
				this.selectImage(tagNumber);
				return;
			}
		}
		
	}
};
wby.addEventHandler(window,'load',wby.init);