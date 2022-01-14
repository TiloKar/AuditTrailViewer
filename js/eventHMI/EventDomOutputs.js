/**
 *  Enthällt ststische Methoden für die DOM Strings zur menschenlesbaren Ausgabe der Eventdatei und Trenddatei
 *
 *
 *  *@author TK, 04/2020,   version 1.0.1

 * to do in ListPlotter umziehen lassen
 *
 */
"use strict";
class EventDOMOutputs   {

  static makeHeaderTable(trends,events){
    var age=Math.ceil((trends.lastDat - trends.firstDat)/1000/60/60);
    $('#headerInfoTrendfile').html(
      "<table><tbody><tr>   <th>Total batch time: </th><td>"              + String(age) + ' hours' +
      "</td></tr><tr>       <th>Last sample time from header:</th><td>"   + trends.firstDat.toUTCString() +
      "</td></tr><tr>       <th>Last sample time from header:</th><td>"   + trends.lastDat.toUTCString() +
      "</td></tr><tr>       <th>User Comment: </th><td>"                   + trends.comment +
      "</td></tr><tr>       <th>Data lines header: </th><td>"             + String(trends.lineCount) +
      "</td></tr><tr>       <th>Data lines read: </th><td>"               + String(trends.dataLinesRead) +
      "</td></tr><tr>       <th>Bytes skipped: </th><td>"                 + String(trends.bytesSkipped) + " / " + String(events.bytesSkipped) +
      "</td></tr><tr>       <th>Events read: </th><td>"                   + String(events.records) +
      "</td></tr><tr>       <th>Max. events in buffer: </th><td>"         + String(events.maxBufCount) +
      "</td></tr><tr>       <th>Max. eventbuffer size: </th><td>"         + String(events.maxBufSize) +
      "</td></tr><tr>       <th>Sampling rate: </th><td>"                 + String(trends.samplingRate) + ' sek' +
      "</td></tr><tr>       <th>Device Ident: </th><td>"                  + String(trends.ident) +
      "</td></tr><tr>       <th>Controller: </th><td>"                    + String(trends.countCLMax) +
      "</td></tr><tr>       <th>Outputs: </th><td>"                       + String(trends.countOutpMax) +
      "</td></tr><tr>       <th>Inputs: </th><td>"                        + String(trends.countInpMax) +
      "</td></tr></tbody></table>");
  }
  /**
  - erzeugt den string für die rückgabe vom Alrmlisteneintrag generix,serial,x20
    im listplotter
    @param alertSubClass index der alrm subclasse 0- generic, 1-serial ,2-x20
    @param alertType typcode des alrms 0-come, 1-gone, 2 ack
    @param index   index innerhalb der subklasse
  */
  static makeGenericAlertEntry(alertSubClass,alertType,index){
    var back="";
    var alertSubClassString = new Array();
    alertSubClassString.push ("System Alert",
      "Communication Alert",
      "Hardware Alert");
    var alertTypeString = new Array();
    alertTypeString.push('<span class="alertCome">come</span>',
      '<span class="alertGone">gone</span>',
      '<span class="alertAck">ack.</span>');
    back=  '<span class="reportListFirstCol reportListError">' + alertSubClassString[alertSubClass] + '</span>';
    back+= alertTypeString[alertType];

    var alertSystemsString = new Array();
    alertSystemsString[5] = "Actuator in Controller Mode is bypassed";
    alertSystemsString[8] = "error Temp Jacket";
    alertSystemsString[9] = "error Temp Vessel";
    alertSystemsString[10] = "Stirrer Motor error";
    alertSystemsString[12] = "System has started with last IO state";
    alertSystemsString[19] = "to less internal memory for trending";
    alertSystemsString[21] = "error Temp Transfer";
    alertSystemsString[22] = "error Temp Exhaust";
    alertSystemsString[24] = "High Foam";
    alertSystemsString[25] = "Overpressure, save state initialised...";
    alertSystemsString[26] = "Bus error valve cluster";
    alertSystemsString[27] = ""; //kopiervorlage
    var alertSerialsString = new Array();
    alertSerialsString[0] = "Error on RS485 pH Modul";
    alertSerialsString[1] = "Error on RS485 OXY Modul";
    alertSerialsString[2] = "Error on RS485 COND1 Modul";
    alertSerialsString[3] = "Error on RS485 COND2 Modul";
    alertSerialsString[4] = "Error on RS485 HIGHFOAM Modul";
    alertSerialsString[10] = "Error on MFC Bus Channel 1";
    alertSerialsString[11] = "Error on MFC Bus Channel 2";
    alertSerialsString[12] = "Error on MFC Bus Channel 3";
    alertSerialsString[13] = "Error on MFC Bus Channel 4";
    alertSerialsString[20] = "Error on Visiferm RS485 channel";
    alertSerialsString[21] = "Error on pH 1 RS485 channel ";
    alertSerialsString[22] = "Error on pH 2 RS485 channel ";
    alertSerialsString[23] = "Error on ORP RS485 channel ";
    alertSerialsString[24] = "Error on DCO2 RS485 channel ";
    alertSerialsString[25] = "Error on RS485 DS module";
    alertSerialsString[27] = ""; //kopiervorlage
    var alertX20String = new Array();
    for (var i = 0; i < 50; i++) {
      alertX20String[i] = "X20 module error on ST" + String(i+1);
    }
    var alertGenericString = new Array();
    alertGenericString.push(alertSystemsString,alertSerialsString,alertX20String);
    back+= '<br><span class="reportListAlertText">' + alertGenericString[alertSubClass][index] + '</span>';

    return back;
  }

  /**
   - erzeugt den string für die rückgabe vom Nutzeralarmen
      im listplotter
      @param alertSubClass index der alrm subclasse 0-HH,1-H,2-L,3-LL
      @param alertType typcode des alrms 0-come, 1-gone, 2 ack
      @param inputTag string mit kanalbezeichnungen aus dumb
  */
  static makeUserAlertEntry(alertSubClass,alertType,inputTag){
    var back="";
    var alertSubClassString = new Array();
    alertSubClassString.push ("HH Alert",
      "H Alert",
      "L Alert",
      "LL Alert");
    var alertTypeString = new Array();
    alertTypeString.push('<span class="alertCome">come</span>',
      '<span class="alertGone">gone</span>',
      '<span class="alertAck">ack.</span>');
    back=  '<span class="reportListFirstCol reportListError">' + alertSubClassString[alertSubClass];
    back+= ' on ' + '<span class="reportListAlertInputTag">' + inputTag + '</span></span>';
    back+= alertTypeString[alertType];

    return back;
  }
  /**
   - erzeugt den string für die rückgabe vom custom alarmen
      im listplotter
      @param customString string index der alrm subclasse 0-HH,1-H,2-L,3-LL
      @param alertType typcode des alrms 0-come, 1-gone, 2 ack
  */
  static makeCustomAlertEntry(customString,alertType){

  }

}
