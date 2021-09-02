/**
 *  Seq Action 82
    setze zähler
 *
 *  *@author TK, 06/2021, version 1.0.1
 */
"use strict";
class SeqRowType82 extends SeqRowTypeX{

  constructor(seq,r,indexRow){
    super(r);
    this.counter="counter " + (r.parUINT[1] + 1);
    this.global=seq.getGlobal(r.globalCon[0],indexRow + 1,"");
    if (this.global===false){
      this.value=r.parUINT[2];
    }else {
      this.value = this.global.value;
    }
  }

  getActionDiv(){
    var back= '<div class="seqTransitionEntry">set <b>' + this.counter + '</b> to ' + this.value;
    if (this.global!== false)
      back+=this.global.text;
    back+="</div>";
    return back;
  }

}
