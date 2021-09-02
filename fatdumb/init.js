"use strict";

const xhr = new XMLHttpRequest(); //	erstmal nur ein xhr initialisiern zum holen der FAT.Dumpdatei, ausprogrammiert im onload-handler ganz unten
var d= new Object(); //query Object für die daten
var list =new Array(0); //query für späteren Aufbau der Ausgabe, enthält unterstrukturen mit {dateiname:string der datei,ref[]:strings der zugeordneten kanalnamen}

function getDumbFile(){
  xhr.responseType="arraybuffer"; //	HMI.binRequest.responseType="arraybuffer";
  xhr.open("GET", '../plcfile/fatDump.bbib', true);//HMI.binRequest.open("GET", path, true);
  xhr.onload = makeJSONList; //Wenn daten da, dann JSON in d parsen
  xhr.send();                        //HMI.binRequest.send();
  $('#laden').hide();
}


//Methode mit Aufruf der Parser-Klasse und Zusammenbauen der Zuordnungstabelle
// TODO in zukunft je nach Komplexität des fortgeführten projekts in neue Klasse verpacken.....
function makeJSONList(){
  //alert(BinaryBRTypedFile.brStructsParsed);
  d= new BinaryBRTypedFile(xhr.response,'FATdump_typ');
  var inputs = d.elements.cI;
  var outputs = d.elements.cO;
  var countcI=0;
  var countcO=0;

  for (var i=0; i<inputs.length; i++){
    if (inputs[i].type!=0){
      countcI++;
      var filename = 'unhandled';
      var back = FATZuordnung.getFilenamefromInputType(inputs[i].type);
      if (back !== false) filename = back; //falls type aufgelöst wird, dateiname ändern
      var fund = list.find(e => e.dateiname === filename); //dateinamen in ausgabeliste suchen
      if (fund == null){//falls noch nicht angehängt
        var outDatei={dateiname:filename,ref:[]};
        outDatei.ref.push(inputs[i].tag + ' , Type:(' + inputs[i].type + ')');
        list.push(outDatei);  //kompletten dateieintrag mit erster referenz anhängen
      }else{//falls schon mal angehängt
        fund.ref.push(inputs[i].tag + ' , Type:(' + inputs[i].type + ')'); //nur referenz auf diesen kanla anhängen
      }
    }
  }
  //das ganze nochmal für die ausgänge, Achtung. gepusht wird in die gleiche dateiliste
  for (var i=0; i<outputs.length; i++){
    if (outputs[i].type!=0){
      countcO++;
      var filename = 'unhandled';
      var back = FATZuordnung.getFilenamefromOutputType(outputs[i].type);
      if (back !== false) filename = back; //falls type aufgelöst wird, dateiname ändern
      var fund = list.find(e => e.dateiname === filename); //dateinamen in ausgabeliste suchen
      if (fund == null){//falls noch nicht angehängt
        var outDatei={dateiname:filename,ref:[]};
        outDatei.ref.push(outputs[i].tag + ' , Type:(' + outputs[i].type + ')');
        list.push(outDatei);  //kompletten dateieintrag mit erster referenz anhängen
      }else{//falls schon mal angehängt
        fund.ref.push(outputs[i].tag + ' , Type:(' + outputs[i].type + ')'); //nur referenz auf diesen kanla anhängen
      }
    }
  }
//jetzt noch in den DOM einzuhängenden

  var DOMout ='';
  DOMout +='<ul>';
  for (var i=0; i< list.length;i++){ //über alle dateinamen
    DOMout += '<li>';
    DOMout += list[i].dateiname;
    DOMout +='<ul>';
    for (var k=0; k< list[i].ref.length;k++){//über alle referenzen des dateinamens
      DOMout +='<li>';
      DOMout +=list[i].ref[k];
      DOMout +='</li>';
    }
    DOMout +='</ul>';
    DOMout +='</li>';
  }
  DOMout +='</ul>';
$('#header').append('xCUBIO ' + d.elements.ident + ' Inputs: ' + countcI + ' Outputs: ' + countcO);
$('#content').append(DOMout);

}



$( document ).ready(function() { //beim ersten Webseite laden
    BinaryBRTypedFile.parseTypedFiles(); //parsen der B&R Typdateien
    $('#laden').button().click(getDumbFile);

});
