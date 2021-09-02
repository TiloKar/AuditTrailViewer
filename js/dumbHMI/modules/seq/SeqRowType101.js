/**
 *  Seq Action 101
 Dialog
 *
 *  *@author TK, 06/2021, version 1.0.1
 */
"use strict";
class SeqRowType101 extends SeqRowTypeX{

  constructor(seq,r,indexRow){
    super(r);
    this.message=seq.getMessage(r.parUINT[1]);

    this.OKstep="next";
    if (r.parUINT[4]>0) this.OKstep= String(r.parUINT[4]);

    this.cancelStep="next";
    if (r.parUINT[5]>0) this.cancelStep= String(r.parUINT[5]);

    this.timeoutStep="no";
    if (r.parUINT[2]>0) this.timeoutStep= String(r.parUINT[2]);

    this.global=seq.getGlobal(r.globalCon[0],indexRow + 1,"min");
    if (this.global===false){
      this.timeout=r.parUDINT[0];
    }else {
      this.timeout = this.global.value;
    }
  }

  getActionDiv(){

    var back= '<div class="seqTransitionEntry">Open Dialog with text:<br>  <span class="seqUserText">' + this.message  +'</span><br>' +
              "on OK go to " + this.OKstep + "<br>" +
              "on CANCEL go to " + this.cancelStep;
    if (this.timeoutStep!== "no"){
      back+="<br>on TIMEOUT (" + this.timeout + " min) go to " + this.timeoutStep;
      if (this.global!== false)
        back+="<br" + this.global.text;
    }
    back+="</div>";
    return back;
  }

}
