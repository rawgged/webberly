<?php

	/*------------------------------------------------------------------------------------
		Webberly v1.0 JS code was written by Tobi Makinde(4relic Limited)
		Feel free to use it for your web/app projects but kindly
		leave this credit comment for legal purposes, if you intend to
		use it for commercial purposes kindly send an email to tob_kerly4life@yahoo.ca or 
		geeklucas01@gmail.com for necessary negotiations.
	-------------------------------------------------------------------------------------*/

$url = $_GET['url'];
if(file_exists($url)){
	$response = base64_encode(file_get_contents($url));
	$responseBase64 = 'data:'.mime_content_type($url).';base64,'.$response;
	header('Content-type: text/xml');
	echo '<?xml version="1.0" encoding="UTF-8"?>';
	echo '<response>
			<imageData>'.$responseBase64.'</imageData>
			<tagnumber>'.$_GET['tagnumber'].'</tagnumber>
		</response>';
}
?>