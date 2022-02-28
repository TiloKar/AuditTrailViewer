/**erweiterte BinaryBRTypedFile für Checksummenprüfung von Dumps
 *
 *@author TK, 02/2022, version 1.0.1

 *
*/

class Dumpfile extends BinaryBRTypedFile{
  /**
  prüft nach vorgegebenem raster die prüfsummen in der dumpdatei
  */
  checkSumsOK(){
    let checksumsPos = [0,7988,112412,167644,171796,375828,512108];
    for (var i = 1; i < 7; i++) {
      let CRC_tobe=this.makeUDINT(checksumsPos[i] - 4);
      let CRC_calc = this.crctrenddump(checksumsPos[i-1], checksumsPos[i] - checksumsPos[i-1] - 4);
      if (CRC_calc !== CRC_tobe) {
          return false;
      }
    return true;
    }
  }
}
