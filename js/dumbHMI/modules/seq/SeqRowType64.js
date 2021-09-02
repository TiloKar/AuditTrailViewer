/**
 *  Seq Action 64
    starte/stoppe andere sequenz
 *
 *  *@author TK, 06/2021, version 1.0.1
 */
"use strict";
class SeqRowType64 extends SeqRowTypeX{

  constructor(seq,r,indexRow){
    super(r);
    this.name=seq.getOtherSeqName(r.parUINT[1]);
    this.enabled="disable";
    if (r.parBOOL[0]) this.enabled="enable";
  }

  getActionDiv(){
    var back= '<div>' + this.enabled + ' Sequence <span class="seqLoopValue">' + this.name  +
              '</span></div>';
    return back;
  }

}
