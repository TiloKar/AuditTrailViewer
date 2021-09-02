/**
*   Kapselt alle Methoden für die Erstellung der checkbox und zum plotten für
Login/logout Eventklasse
  *
  Filterregel 1
  dynamische erzeugung der Filter-Steuerelemente
 *@author TK, 05/2021, version 1.0.1
 *

*/
"use strict";
class LoginOutEvents{
  static init(DOMquery,events){
    LoginOutEvents.events=events;
    if (typeof(ListPlotter.Definition.eventClasses) == "undefined") ListPlotter.Definition.eventClasses = new Array(0);

    if (ListPlotter.Definition.eventClasses[1]==null){ //pseudoinit wenn keine Daten aus letzter session
      //login/logout
      ListPlotter.Definition.eventClasses[1] = true;
    }
    $( DOMquery ).empty();
    $( DOMquery ).append(
      '<label for="CheckboxRadiosReportBlockUserEvents">Login/out Events</label>' +
      '<input type="checkbox" name="CheckboxRadiosReportBlockUserEvents" class="ReportBlockCount" id="CheckboxRadiosReportBlockUserEvents">' +
      '<span class="ReportBlockCount" id="CountReportBlockUserEvents"></span>'
    );

    $( "#reportBlockUserEvents input").checkboxradio();
    $( "#CheckboxRadiosReportBlockUserEvents").prop('checked',ListPlotter.Definition.eventClasses[1]).checkboxradio('refresh');
    $("#CheckboxRadiosReportBlockUserEvents").on("change",function(event){
        LoginOutEvents.onControlChange();
        //alert(event.target.id);
    });
    //hier einmal pushen in preview auslösen für alle aufgebauten groups
    LoginOutEvents.onControlChange();
  }

  /**
    * Vorparsen der Login Events [1]
   */
  static onControlChange() {
  	ListPlotter.Definition.eventClasses[1]=($( "#CheckboxRadiosReportBlockUserEvents" ).prop("checked")==true); //aus form in definition übernehmen
//alert(this.Definition.userEvents[1].checked);
    if (ListPlotter.preParsedDomOutputs.eventClasses[1] == null)ListPlotter.preParsedDomOutputs.eventClasses[1] = new Array(0);
    ListPlotter.preParsedDomOutputs.eventClasses[1]=new Array(0);
    if (ListPlotter.Definition.eventClasses[1]){
      //alle evnts des selektierten eventsblocks in ausgabearray pushen
      //einmal über alle events iterieren und nur falls gewählt, pushen
      LoginOutEvents.events.event.forEach(element => {
        var push=false;
        //alert (element.ID);
        switch (element.ID) {
          case 1: 	push=  '<span class="reportListFirstCol"><b>User</b><span class="reportListUsername">' + element.data.string1 +
                          "(ID: " + element.data.par1 +" Level: " + element.data.par2 + ")</span></span> logged <b>in</b>";
          break;
      	  case 2:		push=  '<span class="reportListFirstCol"><b>User</b><span class="reportListUsername">' + element.data.string1 +
                          "(ID: " + element.data.par1 +" Level: " + element.data.par2 + ")</span></span> <b>login failed</b>";
          break;
          case 3:		push=  '<span class="reportListFirstCol"><b>User</b><span class="reportListUsername">' + element.data.string1 +
                          "(ID: " + element.data.par1 +" Level: " + element.data.par2 + ")</span></span> logged <b>out</b>";
          break;
        }
        if (push!==false){
          ListPlotter.preParsedDomOutputs.eventClasses[1].push( {
            rawtime: element.timeRaw,   //PFlicht-Sortierschlüssel!!!
            output :  '<span class="reportListTimestamp">' + element.time.toUTCString() + "</span>" + push
          });
        }
      });
    }
    //count aktualisieren in der group
    $("#CountReportBlockUserEvents").html('(' + ListPlotter.preParsedDomOutputs.eventClasses[1].length + ')');
    //hier noch update des preview blocks
    ListPlotter.updateMainListButton();
    //speichert die filterreglen für die nächste session
    ListPlotter.saveUserSettings();
  }

}
