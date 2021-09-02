"use strict";
/**
 *eigene collapsible list
 *  *@author TK, 06/2021, version 1.0.1
 */
"use strict";
class my$ {

  constructor(query){
    this.query=query;
  }
  /**
  * factory auf query anwenden
   */
  clist(off) {
    this.coll = document.getElementsByClassName(query);
    var i;
    for (i = 0; i < this.coll.length; i++) {

      this.coll[i].addEventListener("click", function() {
        this.classList.toggle("clistActive");
        var content = this.nextElementSibling;
        if (content.style.display === "block") {
          content.style.display = "none";
        } else {
          content.style.display = "block";
        }
      });
    }
  }

}
