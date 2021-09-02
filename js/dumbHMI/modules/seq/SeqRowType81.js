/**
 *  Seq Action 81
    EXIT
 *
 *  *@author TK, 06/2021, version 1.0.1
 */
"use strict";
class SeqRowType81 extends SeqRowTypeX{

  constructor(seq,r,indexRow){
    super(r);

  }

  getActionDiv(){
    var back= '<div class="seqTransitionEntry"><b><span>EXIT Sequence without any further actions </span></b></div>';
    return back;
  }

}
