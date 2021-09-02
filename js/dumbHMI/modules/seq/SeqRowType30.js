/**
 *  Seq Action 30
Regler eingang umkonfigurieren
 *
 *  *@author TK, 06/2021, version 1.0.1
 */
"use strict";
class SeqRowType30  extends SeqRowTypeX{

  constructor(seq,r,indexRow){
    super(r);
    this.loopName=seq.getLoopName(r.parUINT[1]);
    this.inputName="not used";
    this.number=r.parUINT[2] + 1;
    if (r.parUINT[3] > 0) this.inputName=seq.getInputName(r.parUINT[3] - 1);
    //alert("30");
  }

  getActionDiv(){
    //alert("30");
    //return "<div>ok</div>";
    var back= '<div>Controll Loop Channel <span class="seqLoopValue">' + this.loopName  +
              '</span> setpoint channel ' + this.number +
              ' is set to <span class="seqInputValue">' + this.inputName + "</span>";
    back+="</div>";
    //return "<div>ok</div>";
    return back;
  }

}
