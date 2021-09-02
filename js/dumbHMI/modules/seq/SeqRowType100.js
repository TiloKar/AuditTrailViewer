/**
 *  Seq Action 100
 timer in minuten
 *
 *  *@author TK, 06/2021, version 1.0.1
 */
"use strict";
class SeqRowType100 extends SeqRowTypeX{

  constructor(seq,r,indexRow){
    super(r);
    this.globalValue=seq.getGlobal(r.globalCon[0],indexRow + 1,"min");
    if (this.globalValue===false){
      this.timeout=r.parUDINT[0];
    }else {
      this.timeout = this.globalValue.value;
    }
    this.timeoutSek=r.parUINT[1];
  }

  getActionDiv(){

    var back= '<div class="seqTransitionEntry">Wait <span class="seqTimeValue">' + this.timeout  +
              ' min ';
    if (this.timeoutSek > 0) back+=''+this.timeoutSek + 'sek ';
    back+="</span>";
    if (this.globalValue!== false)
      back+=" " + this.globalValue.text;
    back+="</div>";
    return back;
  }

}
