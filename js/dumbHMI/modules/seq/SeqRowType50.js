/**
 *  Seq Action 50
    jump
 *
 *  *@author TK, 06/2021, version 1.0.1
 */
"use strict";
class SeqRowType50 extends SeqRowTypeX{

  constructor(seq,r,indexRow){
    super(r);
    this.target=(r.parUDINT[0]+1);
  }

  getActionDiv(){
    var back= '<div class="seqTransitionEntry">Jump to ' + this.target  +
              '</div>';
    return back;
  }

}
