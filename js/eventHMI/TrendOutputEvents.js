/**
*   Kapselt alle Methoden für die Erstellung der steuerelemente und zum plotten für
Trend-Einträge der Ausgangskanäle
  *

  dynamische erzeugung der Filter-Steuerelemente
 *@author TK, 05/2021, version 1.0.1
 *

*/
"use strict";
class TrendOutputEvents{
  static init(DOMquery,trend){
    TrendOutputEvents.trend=trend;
    $( DOMquery ).empty();
    //Eingangskanäle nach Totband
    var tag,unit;
    var idCheck,idSpinner,idCount;
    var checkedDeadband;
    if (typeof(ListPlotter.Definition.outputs) == "undefined") ListPlotter.Definition.outputs = new Array(0);
    for (var i=0;(i < TrendOutputEvents.trend.tags.cO.length) && (i < TrendOutputEvents.trend.countOutpMax);i++){
      tag=TrendOutputEvents.trend.tags.cO[i];
      unit=TrendOutputEvents.trend.units.cO[i];
      idCheck="CheckboxReportBlockOutputs_" + i;
      idSpinner="SpinnerReportBlockOutputs_" + i;
      idCount="CountReportBlockOutputs_" + i;
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
    if (ListPlotter.Definition.outputs[i] == null){ //pseudoinit wenn keine Daten aus letzter session
        $( "#" + idSpinner ).spinner({
          step: 0.1,
          min: 0,
        }).val(Trendfile.getDeadbandFromUnitStr(unit)).width(30);
        $( "#" + idCheck ).checkboxradio();
        ListPlotter.Definition.outputs[i]=new Object;
        ListPlotter.Definition.outputs[i].deadb = Trendfile.getDeadbandFromUnitStr(unit);
        //alert(this.Definition.outputs[i].deadb);
        ListPlotter.Definition.outputs[i].checked=false;
      }else {
        $( "#" + idSpinner ).spinner({
          step: 0.1,
          min: 0,
        }).val(ListPlotter.Definition.outputs[i].deadb).width(30);
        //$( "#" + idCheck ).attr('checked',true);
        $( "#" + idCheck ).checkboxradio();
        $( "#" + idCheck).prop('checked',ListPlotter.Definition.outputs[i].checked).checkboxradio('refresh');
      }

      //hier noch click handler anhängen auf checkbox
      $( "#" + idCheck ).on("change",function(event){
          var s=event.target.id;
          var indexStr=s.substr(s.indexOf('_')+1);
          TrendOutputEvents.onReportFilterOutputsChange(Number.parseInt(indexStr));
          //alert(event.target.id);
      });
      //hier noch click handler anhängen auf spinner
      $( "#" + idSpinner ).spinner({change: function( event, ui ) {
        //alert(event.target.id);
        var s=event.target.id;
        var indexStr=s.substr(s.indexOf('_')+1);
        TrendOutputEvents.onReportFilterOutputsChange(Number.parseInt(indexStr));
        //alert(event.target.id);
      }});
      //hier einmal pushen in preview auslösen für alle aufgebauten groups
      TrendOutputEvents.onReportFilterOutputsChange(i);
    }//end for
  }

  /**
   *  Erneuert Auswahl der Ausgangskanäle in ReportDefinition
      und bildet vorschau counts
   */
  static onReportFilterOutputsChange(index){

    var idCheck="CheckboxReportBlockOutputs_" + index;
    var idSpinner="SpinnerReportBlockOutputs_" + index;

    ListPlotter.Definition.outputs[index].checked=($('#' +  idCheck ).prop("checked")==true); //aus form in definition übernehmen
    //alert($( '#' + idSpinner ).val());
    ListPlotter.Definition.outputs[index].deadb=parseFloat($( '#' + idSpinner ).val());
    if (ListPlotter.preParsedDomOutputs.outputs == null) ListPlotter.preParsedDomOutputs.outputs = new Array(0);
    ListPlotter.preParsedDomOutputs.outputs[index]=new Array(0);
    //alert(this.preParsedDomOutputs.outputs[index].length);
    if (ListPlotter.Definition.outputs[index].checked){
      var channelName=TrendOutputEvents.trend.tags.cO[index];
      //alert(channelName);
      var deadb = ListPlotter.Definition.outputs[index].deadb;
      var oldValue=TrendOutputEvents.trend.line[0].data.cO[index] - deadb;

      for (var i=0;i<TrendOutputEvents.trend.dataLinesRead;i++){
        if (Math.abs(TrendOutputEvents.trend.line[i].data.cO[index] - oldValue) >= deadb) {
          oldValue=TrendOutputEvents.trend.line[i].data.cO[index];
          ListPlotter.preParsedDomOutputs.outputs[index].push({
            // to do:  hier besser vorereitetes snippet mit styleklassen und einheiten generieren
            rawtime: TrendOutputEvents.trend.line[i].timeRaw, //PFlicht-Sortierschlüssel!!!
            output :  '<span class="reportListTimestamp">' + TrendOutputEvents.trend.line[i].time.toUTCString() + "</span>" +
                      '<span class="reportListFirstCol"><b>Output</b> value of<span class="reportListOutputTag">' + channelName  + "</span></span> was" +
                      '<span class="reportListValue">' + BinaryBRStructFile.roundWithUnit(oldValue,TrendOutputEvents.trend.units.cO[index]) + " " + TrendOutputEvents.trend.units.cO[index] +  "</span>"
          });
        }
      }
    }
    //count aktualisieren in der group
    var idCount="#CountReportBlockOutputs_" + index;
    $(idCount).html('(' + ListPlotter.preParsedDomOutputs.outputs[index].length + ')');
    //hier noch update des preview blocks
    ListPlotter.updateMainListButton();
    //speichert die filterreglen für die nächste session
    ListPlotter.saveUserSettings();
  }
}
