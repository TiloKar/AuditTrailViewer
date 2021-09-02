/**
 *  Seq Action 22
 Regler einschalten
 *
 *  *@author TK, 06/2021, version 1.0.1
 */
"use strict";
class SeqRowType22 extends SeqRowTypeX{

  constructor(seq,r,indexRow){
    super(r);
    this.name=seq.getLoopName(r.parUINT[1]);
    this.enable = "disabled";
    if (r.parBOOL[0]) this.enable = "enabled";
  }

  getActionDiv(){
    var back= '<div>Controll Loop Channel <span class="seqLoopValue">' + this.name  +
              '</span> is '  + this.enable + " </div>";
    return back;
  }

}
