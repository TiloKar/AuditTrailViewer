/**
 *  Factoryklasse für dom-ausgaben eines seq Eintrags im dump
 *
 *  *@author TK, 06/2021, version 1.0.1
 */
"use strict";
class SeqDump  {

  constructor (d, index){

    SeqDump.categoriesOutput = ["Sterilisation","CIP","Pressure Hold","Process","Induction"];  //klassenkonstante für die Sequenzkategorien
    SeqDump.disabledStartOutput = ["Sterilisation","CIP","Pressure Hold","Process","Induction"];  //klassenkonstante für die Sequenzkategorien
    this.myIndex = index;
    this.v = d.fileValves; //referenz auf ventile
    this.s = d.seqFiles[index]; //referenz auf eigentliche Sequenzdaten, indiziert mit i
    //workaround um bei konstruktion, die referenzliste der globalen parameter zurückzusetzen
    //bei mehrmaligem laden aus dem ersten tab, kam es zu einer akkumulation der pushs in rowRefs.usedInRows[]
    for (var i = 0; i < this.s.globalParHead.length; i++) {
      this.s.globalParHead[i].rowRefs = undefined;
    }
    SeqDump.seqTags = [];
    for (var i = 0; i < d.seqFiles.length; i++) {
      SeqDump.seqTags[i] = d.seqFiles[i].tag;
    }
    this.channelHeaders=d.channelHeaders;//referenz auf struktur mit kanalnamen, einheiten und typen
    //this.globalPar=this.s.globalPar; //referenz auf globale parameter
    //this.globalParHead=this.s.globalParHead; //referenz auf daten der globalen parameter
    this.rowCount=0;
    for (var i = 0; i<this.s.row.length;i++){
      if (this.s.row[i].parUINT[0]===0) {
        this.rowCount=i;
        break;
      }
    }
    //alert("hier");
    //Nachrichtenstrings aus USINT[] konvertieren
    this.convertSeqMessages();
    //alert(this.getMessage(0));
    //Mapping für reflection  sequenzaktionsklassen
    SeqDump.classes={
        'SeqRowType10' : SeqRowType10,
        'SeqRowType20' : SeqRowType20,
        'SeqRowType22' : SeqRowType22,
        'SeqRowType30' : SeqRowType30,
        'SeqRowType32' : SeqRowType32,
        'SeqRowType50' : SeqRowType50,
        'SeqRowType60' : SeqRowType60,
        'SeqRowType64' : SeqRowType64,
        'SeqRowType80' : SeqRowType80,
        'SeqRowType81' : SeqRowType81,
        'SeqRowType82' : SeqRowType82,
        'SeqRowType83' : SeqRowType83,
        'SeqRowType84' : SeqRowType84,
        'SeqRowType100' : SeqRowType100,
        'SeqRowType101' : SeqRowType101,
        'SeqRowType102' : SeqRowType102,
        'SeqRowType103' : SeqRowType103,
        'SeqRowType104' : SeqRowType104,
        'SeqRowType105' : SeqRowType105,
        'SeqRowType110' : SeqRowType110,
        'SeqRowType164' : SeqRowType164
    };
  }
  /**
  wandelt die nutzertexte der sequenz (roh noch als usint[]) in ein echtes array von string um
  */
  convertSeqMessages(){
      this.s.message = [];
      var str="";
      for (var i=0;i<20;i++){
        str="";
        var k=0;
        while((k < 128) && (this.s["message"+(i+1)][k]!=0)) {
    			str += String.fromCharCode(this.s["message"+(i+1)][k]);
    			k++;
    		}
        this.s.message[i]= str;
      }
  }
  /** erzeugt die <ul> für die listeneinträgen
  baut gleichzeitig interne liste der globalen paramter auf
  nutzt polymorphe SeqRowType Klassen
  */
  getActionList(){
    var back=  '';
    var r;
    for (var i=0; i<this.rowCount;i++){
      r = this.s.row[i];
      if (r.parUINT[0]===0) break;
      back+=  '<li><h3>'+ String(i+1) + ' - ' + r.tag + "</h3>";
      //if (r.parUINT[0]===0) break;
      var className = "SeqRowType" + r.parUINT[0];
      var rout;
      try{
        rout = new SeqDump.classes[className](this,r,i);
        back+=rout.getActionDiv();
        //alert("constructed");
      }catch(e){
        rout=false;
        back+='<div class="reportListError">unhandled action class ' + r.parUINT[0] + '</div>';
        //alert("not found");
      }
      back+=  '</li>';
    }
    return back;
  }
  /** Erzeugt den Dump DOMstring eines seq dumpeintrags
  */
  getSequenceListEntry(){
    var back="<li><h3>" + this.s.tag + "</h3>";
    back+=    "<ul><li><h3>Summary</h3>"
    back+=    '<div class="myTable"><table><tbody><tr>   <th>Category: </th><td> '     + SeqDump.categoriesOutput[this.s.category] +
              "</td></tr><tr>       <th>Version: </th><td>"                    + String(this.s.version) +
              "</td></tr><tr>       <th>Action count: </th><td>"                    + String(this.rowCount) +
              "</td></tr><tr>       <th>Last change: </th><td>"             + this.s.dateChange.toUTCString() +
              "</td></tr><tr>       <th>Creation: </th><td>"                     + this.s.dateCreation.toUTCString()  +
              "</td></tr><tr>       <th>Userlevel: </th><td>"                     + String(this.s.user) +
              "</td></tr>";

    if (this.s.hidden) back+="<tr><td></td><td>Auxillary Sequence</td></tr>";
    if (this.s.usePhaseTagsForOPC) back+="<tr><td></td><td>Row tags used as OPC phase tags</td></tr>";
    if (this.s.disabledStart) back+="<tr><td></td><td>Disable all Outputs/Controllers at start</td></tr>";
    if (this.s.lockAll) back+="<tr><td></td><td>Lock all Outputs/Controllers while runnning</td></tr>";
    back+=    "</tbody></table></div></li>";
    //  die aktion list muss zuerst intern vorgeparst werden, dabei werden die referenzen der globalen paramter
    //  aufgelöst, damit einheit und referenzliste zum aufbau der tabelle zur verfügung stehen.
    var actionList=this.getActionList();
    //hier dann aus this.intGlobals() die tabelle der globalen parameter aufbauen
    back+=    "<li><h3>Global Paramters</h3>";
    var nGlobals = 0;
    for (var i=0;i < this.s.globalParHead.length;i++){
      if (this.s.globalParHead[i].rowRefs !== undefined) {
        nGlobals++; //globale oaramter mit gesetzten referenzen durchzählen
        //alert(this.s.globalPar[i]);
        this.s.globalParHead[i].parMin=BinaryBRStructFile.roundWithUnit(this.s.globalParHead[i].parMin,this.s.globalParHead[i].rowRefs.unit);
        this.s.globalParHead[i].parMax=BinaryBRStructFile.roundWithUnit(this.s.globalParHead[i].parMax,this.s.globalParHead[i].rowRefs.unit);
        this.s.globalPar[i]=BinaryBRStructFile.roundWithUnit(this.s.globalPar[i],this.s.globalParHead[i].rowRefs.unit); //unitabhängiges runden
        //bei z.B. eingabe in anzeigeunit<>plc unit kommt es manchmal zu sehr vielen gleitkommastellen
      }
    }
    //alert(nGlobals);
    if (nGlobals>0){
      back+=    '<div class="myTable"><table><tbody>' +
                '<tr><th>Tag </th><th>Value </th><th>Min </th><th>Max </th> <th>Used in rows </th> </tr>';
      var ref;
      for (var i=0;i < this.s.globalParHead.length;i++){
        if (this.s.globalParHead[i].rowRefs !== undefined){
          ref = this.s.globalParHead[i];
          back+=    '<tr><td>' + ref.tag + '</td>' +
                    '<td>' + this.s.globalPar[i] + ' ' + ref.rowRefs.unit + '</td>' +
                    '<td>' + ref.parMin + ' ' + ref.rowRefs.unit + '</td>' +
                    '<td>' + ref.parMax + ' ' + ref.rowRefs.unit + '</td>';
          back+=    '<td> ' + ref.rowRefs.usedInRows[0];
          //alert(ref.rowRefs.usedInRows.length);
          for (var k=1;k < ref.rowRefs.usedInRows.length;k++){
            back+=    ', ' + String(ref.rowRefs.usedInRows[k]);
          }
          back+=    '</td></tr>';
        }
      }
      back+=    '</tbody></table></div></li>';
    }else{
      back+=    '<div>no global parameters used</div></li>';
    }
    //jetzt action list
    back+=  '<li><h3>Actions</h3>';
    back+=  '<ul class="seqActionList">';
    back+=actionList; //muss intern erzeugt werden um die referenzen zu bilden, inhaltlich aber erst nach der tabelle ausgeben
    back+="</ul></ul></li>";

    return back;
  }

  getInputName(index){
    return this.channelHeaders.cI[index].tag;
  }
  getOutputName(index){
    return this.channelHeaders.cO[index].tag;
  }
  getLoopName(index){
    return this.channelHeaders.cCL[index].tag;
  }
  getInputUnit(index){
    return this.channelHeaders.cI[index].unitStr;
  }
  getOutputUnit(index){
    return this.channelHeaders.cO[index].unitStr;
  }
  getLoopUnit(index){
    return this.channelHeaders.cCL[index].unitStr;
  }
  getMessage(index){
    return this.s.message[index];
  }
  getOtherSeqName(index){
    //alert(this.seqTags[0]);
    return SeqDump.seqTags[index];
  }
  /**
    hängt eine referenzliste im ursprünglichen dump eine
    ungenutzte zeilen haben danach kein seqRef attribut
  */
  getValveRowName(slot,indexRow){
    if (this.v[slot].seqRef===undefined){ //falls noch nie eine sequenz was abgeladen hat
      this.v[slot].seqRef=new Array(0);
      var rowRef={};
      rowRef.seqIndex=this.myIndex;
      rowRef.rows=new Array();
      rowRef.rows.push(indexRow);
      this.v[slot].seqRef.push(rowRef);
    }else{  //falls schon sequenzen was in diesem ventilslot referenziert haben
      var seqFund = this.v[slot].seqRef.find(e => e.seqIndex === this.myIndex);//prüfen ob refrenz für diese sequenz schon existiert
      if (seqFund == null){ //seq noch nie aufgenommen
        var rowRef={};
        rowRef.seqIndex=this.myIndex;
        rowRef.rows=new Array();
        rowRef.rows.push(indexRow);
        this.v[slot].seqRef.push(rowRef); //neu diese seqenez pushen
      }else{
        seqFund.rows.push(indexRow); //sonst nur zusätzliche zeile pushen
      }
    }
    return this.v[slot].tag; //immer den eigentlichen namen zurückgebn
  }
  /**
  löst die referenz zum globalen parameter auf
  und hängt eine entsprechendes object in d.globalParHead ein, bzw. erweitert es

  nur verwendete parameter bekommen .rowRefs

  */
  getGlobal (indexChannel,indexRow,unit){
    if (indexChannel===0)return false;
    var slot=indexChannel-1;
    if (this.s.globalParHead[slot].rowRefs===undefined){
      this.s.globalParHead[slot].rowRefs={};
      this.s.globalParHead[slot].rowRefs.usedInRows = new Array(0);
      this.s.globalParHead[slot].rowRefs.unit=unit
      this.s.globalParHead[slot].rowRefs.usedInRows[0]=indexRow;
      //alert(indexRow);
    }else{
      this.s.globalParHead[slot].rowRefs.usedInRows.push(indexRow);
      //alert(indexRow);
      this.s.globalParHead[slot].rowRefs.unit=unit
    }
    var back = {};
    back.value= this.s.globalPar[slot];
    back.text= "(Global Par " + indexChannel + ", " + this.s.globalParHead[slot].tag + ")";
    return back;
  }
}
