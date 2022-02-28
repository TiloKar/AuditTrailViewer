
/**Zentrale Ablaufsteuerung für At-Auswahl, Datei-parsen und Anstoßen des Seitenaufbaus im Event-teil
 *     !!!!!!!!!!!!     ACHTUNG keine class Notation sondern JS Object-Notation, da nur ein statisches HMI Objekt nötig
 *
 *@author TK, 04/2021, version 1.0.1
 *
*/
"use strict";
var trendfile1 = {};
var eventfile1 = {};
var dumpfile1 = {};
var localFiles1 = []; //sicher sortiertes array bei lokalem browsing

var idAT_1;     //die Explizite Abbildung auf Object Nummer 1 ist gedanklich vorbereitend für zukünftige vergleichsplots
var idUnit_1;

var HMI = {

  /** Der B&R webserver aktualisiert beim erzeugen neuer trenddateien die Dateiliste uf dem Server
   * Diese methode hängt ein onClick Event an jede zeile
   *
   * to do: Styling und Tooltip mit Hinweis auf Unit (auch als Klassenname bereits vom Server angelegt
   */
  atPrepareFileList(){
    //holt liste aus sps tohdatei und fügt click eventhandler für jede zeile an
    $("#fileListfromServer").load("plcfile/atfilenames.html", function(){
      $( ".trendfiles" ).click(HMI.onClickInTrendList);
      //ändert nativen B&R datumsinteger in JS Datumsobjektstring
      $(".trendfiles td:nth-child(2)").each(function() {
        var num = parseInt($(this).html());
        $(this).html(new Date(num * 1000).toUTCString());
      });
    });
  },

  /**
	 * Eventhandler zum dynamischen generieren des Zielpfades für Ajax request auf Trendfile
	 */
	onClickInTrendList(){
		//Pfad aus Dateinamen und unit-index aus Klassenbezeichner extrahieren
		idAT_1 = $(this).children("td:first-child").text();     //die Explizite Abbildung auf Object Nummer 1 ist vorbereitend für zukünftige vergleichsplots
		idUnit_1 = Number(this.className.slice(-1));
		//Call
		HMI.getTrendFile1('plcfile/TREND'+idUnit_1+'/' + idAT_1 + '.TREND');
	},

/**
  Handler für archivdateien, die lokal gebrowst und nicht vom server kommen
  rollt xhr/filereader kette an
*/
  onChangeInFileInput(){
    if (HMI.checkFileTypesOnArchiveInput(fileInput.files)){
      idAT_1 = localFiles1[0].name.substring(0,localFiles1[0].name.length - 6);
      idUnit_1 = 99; //marker für archiv plot
      HMI.getTrendFile1(localFiles1[0]);
    }else{
      $( "#DialogErrorFileSelection" ).dialog("open");
    }
  },

/**
  prüft ob drei dateien gewählt sind und ob die typen ok sind
  legt die file handles sicher im sortierten array ab
*/
  checkFileTypesOnArchiveInput(fList){
    var eventfile=false;
    var dumpfile=false;
    var trendfile=false;
    for (var i = 0; i < fList.length; i++) {
      var file=fList[i];
      if (file.name.indexOf('.EVENT') != -1) {
        eventfile=true;
        localFiles1[2]=file;
      }
      if (file.name.indexOf('.TREND') != -1) {
        trendfile=true;
        localFiles1[0]=file;
      }
      if (file.name.indexOf('.bbid') != -1){
        dumpfile=true;
        localFiles1[1]=file;
      }
    }
    return (eventfile && dumpfile && trendfile &&(fList.length===3));
  },
  /**
   * bargraph, während Dateidownload
   *
   */
  onprogressLoadingXHRFile(xhr){
    $( "#progressbarloadingTrendfile" ).progressbar( "option", "value", (xhr.loaded / xhr.total) * 100 );
    //alert(xhr.loaded);
  },
	/**
	 * Ajax request für Trendfile
	 */
	getTrendFile1(src){//binärer Ajax-GET mit Pfadstring
    if (typeof src === 'string'){
      const xhr = new XMLHttpRequest(); //	HMI.binRequest = new XMLHttpRequest();
      xhr.responseType="arraybuffer"; //	HMI.binRequest.responseType="arraybuffer";
  		xhr.open("GET", src, true);//HMI.binRequest.open("GET", path, true);
      //alert('');
  		xhr.onload = function(){
        if (xhr.status == 404){
    			//to do auf 404 reagieren, solange ungültige dateinamen in B&R zulässig, sehr wahrscheinlich
    			$( "#DialogError404" ).dialog("open");
    		}else{
          HMI.unzipTrendFile1(xhr.response,false)
        }
      }; //HMI.binRequest.onload = function(){HMI.trendfile.unzipTrendFile(HMI.binRequest)};
      xhr.addEventListener('progress', HMI.onprogressLoadingXHRFile);//HMI.binRequest.onprogress = function(){HMI.trendfile.onprogressHandlerTrendFile(HMI.binRequest)};
      $("#loadingScreen").dialog("open");//hier HMI Eventhandler für Ladefenster öffnen
      $("#loadingScreen h1").html("Getting Trend-File from PLC...");
      $( "#progressbarloadingTrendfile" ).progressbar( "option", "value", 0 );
  		xhr.send();                        //HMI.binRequest.send();
      return xhr;
    }else{//filereader für lokales browsen
      const fr = new FileReader(); //	HMI.binRequest = new XMLHttpRequest();
      //alert('');
      fr.onerror = function(){
        $( "#DialogError404" ).dialog("open");
      };
      fr.onload = function(){
        HMI.unzipTrendFile1(fr.result,true);
      }; //HMI.binRequest.onload = function(){HMI.trendfile.unzipTrendFile(HMI.binRequest)};
      fr.addEventListener('progress', HMI.onprogressLoadingXHRFile);//HMI.binRequest.onprogress = function(){HMI.trendfile.onprogressHandlerTrendFile(HMI.binRequest)};
      $("#loadingScreen").dialog("open");//hier HMI Eventhandler für Ladefenster öffnen
      $("#loadingScreen h1").html("Getting Trend-File from Archive...");
      $( "#progressbarloadingTrendfile" ).progressbar( "option", "value", 0 );
      fr.readAsArrayBuffer(src);                        //stat
      return fr;
    }
	},

	/**
	 * entpacken starten
	 * Trendfile.readDataBlock() ist asynchron, daher müssen eventhandler für jeden Zwischen-Aufruf
	 * und beenden des Lesens übergeben werden
	 *
	 */
	unzipTrendFile1(response,local){
    var nextCall;
    if (local===true){
      nextCall=function() {
         HMI.getDumpFile1(localFiles1[1]);
      }
    }else{
      nextCall=function() {
         HMI.getDumpFile1('plcfile/DUMP' + idUnit_1 + '/' + idAT_1 + '.bbid');
      }
    }

		trendfile1 = new Trendfile(response); //trendobject header und erste zeile synchron erzeugen

		if (trendfile1.firstLineOK === false){
      $('#DialogErrorValidation').html('Trendfiles first data line corrupted');
      $( "#DialogErrorValidation" ).dialog("open");
    }else if (trendfile1.CRC_A_OK === false) {
        $('#DialogErrorValidation').html('Trendfiles first Header Checksumm is corrupted');
        $( "#DialogErrorValidation" ).dialog("open");
    }else if (trendfile1.CRC_B_OK === false) {
        $('#DialogErrorValidation').html('Trendfiles second Header Checksumm is corrupted');
        $( "#DialogErrorValidation" ).dialog("open");
    }else if (trendfile1.tag !== idAT_1) {
        $('#DialogErrorValidation').html('Trendfiles tag name corrupted');
        $( "#DialogErrorValidation" ).dialog("open");
    }else{
			$("#editor").hide();
			$("#reportList").html("<br><br><br>");

			trendfile1.readDataBlock(//diese funktion ruft sich selbst rekursiv asynchron auf, bis entpackt ist
					//Hier HMI Eventhandler für Statusaktualisierung im Ladefenster
				event => {	$("#loadingScreen h1").html("Trend Lines read: " + trendfile1.dataLinesRead);
							$( "#progressbarloadingTrendfile" ).progressbar( "option", "value", trendfile1.percentRead );},
					//hier HMI Eventhandler für beenden des Ladens
        //event => {HMI.getEventFile1('plcfile/EVENTS' + idUnit_1 + '/' + idAT_1 + '.EVENT');});
        //event => {HMI.getDumpFile1('plcfile/DUMP' + idUnit_1 + '/' + idAT_1 + '.bbid');});
        nextCall);
		}
	},

  getDumpFile1(src){
    if ((trendfile1.lineCRCerrors > 0)||(trendfile1.eventFrameError > 0)) {
        let text=String(trendfile1.lineCRCerrors) + " Checksum-Errors in Trendfile"
        $('#DialogErrorValidation').html(text);
        $( "#DialogErrorValidation" ).dialog("open");
    }else if (typeof src === 'string'){
      const xhr = new XMLHttpRequest();
      xhr.responseType="arraybuffer";
      xhr.open("GET", src, true);

      xhr.onload = function(){
        if (xhr.status == 404){
          //to do auf 404 reagieren, solange ungültige dateinamen in B&R zulässig, sehr wahrscheinlich
          $( "#DialogError404" ).dialog("open");
        }else{
          HMI.unzipDumpFile1(xhr.response,false);
        }
      }; //HMI.binRequest.onload = function(){HMI.trendfile.unzipTrendFile(HMI.binRequest)};
      xhr.addEventListener('progress', HMI.onprogressLoadingXHRFile);//HMI.binRequest.onprogress = function(){HMI.trendfile.onprogressHandlerTrendFile(HMI.binRequest)};
      $("#loadingScreen").dialog("open");//hier HMI Eventhandler für Ladefenster öffnen
      $("#loadingScreen h1").html("Getting Dump-File from PLC...");
      $( "#progressbarloadingTrendfile" ).progressbar( "option", "value", 0 );
      xhr.send();                        //HMI.binRequest.send();
      return xhr;
    }else{//filereader für lokales browsen
      const fr = new FileReader(); //	HMI.binRequest = new XMLHttpRequest();
      //alert('');
      fr.onerror = function(){
        $( "#DialogError404" ).dialog("open");
      };
      fr.onload = function(){
        HMI.unzipDumpFile1(fr.result,true);
      }; //HMI.binRequest.onload = function(){HMI.trendfile.unzipTrendFile(HMI.binRequest)};
      fr.addEventListener('progress', HMI.onprogressLoadingXHRFile);//HMI.binRequest.onprogress = function(){HMI.trendfile.onprogressHandlerTrendFile(HMI.binRequest)};
      $("#loadingScreen").dialog("open");//hier HMI Eventhandler für Ladefenster öffnen
      $("#loadingScreen h1").html("Getting Dumb-File from Archive...");
      $( "#progressbarloadingTrendfile" ).progressbar( "option", "value", 0 );
      fr.readAsArrayBuffer(src);                        //stat
      return fr;
    }
  },
  /**
    entpackt dump infos
  */
  unzipDumpFile1(response,local){

      //var dobj = new BinaryBRTypedFile(response,"dumpfile_typ");
      var dobj = new Dumpfile(response,"dumpfile_typ");
      dumpfile1=dobj.elements;
      if (dobj.checkSumsOK() !== true) {
          $('#DialogErrorValidation').html("Dumpfile corrupted");
          $( "#DialogErrorValidation" ).dialog("open");
      }else if (dumpfile1.tag !== idAT_1) {
          $('#DialogErrorValidation').html('Dumpfiles tag name corrupted');
          $( "#DialogErrorValidation" ).dialog("open");
      }else if (local===true){
        HMI.getEventFile1(localFiles1[2]);
      }else{
        HMI.getEventFile1('plcfile/EVENTS' + idUnit_1 + '/' + idAT_1 + '.EVENT');
      }
  },

  /**
   * Ajax request für Trendfile
   */
  getEventFile1(src){//binärer Ajax-GET mit Pfadstring
    if (typeof src === 'string'){
      const xhr = new XMLHttpRequest(); //	HMI.binRequest = new XMLHttpRequest();
      xhr.responseType="arraybuffer"; //	HMI.binRequest.responseType="arraybuffer";
      xhr.open("GET", src, true);//HMI.binRequest.open("GET", path, true);
      xhr.onload = function(){
        if (xhr.status == 404){
          //to do auf 404 reagieren, solange ungültige dateinamen in B&R zulässig, sehr wahrscheinlich
          $( "#DialogError404" ).dialog("open");
        }else{
          HMI.unzipEventFile(xhr.response);
        }
      }; //HMI.binRequest.onload = function(){HMI.trendfile.unzipTrendFile(HMI.binRequest)};
      xhr.addEventListener('progress', HMI.onprogressLoadingXHRFile);//HMI.binRequest.onprogress = function(){HMI.trendfile.onprogressHandlerTrendFile(HMI.binRequest)};
      $("#loadingScreen").dialog("open");//hier HMI Eventhandler für Ladefenster öffnen
      $("#loadingScreen h1").html("Getting Event-File from PLC...");
      $( "#progressbarloadingTrendfile" ).progressbar( "option", "value", 0 );
      xhr.send();                        //HMI.binRequest.send();
      return xhr;
    }else{
      const fr = new FileReader(); //	HMI.binRequest = new XMLHttpRequest();
      //alert('');
      fr.onerror = function(){
        $( "#DialogError404" ).dialog("open");
      };
      fr.onload = function(){
        HMI.unzipEventFile(fr.result,true);
      }; //HMI.binRequest.onload = function(){HMI.trendfile.unzipTrendFile(HMI.binRequest)};
      fr.addEventListener('progress', HMI.onprogressLoadingXHRFile);//HMI.binRequest.onprogress = function(){HMI.trendfile.onprogressHandlerTrendFile(HMI.binRequest)};
      $("#loadingScreen").dialog("open");//hier HMI Eventhandler für Ladefenster öffnen
      $("#loadingScreen h1").html("Getting Event-File from Archive...");
      $( "#progressbarloadingTrendfile" ).progressbar( "option", "value", 0 );
      fr.readAsArrayBuffer(src);                        //stat
      return fr;
    }
  },

  /**
   * entpacken starten
   * Trendfile.readDataBlock() ist asynchron, daher müssen eventhandler für jeden Zwischen-Aufruf
   * und beenden des Lesens übergeben werden
   *
   */
  unzipEventFile(response){

    //  this.eventfile.blob = xhr.response; //blob für weitere Verwendung im objekt speichern
    eventfile1 = new Eventfile(response); //trendobject header und erste zeile synchron erzeugen
    eventfile1.readDataBlock(//diese funktion ruft sich selbst rekursiv asynchron auf, bis entpackt ist
        //Hier HMI Eventhandler für Statusaktualisierung im Ladefenster
      event => {	$("#loadingScreen h1").html("Event Lines read: " + eventfile1.eventsRead);
                  $( "#progressbarloadingTrendfile" ).progressbar( "option", "value", eventfile1.percentRead );
              },
        //hier HMI Eventhandler für beenden des Ladens
      event => {  HMI.onFinishUnzip();}
    );

  },

  onFinishUnzip(){
    //alert(eventfile1.eventCRCerrors);
    if ((eventfile1.eventCRCerrors > 0)||(eventfile1.eventFrameError > 0)) {
        let text="Checksum-Errors in Eventfile"
        $('#DialogErrorValidation').html(text);
        $( "#DialogErrorValidation" ).dialog("open");
    }
    $("#loadingScreen").dialog("close");//hier HMI Eventhandler für Ladefenster öffnen
    $('#headerFilename').html(idAT_1);
    $("#fileSelection").hide();
    document.title = "bbi-AT-Events #" + idAT_1;

    ListPlotter.init(trendfile1,eventfile1,dumpfile1);
    //FIL.makeReportFilterInputs("#reportBlockInputs");
    $("#ButtonDrawReport").show();
    $("#ButtonChooseNewTrendfile").show();

    $('#editor').accordion({
      heightStyle: "content", active: false, collapsible: true
    });
    //HMI.makeReportList("preview");

    EventDOMOutputs.makeHeaderTable(trendfile1,eventfile1);
    $("#ButtonToggleEditorView").show();
    $("#ButtonLoadDump").show();
    $("#editor").show("slow");
  },

  onFinalReportButton(){
    $('#reportList').empty();
    $("#loadingScreen").dialog("open");//hier HMI Eventhandler für Ladefenster öffnen
    $("#loadingScreen h1").html("Building up Report: ");
    $("#editor").hide();
    ListPlotter.makeReportList(
      event => {
                  $("#loadingScreen h1").html("Building up Report: " + ListPlotter.asyReportRead + " of " + ListPlotter.preParsedDomOutputs.length + " printed...");
                  $( "#progressbarloadingTrendfile" ).progressbar( "option", "value", ListPlotter.asyReportRead * 100 / ListPlotter.preParsedDomOutputs.length );
              },
      //hier HMI Eventhandler für Beenden des Ladens
      event => {  $("#loadingScreen").dialog("close");});
  }
}
