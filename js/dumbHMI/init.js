"use strict";
//alle HMI Funktionen auf der Dumb Seite
var d ={}; //query für js entsprechung der dumpdaten
$( document ).ready(function() { //beim ersten Webseite laden
    $('#headerFilename').html(window.opener.idAT_1);
    document.title = "bbi-AT-Initial-State #" + window.opener.idAT_1;
    //BinaryBRTypedFile.parseTypedFiles(HMI.loadDumpFile); //parsed die B&R Typdateine
    //eigene HMI für dumb
  //  HMI.loadDumpFile();


    d=window.opener.dumpfile1;// schon verfügbar, und muss nicht neu geparst werden...
    HMI.prepareOverview();



});
