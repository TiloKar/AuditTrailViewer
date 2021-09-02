
TYPE
	FATchannel_typ : 	STRUCT 
		type : USINT; (*Type der angehängten IO logik*)
		tag : STRING[24];
		unitStr : STRING[10]; (*Einheitenstring*)
		min : REAL;
		max : REAL; (*obere Skalierungsgrenze Messwert*)
	END_STRUCT;
	FATdump_typ : 	STRUCT 
		ident : UDINT;
		cI : ARRAY[0..63]OF FATchannel_typ;
		cO : ARRAY[0..63]OF FATchannel_typ;
	END_STRUCT;
END_TYPE
