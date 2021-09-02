/**
 *  Seq Action 83
    inc zähler
 *
 *  *@author TK, 06/2021, version 1.0.1
 */
"use strict";
class SeqRowType83 extends SeqRowTypeX{

  constructor(seq,r,indexRow){
    super(r);
    this.counter="counter " + (r.parUINT[1] + 1);
  }

  getActionDiv(){
    var back= '<div class="seqTransitionEntry">adding +1 to <b>' + this.counter + '</b>';
    back+="</div>";
    return back;
  }

}
