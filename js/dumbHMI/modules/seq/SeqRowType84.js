/**
 *  Seq Action 84
    prüfe zähler und springe
 *
 *  *@author TK, 06/2021, version 1.0.1
 */
"use strict";
class SeqRowType84 extends SeqRowTypeX{

  constructor(seq,r,indexRow){
    super(r);
    this.counter="counter " + (r.parUINT[1] + 1);
    this.global=seq.getGlobal(r.globalCon[0],indexRow + 1,"");
    if (this.global===false){
      this.value=r.parUINT[2];
    }else {
      this.value = this.global.value;
    }
    this.upOrEqualStep="next";
    if (r.parUINT[4]>0) this.upOrEqualStep= String(r.parUINT[4]);
    this.lowerStep="next";
    if (r.parUINT[5]>0) this.lowerStep= String(r.parUINT[5]);
  }

  getActionDiv(){
    var back= '<div class="seqTransitionEntry">compare <b>' + this.counter + '</b> to ' + this.value + ' ';
    if (this.global!== false)
      back+=this.global.text;
    back+=  '<br>if counter &gt;= ' + this.value + ' jump to ' + this.upOrEqualStep;
    back+=  '<br>if counter &lt; ' + this.value + ' jump to ' + this.lowerStep;
    back+="</div>";
    return back;
  }

}
