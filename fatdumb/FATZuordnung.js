/**
 *  Zuordnungstabelle zwischen xCUBIO kanal-Klassentypen und FAT-Dateiname
 *
 *
 *  *@author TK, 04/2020,   version 1.0.1
      STIU bitte fortführen
 *
 */
"use strict";
class FATZuordnung  {
  /**
    Erzeugt Dateinamen aus Eingngs-typnummer, Rückgabe dann String
    Rückgabe false für unbekannte typen
  */
  static getFilenamefromInputType(type){
    switch (type) {
      case 102: //fcI_Ptx
      case 101: //fcI_lin mA
        return 'sFORM 100 V1.4 IO test.docx';
      break;
      case 90:
        return 'todo serielle Sonden';
      break;
      default:  //unhandled
        return false;
    }
  }
  /**
    Erzeugt Dateinamen aus Ausgangs-typnummer, Rückgabe dann String
    Rückgabe false für unbekannte typen
  */
  static getFilenamefromOutputType(type){
    switch (type) {
      case 5: //fcO_SM1426_scale
      case 101: //fcO_lin mA
        return 'sFORM 100 V1.4 IO test.docx';
      break;
      case 6:
      case 7:
      case 8:
        return 'sFORM 200 V1.0 Tempering Unit Test.docx';
      break;
      default:  //unhandled
        return false;
    }
  }
}
