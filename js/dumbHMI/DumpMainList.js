"use strict";
//eigene HMI für dumb

var HMI = {
  prepareOverview(){
    /*
    Idee kurze zusammenfassung der belegten hauptstrukturen anzeigen
    - nutzer kreuzt an/klappt auf, welche hauptstrukturen in die liste kommentare
    - spezifische Interpreter für die unterstrukturen als klassen entwerfen, welche die rohinformationen parsen und als
    - stylebares html auswerfen...

    */

    //Übersichtstabelle
    var seqUsed =0 ;
    var userCount =0 ;
    for (var i=0;i<d.seqFiles.length;i++) if(d.seqFiles[i].user > 1) seqUsed++;
    for (var i=0;i<d.userFiles.length;i++) if(d.userFiles[i].level > 0) userCount++;
    $('#overview').html(
      "<table><tbody><tr>   <th>Device ID: </th><td>"                    + String(d.bbiIdent) +
      "</td></tr><tr>       <th>used Sequences: </th><td>"             + String(seqUsed) +
      "</td></tr><tr>       <th>possible users: </th><td>"             + String(userCount - 1) +  //gast und service werden mitgezählt, service soll aber nich tauftauchen
      "</td></tr><tr>       <th>Kommentar: </th><td>"                     + d.comment +
      "</td></tr></tbody></table>");
    //interne Hilfsfunktion für Referenzenliste der Ventilzeilen (in welchen SEQ und Actions verwendet?)
    //HMI.listUsageV=DumbBrainstorming.getValveDependencies(d);
    //Auflistung der Sequenzen
    var s=[];
    for (var i=0;i<d.seqFiles.length;i++){
      if(d.seqFiles[i].user > 1){
          s.push(new SeqDump(d,i));
          $("#seqList").append(s[s.length-1].getSequenceListEntry());
      }
    }
    var v= new ValveDump(d);
    $("#valveList").append(v.getValveList());
    var L = new Interlocking(d);
    $("#interlockingList").append(L.getIntelockingTable());
    var U = new Usersystem(d);
    $("#userList").append(U.getUserTable());
    CollapsibleList.init(".clist li");
userList
  }
}
