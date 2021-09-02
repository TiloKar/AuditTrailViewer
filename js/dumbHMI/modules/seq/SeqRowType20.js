/**
 *  Seq Action 20
 Sollwert Sprung
 *
 *  *@author TK, 06/2021, version 1.0.1
 */
"use strict";
class SeqRowType20 extends SeqRowTypeX{

  constructor(seq,r,indexRow){
    super(r);
    this.name=seq.getLoopName(r.parUINT[1]);
    this.unit=seq.getLoopUnit(r.parUINT[1]);
    this.global=seq.getGlobal(r.globalCon[0],indexRow + 1,this.unit);
    if (this.global===false){
      this.value=r.parReal[0];
    }else {
      this.value = this.global.value;
    }
  }

  getActionDiv(){
    var back= '<div>Controll Loop Channel <span class="seqLoopValue">' + this.name  +
              '</span> is set to <span class="seqLoopValue">' + this.value + " " + this.unit + "</span>";
    if (this.global!== false)
      back+=" " + this.global.text;
    back+="</div>";
    return back;
  }

}
