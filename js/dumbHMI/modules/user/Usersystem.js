/**
 *  Factoryklasse für dom-ausgaben zum nutzersystem

 *  *@author TK, 09/2021, version 1.0.1
 */
"use strict";
class Usersystem {
  constructor(d){
    this.usernames = [];
    this.userlevel = [];
    for (var i = 0 ; i < d.userFiles.length ; i++){
      switch (d.userFiles[i].level) {
        case 1:
          this.userlevel.push("Guest");
          this.usernames.push(d.userFiles[i].nick);
        break;
        case 2:
          this.userlevel.push("Operator");
          this.usernames.push(d.userFiles[i].nick);
        break;
        case 3:
          this.userlevel.push("Admin");
          this.usernames.push(d.userFiles[i].nick);
        break;
        case 5:
          this.userlevel.push("Supervisor");
          this.usernames.push(d.userFiles[i].nick);
        break;
        case 10:
          this.userlevel.push("Service");
          this.usernames.push(d.userFiles[i].nick);
        break;
      }
    }

  }
/**
  gibt tabelle der möglichen nutzer aus
*/
  getUserTable(){
    var usercount=this.userlevel.length;
    var back=   '<div class="myTable"><table><tbody><tr><th>Username</th><th>Userlevel</th></tr>';
    for (var i = 0 ; i < usercount ; i++){ //alle nutzer
        back+=  '<tr><td>' + this.usernames[i] + '</td>';  //name
        back+=  '<td>' + this.userlevel[i] + '</td></tr>';  //level
    }
    back+=   '</tbody></table></div>';
    return back
  }
}
