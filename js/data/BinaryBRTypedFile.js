/**Prototype für Umgang mit B&R binaries für die eine Typ-Datei geparst wurde
 *
 *@author TK, 04/2021, version 1.0.1
                        - 1.0.2   Vehalten für meherer typdaten debugged
                                  Verhalten für parseTypedFiles aus verschiedenen subdomains debugged

                                  to do string arrays unbehandelt
 *
*/

class BinaryBRTypedFile extends BinaryBRStructFile{
  /**
   * estellt objectarray "brStructs" aller ": 	STRUCT" Elemente
   * bereitet name und typstring in BRStructType[] auf
   */

  static parseTypedFiles(callback){
    //klassenvariablen mit Dateinamen im typ ordner
    BinaryBRTypedFile.BR_TYPE_FILES =[
       "dumbSeq10Auto"
      // "fatdumb"
       //mit komma weitere dateien einhängen...
    ];
    //hier werden rohinformationen der Structs abgelegt
    BinaryBRTypedFile.brStructs = [];
    //zähler für gefundene structs, interne nutzung
    BinaryBRTypedFile.brStructsParsed = 0;
    BinaryBRTypedFile.filesParsed = 0;

    var rq = new Array(BinaryBRTypedFile.BR_TYPE_FILES.length);

    BinaryBRTypedFile.BR_TYPE_FILES.forEach(function(typ_e, index){  //geht durch alle BR_TYPE_FILES im ordner

      rq[index] = new XMLHttpRequest();
      rq[index].responseType="text";
      rq[index].open('GET', '\\typ\\' + typ_e + '.typ', true);
      rq[index].onload = function(){
        var s=rq[index].response;
        s=s.replace(/\s/g,''); //entfernt whitespaces
        s=s.replace(/\(\*(.*?)\*\)/g,'');	//entfernt kommentare
        s=s.substr(4,s.length - 12);	//entfernt hauptrahmen TYPE/END_TYPE

        while (s.indexOf(":STRUCT")!=-1){//alle struct container übernehmen und splitten
          var n=s.substr(0,s.indexOf(":STRUCT")); //holt structname
          if (BinaryBRTypedFile.brStructs.find(parsed_structs_e => parsed_structs_e.name==n)!=undefined) {
            alert("multiple use of " + n + " in B&R structfile: " + typ_e);
            return 0;
          }else{
            var struct = new BRStructType(n);//erzeugt neue hüllklasse
            s=s.substr(s.indexOf(":STRUCT")+7); //entfernt struct header structname
            //alert(s);
            n=s.substr(0,s.indexOf("END_STRUCT;")-1); //extrahiert in neuen string ohne struct tail, -1 für letztes semikolon (split)
            //alert(n);
            s=s.substr(s.indexOf("END_STRUCT;") + 11); //entfernt entnommenen teilstring
            //alert(s.length);
            struct.brRawParse=n.split(";"); //kindelemente schon im 2 dimensionalen arry aufbereiten (0-nameStr,1-typStr)[unterelement]
            for (var i=0; i<struct.brRawParse.length;i++){ //alle unterstrukturen
              //pauschal initialisierung z.B. ":=1" am ende abschneiden
              if (struct.brRawParse[i].indexOf(":=")!=-1){
                struct.brRawParse[i]=struct.brRawParse[i].substr(0,struct.brRawParse[i].indexOf(":="));
              //	alert(element);
              }
              var test = struct.brRawParse[i].split(':');
              //alert(test[1]);
              //alert(singleChildStr[0] + "--" + singleChildStr[1] + "--" + singleChildStr);
              if (test.length!=2) {
                alert("child element not formed well: "+ struct.brRawParse[i] + " in " + struct.name);
                return 0;
              }
              struct.brRawParse[i]=[test[0],test[1]];
            }
            //alert (struct.brRawParse[0]);
          }
          BinaryBRTypedFile.brStructs.push(struct); //object
          BinaryBRTypedFile.brStructsParsed++;
        }//end_while
        BinaryBRTypedFile.filesParsed++;
        if (BinaryBRTypedFile.filesParsed === BinaryBRTypedFile.BR_TYPE_FILES.length){
          //alert(callback);
          BinaryBRTypedFile.brStructs.forEach(function(struct_e, index){  //geht durch erzeugte structs und hängt wert für nachkorrektur an
            //alert(BinaryBRTypedFile.getCorrectionOperatorFromRawParse(struct_e.brRawParse));
            BinaryBRTypedFile.brStructs[index].moduloOperatorForOffsetCorrection=BinaryBRTypedFile.getCorrectionOperatorFromRawParse(struct_e.brRawParse);
          });

          if (typeof(callback) != "undefined") {
            callback();
          }else {
            //alert(BinaryBRTypedFile.filesParsed);
          }
        }
      };

      rq[index].send();
    });
  }
  /**
      - nimmt blob und structname entgegen und versucht die JS Entsprechung der struktur zu erzeugen
      - verwendet dazu die BRTypedFile.brStructs aus Klassenvariable und die Klasse BRStructType
   *
   */
  constructor(b,defname){
    super(b);
    this.bytesRead=this.offset;
    try {
      this.elements = this.makeStructNodes(defname).node;
    }catch(e){
      alert(e);
    }
    this.bytesRead=this.offset - this.bytesRead //letzte offsetverschiebung zurücknehmen (gilt erst für weiteren speicherbereich)
  }
  /** diese rekursive funktion ermittelt den ntsprechenden operator
  für die offset korrektur für eine strukturdefinition

  */
  static getCorrectionOperatorFromRawParse(rawParse,debug){
    var back=0;
    var check;
    rawParse.forEach(function(rawParseElement, index){
      check=BinaryBRTypedFile.getCorrectionOperatorFromTypeString(rawParseElement[1]);
      if (check===false){ //ist wiederum ein sruct
        trimmedStructname=rawParseElement[1];
        if (trimmedStructname.indexOf("ARRAY")!=-1){ //bei bedarf array sytax raustrimmen
          var trimmedStructname=trimmedStructname.substr(trimmedStructname.indexOf("OF") + 2);
        }
        var fund=BinaryBRTypedFile.brStructs.find(parsed_structs_e => parsed_structs_e.name==trimmedStructname);
        if (fund!=undefined) {
          check=BinaryBRTypedFile.getCorrectionOperatorFromRawParse(fund.brRawParse); //rekursionstiefe erhöhen
          if (check > back) back=check;
        }else {
          alert("no type definition for " + trimmedStructname+ " in preparsed structs");
          return false;
        }
      }else{
       if (check > back) back=check;
      }
    });
    return back;
  }
  /** prüft einen string, ob dieser einem atomaen
    Datentyp oder einem array davon entspricht und gibt dann den entsprechenden operator
    für die offset korrektur zurück
  */
  static getCorrectionOperatorFromTypeString(typeString){
    if (typeString.indexOf("UDINT")!=-1) return 4;
    if (typeString.indexOf("DINT")!=-1) return 4;
    if (typeString.indexOf("USINT")!=-1) return 0;
    if (typeString.indexOf("SINT")!=-1) return 0;
    if (typeString.indexOf("UINT")!=-1) return 2;
    if (typeString.indexOf("INT")!=-1) return 2;
    if (typeString.indexOf("BOOL")!=-1) return 0;
    if (typeString.indexOf("STRING")!=-1) return 0;
    if (typeString.indexOf("DATE_AND_TIME")!=-1) return 4;
    if (typeString.indexOf("REAL")!=-1) return 4;
    return false;
  }

  /**
    hängt kindelement in elternknoten eine
    @param nodeType getrimmter B&R typstring aus strkturdefinitione
  */
  makeStructNodes(nodeType,debug){ //nodeName raus, der kann immer aus structdef entnommen werden und node wird vor dem eigentlichen call erzeugt!
    //alert("start rek: " + node);
    var debugMode;
    //var debugType="nichts";
    var out=new Object();
    out.corrected = 0;
    var atomarType = this.isAtomarBRType(nodeType);
    if (atomarType===true) {//echter atomarer Typ, außer STRING als blatt
      out.corrected = BinaryBRTypedFile.getCorrectionOperatorFromTypeString(nodeType)
      if (out.corrected===false) alert("false at operator, at: " + nodeType);
      //if (debug === true)
      //  if (debugType===nodeType)alert(nodeType + " at " + this.offset + " now correcting with " + out.corrected);
      if (out.corrected > 0) while ((this.offset % out.corrected)!=0)this.offset++; //vorkorektur atomar
      //if (debug === true)
      //  if (debugType===nodeType)alert(nodeType + " now at " + this.offset);
      out.node=this.makeAtomarValue(nodeType);
      return out;
      //alert(node[nodeName]);
    }else if (Number.isInteger(atomarType)){//atomarer String als blatt
      out.corrected = 0;//this.correctOffset("STRING");           //keine vorkorektur
      out.node = this.makeAtomarValue("STRING",atomarType);
      return out;
    }else if (nodeType.indexOf("ARRAY")!=-1){ //array marker erkannt, behandeln....
      if (nodeType.indexOf(",")!=-1){
        alert("unhandled unidimensional array: "+ nodeType + " , parsing stopped! ");
        //out.corrected = 0;
        out.node = false;
        return out;
      }
      //lauflänge extrahieren
      var first = nodeType.indexOf('[0..') + 4;
      //  alert("first: " + first);
      var last = nodeType.indexOf(']');
      //  alert("last: " + last);
      var arLen = parseInt(nodeType.substr(first,last - first)) + 1;
      //  alert("lenstr: " + lenStr);
      var arTypeStr = nodeType.substr(last + 3,nodeType.length);
      //darüber iterieren
      var node=new Array(arLen);
      var atomarArType = this.isAtomarBRType(arTypeStr);
      if (atomarArType===true) {//echter atomarer Typ, außer STRING als array
        //out.corrected = this.correctOffset(arTypeStr);
        out.corrected = BinaryBRTypedFile.getCorrectionOperatorFromTypeString(arTypeStr) //vorkorektur atomar array
        if (out.corrected > 0) while ((this.offset % out.corrected)!=0)this.offset++;
        for (var indexArray=0; indexArray < arLen; indexArray++)
          node[indexArray]=this.makeAtomarValue(arTypeStr);
        out.node=node;
        return out;
      }else if (Number.isInteger(atomarArType)){//atomarer String als array
        out.corrected = 0;//this.correctOffset("STRING");       //keine vorkorektur
        for (var indexArray=0; indexArray < arLen; indexArray++)
          node[indexArray]=this.makeAtomarValue("STRING",arTypeStr);
        out.node=node;
        return out;
      }else{ //struct als array
      //  if (arTypeStr==="rem_trend_typ")alert("o: " + this.offset + " l: " + arLen);
        for (var indexArray=0; indexArray < arLen; indexArray++){ //wegen prüfung an elemnt 1, schleife an 1 durchzählen
          //if (arTypeStr == 'cCL_rem_typ') alert ("offset " + arTypeStr + " struct array item now: " + this.offset);
          var back= new Object();

        //  debugMode = (arTypeStr === 'PIDpar_typ');
          back=this.makeStructNodes(arTypeStr,debugMode); //für alle struct[] rekursionstiefe erhöhen
          node[indexArray] = back.node;
        }
        //letztes elment pauschal zur ermittlung des korekturoffsets nutzen
        out.corrected = back.corrected;
        out.node=node;
        return out;
      }
    }else{//struct als blatt auflösen
      //if (nodeType==="df_channel_header_typ")alert("o: " + this.offset + " l: " + arLen);
      var fund=BinaryBRTypedFile.brStructs.find(parsed_structs_e => parsed_structs_e.name==nodeType);
      if (fund==undefined){
        alert("structname: " + nodeType + " unknown, parsing stopped!");
        out.corrected = 0;
        out.node = false;
        return out;
      }else{ //über alle Elemente der Strukturdefinition iterieren und rekursionstiefe erhöhen
        //if (nodeType==="valveArraySlot_typ")alert(this.offset);
        out.corrected = fund.moduloOperatorForOffsetCorrection;
        //if (debug === true){
        //  if (debugType===nodeType)alert(nodeType + " at " + this.offset + " now precorrecting with " + out.corrected);
          //alert(debugType);
        //}
        if (out.corrected > 0) while ((this.offset % out.corrected)!=0)this.offset++;  //vorkorrektur
        //if (debug === true)
        //  if (debugType===nodeType)alert(nodeType + " after precorr. at " + this.offset);
        var node = new Object;
      //  if (nodeType == 'seq_Slot_typ') alert ("offset for: " + nodeType + " at : " + this.offset);
        for (var indexStruct=0; indexStruct < fund.brRawParse.length; indexStruct++){
          try {
            /*
              !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

                wichtige debugging zeile

            */


            //debugMode = (fund.brRawParse[indexStruct][0] === 'par');


            /*
              !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

                wichtige debugging zeile

            */

            var back= new Object();
            back = this.makeStructNodes(fund.brRawParse[indexStruct][1],debugMode);
            node[fund.brRawParse[indexStruct][0]] = back.node;
          //  if (back.corrected > out.corrected) out.corrected = back.corrected; //hier Modulooperator abhängig von unterelmenten setzen, je nach enthaltenen unterelementen 0, 2 oder 4
          } catch (e) {
            throw "parsing struct fails at offset: " + this.offset + " for: " + fund.brRawParse[indexStruct][0] + ":" + fund.brRawParse[indexStruct][1] + "with exception: " + e;

          } finally {

          }
        }
        if (out.corrected > 0) while ((this.offset % out.corrected)!=0)this.offset++;  //nachkorrektur
        //if (debug === true)
        //  if (debugType===nodeType)alert(nodeType + " after postcorr. at " + this.offset);
        out.node=node;
        return out;
      }
    }
  }
  /**
    legay 06.2021, Offset correctur direkt in parser methoden

    bei der internen ablage in B&R Structs,
    wird ein folgendes element automatisch auf speicher-offset gelegt, die dem nächsten vielfachen der
    datentyp-speichergröße entsprechen

    !!!Ausnahme: Das gesamte strucht nimmt immer das nächste vielfache von 4 im speicher ein
     wenn das struct nur 1 byte untertypen enthällt, dann wird auch nicht korrigiert

   correctOffset (typestr){
     switch(typestr) {
       case 'BOOL':
       case 'USINT':
       case 'SINT':
       case 'STRING':
       //nix
       return 0;
       break;
       case 'UINT':
       case 'INT':
       while ((this.offset % 2)!=0)this.offset++;
       return 2;
       break;
       case 'UDINT':
       case 'DINT':
       case 'DATE_AND_TIME':
       case 'REAL':
       while ((this.offset % 4)!=0)this.offset++;
       return 4;
       break;

       default:
         if (typeof(typestr) == "undefined"){
           alert("atomar type identifier is undefined: " + typestr);
         }else
           alert("atomar type identifier: " + typestr + " unhandled");
         }
     }  */
 /**
   fallunterscheidun für typstr
   Rückgabe true für atomare Basistypen
   int mit stringlänge für string
 */
  isAtomarBRType (typestr){
    switch(typestr) {
      case 'BOOL':
      case 'USINT':
      case 'UINT':
      case 'UDINT':
      case 'SINT':
      case 'INT':
      case 'DINT':
      case 'DATE_AND_TIME':
      case 'REAL':   return true;
      break;
      default:
        if (typeof(typestr) == "undefined"){
          alert("atomar type identifier is undefined: "); //?? ob das wohl geht?
        }else if(typestr.indexOf("STRING")!=-1){//single string
          var lenStr= typestr.substr(typestr.indexOf('[')+1,typestr.length - 1);
          return parseInt(lenStr);
        }else{
        //  alert("atomar type identifier: " + typestr + " unhandled");
          return false;
        }
    }
  }
/**
    nimmt atomaren typstring entgegen und gibt  werte der
    JS entsprechung der binärdaten zurück
    dabei wird offset hochgezählt
*/
  makeAtomarValue(type,length){
    if (length==null){
      switch(type) {
    	  case 'BOOL': 	 return this.makeBOOL();
        break;
    	  case 'USINT':  return this.makeUSINT();
        break;
        case 'UINT':   return this.makeUINT();
        break;
        case 'UDINT':  return this.makeUDINT();
        break;
        case 'SINT':   return this.makeSINT();
        break;
        case 'INT':    return this.makeINT();
        break;
        case 'DINT':   return this.makeDINT();
        break;
        case 'DATE_AND_TIME': return this.makeDT();
        break;
        case 'REAL':   return this.makeFLOAT();
        break;
    	  default:
    		  alert("atomar type identifier: " + type + " unhandled");
    	}
    }else{
      switch(type) {
        case 'STRING':  return this.makeSTR(length);
        break;
        default:
          alert("atomar type identifier: " + type + " unhandled");
      }
    }
  }
}
