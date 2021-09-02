/**
*   Kapselt alle Methoden für die Erstellung der checkbox und zum plotten für
Sequenz Eventklasse
  *
  Filterregel 5
  dynamische erzeugung der Filter-Steuerelemente
 *@author TK, 05/2021, version 1.0.1
 *

*/
"use strict";
class SequenceEvents{
  static init(DOMquery,events,dump){
    SequenceEvents.events=events;
    SequenceEvents.dump=dump;
    if (typeof(ListPlotter.Definition.eventClasses) == "undefined") ListPlotter.Definition.eventClasses = new Array(0);

    if (ListPlotter.Definition.eventClasses[5]==null){ //pseudoinit wenn keine Daten aus letzter session
      //login/logout
      ListPlotter.Definition.eventClasses[5] = true;
    }
    $( DOMquery ).empty();
    $( DOMquery ).append(
      '<label for="CheckboxRadiosReportBlockSequenceEvents">Sequence Events</label>' +
      '<input type="checkbox" name="CheckboxRadiosReportBlockSequenceEvents" class="ReportBlockCount" id="CheckboxRadiosReportBlockSequenceEvents">' +
      '<span class="ReportBlockCount" id="CountReportBlockSequenceEvents"></span>'
    );

    $( "#reportBlockSequenceEvents input").checkboxradio();
    $( "#CheckboxRadiosReportBlockSequenceEvents").prop('checked',ListPlotter.Definition.eventClasses[5]).checkboxradio('refresh');
    $("#CheckboxRadiosReportBlockSequenceEvents").on("change",function(event){
        SequenceEvents.onControlChange();
        //alert(event.target.id);
    });
    //hier einmal pushen in preview auslösen für alle aufgebauten groups
    SequenceEvents.onControlChange();
  }

  /**
    * Vorparsen der Login Events [1]
   */
  static onControlChange() {
  	ListPlotter.Definition.eventClasses[5]=($( "#CheckboxRadiosReportBlockSequenceEvents" ).prop("checked")==true); //aus form in definition übernehmen
//alert(this.Definition.userEvents[1].checked);
    if (ListPlotter.preParsedDomOutputs.eventClasses[5] == null)ListPlotter.preParsedDomOutputs.eventClasses[5] = new Array(0);
    ListPlotter.preParsedDomOutputs.eventClasses[5]=new Array(0);
    if (ListPlotter.Definition.eventClasses[5]){
      //alle evnts des selektierten eventsblocks in ausgabearray pushen
      //einmal über alle events iterieren und nur falls gewählt, pushen
      SequenceEvents.events.event.forEach(element => {
        //alert(element.ID)
        var push=false;
        //alert (element.ID);
        switch (element.ID) {
          case 51:
            push= '<b>Seq.' + String(element.data.par1 + 1) +
                  '</b> aborted manually <br><span class="reportListSeqTag">' + SequenceEvents.dump.seqFiles[element.data.par1].tag  +
                  "</span>";
          break;
          case 52:
            push= '<b>Seq.' + String(element.data.par1 + 1) +
                  '</b> hard stopped manually <br><span class="reportListSeqTag">' + SequenceEvents.dump.seqFiles[element.data.par1].tag  +
                  "</span>";
          break;
          case 55:
            push= '<b>Seq.' + String(element.data.par1 + 1) +
                  '</b> shutting down <br><span class="reportListSeqTag">' + SequenceEvents.dump.seqFiles[element.data.par1].tag  +
                  "</span>";
          break;
          case 56:
            push= '<b>Aux-Seq.' + String(element.data.par1 + 1) +
                  '</b> automatic shut down <br><span class="reportListSeqTag">' + SequenceEvents.dump.seqFiles[element.data.par1].tag  +
                  "</span>";
          break;
          case 60:
          case 61:
            push= '<span class="reportListFirstCol"><b>Seq.' + String(element.data.par1 + 1) +
                  ' par.</b> changed <span class="reportListLoopTag">' + SequenceEvents.dump.seqFiles[element.data.par1].globalParHead[element.data.par2].tag  +
                  "</span></span> to" +
                  '<span class="reportListValue">' + BinaryBRStructFile.round(element.data.new1,Trendfile.getDigitsFromUnitStr(element.data.string1)) +
                  " " + element.data.string1 +  "</span>";
                  //alert(element.data.new1);
          break;
          case 70:
            push= '<b>Seq.' + String(element.data.par1 + 1) + '</b> req. user input (DIALOG) <br>' +
                  '<span class="reportListSeqTag">' + SequenceEvents.dump.seqFiles[element.data.par1].tag  + "</span>" +
                  ' (action ' + String(element.data.par2 + 1) + ') Dialog text:<br><span class="reportListUsertext">' +
                  element.data.string1 + "</span>";
          break;
          case 71:
            push= '<b>Seq.' + String(element.data.par1 + 1) + ' ACK. OK</b> by user<br>' +
                  '<span class="reportListSeqTag">' + SequenceEvents.dump.seqFiles[element.data.par1].tag  +
                  '</span> (action ' + String(element.data.par2 + 1) + ')';
          break;
          case 72:
            push= '<b>Seq.' + String(element.data.par1 + 1) + ' ACK. CANCEL</b> by user<br>' +
                  '<span class="reportListSeqTag">' + SequenceEvents.dump.seqFiles[element.data.par1].tag  +
                  '</span> (action ' + String(element.data.par2 + 1) + ')';
          break;
          case 73:
            push= '<b>Seq.' + String(element.data.par1 + 1) + ' DIALOG TIMEOUT</b><br>' +
                  '<span class="reportListSeqTag">' + SequenceEvents.dump.seqFiles[element.data.par1].tag  +
                  '</span> (action ' + String(element.data.par2 + 1) + ')';
          break;
          case 74:
            push= '<b>Seq.' + String(element.data.par1 + 1) + ' MINIMIZED</b> by user<br>' +
                  '<span class="reportListSeqTag">' + SequenceEvents.dump.seqFiles[element.data.par1].tag  +
                  '</span> (action ' + String(element.data.par2 + 1) + ')';
          break;
        }
        if (push!==false){
          ListPlotter.preParsedDomOutputs.eventClasses[5].push( {
            rawtime: element.timeRaw,   //PFlicht-Sortierschlüssel!!!
            output :  '<span class="reportListTimestamp">' + element.time.toUTCString() + "</span>" + push
          });
        }
      });
    }
    //count aktualisieren in der group
    $("#CountReportBlockSequenceEvents").html('(' + ListPlotter.preParsedDomOutputs.eventClasses[5].length + ')');
    //hier noch update des preview blocks
    ListPlotter.updateMainListButton();
    //speichert die filterreglen für die nächste session
    ListPlotter.saveUserSettings();
  }

}
