/**
 *  Seq Action 40
 alarmwert änderung
 *
 *  *@author TK, 06/2021, version 1.0.1
 */
"use strict";
class SeqRowType40 extends SeqRowTypeX{

  constructor(seq,r,indexRow){
    super(r);
    this.enableFlag=r.parBOOL[0];
    this.name=seq.getInputName(r.parUINT[1]);
    this.unit=seq.getInputUnit(r.parUINT[1]);
    this.globalValue=seq.getGlobal(r.globalCon[0],indexRow + 1,this.unit);
    if (this.globalValue===false){
      this.value=BinaryBRStructFile.roundWithUnit(r.parReal[0],this.unit);
    }else {
      this.value = BinaryBRStructFile.roundWithUnit(this.globalValue.value,this.unit);
    }

    var rangeType=["HH ","H ","L ","LL "];
    this.rangeString=rangeType[r.parUINT[2]];

  }

  getActionDiv(){
    if (this.enableFlag===false){
      var back= '<div>Alarm Range ' + this.rangeString +
        '<span class="seqInputValue">' + this.name  +'</span> disabled</div>';
        return back;
    }

    var back= '<div>Alarm Range ' + this.rangeString +
      '<span class="seqInputValue">' + this.name  +'</span> enabled to '+
      '<span class="seqInputValue">' + this.value + " " + this.unit + '</span>';
    if (this.globalValue!== false)
      back+=" " + this.globalValue.text;
    back+="</div>";
    return back;
  }

}
