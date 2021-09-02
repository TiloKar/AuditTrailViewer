/**
 *  Seq Action 32
Regler ausgang umkonfigurieren
 *
 *  *@author TK, 06/2021, version 1.0.1
 */
"use strict";
class SeqRowType32  extends SeqRowTypeX{

  constructor(seq,r,indexRow){
    super(r);
    this.loopName=seq.getLoopName(r.parUINT[1]);
    this.outputName="not used";
    this.number=r.parUINT[2] + 1;
    if (r.parUINT[3] > 0) this.outputName=seq.getOutputName(r.parUINT[3] - 1);
    //alert("30");
  }

  getActionDiv(){
    //alert("30");
    //return "<div>ok</div>";
    var back= '<div>Controll Loop Channel <span class="seqLoopValue">' + this.loopName  +
              '</span> actuator channel ' + this.number +
              ' is set to <span class="seqOutputValue">' + this.outputName + "</span>";
    back+="</div>";
    //return "<div>ok</div>";
    return back;
  }

}
