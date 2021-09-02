/**
 *  Enthällt nach Konstruktoraufruf alle Daten der übergebenen Trenddatei als
 *  JS Datenstruktur
 *
 *  beerbt binäre Funktionalitäten von BinaryBRStructFile
 *
 *  *@author TK, 04/2020,   version 1.0.1
 *        to do:
 *           TK, 02/2021,   version 1.0.2
 *            - events werden als separate Datei geliefert
              - daher auch als separate Klasse "Eventfiles" ausgelagert
              - Event-Entpacken aus dieser Klasse entfernt
 */
"use strict";
class Trendfile extends BinaryBRStructFile  {
	/**
	 *  versucht den Datenheader zu konstruieren (this.CRC_A_OK, this.CRC_B_OK)
	 *  versucht die erste Datenzeile zu konstruieren (this.firstLineOK)
	 *  versucht alle anderen Datenzeilen zu konstruieren (this.dataLinesRead)
	 *
	 */
	//onStart,onBlock,onFinish events übergebn
	constructor(b){
		super(b);
		this.ASYBLOCKSIZE=131072; //Menge an Bytes pro asynchronem aufruf beim entpacken
		this.ASYTIMEOUT=50; //Timeout in msec nach jedem asynchronen aufruf beim entpacken
		this.offset=4;//del : ARRAY[0..1]OF USINT := [2(35)]; (*Delimeter Head A start*)
		this.firstDat=this.makeDT();//firstDat : DATE_AND_TIME; (*first Time Stamp in File*)
		this.lastDat=this.makeDT();//lastDat : DATE_AND_TIME; (*last Time Stamp in File*)
		this.lineCount=this.makeUDINT();//lineCount : UDINT; (*count of Data lines*)
		this.samplingRate=this.makeUDINT();//samplingRate : UDINT := 30; (*sec*)
		this.ident=this.makeUDINT();//ident : UDINT; (*specific xCUBIO Identifier*)
		this.version=this.makeUSINT();//version : USINT; (*specific structure revision (not used)*)
		this.treshold=this.makeUSINT();//treshold : USINT := 1; (*treshold (decay, not used)*)
		this.batchState=this.makeUSINT();//batchState : USINT; (*0 = running 255 = finalized*)
		this.anzcI=this.makeUSINT();//anzcI : USINT := ncI; (*count of input channels on xCUBIO*)
		this.anzcCL=this.makeUSINT();//anzcCL : USINT := ncCL; (*count of Control loops on xCUBIO*)
		this.anzcO=this.makeUSINT();//anzcO : USINT := ncO; (*count of output channels on xCUBIO*)
		this.tag=this.makeSTR(40);//tag : STRING[40]; (*filename of trend on xCUBIO*)
		this.comment=this.makeSTR(252);//comment : STRING[252] := 'init comment'; (*comment for user*)
		this.inoculumDat=this.makeDT();//inoculumDat : DATE_AND_TIME;
		this.offset+=1024;//variant : ARRAY[0..1023]OF USINT;
		this.CRC_A=this.makeUDINT();
		var CRC = this.crctrend(0,this.offset-4);
		this.CRC_A_OK=this.CRC_A == CRC;
		this.offset+=4;//A.endA
		var startB = this.offset;
		this.offset+=4;//B.del1
		this.tags = new Object;
		this.tags.cI = this.makeSTR_AR(24,64);//array hat jetzt feste länge 64,64,16 strings jeweils 24 zeichen lang
		this.tags.cO = this.makeSTR_AR(24,64);
		this.tags.cCL = this.makeSTR_AR(24,16);
		this.offset+=4;//CRLF
		this.units = new Object;
		this.units.cI = this.makeSTR_AR(24,64);
		this.units.cO = this.makeSTR_AR(24,64);
		this.units.cCL = this.makeSTR_AR(24,16);
		this.CRC_B=this.makeUDINT();
		CRC = this.crctrend(startB,this.offset-4-startB);
		this.CRC_B_OK=this.CRC_B == CRC;
		this.offset+=4;//B.endB
		this.DATAHEADER = new Uint8Array(4);
		this.DATAHEADER[0] =38;
		this.DATAHEADER[1] =35;
		this.DATAHEADER[2] =37;
		this.DATAHEADER[3] =36;
		this.line = new Array();
		this.event = new Array();
		this.bytesSkipped=0;
		this.lineCRCerrors=0;
		this.lineFrameError=0;
		this.eventCRCerrors=0;
		this.eventFrameError=0;
		this.firstLineOK=false;
		this.dataLinesRead=0;
		this.eventsRead=0;
		this.percentRead=0;
		this.DEBUGfirstError=false;

		if ((this.offset + 32) < this.b.byteLength){ // Daten muss für einmal header reichen
			this.line[0]=this.makeDataLine(true);
			if (this.line[0]!=false) { //erste datenzeile muss klappen
				this.firstLineOK=true;
				this.dataLinesRead++;
			}
		}
	}

	/**
	 * ließt blob daten in einer schleife
	 * entpackt datenzeilen oder entpackt eventzeilen
	 * oder überspringt bytes
	 * mit erreichen
	 *
	 *
	 */
	readDataBlock(onBlock,onFinish){
		var startOffset=this.offset;
		while ((this.offset + 32) < this.b.byteLength){ // Daten muss für einmal header reichen
			var thisLine=this.makeDataLine(false);
			if (thisLine!=false){
				this.line[this.dataLinesRead]=thisLine;
				this.dataLinesRead++;
				this.percentRead=this.offset * 100 / this.b.byteLength;
			//hier noch elsif für events durchführen
			}else{
				//ein byte weiter falls da keine datenzeile entpackt werden kann
				this.offset++;
				this.bytesSkipped++;
				//return;
			}
			//hier auf erreichen der maximalen blockgröße prüfen und programmsteuerung bis zum nächsten asynchronen Aufruf abgeben
			if ((this.offset - startOffset) >=this.ASYBLOCKSIZE){
				this.timeoutUnzip=window.setTimeout(event => {this.readDataBlock(onBlock,onFinish)}, this.ASYTIMEOUT);
				onBlock();//übegebenen lambdaausdruck ausführen;
				return;
			}
		}
		onFinish();//übegebenen lambdaausdruck ausführen
		return;
	}
	/**
	 * versucht ab offset einen Trenddatensatz zu entpacken
	 *
	 * 		@return FALSE für Fehler
	 *
	 * 		@return object für erfolgreich gebildeten neuen Rohdatensatz:
	 * 		this.offset wird um gelesene Bytes erhöht
	 *
	 *   @return.countInp	Anzahl neuer Eingangskanalwerte im datensatz
	 *   @return.countOutp	Anzahl neuer Ausgangskanalwerte im datensatz
	 *   @return.countCL	Anzahl neuer Sollwertkanalwerte im datensatz
	 *   @return.time	Datensatz Zeitstempel
	 *   @return.data.cI[] array mit neuen Eingangskanalwerte belegt, Lücken an indizes der unveränderten werte
	 *   @return.data.cCL[] array mit neuen Sollwertkanalwerte belegt, Lücken an indizes der unveränderten werte
	 *   @return.data.cO[] array mit neuen Ausgangskanalwerte belegt, Lücken an indizes der unveränderten werte
	 */
	makeDataLine(first) {

		if ((this.offset + 32) > this.b.byteLength){ // muss für einmal header reichen
			this.lineFrameError++;
			return false;
		}else {
			var h = new Uint8Array(this.b,this.offset, 4);
			var internalOffset=this.offset;  //erstmal internen offset verwenden und nur bei erfolg auf Klassenvariable schreiben

			if((h[0]!=38) || (h[1]!=35) || (h[2]!=37) || (h[3]!=36)){
				return false;
			}else{
				internalOffset+=4;//header
				var out=new Object;
				out.time = this.makeDT(internalOffset);
				out.timeRaw = this.makeUDINT(internalOffset); //auch rohzeit übernehmen als späteren Sortierschlüssel
				internalOffset+=4;//zeitstempel
				h = new Uint8Array(this.b,internalOffset, 1);
				out.countInp=this.bitcnt(internalOffset,64);
				internalOffset+=8;
				out.countCL=this.bitcnt(internalOffset,64);
				internalOffset+=8;
				out.countOutp=this.bitcnt(internalOffset,64);
				internalOffset+=8;
				out.countSum=out.countCL + out.countInp + out.countOutp;
				if (first){//für erste datenzeile, maximale kanalzahl für diesen trend in Klassenvariable übernehmen
					this.countInpMax=out.countInp;
					this.countCLMax=out.countCL;
					this.countOutpMax=out.countOutp;
				}
				if ((internalOffset + (4 * out.countSum) + 8) > this.b.byteLength){ //auf verfügbare bytelänge prüfen
					this.lineFrameError++;
					return false;
				}else{
					var CRC_D=this.makeUDINT(internalOffset + (4 * out.countSum));
					if (this.crctrend(this.offset,32 + 4 * out.countSum) != CRC_D){ //Datenframe prüfsumme falsch
						this.lineCRCerrors++;
						return false;
					}else{
						//alert("hier");
						out.data = new Object;
						out.data.cI = new Array();
						for (var i=0; i < this.countInpMax; i++){//Eingänge entpacken
							if (this.bittst(this.offset+8,i)){
								out.data.cI[i]=this.makeFLOAT(internalOffset);
								internalOffset+=4;
							}else{
								//Lücken im Array lassen, falls keine Werte verfügbar
							}
						}
						out.data.cCL = new Array();
						for (var i=0; i < this.countCLMax; i++){//Regler entpacken
							if (this.bittst(this.offset+16,i)){
								out.data.cCL[i]=this.makeFLOAT(internalOffset);
								internalOffset+=4;
							}else{
								//Lücken im Array lassen, falls keine Werte verfügbar
							}
						}
						out.data.cO = new Array();
						for (var i=0; i < this.countOutpMax; i++){//Ausgänge entpacken
							if (this.bittst(this.offset+24,i)){
								out.data.cO[i]=this.makeFLOAT(internalOffset);
								internalOffset+=4;
							}else{
								//Lücken im Array lassen, falls keine Werte verfügbar
							}
						}
						internalOffset+=8; //CRC und end del
					}
				}
			}
		}
		this.offset=internalOffset; //Erfolg: Offset auf alle gelesenen bytes erhöhen
		return out;
	}
}
