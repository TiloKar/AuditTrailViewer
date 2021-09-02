/**
 * Gesammelte ideen/Hilfsfunktionen für Dumpdatei
 Teilweise zum normalisieren beim sequenzschreiben 1124 genutzt
 *
 *  *@author TK, 04/2020,   version 1.0.1

 */
"use strict";
class DumbBrainstorming {

  /**
  gibt json mit übersicht zur listUsage aller ventilzeilen in den Sequenzen
  kein DOM-output, wurde erstmal nur über der heap-funktionen der Browser-konsole gesichtet, soweit OK
*/
  static getValveDependencies (d){
    var v=d.fileValves;
    var s=d.seqFiles;

    //{Matrixzeilenname, {seqname , {index zeilenname}[]}[]}

    var out=new Array(0); //finales ausgabe array über alle ventilzeilen

    for (var i=0;i<v.length;i++){  //alle ventilzeilen
      var outrow={index: i,valveRowTag : v[i].tag , seq : []};
      for (var k=0;k<s.length;k++){  //alle seq definitionen
        var srow={index: k, seqTag : s[k].tag , row : []};
        for (var m=0;m<s[k].row.length;m++){//alle zeilen in der seq definition
          if ((s[k].row[m].parUINT[0] == 60)&&(s[k].row[m].parUINT[1])===i){//wenn ventilzeile richtiger typ und referenz auf diese out-zeile
            var outRowFund = out.find(e => e.index === i); //prüfen ob out-zeile schon einmal referenziert
            if (outRowFund == null){  //noch nie diese out-zeile eingehangen
              var vrow = {index: m, tag: s[k].row[m].tag};
              srow.row.push(vrow); //diese referenz in neue sequenzzeile pushen
              outrow.seq.push(srow);
              out.push(outrow);//diese sequenz in neue out zeile pushen
            }else{//out-zeile wurde schon referenziert
              var seqRowFund = outRowFund.seq.find(e => e.index === k);//prüfen ob seq-zeile schon einmal referenziert
              if (seqRowFund == null){ //seq noch nie aufgenommen
                var vrow = {index: m, tag: s[k].row[m].tag};
                srow.row.push(vrow); //diese referenz in neue sequenzzeile pushen
                outRowFund.seq.push(srow);  //diese sequenz in bestehende out zeile pushen
              }else{//seq schon aufgenommen
                var vrow = {index: m, tag: s[k].row[m].tag};
                seqRowFund.row.push(vrow); //diese referenz in bestehnde sequenzzeile pushen
              }
            }
          }
        }
      }
    }
    return out;
  }

}
