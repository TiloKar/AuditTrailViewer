/**
 * Konstruktorenaufrufe für jQuery UI Steuerelemente
 * Siehe JQuery UI API
 */
 HMI.makeControlElementBindings = function(){
  //$("#ButtonReportBlockInputs").button().click(HMI.refreshReportBlockInput);
//  $("#ButtonReportBlockUserEvents").button().click(HMI.refreshReportUserEvents);
  $("#ButtonChooseNewTrendfile").button().click(function(){		$("#fileSelection").toggle( "slow", null);});
  $("#ButtonChooseNewTrendfile").hide();
  //$("#ButtonPrint").button().click( function(){window.print();}); Öffnet nur druckerdialog, nicht vorschau
  $("#ButtonToggleEditorView").button().click(function(){$("#editor").toggle( "slow", null);});
  $("#ButtonToggleEditorView").hide();
  $("#ButtonRefreshTrendfileList").button().click(HMI.atPrepareFileList);
  $("#ButtonLoadDump").button().click(function(){window.open('dumb.html', 'dumbWindowName');});
  $("#ButtonLoadDump").hide();
  $("#ButtonDrawReport").button().click(HMI.onFinalReportButton);
  $("#ButtonDrawReport").hide();
  $("#loadingScreen").dialog({autoOpen: false, modal:true, height: 400, width:600});
  $( "#DialogError404, #DialogErrorHeaderTrendfile, #DialogErrorFileSelection" ).dialog({dialogClass: "alert", autoOpen: false});
  $( "#progressbarloadingTrendfile" ).progressbar({max: 100, value:0});
  $( document ).tooltip();

}
