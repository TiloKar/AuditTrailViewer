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

    this.globalTimeout=seq.getGlobal(r.globalCon[0],indexRow + 1,"min");
    if (this.globalTimeout===false){
      this.timeout=r.parUDINT[0];
    }else {
      this.timeout = this.globalTimeout.value;
    }
  }

  getActionDiv(){

    var back= '<div class="seqTransitionEntry">Open Dialog with text:<br>  <span class="seqUserText">' + this.message  +'</span><br>' +
              "on OK go to " + this.OKstep + "<br>" +
              "on CANCEL go to " + this.cancelStep;
    if (this.timeoutStep !== "no"){
      back+="<br> Timeout on " + this.timeout + ' min enabled, jumping to ' + this.timeoutStep;
      if (this.globalTimeout!== false){
        back+=" " + this.globalTimeout.text;
      }
    }
    back+="</div>";
    return back;
  }
}
