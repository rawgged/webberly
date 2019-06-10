	
	/*------------------------------------------------------------------------------------
		Webberly v1.0 JS code was written by Tobi Makinde(4relic Limited)
		Feel free to use it for your web/app projects but kindly
		leave this credit comment for legal purposes, if you intend to
		use it for commercial purposes kindly send an email to tob_kerly4life@yahoo.ca or 
		geeklucas01@gmail.com for necessary negotiations.
	-------------------------------------------------------------------------------------*/

var wby = {
	webberly : null,//Property to store the target element object
	requestDir : null,
	/*
	* This configuration preset setting assumes that useJSOnly property is set to true.
	* Otherwise, change this setting to the absolute path of the directory where webberly.php file is located e.g requestDir : 'https://www.4relic.com/webberly/', or to the 
	* path of the directory relative to the target page e.g requestDir : 'webberly/', requestDir : 'plugin/webberly/',
	*/
	useJSOnly : true,//Set to false if you prefer images to load from php script
	wbyHeight : 400,//Height of the gallery viewer
	wbyImageReel : null,//Property to store the image reel object
	wbyReelWidth : null,//Property to store width of the image reel
	reelEndposition : null,//Property to store the end position of the image reel
	wbyImg : '',//Property to store the html of the images
	wbyThumb : '',//Property to store the html of the thumbnails
	wbyOverlay : null,//Property to store expanded image dark overlay div object
	reelAnimateDistance : null,//Property to store the distance between the origin and destination of the image reel
	setTimeoutVar : null,//Property to store the XMLHttpRequest setTimeout object
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
	reelAnimateDistanceThumbReel : null,//Property to store the distance between the origin and destination of the thumbnail reel
	cssTransitionPropertyIsSupported : false,//Property to store the css [vendor prefix] transition property supported by the browser, false if none
	animateStartTime : null,//Property to store the start time of the image reel movement transition
	wbyImageReelStart : null,//Property to store the position of the image reel prior to movement transition
	animateStartTimeThumbReel : null,//Property to store the start time of the thumbnail reel movement transition
	wbyThumbReelStart : null,//Property to store the position of the thumbnail reel prior to movement transition
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
				wby.wbyImg += '<div id="webberly-image-parent-'+tagNumber+'" class="wby-main-image-frame" style="width:'+wby.webberly.offsetWidth+'px;height:'+wby.wbyHeight+'px;"></div>';
				wby.wbyThumb += '<div class="wby-thumbnail-frame wby-responsive-width"><a id="webberly-thumb-'+tagNumber+'" href="javascript:void(0);" onclick="wby.selectImage('+tagNumber+')"><img src="'+wbyArray[i][1]+'" alt="'+wbyArray[i][2]+'"></a></div>';
			}
			wby.webberly.innerHTML = '<div class="wby-gallery-frame" style="height:'+wby.wbyHeight+'px"><div class="wby-alt"><i class="icon-images"></i><span id="webberly-alt">'+wbyArray.length+'</span></div><a href="javascript:void(0);" class="wby-gallery-tools" onclick="wby.enlargeView()"><i  class="icon-enlarge2"></i></a><div id="webberly-image-reel" class="wby-main-image-reel wby-transition" style="width:'+wby.wbyReelWidth+'px;height:'+wby.wbyHeight+'px;left:0px;">'+wby.wbyImg+'</div><div id="webberly-thumbnail-reel-frame" class="wby-thumbnail-reel-frame"><div id="webberly-thumbnail-reel" class="wby-thumbnail-reel wby-transition" style="width:'+wby.thumbReelWidth+'px;left:0px;">'+wby.wbyThumb+'</div><a href="javascript:void(0);" onclick="wby.scrollThumbReel(\'left\');" id="webberly-thumb-left" class="wby-nav-btn" style="left:0px;display:none;"><i class="icon-arrow-left"></i></a><a href="javascript:void(0);" onclick="wby.scrollThumbReel(\'right\');" id="webberly-thumb-right" class="wby-nav-btn" style="right:0px;display:none;"><i class="icon-arrow-right"></i></a></div></div>';
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
			wby.cssTransitionPropertyIsSupported = wby.cssTransitionPropertySupported();
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
		if(this.cssTransitionPropertyIsSupported === false){
			this.wbyImageReelStart = parseFloat(this.wbyImageReel.style.left.replace('px', ''));
			this.animateStartTime = new Date().getTime();
			this.reelAnimateDistance = parseFloat(newPos) - parseFloat(this.wbyImageReelStart);
			this._gotoAnimate();
		}else{
			this.addCssTransition(this.wbyImageReel);
			this.wbyImageReel.style.left = newPos+'px';
		}			
	},
	
	_gotoAnimate : function(){
		var currentTime = new Date().getTime();
		var timeFraction = (currentTime - wby.animateStartTime) / 250;
		timeFraction = timeFraction > 1 ? 1 : timeFraction;
		//Ease-in-out timing function code
		if(timeFraction <= 0.5) {
			timeFraction = (2 * timeFraction) / 2;
		}else{
			timeFraction = (2 - (2 * (1 - timeFraction))) / 2;
		}
		//End
		var currentPos = wby.wbyImageReelStart + (parseFloat(timeFraction) * parseFloat(wby.reelAnimateDistance));
		wby.wbyImageReel.style.left = currentPos+'px';
		if(timeFraction < 1){
			window.requestAnimationFrame(wby._gotoAnimate);
		}
	},
	
	scrollThumbReel : function(dir){
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
			var newPos = step;
		}else{
			if(step <= realBound){
				var newPos = realBound;
			}else{
				var newPos = 0;
			}
		}
		if(this.cssTransitionPropertyIsSupported === false){
			this.wbyThumbReelStart = parseFloat(wbyThumbReelPos);
			this.animateStartTimeThumbReel = new Date().getTime();
			this.reelAnimateDistanceThumbReel = parseFloat(newPos) - parseFloat(this.wbyThumbReelStart);
			this._gotoAnimateThumbReel();
		}else{
			this.wbyThumbReel.style.left = newPos+'px';
			this.toggleThumbNav();
		}
	},
	
	_gotoAnimateThumbReel : function(){
		var currentTime = new Date().getTime();
		var timeFraction = (currentTime - wby.animateStartTimeThumbReel) / 250;
		timeFraction = timeFraction > 1 ? 1 : timeFraction;
		//Ease-in-out timing function code
		if(timeFraction <= 0.5) {
			timeFraction = (2 * timeFraction) / 2;
		}else{
			timeFraction = (2 - (2 * (1 - timeFraction))) / 2;
		}
		//End
		var currentPos = wby.wbyThumbReelStart + (parseFloat(timeFraction) * parseFloat(wby.reelAnimateDistanceThumbReel));
		wby.wbyThumbReel.style.left = currentPos+'px';
		wby.toggleThumbNav();
		if(timeFraction < 1){
			window.requestAnimationFrame(wby._gotoAnimateThumbReel);
		}
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
				wby.removeCssTransition(wby.wbyImageReel);
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
		var wbyMidPoint = this.webberly.offsetWidth/6;
		var wbyImageReelPos = this.wbyImageReel.style.left.replace('px', '');
		var currImageReelPos = wbyArray[wby.currTagNumber - 1][3];
		var distance = currImageReelPos - wbyImageReelPos;
		distance = Math.abs(distance);
		/*Improved the swipe responsiveness using currTagNumber property*/
		if(distance >= wbyMidPoint){
			if(wbyImageReelPos < currImageReelPos){
				this.selectImage(wby.currTagNumber + 1);
			}else{
				this.selectImage(wby.currTagNumber - 1);
			}
		}else{
			this.selectImage(wby.currTagNumber);
		}
	},
	
	cssTransitionPropertySupported : function(){
		//This property checks for css transition browser support against all vendor prefixes
		var prop = 'transition';
		var vendors = 'Khtml Ms O Moz Webkit'.split(' ');
		if(prop in this.wbyImageReel.style){
			return prop;
		}
		for(var i = 0;i < vendors.length;i++){
			vProp = vendors[i].charAt(0).toUpperCase() + prop; 
			if(vProp in this.wbyImageReel.style){
				return vProp;
			}
		}
		return false;
	},
	
	addCssTransition : function(obj){
		obj.style[this.cssTransitionPropertyIsSupported] = 'all 0.25s ease 0s';
	},
	
	removeCssTransition : function(obj){
		obj.style[this.cssTransitionPropertyIsSupported] = 'all 0s ease 0s';
	}
};
wby.addEventHandler(window,'load',wby.init);