/**
 *  Seq Action 110
 timer in sekunden
 *
 *  *@author TK, 06/2021, version 1.0.1
 */
"use strict";
class SeqRowType110 extends SeqRowTypeX{

  constructor(seq,r,indexRow){
    super(r);
    this.globalValue=seq.getGlobal(r.globalCon[0],indexRow + 1,"sek");
    if (this.globalValue===false){
      this.timeout=r.parUDINT[0];
    }else {
      this.timeout = this.globalValue.value;
    }
  }

  getActionDiv(){

    var back= '<div class="seqTransitionEntry">Wait <span class="seqTimeValue">' + this.timeout  +' sek</span>';
    if (this.globalValue!== false)
      back+=" " + this.globalValue.text;
    back+="</div>";
    return back;
  }

}
