"use strict";
/**Datenhaltungsklasse für Rohinformation einer B&R typdatei
 *
 */
class BRStructType {
	constructor(name){
		this.name=name; //String aus TYP-Datei
		this.brRawParse= new Array(0); //ursprüngliche, getrimmte liste der unterstrukturen im B&R *.typ Dateiformat
		this.moduloOperatorForOffsetCorrection=0;
	}
}
