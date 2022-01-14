/**
 *  Enthällt nach Konstruktoraufruf alle Daten der übergebenen Eventddatei als
 *  JS Datenstruktur
 *
 *  beerbt binäre Funktionalitäten von BinaryBRStructFile
 *
 *  *@author TK, 02/2021, version 1.0.1
 */
"use strict";
class Eventfile extends BinaryBRStructFile  {
  /**
   *  versucht mit eine JS Entsprechun eines B&R Events aus dem übergeben blob zu erzeugen
   *  to do: Events paralle zur implmentierung im B&R projekt hier nachpflegen
   *  @param ID   ID für switch case
   *  @param count der payload, verfügbarkeit im blob und CRC wurden bereits von aufrufender instanz geprüft
   *
   *  *@author

                TK, 04/2020, version 1.0.1
   *            TK, 03/2021,  aus ATevent.js in Eventfile.js integriert,
   *                          nachdem von B&R-Logger-Engine eine eigene Datei *.EVENT erzeugt wird
                TK, 05/2021   DOM outputs in spezialisierte klassen für in/out/loop/evntklassen[] ausgelagert
                              Rohdatenerfassung muss hierbleiben, da Auslagerung in spezialisierte klasse mehr Arbeit macht,
                              als es an Übersicht schafft
   */
  makeATeventRawData (ID,count)  {
  	var out = new Object();
    //alert(ID);
  	switch(ID) {
  	  case 1: //Login
  	  case 2://Login fail
  	  case 3:	//Logout
      case 10: //AT-start
      case 11: //At-stop
      case 5: //Nutzer hat sein Passwort geändert
      case 6: //Login mit kritischen Zugriffsrechten
      case 26: //zugriff auf cO faceplate begründet
      case 36: //zugriff auf cI faceplate begründet
      case 37: //zugriff auf Reglerseite begründet
      case 70: //sequence fordert nutzereingabe an, dialog öffnet
      case 75: //inoculation
  		  out.par1=this.makeUDINT();
        out.par2=this.makeUDINT();
  		  out.string1=this.makeSTR(count - 9);
  	    break;
      case 20: //wert ausgang im faceplate geändert
      case 30: //wert reglersollwert im faceplate cO geändert
      case 31: //wert reglersollwert auf rgelerseite geändert
      case 34: //wert reglersollwert im faceplate cI geändert
        out.par1=this.makeUDINT();
        out.new1=this.makeFLOAT();
        //alert(out.new1);
      break;
      case 22: //lockOff geändert
      case 23: //lockman geändert
      case 32: //enable regler aus faceplate cO geändert
      case 33: //enable regler aus reglerseite geändert
      case 35: //enable regler aus faceplate cO geändert
      case 40:// profil manuell gestartet/gestoppt
      case 71: //sequence dialog mit OK quittiert
      case 72: //sequence dialog mit abbruch quittiert
      case 73: //sequence dialog timeout abgelaufen
      case 74: //sequence dialog minimiert
      case 100: //alarm generic come
      case 101: //alarm generic gone
      case 102: //alarm generic ack
      case 110: //alarm serial come
      case 111: //alarm serial gone
      case 112: //alarm serial ack
      case 120: //alarm x20 come
      case 121: //alarm x20 gone
      case 122: //alarm x20 ack
      case 130: //alarm HH come
      case 131: //alarm HH gone
      case 132: //alarm HH ack
      case 140: //alarm H come
      case 141: //alarm H gone
      case 142: //alarm H ack
      case 150: //alarm L come
      case 151: //alarm L gone
      case 152: //alarm L ack
      case 160: //alarm LL come
      case 161: //alarm LL gone
      case 162: //alarm LL ack

        out.par1=this.makeUDINT();
        out.par2=this.makeUDINT();
      break;
      case 50: // sequenz manuell gestartet
      case 51: // sequenz manuell weich gestoppt
      case 52: // sequenz manuell hart gestoppt
      case 55: // sequenzengine beginnt Herunterfahren
      case 56: // sequenzengine beginnt Herunterfahren einer hilfssequenz nach Stop der muttersequenz
      case 57: // sequenzengine bendet ausführung
      case 12: // B&R DB-Modul hat unbekannte ID geparst
      case 41:// profil selbständig durchgelaufen
        out.par1=this.makeUDINT();
      break;
      case 19: // datei-Puffer Überlauf am B&R DB-Modul
      case 14: //reboot
      case 18: // eventpuffer überlauf
        break;
      case 60: //globaler sequenzparamter vor start der sequenz geändert
      case 61: //globaler sequenzparamter bei laufender sequenz geändert
        //alert(String(ID)+' '+String(count - 13)+' '+String(this.offset));
        out.par1=this.makeUDINT();
        out.par2=this.makeUDINT();
        out.new1=this.makeFLOAT();
        out.string1=this.makeSTR(count - 13);
        break;
  	  default: //JS preparser hat unbekannte ID geparst
        out=false;  //wird von aufrufener instanz auf ID 13 gezwungen
  	}
  	return out;
  }

  /**
	 *  versucht den Datenheader zu konstruieren (this.CRC_A_OK, this.CRC_B_OK)
	 *  versucht die erste Datenzeile zu konstruieren (this.firstLineOK)
	 *  versucht alle anderen Datenzeilen zu konstruieren (this.dataLinesRead)
	 *  to do: prüft auf Eventdaten und konstruiert diese (this.eventsRead);
	 *
	 */
	//onStart,onBlock,onFinish events übergebn
	constructor(b){
		super(b);
		this.ASYBLOCKSIZE=131072; //Menge an Bytes pro asynchronem aufruf beim entpacken
		this.ASYTIMEOUT=50; //Timeout in msec nach jedem asynchronen aufruf beim entpacken
		this.deviceident=this.makeUDINT();
    this.maxBufCount=this.makeUDINT();
    this.maxBufSize=this.makeUDINT();
    this.records=this.makeUDINT();
    this.crcHeader=this.makeUDINT();
		var CRC = this.crctrend(0,this.offset-4);
		this.crcHeader_OK=this.crcHeader == CRC;
		this.event = new Array();
		this.bytesSkipped=0;
		this.eventCRCerrors=0;
		this.eventFrameError=0;
		this.eventsRead=0;
		this.percentRead=0;
		this.DEBUGfirstError=false;
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
		while ((this.offset + 24) <= this.b.byteLength){ // Daten muss für einmal header/footer
      var thisEvent=this.makeEvent();
	    if (thisEvent!=false){
				this.event[this.eventsRead]=thisEvent;
				this.eventsRead++;
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
	makeEvent() {

		if ((this.offset + 16) > this.b.byteLength){ // muss für einmal delim + time + id + payloadcount reichen
			this.eventFrameError++;
			return false;
		}else {
			var h = new Uint8Array(this.b,this.offset, 4);
			var internalOffset=this.offset;  //erstmal internen offset verwenden und nur bei erfolg auf Klassenvariable schreiben

			if((h[0]!=35) || (h[1]!=35) || (h[2]!=35) || (h[3]!=35)){
				return false;
			}else{
				internalOffset+=4;//header
				var out=new Object;
				out.time = this.makeDT(internalOffset);
				out.timeRaw = this.makeUDINT(internalOffset); //auch rohzeit übernehmen als späteren Sortierschlüssel
				internalOffset+=4;//zeitstempel
				out.ID = this.makeUDINT(internalOffset); //auch rohzeit übernehmen als späteren Sortierschlüssel
				internalOffset+=4;//ID
				out.payloadCount = this.makeUDINT(internalOffset);//payloadcount an diesem offset holen
				internalOffset+=4;

				if ( (internalOffset + out.payloadCount + 8) > this.b.byteLength){
					this.eventFrameError++;
					return false;
				}else{
					var CRC_E_calc = this.crctrend(internalOffset-12,out.payloadCount + 12);//CRC über erwartete länge berechnen (payload + crc + enddelim)
					var CRC_E_found = this.makeUDINT(internalOffset + out.payloadCount);
					if (CRC_E_calc != CRC_E_found){
						this.eventCRCerrors++;
						return false;
					}else{
            this.offset=internalOffset; //Erfolg: Offset auf alle gelesenen bytes erhöhen
            //alert(out.payloadCount);
            var back=this.makeATeventRawData(out.ID,out.payloadCount);//hier ATevent rückgabe, offset wird intern hochgezählt
            if (back===false){
              out.data = new Object;
              out.data.par1 = out.ID; //ursprüngliche ID in par1 sichern
              out.ID = 13;// parserfehler frontent markieren, ursprüngliche id überschreiben
            }else{
              out.data = back;
              alert
            }
						this.offset+=8; //crc + end delim
            return out;
					}
				}
			}
		}
		//this.offset=internalOffset; //Erfolg: Offset auf alle gelesenen bytes erhöhen
		//return out;
	}

}
