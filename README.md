# Webberly
A responsive and neat image viewer with rich UI for web/app projects written with plain js, css and php

Build status: [![Build Status](https://travis-ci.org/PHPMailer/PHPMailer.svg)](https://travis-ci.org/PHPMailer/PHPMailer)

## Introduction
The Image viewer enables proper scaling of images to its viewport and can properly scale group of images of different dimensions.
Webberly was created to give web developers an option of having an image viewer with a mobile device gallery thumbnail scaling having the same dimensions for thumbnails of different dimensions without distorting the images.

### How to deploy
- Open the sample.html file to see how the gallery is loaded.
- Create a div with id webberly div#webberly on the target page

```html
<div id="webberly"></div>
```

- Reference to webberly.js, webberly.css and its dependencies as it is on the sample.html or to the location you placed the webberly folder absolute or relative to the target page

```html
<link rel="stylesheet" href="dependencies/css/icomoon.css">
<link rel="stylesheet" href="webberly.css">
<script type="text/javascript" src="webberly.js"></script>
```

- Declare an array called wbyArray, Each sub array will contain the src of the image, the src of the thumbnail and  the thumb image alt

```js
wbyArray[0] = ['sample/images/large/image1.jpg','sample/images/thumbs/thumb1.jpg','Webberly'];
```

- The image src and image thumb src can be an absolute path or relative path to the target page if useJSOnly property is set to true. Otherwise, the image src must be a relative path to webberly.php

```js
useJSOnly : true,//Set to false if you prefer images to load from php script
```

- If useJSOnly is set to false, you will have to set the requestDir property to the full absolute path of the directory webberly.php script is located or to the path of the directory relative to the target page.

```js
requestDir : null,
	/*
	* This configuration preset setting assumes that useJSOnly property is set to true.
	* Otherwise, change this setting to the absolute path of the directory where webberly.php file is located e.g requestDir : 'https://www.4relic.com/webberly/', or to the 
	* path of the directory relative to the target page e.g requestDir : 'webberly/', requestDir : 'plugin/webberly/',
	*/
	useJSOnly : true,//Set to false if you prefer images to load from php script
```

- Webberly gallery width is fluid so its adapts to the width of its parent container. However, you can modify the gallery height by adjusting the wbyHeight property

```js
wbyHeight : 400,//Height of the gallery viewer
```

- Webberly makes use of icomoon fonts which is located in the dependencies folder, if you already have icomoon loaded on your project just make reference to it on the target page

### Why you may need Webberly
Webberly is very easy to deploy on your web/app projects.

Webberly runs on plain js and php and has been tested and seen to have optimal performance on top modern browsers like Mozilla firefox, Google Chrome and Safari e.t.c

Webberly is useful when it comes to projects with dynamic contents and images which gives it an edge over html and css image viewers with sliders.

Webberly suppports both Mouse and touch devices, image reel can be moved with both input methods.

Webberly is also useful when you have images that don't have the same dimension, webberly neatly scales the images in the viewer - plus - also has an expanded viewer that displays an image in its natural dimensions and scales down the image dimensions to 98% of the browser viewport if the image natural width is larger the browser viewport

### Dependencies
Icomoon fonts

### Credits, Legal & Licence
Webberly v1.0 JS code was written by **Tobi Makinde**(4relic Limited)
Feel free to use it for your web/app projects but kindly
leave this credit comment for legal purposes. 

**If you intend to use it for commercial purposes kindly send an email to tob_kerly4life@yahoo.ca or geeklucas01@gmail.com for necessary negotiations.**
 
