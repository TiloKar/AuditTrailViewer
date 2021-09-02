/**
*   Kapselt alle Methoden für die Erstellung der steuerelemente und zum plotten für
Trend-Einträge der Regelkreise
  *

  dynamische erzeugung der Filter-Steuerelemente
 *@author TK, 05/2021, version 1.0.1
 *

*/
"use strict";
class TrendLoopEvents{
  static init(DOMquery,trend){
    TrendLoopEvents.trend=trend;
    $( DOMquery ).empty();
    //Eingangskanäle nach Totband
    var tag,unit;
    var idCheck,idSpinner,idCount;
    var checkedDeadband;
    //  alert(ListPlotter.Definition.loops.length);
    if (typeof(ListPlotter.Definition.loops) == "undefined") ListPlotter.Definition.loops = new Array(0);
    for (var i=0;(i < TrendOutputEvents.trend.tags.cCL.length) && (i < TrendOutputEvents.trend.countCLMax);i++){
    //  alert("hier2");
      tag=TrendLoopEvents.trend.tags.cCL[i];
      unit=TrendLoopEvents.trend.units.cCL[i];
      idCheck="CheckboxReportBlockLoops_" + i;
      idSpinner="SpinnerReportBlockLoops_" + i;
      idCount="CountReportBlockLoops_" + i;
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
      if (ListPlotter.Definition.loops[i] == null){ //pseudoinit wenn keine Daten aus letzter session
        $( "#" + idSpinner ).spinner({
          step: 0.1,
          min: 0,
        }).val(Trendfile.getDeadbandFromUnitStr(unit)).width(30);
        $( "#" + idCheck ).checkboxradio();
        ListPlotter.Definition.loops[i]=new Object;
        ListPlotter.Definition.loops[i].deadb = Trendfile.getDeadbandFromUnitStr(unit);
        //alert(ListPlotter.Definition.outputs[i].deadb);
        ListPlotter.Definition.loops[i].checked=false;
      }else {
        $( "#" + idSpinner ).spinner({
          step: 0.1,
          min: 0,
        }).val(ListPlotter.Definition.loops[i].deadb).width(30);
        //$( "#" + idCheck ).attr('checked',true);
        $( "#" + idCheck ).checkboxradio();
        $( "#" + idCheck).prop('checked',ListPlotter.Definition.loops[i].checked).checkboxradio('refresh');
      }

      //hier noch click handler anhängen auf checkbox
      $( "#" + idCheck ).on("change",function(event){
          var s=event.target.id;
          var indexStr=s.substr(s.indexOf('_')+1);
          TrendLoopEvents.onReportFilterLoopsChange(Number.parseInt(indexStr));
          //alert(event.target.id);
      });
      //hier noch click handler anhängen auf spinner
      $( "#" + idSpinner ).spinner({change: function( event, ui ) {
        //alert(event.target.id);
        var s=event.target.id;
        var indexStr=s.substr(s.indexOf('_')+1);
        TrendLoopEvents.onReportFilterLoopsChange(Number.parseInt(indexStr));
        //alert(event.target.id);
      }});
      //hier einmal pushen in preview auslösen für alle aufgebauten groups
      this.onReportFilterLoopsChange(i);
    }//end for
  }

  static onReportFilterLoopsChange(index){

    var idCheck="CheckboxReportBlockLoops_" + index;
    var idSpinner="SpinnerReportBlockLoops_" + index;

    ListPlotter.Definition.loops[index].checked=($('#' +  idCheck ).prop("checked")==true); //aus form in definition übernehmen
    //alert($( '#' + idSpinner ).val());
    ListPlotter.Definition.loops[index].deadb=parseFloat($( '#' + idSpinner ).val());
    if (ListPlotter.preParsedDomOutputs.loops == null) ListPlotter.preParsedDomOutputs.loops = new Array(0);
    ListPlotter.preParsedDomOutputs.loops[index]=new Array(0);
    //alert(ListPlotter.preParsedDomOutputs.outputs[index].length);
    if (ListPlotter.Definition.loops[index].checked){
      var channelName=TrendLoopEvents.trend.tags.cCL[index];
      //alert(channelName);
      var deadb = ListPlotter.Definition.loops[index].deadb;
      var oldValue=TrendLoopEvents.trend.line[0].data.cCL[index] - deadb;

      for (var i=0;i<TrendLoopEvents.trend.dataLinesRead;i++){
        if (Math.abs(TrendLoopEvents.trend.line[i].data.cCL[index] - oldValue) >= deadb) {
          oldValue=TrendLoopEvents.trend.line[i].data.cCL[index];
          ListPlotter.preParsedDomOutputs.loops[index].push({
            // to do:  hier besser vorereitetes snippet mit styleklassen und einheiten generieren
            rawtime: TrendLoopEvents.trend.line[i].timeRaw, //PFlicht-Sortierschlüssel!!!
            output :  '<span class="reportListTimestamp">' + TrendLoopEvents.trend.line[i].time.toUTCString() + "</span>" +
                      '<span class="reportListFirstCol"><b>Setpoint</b> value of<span class="reportListLoopTag">' + channelName  + "</span></span> was" +
                      '<span class="reportListValue">' + BinaryBRStructFile.roundWithUnit(oldValue,TrendLoopEvents.trend.units.cCL[index]) + " " + TrendLoopEvents.trend.units.cCL[index] +  "</span>"
          });
        }
      }
    }
    //count aktualisieren in der group
    var idCount="#CountReportBlockLoops_" + index;
    $(idCount).html('(' + ListPlotter.preParsedDomOutputs.loops[index].length + ')');
    //hier noch update des preview blocks
    ListPlotter.updateMainListButton();
    //speichert die filterreglen für die nächste session
    ListPlotter.saveUserSettings();
  }
}
