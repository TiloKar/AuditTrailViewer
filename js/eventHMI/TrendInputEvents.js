/**
*   Kapselt alle Methoden für die Erstellung der steuerelemente und zum plotten für
Trend-Einträge der Eingangskanäle
  *

  dynamische erzeugung der Filter-Steuerelemente
 *@author TK, 05/2021, version 1.0.1
 *

*/
"use strict";
class TrendInputEvents{
  static init(DOMquery,trend){
    TrendInputEvents.trend=trend;
    //Eingangskanäle nach Totband
    var tag,unit;
    var idCheck,idSpinner,idCount;
    var checkedDeadband;
    //alert(typeof(ListPlotter.Definition));
    //ListPlotter.Definition.inputs = new Array(0);

    if (typeof(ListPlotter.Definition.inputs) == "undefined") ListPlotter.Definition.inputs = new Array(0);
    //alert(this.trend.tags.cI[0]);
    $( DOMquery ).empty();
    for (var i=0;(i < TrendInputEvents.trend.tags.cI.length) && (i < TrendInputEvents.trend.countInpMax);i++){
      //alert(this.trend.tags.cI[i]);
      tag=TrendInputEvents.trend.tags.cI[i];
      unit=TrendInputEvents.trend.units.cI[i];
      idCheck="CheckboxReportBlockInputs_" + i;
      idSpinner="SpinnerReportBlockInputs_" + i;
      idCount="CountReportBlockInputs_" + i;
      $( DOMquery ).append(
        //'<fieldset>' +
        '<div class="ControlGroupReportBlock">' +
        '<label for="' + idCheck +'">' + tag +
        '<input type="checkbox" name="' + idCheck + '" id="' + idCheck + '">' +
        '</label>' +
        '<input class="SpinnerReportBlock" id="' + idSpinner + '" name="value">' +
        '<span class="SpinnerReportBlockUnit">' + unit + '</span>' +
        '<span class="ReportBlockCount" id="' + idCount + '">(?)</span>' +  //anzahl der resultierenden events
        '</div>'//</fieldset>'
      );
      if (ListPlotter.Definition.inputs[i]==null){ //pseudoinit wenn keine Daten aus letzter session
        $( "#" + idSpinner ).spinner({
          step: 0.1,
          min: 0,
        }).val(Trendfile.getDeadbandFromUnitStr(unit)).width(30);
        $( "#" + idCheck ).checkboxradio();
        ListPlotter.Definition.inputs[i]=new Object;
        ListPlotter.Definition.inputs[i].deadb = Trendfile.getDeadbandFromUnitStr(unit);
        //alert(this.Definition.inputs[i].deadb);
        ListPlotter.Definition.inputs[i].checked=false;
      }else {
        $( "#" + idSpinner ).spinner({
          step: 0.1,
          min: 0,
        }).val(ListPlotter.Definition.inputs[i].deadb).width(30);
        //$( "#" + idCheck ).attr('checked',true);
        $( "#" + idCheck ).checkboxradio();
        $( "#" + idCheck).prop('checked',ListPlotter.Definition.inputs[i].checked).checkboxradio('refresh');
      }

      //hier noch click handler anhängen auf checkbox
      $( "#" + idCheck ).on("change",function(event){
          var s=event.target.id;
          var indexStr=s.substr(s.indexOf('_')+1);
          TrendInputEvents.onReportFilterInputsChange(Number.parseInt(indexStr));
          //alert(event.target.id);
      });
      //hier noch click handler anhängen auf spinner
      $( "#" + idSpinner ).spinner({change: function( event, ui ) {
        //alert(event.target.id);
        var s=event.target.id;
        var indexStr=s.substr(s.indexOf('_')+1);
        TrendInputEvents.onReportFilterInputsChange(Number.parseInt(indexStr));
        //alert(event.target.id);
      }});
      //hier einmal pushen in preview auslösen für alle aufgebauten groups
      TrendInputEvents.onReportFilterInputsChange(i);
    }//end for
  }

  /**
   *  Erneuert Auswahl der Eingangskanäle in ReportDefinition
      und bildet vorschau counts
   */
  static onReportFilterInputsChange(index){

    var idCheck="CheckboxReportBlockInputs_" + index;
    var idSpinner="SpinnerReportBlockInputs_" + index;

    ListPlotter.Definition.inputs[index].checked=($('#' +  idCheck ).prop("checked")==true); //aus form in definition übernehmen
    //alert($( '#' + idSpinner ).val());
    ListPlotter.Definition.inputs[index].deadb=parseFloat($( '#' + idSpinner ).val());
    if (ListPlotter.preParsedDomOutputs.inputs == null) ListPlotter.preParsedDomOutputs.inputs = new Array(0);
    ListPlotter.preParsedDomOutputs.inputs[index]=new Array(0);
    //alert(this.preParsedDomOutputs.inputs[index].length);
    if (ListPlotter.Definition.inputs[index].checked){
      var channelName=TrendInputEvents.trend.tags.cI[index];
      //alert(channelName);
      var deadb = ListPlotter.Definition.inputs[index].deadb;
      var oldValue=TrendInputEvents.trend.line[0].data.cI[index] - deadb;

      for (var i=0;i<TrendInputEvents.trend.dataLinesRead;i++){
        if (Math.abs(TrendInputEvents.trend.line[i].data.cI[index] - oldValue) >= deadb) {
          oldValue=TrendInputEvents.trend.line[i].data.cI[index];
          ListPlotter.preParsedDomOutputs.inputs[index].push({
            // to do:  hier besser vorereitetes snippet mit styleklassen und einheiten generieren
            rawtime: TrendInputEvents.trend.line[i].timeRaw, //PFlicht-Sortierschlüssel!!!
            output :  '<span class="reportListTimestamp">' + TrendInputEvents.trend.line[i].time.toUTCString() + "</span>" +
                      '<span class="reportListFirstCol"><b>Input</b> value of<span class="reportListInputTag">' + channelName  + "</span></span> was" +
                      '<span class="reportListValue">' + BinaryBRStructFile.roundWithUnit(oldValue,TrendInputEvents.trend.units.cI[index]) + " " + TrendInputEvents.trend.units.cI[index] +  "</span>"
          });
        }
      }
    }
    //count aktualisieren in der group
    var idCount="#CountReportBlockInputs_" + index;
    $(idCount).html('(' + ListPlotter.preParsedDomOutputs.inputs[index].length + ')');
    //hier noch update des preview blocks
    ListPlotter.updateMainListButton();
    //speichert die filterreglen für die nächste session
    ListPlotter.saveUserSettings();
  }
}
