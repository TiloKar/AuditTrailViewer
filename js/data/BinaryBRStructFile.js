
/**Prototype für alle binfiles
 *
 *nimmt blob entgegen und stellt methoden für konvertierung der atomaren typen
 *in JS objecte zur verfügung
 * nutzt interne Objektvariable "offset" als Marker in den Rohbytes
 *
 *@author TK, 04/2020, version 1.0.1
 *
*/
"use strict";
class BinaryBRStructFile {

  //enum der B&R Basistypen
  static BRTYPES = {
    BOOL: 'BOOL', //Boolean
      USINT: 'USINT', //unsigned 8 bit integer
      UINT: 'UINT',   //unsigned 16 bit integer
      UDINT: 'UDINT', //unsigned 32 bit integer
      SINT: 'SINT', //signed 8 bit integer
      INT: 'INT',   //signed 16 bit integer
      DINT: 'DINT', //signed 32 bit integer
      STRING: 'STRING', //1 byte Ascii-Zeichenkette
      DATE: 'DATE_AND_TIME', //unsigned 32 bit integer als Sekunden seit 1970
      REAL: 'REAL', //32 bit Fließkomma
  };

	/**
	 * Konstruktor für leeres object mit Basismethoden
	 *
	 */
	constructor(b){
		//blob struktur als klassenvariable übernehmen
		this.b=b;
		/*
		 * offset im blob der mit jedem aufruf der get-Methoden automatisch
		 * 	hochzählt
		 *  direkte manuipulation ohne setter möglich!!!!
		 *  für überspringen der "delimiter und prüfsummen" nach Verarbeitung
		*/
		this.offset=0;
		//generatorpolynom CRC32
		this.GEN = 548942248;
		//this.typedParsingAbsStartByte=0;//absolutes startbyte für struct entpacken
		//this.typedParsingStructCheckLen=1; //maximale atomare Datentyplänge innerhalb des Node
		//this.typedParsingStructStartByte=0; //startbyte für jeden neuen structlevel
	}
	/**
	 * generiert ein JS Datumsobjekt aus 4 byte vorzeichenlosem Int
	 * ohne args = zählt offset um 4 bytes hoch
	 * mit args ohne Hochzählen des offset
	 *
	 *
	 * @return Datumsobjekt
	 */
	makeDT(off) {
		if (off==undefined){
			var m = this.b.slice(this.offset,this.offset+4);
			this.offset+=4;
		}else var m = this.b.slice(off,off+4);

		var h = new Uint32Array(m , 0 , 1 );
		var date = new Date(h[0] * 1000);
		return date;
	}
	/**
	 * generiert ein JS Boolean aus rohbyte
	 * zählt offset um 1 bytes hoch
	 * @return Boolean
	 */
	makeBOOL() {
		var h = new Uint8Array(this.b,this.offset, 1);
		this.offset++;
		return h[0]>0;
	}
	/**
	 * generiert ein JS Ganzzahltyp aus 1 byte vorzeichenlosem Int
	 * zählt offset um 1 bytes hoch
	 * @return Ganzzahl
	 */
	makeUSINT() {
  //  try {
      var h = new Uint8Array(this.b,this.offset, 1);
      this.offset++;
      return h[0];
  //  } catch (e) {
  //    alert("usint fail at offset: " + this.offset);
  //  } finally {

  //  }

	}
	/**
	 * generiert ein JS Ganzzahltyp aus 1 byte signed Int
	 * zählt offset um 1 bytes hoch
	 * @return Ganzzahl
	 */
	makeSINT() {
		var h = new Int8Array(this.b,this.offset, 1);
		this.offset++;
		return h[0];
	}
	/**
	 * generiert ein JS Ganzzahltyp aus 2 byte vorzeichenlosem Int
	 * ohne args = zählt offset um 2 bytes hoch
	 * mit args ohne Hochzählen des offset
	 *
	 * @return Ganzzahl
	 */
	makeUINT(off) {
		if (off==undefined){
			var m = this.b.slice(this.offset,this.offset+2);
			this.offset+=2;
		}else var m = this.b.slice(off,off+2);

		var h = new Uint16Array(m , 0 , 1 );
		return h[0];
	}
	/**
	 * generiert ein JS Ganzzahltyp aus 2 byte signed Int
	 * ohne args = zählt offset um 2 bytes hoch
	 * mit args ohne Hochzählen des offset
	 *
	 * @return Ganzzahl
	 */
	makeINT(off) {
		if (off==undefined){
			var m = this.b.slice(this.offset,this.offset+2);
			this.offset+=2;
		}else var m = this.b.slice(off,off+2);

		var h = new Int16Array(m , 0 , 1 );
		return h[0];
	}
	/**
	 * generiert ein JS Ganzzahltyp aus 4 byte vorzeichenlosem Int
	 * ohne args = zählt offset um 4 bytes hoch
	 * mit args ohne Hochzählen des offset
	 *
	 * @return Ganzzahl
	 */
	makeUDINT(off) {
		if (off==undefined){
			var m = this.b.slice(this.offset,this.offset+4);
			this.offset+=4;
		}else var m = this.b.slice(off,off+4);

		var h = new Uint32Array(m , 0 , 1 );
		return h[0];
	}
	/**
	 * generiert ein JS Ganzzahltyp aus 4 byte signed Int
	 * ohne args = zählt offset um 4 bytes hoch
	 * mit args ohne Hochzählen des offset
	 *
	 * @return Ganzzahl
	 */
	makeDINT(off) {
		if (off==undefined){
			var m = this.b.slice(this.offset,this.offset+4);
			this.offset+=4;
		}else var m = this.b.slice(off,off+4);

		var h = new Int32Array(m , 0 , 1 );
		return h[0];
	}

	/**
	 * generiert ein JS Gleitkommatyp aus 4 byte vorzeichenlosem Int
	 *
	 * ohne args = zählt offset um 4 bytes hoch
	 * mit args ohne Hochzählen des offset
	 *
	 * @return Fließkommazahl
	 */
	makeFLOAT(off) {
		if (off==undefined){
			var m = this.b.slice(this.offset,this.offset+4);
			this.offset+=4;
		}else var m = this.b.slice(off,off+4);

		var h = new Float32Array(m , 0 , 1 );
		return h[0];
	}

	/**
	 * generiert eine JS Zeichenkette aus 1 byte Ascii frame
	 * terminatorzeichen ist 0, wird bei konvertierung ignoriert
	 * @length ursprüngliche Kapazität des Strings,
	 *  (bei B&R wird auf datenebene mit rohlänge 0 kapazität + 1 für terminatorzeichen deklariert)
	 *  zählt offset daher um length+1 bytes hoch
	 *  @return String
	 */
	makeSTR(length) {
		try{
			var h = new Uint8Array(this.b,this.offset, length);
		}catch(e){
			alert(this.offset);
		}
		this.offset+=(length+1);
		var out, i, len
		out = "";
		i = 0;
		while((i < length) && (h[i]!=0)) {
			out += String.fromCharCode(h[i]);
			i++;
		}
		return out;
	}
	/**
	 * generiert ein JS Zeichenkettenarray aus rohdaten
	 * iteriert makeSTR(length) über items
	 * @length Kapazität des Strings
	 * @items Kapazität des Arrays
	 *
	 * @return String[]
	 */
	makeSTR_AR(length,items) {
		var out = new Array(items);
		for (var i=0;i<items;i++){
			out[i]=this.makeSTR(length);
		}
		return out;
	}
	/**
	 * bildet prüfsummenalgorithmus auf Rohdatenebene ab
	 *
	 * @pmem start offset im blob (byteweise)
	 * @len	bytelänge für Prüfsummeniteration
	 * @return Ganzzahl (tatsächliche Prüfsumme)
	 */
	crctrend(pmem,len) {
		var crc_input = new Uint32Array(1);
		crc_input[0]=1;
		var indata;
		for (var n = 0; n < len; n++){
			if ((pmem + len) < this.b.byteLength){
				var h = new Uint8Array(this.b,pmem + n, 1);
				indata = h[0];
				for (var i = 0; i < 8; i++){
					if(((crc_input[0] & 0x80000000) != 0) != ((indata & 0x80) != 0 )){
						crc_input[0] = (crc_input[0] << 1) ^ this.GEN;
					}else{
						crc_input[0] = crc_input[0] << 1;
					}
					indata = indata << 1;
				}
			}
		}
		//alert (this.gen);
		return crc_input[0];
	}
	/**testet auf gesetzte bits in rohdaten
	 * @pB start offset im blob (byteweise)
	 * @tstPos Position des zu testenden bits (bitweise, 0=LSB)
	 * @return zustand des zu testenden bits
	 */
	//testet bits in blob
	bittst(pB,tstPos) {
		//Testet bit an zielposition durch anlegen einer 8 bit maske
		var targetBlock = Math.floor(tstPos / 8); //zeiger offset ermitteln
		var exponent=tstPos - (targetBlock * 8);
		var targetBlockMask = Math.floor(Math.pow(2,exponent));
		//alert(targetBlockMask);
		var h=new Uint8Array(this.b,pB + targetBlock, 1);
		return (h[0] & targetBlockMask) > 0;
	}
	/**
	 * Zählt bits ab zeigeradresse in 8 bit portionen
	 * maskierung der überzähligen bits im letzten block für kein genaues Vielfaches von 8
	 * @pB start offset im blob (byteweise)
	 * @cntLen lauflänge der zu testenden bits (bitweise, >0)
	 */
	bitcnt(pIN,cntLen){
		var h,aIN,BITCNT8,v;
		var BITCNT=0;
		if (cntLen > 0){
			var lastBlock = Math.floor(cntLen / 8); //anzahl der byte blöcke ermitteln
			if (cntLen > (lastBlock * 8)) { //falls cntLen kein genaues Vielfaches
				var lastBlockMask=0xFF;
				var scount=((lastBlock + 1) * 8) - cntLen;
				lastBlockMask=lastBlockMask>>>scount;
			}else if ( cntLen == (lastBlock * 8)){  //falls CntLen genau passt, alle bits des blocks zählen
				lastBlock-=1;
				lastBlockMask=0;
			}
			for( var i= 0; i<= lastBlock;i++){
				BITCNT8=0;
				h=new Uint8Array(this.b,pIN + i, 1);
				aIN=h[0];
				if(( lastBlockMask > 0)&&( i==lastBlock)){ 	//falls ungerades Vielfaches und letzter block, dann überzählige bits ignorieren
					v = aIN & lastBlockMask;
				}else{
					v=aIN;
				}
				while( v > BITCNT8) {
					BITCNT8+=1;
					v= v & ( v - 1);
				}
				BITCNT +=BITCNT8;
			}
		}
		return BITCNT;
	}

  /**
    eine rundungsfunktion mit angabe der nachkommastellen
  */
  static round(wert, dez) {
      var hlp = Math.pow(10,dez)
      return Math.floor(wert * hlp) / hlp;
  }
  /**
  gibt die default totbandeinstellung für die trend filter zurück,
  abhängig vom unit string der kanalklasse
  */
  static getDeadbandFromUnitStr(unitstr){
    switch(unitstr) {
      case '°C':
        return 0.5;
      break;
      case 'mbar':
        return 50;
      break;
      case '%':
      case 'g':
      case 'ml/min':
        return 1;
      break;
      case 'rpm':
        return 10;
      break;
      case 'S/m':
        return 0.0005;
      break;
      default:
        return 0.5;

    }
  }
  /**
  gibt die default digits für die event ausgaben zurück,
  abhängig vom unit string der kanalklasse
  */
  static getDigitsFromUnitStr(unitstr){
    switch(unitstr) {
      case '°C':
        return 1;
      break;
      case 'mbar':
      case '%':
      case 'g':
      case 'rpm':
      case 'ml/min':
        return 0;
      break;
      case '%':
      case 'g':
        return 1;
      break;
      case 'S/m':
        return 4;
      break;
      default:
        return 3;

    }
  }

  /**
  rundet abhängig vom unit string
  */
  static roundWithUnit(wert, unit) {
    return BinaryBRStructFile.round(wert,BinaryBRStructFile.getDigitsFromUnitStr(unit));
  }
}
