/**
*   Kapselt alle Methoden für die Erstellung der checkbox und zum plotten für
Kal Eventklasse
  *
  Filterregel 6
  dynamische erzeugung der Filter-Steuerelemente
 *@author TK, 03/2023, version 1.0.1
 *

*/
"use strict";
class KalEvents{
  static init(DOMquery,events,trend){
    KalEvents.events=events;
    KalEvents.trend=trend;
    if (typeof(ListPlotter.Definition.eventClasses) == "undefined") ListPlotter.Definition.eventClasses = new Array(0);

    if (ListPlotter.Definition.eventClasses[6]==null){ //pseudoinit wenn keine Daten aus letzter session
      //login/logout
      ListPlotter.Definition.eventClasses[6] = true;
    }
    $( DOMquery ).empty();
    $( DOMquery ).append(
      '<label for="CheckboxRadiosReportBlockKalEvents">Kalibration Actions</label>' +
      '<input type="checkbox" name="CheckboxRadiosReportBlockKalEvents" class="ReportBlockCount" id="CheckboxRadiosReportBlockKalEvents">' +
      '<span class="ReportBlockCount" id="CountReportBlockKalEvents"></span>'
    );

    $( "#reportBlockKalEvents input").checkboxradio();
    $( "#CheckboxRadiosReportBlockKalEvents").prop('checked',ListPlotter.Definition.eventClasses[6]).checkboxradio('refresh');
    $("#CheckboxRadiosReportBlockKalEvents").on("change",function(event){
        KalEvents.onControlChange();
        //alert(event.target.id);
    });
    //hier einmal pushen in preview auslösen für alle aufgebauten groups
    KalEvents.onControlChange();
  }

  /**
    * Vorparsen der Login Events [1]
   */
  static onControlChange() {
  	ListPlotter.Definition.eventClasses[6]=($( "#CheckboxRadiosReportBlockKalEvents" ).prop("checked")==true); //aus form in definition übernehmen
//alert(this.Definition.userEvents[1].checked);
    if (ListPlotter.preParsedDomOutputs.eventClasses[6] == null)ListPlotter.preParsedDomOutputs.eventClasses[6] = new Array(0);
    ListPlotter.preParsedDomOutputs.eventClasses[6]=new Array(0);
    if (ListPlotter.Definition.eventClasses[6]){
      //alle evnts des selektierten eventsblocks in ausgabearray pushen
      //einmal über alle events iterieren und nur falls gewählt, pushen
      KalEvents.events.event.forEach(element => {

        var push=false;
        var tagString;
        if (element.data.par2 === 1){
          tagString = '"reportListOutputTag">' + KalEvents.trend.tags.cO[element.data.par1];
        }else {
          tagString = '"reportListInputTag">' + KalEvents.trend.tags.cI[element.data.par1];
        }

        switch (element.ID) {
          case 80:
            push= '<span class="reportListFirstCol"><b>Kal.-Tara/Zero</b> on ' +
                  '<span class=' + tagString + "</span></span>";
          break;
          case 81:
            push= '<span class="reportListFirstCol"><b>Kal.-Dataset changed</b> on ' +
                  '<span class=' + tagString + "</span></span>";
          break;
        }
        if (push!==false){
          ListPlotter.preParsedDomOutputs.eventClasses[6].push( {
            rawtime: element.timeRaw,   //PFlicht-Sortierschlüssel!!!
            output :  '<span class="reportListTimestamp">' + element.time.toUTCString() + "</span>" + push
          });
        }
      });
    }
    //count aktualisieren in der group
    $("#CountReportBlockKalEvents").html('(' + ListPlotter.preParsedDomOutputs.eventClasses[6].length + ')');
    //hier noch update des preview blocks
    ListPlotter.updateMainListButton();
    //speichert die filterreglen für die nächste session
    ListPlotter.saveUserSettings();
  }

}
