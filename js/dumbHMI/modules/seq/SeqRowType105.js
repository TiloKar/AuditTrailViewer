/**
 *  Seq Action 105
 bedingter zähler
 *
 *  *@author TK, 06/2021, version 1.0.1
 */
"use strict";
class SeqRowType105 extends SeqRowTypeX{

  constructor(seq,r,indexRow){
    super(r);
    this.name=seq.getInputName(r.parUINT[1]);
    this.unit=seq.getInputUnit(r.parUINT[1]);
    this.globalValue=seq.getGlobal(r.globalCon[1],indexRow + 1,this.unit);
    if (this.globalValue===false){
      this.value=BinaryBRStructFile.roundWithUnit(r.parReal[0],this.unit);
    }else {
      this.value = BinaryBRStructFile.roundWithUnit(this.globalValue.value,this.unit);
    }

    this.conditionComplete="next";
    if (r.parUINT[2] > 0) this.conditionComplete= String(r.parUINT[2]);

    this.conditionFalse=false;
    if (r.parUINT[3] > 0) this.conditionFalse= String(r.parUINT[3]);

    this.comparator="&gt;=";
    if (r.parBOOL[0]) this.comparator="&lt;=";

    this.globalTimeout=seq.getGlobal(r.globalCon[0],indexRow + 1,"min");
    if (this.globalTimeout===false){
      this.timeout=r.parUDINT[0];
    }else {
      this.timeout = this.globalTimeout.value;
    }

  }

  getActionDiv(){

    var back= '<div class="seqTransitionEntry">Conditional jump for input channel <span class="seqInputValue">' + this.name  +'</span> ' +
              this.comparator +' <span class="seqInputValue">' + this.value + " " + this.unit + '</span>';
    if (this.globalValue!== false)
      back+=" " + this.globalValue.text;
    back+='<br> On <span class="seqTimeValue">' + this.timeout + ' min</span> with this condition, jump to ' + this.conditionComplete;
    if (this.globalTimeout!== false)
      back+=" " + this.globalTimeout.text;
    if (this.conditionFalse!==false)
      back+="<br> If condition fails before timeout, jump to " + this.conditionFalse;
    back+="</div>";
    return back;
  }

}
