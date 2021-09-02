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





}
