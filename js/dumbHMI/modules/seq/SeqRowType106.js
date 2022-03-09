/**
 *  Seq Action 106
 Warte bis cI [uint[1]] <=/>= real[0]/global[0] UND/ODER bis cI [uint[2]] <=/>= real[1]/global[2] (keine Tolleranz, Eventtimer zählt hoch),
 Timeout: udint[0]/global[1] min (nur wenn bool[0])
 uint[3] wählt Paarung:
  000(0): in 1 >= Wert 1 UND in 2 >= Wert 2
  100(4)  in 1 >= Wert 1 UND in 2 <= Wert 2
  001(1)  in 1 <= Wert 1 UND in 2 >= Wert 2
  101(5)  in 1 <= Wert 1 UND in 2 <= Wert 2
  010(2): in 1 >= Wert 1 ODER in 2 >= Wert 2
  110(6)  in 1 >= Wert 1 ODER in 2 <= Wert 2
  011(3)  in 1 <= Wert 1 ODER in 2 >= Wert 2
  111(7): in 1 <= Wert 1 ODER in 2 <= Wert 2
  Falls Bedingung erfüllt: Springe zu Schritt (uint[4]] , 0=nächster)
  Falls Timeout, Springe zu Schritt (uint[5]] , 0=nächster)
 *
 *  *@author TK, 06/2021, version 1.0.1
 */
"use strict";
class SeqRowType106 extends SeqRowTypeX{

  constructor(seq,r,indexRow){
    super(r);
    this.name1=seq.getInputName(r.parUINT[1]);
    this.unit1=seq.getInputUnit(r.parUINT[1]);
    this.globalValue1=seq.getGlobal(r.globalCon[0],indexRow + 1,this.unit1);
    this.name2=seq.getInputName(r.parUINT[2]);
    this.unit2=seq.getInputUnit(r.parUINT[2]);
    this.globalValue2=seq.getGlobal(r.globalCon[2],indexRow + 1,this.unit2);
    if (this.globalValue1===false){
      this.value1=BinaryBRStructFile.roundWithUnit(r.parReal[0],this.unit1);
    }else {
      this.value1 = BinaryBRStructFile.roundWithUnit(this.globalValue1.value,this.unit1);
    }
    if (this.globalValue2===false){
      this.value2=BinaryBRStructFile.roundWithUnit(r.parReal[1],this.unit2);
    }else {
      this.value2 = BinaryBRStructFile.roundWithUnit(this.globalValue2.value,this.unit2);
    }
    this.biggerThenOp1 = [0,2,4,6];
    this.biggerThenOp2 = [0,1,2,3];
    this.opOr = [2,3,6,7];

    if (this.biggerThenOp1.includes(r.parUINT[3])){
      this.part1=" &gt;= ";
    }else{
      this.part1=" &lt;= ";
    }
    if (this.biggerThenOp2.includes(r.parUINT[3])){
      this.part3=" &gt;= ";
    }else{
      this.part3=" &lt;= ";
    }
    if (this.opOr.includes(r.parUINT[3])){
      this.part2=" OR ";
    }else{
      this.part2=" AND ";
    }
    this.conditionStep="next";
    if (r.parUINT[4] > 0) this.cancelStep= String(r.parUINT[4]);

    this.useTimeout=r.parBOOL[0];

    this.timeoutStep="next";
    if (r.parUINT[5] > 0) this.timeoutStep= String(r.parUINT[5]);

    this.globalTimeout=seq.getGlobal(r.globalCon[1],indexRow + 1,"min");
    if (this.globalTimeout===false){
      this.timeout=r.parUDINT[0];
    }else {
      this.timeout = this.globalTimeout.value;
    }
    this.timeout+=r.parUINT[2];
  }

  getActionDiv(){

    var back= '<div class="seqTransitionEntry">Wait for input channel <span class="seqInputValue">' + this.name1  +'</span>' +
              this.part1 + '<span class="seqInputValue">' + this.value1 + " " + this.unit1 + '</span>';
    if (this.globalValue1!== false)
      back+=" " + this.globalValue1.text;
    back+="<br>" + this.part2 + "<br>";
    back+='<span class="seqInputValue">' + this.name2  +'</span>' +
              this.part3 + '<span class="seqInputValue">' + this.value2 + " " + this.unit2 + '</span>';
    if (this.globalValue2!== false)
      back+=" " + this.globalValue2.text;
    back+='<br> then jump to '+   this.conditionStep;
    var timeouttext="<br> Timeout on " + this.timeout + ' min enabled, jumping to ' + this.timeoutStep;
    if (this.globalTimeout!== false)
      timeouttext+=" " + this.globalTimeout.text;
    if (this.useTimeout) back+=timeouttext;
    back+="</div>";
    return back;
  }

}
