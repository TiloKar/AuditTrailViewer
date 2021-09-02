/**
 *  Seq Action 60
    ventilzeile
 *
 *  *@author TK, 06/2021, version 1.0.1
 */
"use strict";
class SeqRowType60 extends SeqRowTypeX{

  constructor(seq,r,indexRow){
    super(r);
    this.name=seq.getValveRowName(r.parUINT[1],indexRow);
  }

  getActionDiv(){
    var back= '<div>Valve row <span class="seqOutputValue">' + this.name  +
              '</span> is set</div>';
    return back;
  }

}
