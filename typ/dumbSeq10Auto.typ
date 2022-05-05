TYPE
	dumpfile_typ : 	STRUCT
		tag : STRING[40];
		time : DATE_AND_TIME;
		channelHeaders : df_channel_header_typ; (*Kanalnamen, min/max, Typnummer, Einheit f�r in/out/CL*)
		bbiIdent : UDINT;
		comment : STRING[252] := 'init comment'; (*comment for user*)
		variantHeader : ARRAY[0..766]OF USINT;
		channelHeadersCRC : UDINT;
		delActiveConf : ARRAY[0..3]OF USINT;
		configActive : ARRAY[0..11]OF core_rem_typ;
		variantConfigActive : ARRAY[0..1023]OF USINT;
		configActiveCRC : UDINT;
		delConfFiles : ARRAY[0..3]OF USINT;
		configFiles : ARRAY[0..9]OF config_file_typ;
		variantConfigFiles : ARRAY[0..1023]OF USINT;
		configFilesCRC : UDINT;
		delProfFiles : ARRAY[0..3]OF USINT;
		profileFiles : ARRAY[0..9]OF profile_file_slot_typ;
		variantProfileFiles : ARRAY[0..1023]OF USINT;
		profileFilesCRC : UDINT;
		delSeqFiles : ARRAY[0..3]OF USINT;
		seqFiles : ARRAY[0..9]OF seq_Slot_typ;
		variantSeqFiles : ARRAY[0..1023]OF USINT;
		seqFilesCRC : UDINT;
		delAddFiles : ARRAY[0..3]OF USINT;
		recTemplateFiles : ARRAY[0..9]OF rem_trend_typ;
		userFiles : ARRAY[0..61]OF user_typ;
		fileValves : ARRAY[0..31]OF valveArraySlot_typ;
		file_setup : file_setup_typ;
		file_cal : ARRAY[0..11]OF file_cal_typ;
		variantAddFiles : ARRAY[0..1023]OF USINT;
		addFilesCRC : UDINT;
	END_STRUCT;
	df_channel_header_typ : 	STRUCT
		cCL : ARRAY[0..15]OF df_channel_header_values_typ;
		cO : ARRAY[0..63]OF df_channel_header_values_typ;
		cI : ARRAY[0..63]OF df_channel_header_values_typ;
	END_STRUCT;
	df_channel_header_values_typ : 	STRUCT
		tag : STRING[24];
		unitStr : STRING[10]; (*Einheitenstring*)
		min : REAL;
		max : REAL;
		type : USINT; (*ident zur Bestimmung der Reglerlogik f�r andere FUB/ externe Anwendungen*)
	END_STRUCT;
	core_rem_typ : 	STRUCT  (*remanenter Anlagenstack der global verf�gbar sein muss (Konfiguration und Sequenzstack)*)
		seq : ARRAY[0..2]OF rem_seq_typ; (*remanente infos der laufenden sequenz*)
		config : config_rem_typ; (*aktuelle Konfiguration der Kan�le*)
		profile : ARRAY[0..9]OF profile_rem_slot_typ; (*aktuelle Konfiguration der Profile*)
	END_STRUCT;
	rem_seq_typ : 	STRUCT
		int : REAL; (*ticks im bedingten timer*)
		ticks : UDINT; (*ticks im bedingten timer*)
		condStartTime : DATE_AND_TIME;
		seqStartTime : DATE_AND_TIME;
		start104 : REAL;
		row : UINT;
		parent : USINT; (*index+1 der elterndefinition; bedeutet auch, das wenn > 0, ist dieser slot eine hilfssequenz*)
		ident : USINT; (*index+1 der Definition die auf diesem slot ausgef�hrt wird*)
		valveArrayIndex : USINT;
		seqInit : BOOL; (*flanke seq enable*)
		rowInit : BOOL; (*wird zur umschaltung zwischen aktion und transitionsbedingung bei einzelnen schritten verwendet (true bei warten auf bedingung)*)
		skip : BOOL;
		abort : BOOL;
		messageCancel : BOOL;
		messageOK : BOOL;
		message : BOOL;
		messageMinimized : BOOL;
		counter : ARRAY[0..2]OF UINT;
	END_STRUCT;
	config_rem_typ : 	STRUCT  (*remanente Kanalinformationen die global verf�gbar sein m�ssen*)
		cCL : ARRAY[0..15]OF cCL_rem_typ;
		cO : ARRAY[0..63]OF cO_rem_typ;
		cI : ARRAY[0..63]OF cI_rem_typ;
	END_STRUCT;
	cCL_rem_typ : 	STRUCT
		W : REAL; (*Sollwert cI skaliert*)
		PV : ARRAY[0..1]OF USINT; (*Slotbelegung f�r Istwert Eing�nge*)
		ACT : ARRAY[0..4]OF USINT; (*Slotbelegung der Stellglieder*)
		PID : ARRAY[0..4]OF PIDpar_typ; (*PID parameters�tze*)
		par : CLpar_typ; (*erweiterte Parameter*)
		enable : BOOL := FALSE; (*Regler Ein/Aus (Wunschzustand durch Seq/User)*)
	END_STRUCT;
	cO_rem_typ : 	STRUCT
		man : REAL; (*manueller Vorgabewert bei lockOnMan*)
		out : REAL; (*Eingangssignal Stellwert f�r die Skalierung (standardisierte Verkn�pfungsvariable, wird zwischen inMin und inMax auf Stellausgang skaliert)*)
		rangeLow : REAL; (*untere Stellwertschranke bei Reglerbetrieb (in-skaliert)*)
		rangeHigh : REAL; (*obere Stellwertschranke bei Reglerbetrieb (in-skaliert)*)
		lockON : BOOL; (*f�r faceplate locking*)
		lockOFF : BOOL; (*f�r faceplate locking*)
	END_STRUCT;
	cI_rem_typ : 	STRUCT
		alertRanges : ARRAY[0..3]OF REAL; (*untere Grenzen Alarmbereich alarm bei x>range 0-notice 1-critical  alarm bei x<range 2-notice 3-critical (out-skaliert)*)
		alertActive : ARRAY[0..3]OF BOOL; (*Schalter f�r Ein/Ausschalten der Alarme von 0 bis 3*)
	END_STRUCT;
	profile_rem_slot_typ : 	STRUCT
		start : DATE_AND_TIME;
		indexRunning : USINT; (*index auf dem das profil l�uft (linear)*)
		status : USINT; (*0-disabled, 1-started*)
		min : REAL;
		max : REAL;
		p1 : ARRAY[0..31]OF UDINT;
		p2 : ARRAY[0..31]OF REAL;
		factor : REAL := 1; (*Faktor mit dem alle p2 multipliziert werden*)
		tag : STRING[31];
		target : USINT; (*0=unbelegt, 1=ausgang, 2 =Sollwert*)
		index : USINT; (*kanal index nullbasiert*)
		type : USINT; (*0=linear*)
	END_STRUCT;
	config_file_typ : 	STRUCT  (*remanente Kanalinformationen die global verf�gbar sein m�ssen*)
		dateStamp : DATE_AND_TIME; (*Erstellungsdatum*)
		user : USINT; (*NEU: Userlevel des erstellers, nur 2/3 zul�ssig, alt:Erstellerindex (userArray)*)
		tag : STRING[30]; (*titel*)
		cCL : ARRAY[0..15]OF cCL_rem_typ;
		cO : ARRAY[0..63]OF cO_rem_typ;
		cI : ARRAY[0..63]OF cI_rem_typ;
		valveState : UDINT; (*legacy, abgel�st mit 64 Kanal erweiterung*)
		changed : BOOL;
	END_STRUCT;
	profile_file_slot_typ : 	STRUCT
		dat : DATE_AND_TIME;
		changed : BOOL;
		min : REAL;
		max : REAL;
		p1 : ARRAY[0..31]OF UDINT;
		p2 : ARRAY[0..31]OF REAL;
		factor : REAL := 1; (*Faktor mit dem alle p2 multipliziert werden*)
		tag : STRING[31];
		target : USINT; (*0=unbelegt, 1=ausgang, 2 =Sollwert*)
		index : USINT; (*kanal index nullbasiert*)
		type : USINT; (*0=linear*)
	END_STRUCT;
	seq_Slot_typ : 	STRUCT
		globalPar : ARRAY[0..9]OF REAL; (*globale Parameter (werden beim Start rmenanent auf engine Slot abgelegt)*)
		version : UDINT;
		tag : STRING[30]; (*Tag der in der kopfzeile angezeigt wird*)
		dateChange : DATE_AND_TIME; (*zeitstempel der letzten �nderung*)
		dateCreation : DATE_AND_TIME; (*zeitstempel der Erstellung*)
		user : USINT; (*Userlevel des editors, eventuell noch bugs, da vorher ID genutzt wurde....*)
		category : USINT; (*Symbolgruppe*)
		error : BOOL; (*wird aus dem FUB heraus gesetzt falls ein Fehler detektiert wird*)
		row : ARRAY[0..99]OF seq_Row_typ; (*array mit zeilenweisen sequenzanweisungen f�r engine*)
		disabledStart : BOOL; (*setzen um alle Stellglieder bei start der seq zu beenden*)
		lockAll : BOOL; (*gesetzt wenn Systemeingriffe w�hrend der Seq unterbundne werden sollen (Sterilisation)*)
		hidden : BOOL; (*gesetzt, wenn als Hilfssequenz definiert, diese sequenzen k�nnen nicht manuell gestartet werden und sterben mit abbruch ihrer Elternsequenz*)
		usePhaseTagsForOPC : BOOL; (*Setzen um automatisch bei Zeilenwechsel den Zeilen-Tag als Phasen-Tag ans OPC Mapping durchzureichen.*)
		globalParHead : ARRAY[0..9]OF seqGlobalParHead_typ; (*Overhead f�r globale Parameter (bleibt imme rTeil der Definitionsdatei)*)
		message1 : ARRAY[0..127]OF USINT; (*Workaround da im dataH keine Mehrdmensionalen Arrays (damit auch Stringarrays) unterst�tzt werden*)
		message2 : ARRAY[0..127]OF USINT; (*Workaround da im dataH keine Mehrdmensionalen Arrays (damit auch Stringarrays) unterst�tzt werden*)
		message3 : ARRAY[0..127]OF USINT; (*Workaround da im dataH keine Mehrdmensionalen Arrays (damit auch Stringarrays) unterst�tzt werden*)
		message4 : ARRAY[0..127]OF USINT; (*Workaround da im dataH keine Mehrdmensionalen Arrays (damit auch Stringarrays) unterst�tzt werden*)
		message5 : ARRAY[0..127]OF USINT; (*Workaround da im dataH keine Mehrdmensionalen Arrays (damit auch Stringarrays) unterst�tzt werden*)
		message6 : ARRAY[0..127]OF USINT; (*Workaround da im dataH keine Mehrdmensionalen Arrays (damit auch Stringarrays) unterst�tzt werden*)
		message7 : ARRAY[0..127]OF USINT; (*Workaround da im dataH keine Mehrdmensionalen Arrays (damit auch Stringarrays) unterst�tzt werden*)
		message8 : ARRAY[0..127]OF USINT; (*Workaround da im dataH keine Mehrdmensionalen Arrays (damit auch Stringarrays) unterst�tzt werden*)
		message9 : ARRAY[0..127]OF USINT; (*Workaround da im dataH keine Mehrdmensionalen Arrays (damit auch Stringarrays) unterst�tzt werden*)
		message10 : ARRAY[0..127]OF USINT; (*Workaround da im dataH keine Mehrdmensionalen Arrays (damit auch Stringarrays) unterst�tzt werden*)
		message11 : ARRAY[0..127]OF USINT; (*Workaround da im dataH keine Mehrdmensionalen Arrays (damit auch Stringarrays) unterst�tzt werden*)
		message12 : ARRAY[0..127]OF USINT; (*Workaround da im dataH keine Mehrdmensionalen Arrays (damit auch Stringarrays) unterst�tzt werden*)
		message13 : ARRAY[0..127]OF USINT; (*Workaround da im dataH keine Mehrdmensionalen Arrays (damit auch Stringarrays) unterst�tzt werden*)
		message14 : ARRAY[0..127]OF USINT; (*Workaround da im dataH keine Mehrdmensionalen Arrays (damit auch Stringarrays) unterst�tzt werden*)
		message15 : ARRAY[0..127]OF USINT; (*Workaround da im dataH keine Mehrdmensionalen Arrays (damit auch Stringarrays) unterst�tzt werden*)
		message16 : ARRAY[0..127]OF USINT; (*Workaround da im dataH keine Mehrdmensionalen Arrays (damit auch Stringarrays) unterst�tzt werden*)
		message17 : ARRAY[0..127]OF USINT; (*Workaround da im dataH keine Mehrdmensionalen Arrays (damit auch Stringarrays) unterst�tzt werden*)
		message18 : ARRAY[0..127]OF USINT; (*Workaround da im dataH keine Mehrdmensionalen Arrays (damit auch Stringarrays) unterst�tzt werden*)
		message19 : ARRAY[0..127]OF USINT; (*Workaround da im dataH keine Mehrdmensionalen Arrays (damit auch Stringarrays) unterst�tzt werden*)
		message20 : ARRAY[0..127]OF USINT; (*Workaround da im dataH keine Mehrdmensionalen Arrays (damit auch Stringarrays) unterst�tzt werden*)
		locking : ARRAY[0..9]OF BOOL; (*Interlocktabelle*)
		changed : BOOL;
	END_STRUCT;
	seq_Row_typ : 	STRUCT
		tag : STRING[15];
		parReal : ARRAY[0..1]OF REAL;
		parUDINT : ARRAY[0..0]OF UDINT;
		parUINT : ARRAY[0..5]OF UINT;
		globalCon : ARRAY[0..3]OF UINT; (*0=keine verbindung*)
		parBOOL : ARRAY[0..0]OF BOOL;
	END_STRUCT;
	seqGlobalParHead_typ : 	STRUCT
		parMax : REAL; (*maximal zul�ssiger Wertebereich des globalen P.*)
		parMin : REAL; (*minimal zul�ssiger Wertebereich des globalen P.*)
		tag : STRING[15] := 'par'; (*Tag des globalen P.*)
	END_STRUCT;
	rem_trend_typ : 	STRUCT
		tag : STRING[19] := 'unused'; (*Template name*)
		Ymax : ARRAY[0..7]OF REAL;
		Ymin : ARRAY[0..7]OF REAL;
		index : ARRAY[0..7]OF USINT;
		type : ARRAY[0..7]OF USINT;
		range : UDINT; (*obsolet, x-achsen einstellungen nicht mehr teil der config*)
		offset : UDINT; (*obsolet, x-achsen einstellungen nicht mehr teil der config*)
		autoRange : BOOL; (*obsolet, x-achsen einstellungen nicht mehr teil der config*)
		autoOffset : BOOL; (*obsolet, x-achsen einstellungen nicht mehr teil der config*)
		changed : BOOL;
	END_STRUCT;
	user_typ : 	STRUCT
		nick : STRING[30];
		pw : STRING[30];
		level : USINT; (*neu mit AT Nutzersystem*)
		bg : USINT; (*Index Hintergrundbild*)
		language : USINT;
		changed : BOOL;
	END_STRUCT;
	valveArraySlot_typ : 	STRUCT
		user : USINT; (*Erstellerindex (userArray)*)
		version : UDINT;
		tag : STRING[15]; (*titel*)
		lastChanged : DATE_AND_TIME;
		valve : ARRAY[0..31]OF USINT; (*ventilarray*)
		changed : BOOL;
	END_STRUCT;
	ntp_typ : 	STRUCT
		enable : BOOL;
		serverName1 : STRING[30];
		serverName2 : STRING[30];
		serverName3 : STRING[30];
		serverName4 : STRING[30];
	END_STRUCT;
	netStorage_typ : 	STRUCT
		enable : BOOL;
		folder : STRING[30];
		serverName : STRING[30];
		user : STRING[30];
		pw : STRING[30];
	END_STRUCT;
	setup_units_typ : 	STRUCT
		unitPres : USINT;
		unitVol2 : USINT;
		unitVol : USINT;
		unitFlow : USINT;
		unitMass : USINT;
		unitTemp : USINT;
		unitCond : USINT := 1;
	END_STRUCT;
	file_setup_typ : 	STRUCT
		scrBacklightTurnOffDelayScaled : UINT := 300; (*Delay(sek) bis zum ausschalten der hintergrundbeleuchtung (0=kein abschalten)*)
		enableRAMdebug : BOOL;
		enableRecovery : BOOL := TRUE; (*nur f�r anlagen ohne hauptschalter�berwachung*)
		enableBeep : BOOL := TRUE;
		enableCustomAlert : ARRAY[0..7]OF BOOL;
		recoveryDelayScaled : REAL := 5.0; (*recoveryzeit in minuten (0=kein recovery) nur f�r anlagen mit hauptschalter�berwachung*)
		gate : ARRAY[0..3]OF USINT := [192,168,123,214]; (*IP*)
		ip : ARRAY[0..3]OF USINT := [192,168,123,214]; (*IP*)
		snm : ARRAY[0..3]OF USINT := [3(255),0]; (*subnetmask*)
		dhcpActive : BOOL := FALSE; (*DHCP aktivieren*)
		OPC_enable : BOOL := TRUE;
		VNC_enable : BOOL := TRUE;
		VNC_pw_full : STRING[9] := 'bbi';
		VNC_pw_viewwonly : STRING[9] := '1234';
		gaspump : BOOL;
		mplexMeas : ARRAY[0..3]OF UDINT;
		mplexDead : ARRAY[0..3]OF UDINT;
		mplexDest : ARRAY[0..3]OF USINT;
		timeSampler : ARRAY[0..6]OF UDINT := [2000,500,1000,2000,10000,1000,0]; (*zeit f�r samplerschritte in msec*)
		counter : ARRAY[0..7]OF UDINT;
		netStorage : netStorage_typ;
		ntp : ntp_typ;
		units : setup_units_typ;
		trendAutoTag1 : STRING[23] := 'SIP';
		trendAutoTag2 : STRING[23] := 'FERM';
		trendAutoTag3 : STRING[23] := 'CIP';
		changed : BOOL;
	END_STRUCT;

	cCal_typ : 	STRUCT
		tim : DATE_AND_TIME; (*Zeitpunkt der letzten Kalibrierung*)
		user : STRING[30]; (*Nutzername der letzten Kalibrierung*)
		X1 : REAL; (*rohwert erstes paar*)
		X2 : REAL; (*rohwert zweites paar*)
		Y1 : REAL; (*Kalibriergr��e erstes paar*)
		Y2 : REAL; (*Kalibriergr��e zweites paar*)
		parReal : ARRAY[0..1]OF REAL; (*Parameter als flie�kommazahl*)
		parBool : ARRAY[0..0]OF BOOL; (*Paramter als boolsche variable*)
		parInt : ARRAY[0..3]OF UINT;
		DISABLED : BOOL;
	END_STRUCT;
	file_cal_typ : 	STRUCT
		cal_cI : ARRAY[0..63]OF cCal_typ;
		cal_cO : ARRAY[0..63]OF cCal_typ;
		reactStartVol : REAL := 15000;
		inocVol : REAL := 1000;
		pressRange : REAL := 2000; (*druckgrenze*)
		counter : ARRAY[0..7]OF UDINT;
		trendName : STRING[40];
		deviceID : STRING[9] := '';
		processCommentFromTrend : STRING[255]; (*f�r Batch Kommentar an �bergeordnetes Scada (osi pi)*)
		autoProcessPhaseName : STRING[100]; (*f�r Batch Phase an �bergeordnetes Scada (osi pi)*)
		autoProcessName : STRING[100]; (*f�r Batch ID an �bergeordnetes Scada (osi pi)*)
		changed : BOOL;
	END_STRUCT;
	CL_lock_typ : 	STRUCT
		disable_on_cI_error : ARRAY[0..1]OF BOOL;
		disable_on_cO_error : ARRAY[0..4]OF BOOL;
		disable_on_cO_lock : ARRAY[0..4]OF BOOL;
	END_STRUCT;
	CLpar_typ : 	STRUCT
		delay1 : REAL := 30.0; (*Totzeiten bis zum Umschalten der Stellglieder 1/2 (sec)*)
		delay2 : REAL := 30.0; (*Totzeiten bis zum Umschalten der Stellglieder 2/3 (sec)*)
		delay3 : REAL := 30.0; (*Totzeiten bis zum Umschalten der Stellglieder 3/4 (sec)*)
		Wmin : REAL := 5.0; (*minimale Temperatur auf dem Slave Controller*)
		Wmax : REAL := 85.0; (*maximale Temperatur auf dem Slave Controller*)
		Wadd : REAL := 60.0; (*maximale Aufschalttemperatur in beide Richtungen*)
		lock : CL_lock_typ; (*disable bedingungen*)
		logic : USINT; (*logic Auswahl f�r CL math*)
		toW : BOOL; (*Sollwert Auswahl f�r CL math*)
	END_STRUCT;
	PIDpar_typ : 	STRUCT
		Kp : REAL; (*P-Anteil*)
		Tn : REAL; (*I-Anteil (0 f�r aus)*)
		Tv : REAL; (*D-Anteil (0 f�r aus)*)
		offsetIFreeze : REAL; (*minimale regelabweichung ab der der I Anteil zugeschaltet wird (WX skaliert)*)
		deadband : REAL; (*Totband (WX skaliert)*)
		invert : BOOL; (*Invertierung des Stellausgangs*)
	END_STRUCT;
END_TYPE
