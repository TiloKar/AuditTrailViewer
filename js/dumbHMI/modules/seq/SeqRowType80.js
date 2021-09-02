/**
 *  Seq Action 80
    abbruch marker
 *
 *  *@author TK, 06/2021, version 1.0.1
 */
"use strict";
class SeqRowType80 extends SeqRowTypeX{

  constructor(seq,r,indexRow){
    super(r);
    //nix
  }

  getActionDiv(){
    var back= '<div class="seqTransitionEntry"><b>STOP button marker</b></div>';
    return back;
  }

}
