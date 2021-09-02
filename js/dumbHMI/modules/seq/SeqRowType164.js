/**
 *  Seq Action 164
    warte auf start/stop andere sequenz
 *
 *  *@author TK, 06/2021, version 1.0.1
 */
"use strict";
class SeqRowType164 extends SeqRowTypeX{

  constructor(seq,r,indexRow){
    super(r);
    this.name=seq.getOtherSeqName(r.parUINT[1]);
    this.enabled="disable";
    if (r.parBOOL[0]) this.enabled="enable";
  }

  getActionDiv(){
    var back= '<div class="seqTransitionEntry">Wait for Sequence <span class="seqLoopValue">' + this.name  +
              '</span> '+ this.enabled + '</div>';
    return back;
  }

}
