/**
 *  Factoryklasse für dom-ausgaben der ventilmatrix
 *  seqDumb muss vorher für jede sequenz konstruiert worden sein,
 damit d.fileValves mit referenzliste angereichert worden ist
 *  *@author TK, 06/2021, version 1.0.1
 */
"use strict";
class ValveDump {
  constructor (d){
    this.vdef=[];
    var ref;
    //echten seqTag anhängen
    for (var i=0; i<d.fileValves.length;i++){
      if (d.fileValves[i].seqRef!==undefined){
        ref = d.fileValves[i].seqRef
        for (var k=0;k<ref.length;k++) {
          ref[k].seqName=SeqDump.seqTags[ref[k].seqIndex]; //echten seqTag anhängen
        }
        //alert (d.fileValves[i].tag);
        this.vdef.push(d.fileValves[i]); //nur verwendete zeilen aufnehmen in hilfsstruktur
      }
    }

    //ventil kopfzeilentags vorbereiten
    //alle mit typ 12 aus outputs dazu vorbereiten
    this.vHeaderTags=[];
    var cO;
    for (var i=0; i<d.channelHeaders.cO.length;i++){
      cO=d.channelHeaders.cO[i];
      if (cO.type===12) this.vHeaderTags.push(cO.tag);
    }
  }
  //fügt ventilmatrix mit referenzen zusammen
  getValveList(){
    //to do last changed und version ergänzen
    var cols = this.vHeaderTags.length; //tag ... genutzte ventile ... referenznamen der sequenzen
    var rows = this.vdef.length;//spalten bezeichner ... anzahl der referenzierten zeilen
    if ((cols==0)||(rows==0)) return '<div>no valve rows used</div>';

    var back=   '<div class="myTable">' +
                '<span class="closedValve"> - close valves </span><br>'+
                '<span class="openedValve"> + open valves </span><br>'+
                '<span class="keepValve"> * keep valves </span><br>'+
                '<table><tbody>' +
                '<tr>   <th>Valverow/Valve</th> ';
    for (var i = 0; i < cols; i++) back+='<th  class="verticalText">' + this.vHeaderTags[i] + '</th>';
    back+=      '<th>Version<br>Seq. References </th></tr><tr>';
    for (var i = 0; i < rows; i++) {
      back+=  '<th>' + this.vdef[i].tag + '</th>';
      for (var k = 0; k < cols; k++) {
        switch (this.vdef[i].valve[k]){
          case 0: back+=  '<td class="closedValve"> &nbsp;&#8722;&nbsp; </td>';
          break;
          case 1: back+=  '<td class="openedValve">+</td>';
          break;
          case 2: back+=  '<td class="keepValve">*</td>';
          break;
        }
      }
      back+=  '<td>Version: ' + this.vdef[i].version + '<br>last changed: ' +
              this.vdef[i].lastChanged.toUTCString() + '<br>References in: ' +
              this.vdef[i].seqRef[0].seqName;
      for (var k = 1; k < this.vdef[i].seqRef.length; k++) back+=', ' + this.vdef[i].seqRef[k].seqName;
      back+=  '</td></tr>';
    }
    back+=    "</tbody></table></div>";
    return back;
  }
}
