/**
*   Kapselt alle Methoden für die Erstellung der checkbox und zum plotten für
loop cahnges Eventklasse
  *
  Filterregel 3
  dynamische erzeugung der Filter-Steuerelemente
 *@author TK, 05/2021, version 1.0.1
 *

*/
"use strict";
class LoopEvents{
  static init(DOMquery,events,trend){
    LoopEvents.events=events;
    LoopEvents.trend=trend;
    if (typeof(ListPlotter.Definition.eventClasses) == "undefined") ListPlotter.Definition.eventClasses = new Array(0);

    if (ListPlotter.Definition.eventClasses[3]==null){ //pseudoinit wenn keine Daten aus letzter session
      //login/logout
      ListPlotter.Definition.eventClasses[3] = true;
    }
    $( DOMquery ).empty();
    $( DOMquery ).append(
      '<label for="CheckboxRadiosReportBlockLoopEvents">Manual Control Loop Changes</label>' +
      '<input type="checkbox" name="CheckboxRadiosReportBlockLoopEvents" class="ReportBlockCount" id="CheckboxRadiosReportBlockLoopEvents">' +
      '<span class="ReportBlockCount" id="CountReportBlockLoopEvents"></span>'
    );

    $( "#reportBlockLoopEvents input").checkboxradio();
    $( "#CheckboxRadiosReportBlockLoopEvents").prop('checked',ListPlotter.Definition.eventClasses[3]).checkboxradio('refresh');
    $("#CheckboxRadiosReportBlockLoopEvents").on("change",function(event){
        LoopEvents.onControlChange();
        //alert(event.target.id);
    });
    //hier einmal pushen in preview auslösen für alle aufgebauten groups
    LoopEvents.onControlChange();
  }

  /**
    * Vorparsen der Login Events [1]
   */
  static onControlChange() {
  	ListPlotter.Definition.eventClasses[3]=($( "#CheckboxRadiosReportBlockLoopEvents" ).prop("checked")==true); //aus form in definition übernehmen
//alert(this.Definition.userEvents[1].checked);
    if (ListPlotter.preParsedDomOutputs.eventClasses[3] == null)ListPlotter.preParsedDomOutputs.eventClasses[3] = new Array(0);
    ListPlotter.preParsedDomOutputs.eventClasses[3]=new Array(0);
    if (ListPlotter.Definition.eventClasses[3]){
      //alle evnts des selektierten eventsblocks in ausgabearray pushen
      //einmal über alle events iterieren und nur falls gewählt, pushen
      LoopEvents.events.event.forEach(element => {
        //alert(element.ID)
        var push=false;
        //alert (element.ID);
        switch (element.ID) {
          case 30:
          case 31:
          case 34:
            push= '<span class="reportListFirstCol"><b>Setpoint</b> changed by user<span class="reportListLoopTag">' + LoopEvents.trend.tags.cCL[element.data.par1]  +
                  "</span></span> to" +
                  '<span class="reportListValue">' + BinaryBRStructFile.round(element.data.new1,Trendfile.getDigitsFromUnitStr(LoopEvents.trend.units.cCL[element.data.par1])) +
                  " " + LoopEvents.trend.units.cCL[element.data.par1] +  "</span>";
          break;
          case 32:
          case 33:
          case 35:
            if (element.data.par2===1)
              var enabled= 'enabled';
            else
              var enabled= 'disabled';
            push= '<span class="reportListFirstCol"><b>Control Loop</b> ' + enabled + '<span class="reportListLoopTag">' + LoopEvents.trend.tags.cCL[element.data.par1]  +
                  "</span></span>";
          break;
        }
        if (push!==false){
          ListPlotter.preParsedDomOutputs.eventClasses[3].push( {
            rawtime: element.timeRaw,   //PFlicht-Sortierschlüssel!!!
            output :  '<span class="reportListTimestamp">' + element.time.toUTCString() + "</span>" + push
          });
        }
      });
    }
    //count aktualisieren in der group
    $("#CountReportBlockLoopEvents").html('(' + ListPlotter.preParsedDomOutputs.eventClasses[3].length + ')');
    //hier noch update des preview blocks
    ListPlotter.updateMainListButton();
    //speichert die filterreglen für die nächste session
    ListPlotter.saveUserSettings();
  }

}
