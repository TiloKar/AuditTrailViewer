/**
 *  Factoryklasse für dom-ausgaben der interlockings

 *  *@author TK, 06/2021, version 1.0.1
 */
"use strict";
class Interlocking {
  constructor(d){
    this.locks = [];
    this.names = [];
    for (var i = 0 ; i < d.seqFiles.length ; i++){
      if(d.seqFiles[i].user > 1){
        this.locks.push(d.seqFiles[i].locking);
        this.names.push(d.seqFiles[i].tag);
      }
    }

  }
/**
  gibt inrelocking tabelle aus
*/
  getIntelockingTable(){
    var seqUsed=this.names.length;
    var back=   '<div class="myTable"><table><tbody><tr><th></th>';
    for (var k=0;k<seqUsed;k++) back+='<th  class="verticalText">' + this.names[k] + '</th>';  //kopfzeile
    back+=      '</tr>';
    var lastCol=1;
    for (var i=1;i<seqUsed;i++){ //alle zeilen ab zweiter sequenz
        back+=  '<tr><th>' + this.names[i] + '</th>';  //name
        for (var k=0;k<lastCol;k++){
          if (this.locks[i][k]){ //falls gelockt, eintragen
            back+=  '<td class="lockedSeq">x</td>';
          }else{
            back+=  '<td></td>';
          }
        }

        for (k;k<seqUsed;k++) back+=  '<td></td>'; //nicht geprüfte anhänegn
        lastCol++; //jedesmal eine weniger überprüfen
        back+=  '</tr>';
    }
    back+=   '</tbody></table></div>';
    return back
  }
}
