
/**
*   - ruft spezilisierte Klassen zum Aufbau der filter-Steuerelmente auf
    - zählt die vorgeparsten events und steuert den zentralen Report-Button
    - Übernimmt localStorage verwaltung der Paramter-JSON
    - preparser für alle evnts die immer im Report auftauchen
  *

 *@author TK, 04/2021, version 1.0.1
              05/2021  abgespeckt, methoden in spezifische klasse nausgelagert
 *
*/
"use strict";
class ListPlotter{
  static init(trend,events,dump){
    /**
    Object für Reportdefinition
    nimmt Einstellungen in den Forms auf und
    JSON des objects kann als Cookie, localStorage oder Serverseitig gespeichert werden
    */
    ListPlotter.dump=dump;
    ListPlotter.events=events;
    ListPlotter.ASYREPORTSIZE = 100; //Menge an Events pro asynchronem aufruf beim aufbau der Reportliste
    ListPlotter.ASYREPORTTIME = 50; //ms für timeout des asynchronen report-aufbaus
    /**
      prüft, ob aus letzter session Filterregeln da sind und bereitet diese auf
    */
    var last = window.localStorage.getItem('eventReportDefinition');
    if (last==null) {
      ListPlotter.Definition=new Object();
    }else{
      ListPlotter.Definition=JSON.parse(last);
    }
    ListPlotter.preParsedDomOutputs = new Object();//new EventFilterDefinition(Trendfile1); //container für preparsed DOM snippets im Report
    ListPlotter.makeMainEventsPreparse(events); //nur einmal die nicht abwählbaren events parsen
  //  alert("call input");
    TrendInputEvents.init("#reportBlockInputs",trend);
    TrendOutputEvents.init("#reportBlockOutputs",trend);
    TrendLoopEvents.init("#reportBlockLoops",trend);
    LoginOutEvents.init("#reportBlockUserEvents",events);
    OutputEvents.init("#reportBlockOutputEvents",events,trend);
    LoopEvents.init("#reportBlockLoopEvents",events,trend);
    ProfileEvents.init("#reportBlockProfileEvents",events,dump);
    SequenceEvents.init("#reportBlockSequenceEvents",events,dump);
  }

  /**
   * Vorparsen der Nicht abwählbaren Events [0]
   - start/stop AT
   - kritische logins
   - B&R buffer/preparser fehler
   - PW Änderungen
   */
  static makeMainEventsPreparse(events){
    if (ListPlotter.preParsedDomOutputs.eventClasses == null) ListPlotter.preParsedDomOutputs.eventClasses = new Array(0);
    if (ListPlotter.preParsedDomOutputs.eventClasses[0] == null)ListPlotter.preParsedDomOutputs.eventClasses[0] = new Array(0);

    //alle evnts des selektierten eventsblocks in ausgabearray pushen
    //einmal über alle events iterieren und nur falls gewählt, pushen
    events.event.forEach(element => {
      var push=false;
      //alert (element.ID);
      switch (element.ID) {
        case 10:	push=  '<span class="reportListFirstCol"><b>User</b><span class="reportListUsername">' + element.data.string1 +
                        "(ID: " + element.data.par1 +" Level: " + element.data.par2 + ")</span></span><b> started</b> AT-Batch";
        break;
        case 11:	push=  '<span class="reportListFirstCol"><b>User</b><span class="reportListUsername">' + element.data.string1 +
                        "(ID: " + element.data.par1 +" Level: " + element.data.par2 + ")</span></span><b> stopped</b> AT-Batch";
        break;
        case 75:	push=  '<span class="reportListFirstCol"><b>User</b><span class="reportListUsername">' + element.data.string1 +
                        "(ID: " + element.data.par1 +" Level: " + element.data.par2 + ")</span></span><b> inoculated</b>";
        break;
        case 12:	push=  '<span class="reportListFirstCol"><span class="reportListError">Unh.Ev.ID in PLC Eng. ' +
                        "(ID: " + element.data.par1 + ")</span></span>";
        break;
        case 13:	push=  '<span class="reportListFirstCol"><span class="reportListError">Unh.Ev.ID in JS-Pre-Parser ' +
                        "(ID: " + element.data.par1 + ")</span></span>";
        break;
        case 19:	push=  '<span class="reportListFirstCol"><span class="reportListError">Buffer overrun in PLC Eng.</span></span>';
        break;
        case 18:	push=  '<span class="reportListFirstCol"><span class="reportListError">Eventfile overrun in PLC Eng.</span></span>';
        break;
        case 5:		push=  '<span class="reportListFirstCol"><b>User</b><span class="reportListUsername">' + element.data.string1 +
                        "(ID: " + element.data.par1 +" Level: " + element.data.par2 + ")</span></span><b>changed PW</b>";
        break;
        case 6:		push=  '<span class="reportListFirstCol"><span class="reportListError">Critical Login' +
                        "(ID: " + element.data.par1 + " Level: " + element.data.par2 + ')</span></span>Reason given by user:<br><span class="reportListUsertext">' +
                        element.data.string1 + "</span>";
        break;
        case 26:		push=  '<span class="reportListFirstCol"><span class="reportListError">man. Access to outp.facepl.' +
                        '</span></span>Reason given by user:<br><span class="reportListUsertext">' +
                        element.data.string1 + "</span>";
        break;
        case 36:		push=  '<span class="reportListFirstCol"><span class="reportListError">man. Access to inp.facepl.' +
                        '</span></span>Reason given by user:<br><span class="reportListUsertext">' +
                        element.data.string1 + "</span>";
        break;
        case 37:		push=  '<span class="reportListFirstCol"><span class="reportListError">man. Access to Con.Loop' +
                        '</span></span>Reason given by user:<br><span class="reportListUsertext">' +
                        element.data.string1 + "</span>";
        break;
        case 14:	push=  '<span class="reportListFirstCol">AT-Batch continues after </span><b>system reboot</b>';
        break;
        case 50:
          push= '<b>Seq.' + String(element.data.par1 + 1) +
                '</b> started manually <br><span class="reportListSeqTag">' + ListPlotter.dump.seqFiles[element.data.par1].tag  +
                "</span>";
        break;
        case 57:
          push= '<b>Seq.' + String(element.data.par1 + 1) +
                '</b> stopped finally <br><span class="reportListSeqTag">' + ListPlotter.dump.seqFiles[element.data.par1].tag  +
                "</span>";
        break;
        case 100: push=EventDOMOutputs.makeGenericAlertEntry(0,0,element.data.par2); break; //generic alarm come
        case 101: push=EventDOMOutputs.makeGenericAlertEntry(0,1,element.data.par2); break; //generic alarm gone
        case 102: push=EventDOMOutputs.makeGenericAlertEntry(0,2,element.data.par2); break; //generic alarm ack
        case 110: push=EventDOMOutputs.makeGenericAlertEntry(1,0,element.data.par2); break; //serial alarm come
        case 111: push=EventDOMOutputs.makeGenericAlertEntry(1,1,element.data.par2); break; //serial alarm gone
        case 112: push=EventDOMOutputs.makeGenericAlertEntry(1,2,element.data.par2); break; //serial alarm ack
        case 120: push=EventDOMOutputs.makeGenericAlertEntry(2,0,element.data.par2); break; //x20 alarm come
        case 121: push=EventDOMOutputs.makeGenericAlertEntry(2,1,element.data.par2); break; //x20 alarm gone
        case 122: push=EventDOMOutputs.makeGenericAlertEntry(2,2,element.data.par2); break; //x20 alarm ack
        case 130: push=EventDOMOutputs.makeUserAlertEntry(0,0,ListPlotter.dump.channelHeaders.cI[element.data.par2].tag); break; //HH alarm come
        case 131: push=EventDOMOutputs.makeUserAlertEntry(0,1,ListPlotter.dump.channelHeaders.cI[element.data.par2].tag); break; //HH alarm gone
        case 132: push=EventDOMOutputs.makeUserAlertEntry(0,2,ListPlotter.dump.channelHeaders.cI[element.data.par2].tag); break; //HH alarm ack
        case 140: push=EventDOMOutputs.makeUserAlertEntry(1,0,ListPlotter.dump.channelHeaders.cI[element.data.par2].tag); break; //L alarm come
        case 141: push=EventDOMOutputs.makeUserAlertEntry(1,1,ListPlotter.dump.channelHeaders.cI[element.data.par2].tag); break; //...
        case 142: push=EventDOMOutputs.makeUserAlertEntry(1,2,ListPlotter.dump.channelHeaders.cI[element.data.par2].tag); break;
        case 150: push=EventDOMOutputs.makeUserAlertEntry(2,0,ListPlotter.dump.channelHeaders.cI[element.data.par2].tag); break;
        case 151: push=EventDOMOutputs.makeUserAlertEntry(2,1,ListPlotter.dump.channelHeaders.cI[element.data.par2].tag); break;
        case 152: push=EventDOMOutputs.makeUserAlertEntry(2,2,ListPlotter.dump.channelHeaders.cI[element.data.par2].tag); break;
        case 160: push=EventDOMOutputs.makeUserAlertEntry(3,0,ListPlotter.dump.channelHeaders.cI[element.data.par2].tag); break;
        case 161: push=EventDOMOutputs.makeUserAlertEntry(3,2,ListPlotter.dump.channelHeaders.cI[element.data.par2].tag); break;
        case 162: push=EventDOMOutputs.makeUserAlertEntry(3,2,ListPlotter.dump.channelHeaders.cI[element.data.par2].tag); break;
      }
      if (push!==false) {
        ListPlotter.preParsedDomOutputs.eventClasses[0].push( {
          rawtime: element.timeRaw,   //PFlicht-Sortierschlüssel!!!
          output :  '<span class="reportListTimestamp">' + element.time.toUTCString() + "</span>" + push
        });
      }
    });
  }

  static updateMainListButton(){
    var countTrend = 0;
    for (var i=0; i < ListPlotter.preParsedDomOutputs.inputs.length;i++)
      if (typeof(ListPlotter.preParsedDomOutputs.inputs[i]) != "undefined") countTrend+=ListPlotter.preParsedDomOutputs.inputs[i].length;
    if (typeof(ListPlotter.preParsedDomOutputs.outputs) != "undefined")
      for (var i=0; i<ListPlotter.preParsedDomOutputs.outputs.length;i++)
          if (typeof(ListPlotter.preParsedDomOutputs.outputs[i]) != "undefined") countTrend+=ListPlotter.preParsedDomOutputs.outputs[i].length;
    if (typeof(ListPlotter.preParsedDomOutputs.loops) != "undefined")
      for (var i=0; i<ListPlotter.preParsedDomOutputs.loops.length;i++)
          if (typeof(ListPlotter.preParsedDomOutputs.loops[i]) != "undefined") countTrend+=ListPlotter.preParsedDomOutputs.loops[i].length;

    var countEvents = 0;
    for (var i=0; i < ListPlotter.preParsedDomOutputs.eventClasses.length;i++)
      if (typeof(ListPlotter.preParsedDomOutputs.eventClasses[i]) != "undefined") countEvents+=ListPlotter.preParsedDomOutputs.eventClasses[i].length;
    //  ...
    //alert(countTrend);
    $("#TextDrawReport").html(  "Event-Lines: " + countEvents +
                                  "<br>Trend-Value-Lines: " + countTrend +
                                  "<br>Estimated Pages: " + (Number.parseInt((countEvents + countTrend)/53) + 1)
    );
  }

  /**
  Speichert JSON Parameterstruktur für nutzereinstellungen der filter
  */
  static saveUserSettings(){
    window.localStorage.setItem('eventReportDefinition', JSON.stringify(ListPlotter.Definition));
  }
  /**
   *  kopiert die in preParsedDomOutputs zusammengetragenen Report-Snippets aller unterkategorien
   in ein gemeinsames ausgabearray
    - Sortiert dieses nach der rohzeit
    - stößt dann den asynchronen Aufbau des Reports im DOM an
   */
  static makeReportList(onBlock,onFinish) {
    ListPlotter.finalListOutput = new Array(0);
    for (var i=0;i < ListPlotter.preParsedDomOutputs.eventClasses.length; i++)
      for (var k=0;k < ListPlotter.preParsedDomOutputs.eventClasses[i].length; k++)
        ListPlotter.finalListOutput.push(ListPlotter.preParsedDomOutputs.eventClasses[i][k]); //Events
    for (var i=0;i < ListPlotter.preParsedDomOutputs.inputs.length; i++) //trend Eingänge
      for (var k=0;k < ListPlotter.preParsedDomOutputs.inputs[i].length; k++)
        ListPlotter.finalListOutput.push(ListPlotter.preParsedDomOutputs.inputs[i][k]);
    for (var i=0;i < ListPlotter.preParsedDomOutputs.outputs.length; i++) //trend Ausgänge
      for (var k=0;k < ListPlotter.preParsedDomOutputs.outputs[i].length; k++)
        ListPlotter.finalListOutput.push(ListPlotter.preParsedDomOutputs.outputs[i][k]);
    for (var i=0;i < ListPlotter.preParsedDomOutputs.loops.length; i++) //trend Loops
      for (var k=0;k < ListPlotter.preParsedDomOutputs.loops[i].length; k++)
        ListPlotter.finalListOutput.push(ListPlotter.preParsedDomOutputs.loops[i][k]);

  	ListPlotter.finalListOutput.sort((o1,o2) => {return (o2.rawtime - o1.rawtime)}); //sortieren, Jüngstes event zuerst
    ListPlotter.asyReportRead=0;
    ListPlotter.asyReportBlock(onBlock,onFinish); //anstoßen des Report-Aufbaus
  }
  static asyReportBlock(onBlock,onFinish) {
    //falls letzter block
    if (ListPlotter.finalListOutput.length - ListPlotter.asyReportRead < ListPlotter.ASYREPORTSIZE){
      //nur bis length -1  lesen
      for (var i = ListPlotter.asyReportRead;i < ListPlotter.finalListOutput.length;i++){
        $('#reportList').append("<li>" + ListPlotter.finalListOutput[i].output +"</li>");
        ListPlotter.asyReportRead+=1;
      }
      onFinish();
    }else{//sonst nur blocklänge an events lesen von asyReportRead bis asyReportRead+ASYREPORTSIZE - 1
      for (var i = ListPlotter.asyReportRead;i < ListPlotter.asyReportRead + ListPlotter.ASYREPORTSIZE;i++){
        $('#reportList').append("<li>" + ListPlotter.finalListOutput[i].output +"</li>");
      }
      onBlock();
      ListPlotter.asyReportRead+=this.ASYREPORTSIZE
      ListPlotter.timeoutReportBlock=window.setTimeout(event => {ListPlotter.asyReportBlock(onBlock,onFinish)}, ListPlotter.ASYREPORTTIME);
    }
  }
}
