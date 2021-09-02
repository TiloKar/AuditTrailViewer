/**
*   Kapselt alle Methoden für die Erstellung der checkbox und zum plotten für
output faceplate Eventklasse
  *
  Filterregel 2
  dynamische erzeugung der Filter-Steuerelemente
 *@author TK, 05/2021, version 1.0.1
 *

*/
"use strict";
class OutputEvents{
  static init(DOMquery,events,trend){
    OutputEvents.events=events;
    OutputEvents.trend=trend;
    if (typeof(ListPlotter.Definition.eventClasses) == "undefined") ListPlotter.Definition.eventClasses = new Array(0);

    if (ListPlotter.Definition.eventClasses[2]==null){ //pseudoinit wenn keine Daten aus letzter session
      //login/logout
      ListPlotter.Definition.eventClasses[2] = true;
    }
    $( DOMquery ).empty();
    $( DOMquery ).append(
      '<label for="CheckboxRadiosReportBlockOutputEvents">Manual Output Changes</label>' +
      '<input type="checkbox" name="CheckboxRadiosReportBlockOutputEvents" class="ReportBlockCount" id="CheckboxRadiosReportBlockOutputEvents">' +
      '<span class="ReportBlockCount" id="CountReportBlockOutputEvents"></span>'
    );

    $( "#reportBlockOutputEvents input").checkboxradio();
    $( "#CheckboxRadiosReportBlockOutputEvents").prop('checked',ListPlotter.Definition.eventClasses[2]).checkboxradio('refresh');
    $("#CheckboxRadiosReportBlockOutputEvents").on("change",function(event){
        OutputEvents.onControlChange();
        //alert(event.target.id);
    });
    //hier einmal pushen in preview auslösen für alle aufgebauten groups
    OutputEvents.onControlChange();
  }

  /**
    * Vorparsen der Login Events [1]
   */
  static onControlChange() {
  	ListPlotter.Definition.eventClasses[2]=($( "#CheckboxRadiosReportBlockOutputEvents" ).prop("checked")==true); //aus form in definition übernehmen
//alert(this.Definition.userEvents[1].checked);
    if (ListPlotter.preParsedDomOutputs.eventClasses[2] == null)ListPlotter.preParsedDomOutputs.eventClasses[2] = new Array(0);
    ListPlotter.preParsedDomOutputs.eventClasses[2]=new Array(0);
    if (ListPlotter.Definition.eventClasses[2]){
      //alle evnts des selektierten eventsblocks in ausgabearray pushen
      //einmal über alle events iterieren und nur falls gewählt, pushen
      OutputEvents.events.event.forEach(element => {
        var push=false;
        //alert (element.ID);
        switch (element.ID) {
          case 20: 	push= '<span class="reportListFirstCol"><b>Output</b> changed by user<span class="reportListOutputTag">' + OutputEvents.trend.tags.cO[element.data.par1]  +
                          "</span></span> to" +
                          '<span class="reportListValue">' + BinaryBRStructFile.round(element.data.new1,Trendfile.getDigitsFromUnitStr(OutputEvents.trend.units.cO[element.data.par1])) +
                          " " + OutputEvents.trend.units.cO[element.data.par1] +  "</span>";
          break;
          case 22:
            if (element.data.par2===1)
              var enabled= 'enabled';
            else
              var enabled= 'disabled';
            push= '<span class="reportListFirstCol"><b>Output</b> lockOff ' + enabled + '<span class="reportListOutputTag">' + OutputEvents.trend.tags.cO[element.data.par1]  +
                  "</span></span>";
          break;
          case 23:
            if (element.data.par2===1)
              var enabled= 'enabled';
            else
              var enabled= 'disabled';
            push= '<span class="reportListFirstCol"><b>Output</b> lockMan ' + enabled + '<span class="reportListOutputTag">' + OutputEvents.trend.tags.cO[element.data.par1]  +
                  "</span></span>";
          break;

        }
        if (push!==false){
          ListPlotter.preParsedDomOutputs.eventClasses[2].push( {
            rawtime: element.timeRaw,   //PFlicht-Sortierschlüssel!!!
            output :  '<span class="reportListTimestamp">' + element.time.toUTCString() + "</span>" + push
          });
        }
      });
    }
    //count aktualisieren in der group
    $("#CountReportBlockOutputEvents").html('(' + ListPlotter.preParsedDomOutputs.eventClasses[2].length + ')');
    //hier noch update des preview blocks
    ListPlotter.updateMainListButton();
    //speichert die filterreglen für die nächste session
    ListPlotter.saveUserSettings();
  }

}
