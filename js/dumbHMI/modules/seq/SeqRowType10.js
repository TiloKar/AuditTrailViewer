/**
 *  Seq Action 10
 Ausgangskanal sprung
 *
 *  *@author TK, 06/2021, version 1.0.1
 */
"use strict";
class SeqRowType10 extends SeqRowTypeX{

  constructor(seq,r,indexRow){
    super(r);
    this.name=seq.getOutputName(r.parUINT[1]);
    this.unit=seq.getOutputUnit(r.parUINT[1]);
    this.global=seq.getGlobal(r.globalCon[0],indexRow + 1,this.unit);
    if (this.global===false){
      this.value=r.parReal[0];
    }else {
      this.value = this.global.value;
    }
  }

  getActionDiv(){
    var back= '<div>Output Channel <span class="seqOutputValue">' + this.name  +
              '</span> is set to <span class="seqOutputValue">' + this.value + " " + this.unit + "</span>";
    if (this.global!== false)
      back+=" " + this.global.text;
    back+="</div>";
    return back;
  }

}
