/**
*   Kapselt alle Methoden für die Erstellung der checkbox und zum plotten für
Profil Eventklasse
  *
  Filterregel 4
  dynamische erzeugung der Filter-Steuerelemente
 *@author TK, 05/2021, version 1.0.1
 *

*/
"use strict";
class ProfileEvents{
  static init(DOMquery,events,dump){
    ProfileEvents.events=events;
    ProfileEvents.dump=dump;
    if (typeof(ListPlotter.Definition.eventClasses) == "undefined") ListPlotter.Definition.eventClasses = new Array(0);

    if (ListPlotter.Definition.eventClasses[4]==null){ //pseudoinit wenn keine Daten aus letzter session
      //login/logout
      ListPlotter.Definition.eventClasses[4] = true;
    }
    $( DOMquery ).empty();
    $( DOMquery ).append(
      '<label for="CheckboxRadiosReportBlockProfileEvents">Profile Starts and Stops</label>' +
      '<input type="checkbox" name="CheckboxRadiosReportBlockProfileEvents" class="ReportBlockCount" id="CheckboxRadiosReportBlockProfileEvents">' +
      '<span class="ReportBlockCount" id="CountReportBlockProfileEvents"></span>'
    );

    $( "#reportBlockProfileEvents input").checkboxradio();
    $( "#CheckboxRadiosReportBlockProfileEvents").prop('checked',ListPlotter.Definition.eventClasses[4]).checkboxradio('refresh');
    $("#CheckboxRadiosReportBlockProfileEvents").on("change",function(event){
        ProfileEvents.onControlChange();
        //alert(event.target.id);
    });
    //hier einmal pushen in preview auslösen für alle aufgebauten groups
    ProfileEvents.onControlChange();
  }

  /**
    * Vorparsen der Login Events [1]
   */
  static onControlChange() {
  	ListPlotter.Definition.eventClasses[4]=($( "#CheckboxRadiosReportBlockProfileEvents" ).prop("checked")==true); //aus form in definition übernehmen
//alert(this.Definition.userEvents[1].checked);
    if (ListPlotter.preParsedDomOutputs.eventClasses[4] == null)ListPlotter.preParsedDomOutputs.eventClasses[4] = new Array(0);
    ListPlotter.preParsedDomOutputs.eventClasses[4]=new Array(0);
    if (ListPlotter.Definition.eventClasses[4]){
      //alle evnts des selektierten eventsblocks in ausgabearray pushen
      //einmal über alle events iterieren und nur falls gewählt, pushen
      ProfileEvents.events.event.forEach(element => {
        //alert(element.ID)
        var push=false;
        //alert (element.ID);
        switch (element.ID) {
          case 40:
            if (element.data.par2===1)
              var enabled= 'enabled';
            else
              var enabled= 'disabled';
            push= '<span class="reportListFirstCol"><b>Profile ' + String(element.data.par1 + 1) +
                  '</b> ' + enabled + ' by user<span class="reportListLoopTag">' + ProfileEvents.dump.configActive[UnitID_1].profile[element.data.par1].tag  +
                  "</span></span>";
          break;
          case 41:
            push= '<span class="reportListFirstCol"><b>Profile ' + String(element.data.par1 + 1) +
                  '</b> completed automatically <span class="reportListLoopTag">' + ProfileEvents.dump.configActive[UnitID_1].profile[element.data.par1].tag  +
                  "</span></span>";
          break;
        }
        if (push!==false){
          ListPlotter.preParsedDomOutputs.eventClasses[4].push( {
            rawtime: element.timeRaw,   //PFlicht-Sortierschlüssel!!!
            output :  '<span class="reportListTimestamp">' + element.time.toUTCString() + "</span>" + push
          });
        }
      });
    }
    //count aktualisieren in der group
    $("#CountReportBlockProfileEvents").html('(' + ListPlotter.preParsedDomOutputs.eventClasses[4].length + ')');
    //hier noch update des preview blocks
    ListPlotter.updateMainListButton();
    //speichert die filterreglen für die nächste session
    ListPlotter.saveUserSettings();
  }

}
