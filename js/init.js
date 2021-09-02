"use strict";
const fileInput=document.querySelector('#archiveFileInput');

$( document ).ready(function() { //beim ersten Webseite laden

	HMI.atPrepareFileList();  //holt liste
	HMI.makeControlElementBindings();
	BinaryBRTypedFile.parseTypedFiles(); //parsed die B&R Typdateien
	$("#editor").hide();
	fileInput.addEventListener('change', HMI.onChangeInFileInput,false);

});
