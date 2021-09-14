/**
 *  statische Factoryklasse zur umwandlung einer
 *  nested ul des dump-outputs in eine collapsible list
 *  (nutzerspezifischen ein-ausklappen von benötigten infos)
 *
 *  *@author TK, 06/2021, version 1.0.1
 */
"use strict";
class CollapsibleList  {

 static init(query){
   var coll = document.querySelectorAll(query); //".clist li"
   var i;
   var collh;

   for (i = 0; i < coll.length; i++) {
     collh = coll[i].querySelectorAll("h3");
     if (collh[0]!=null) {
       collh[0].addEventListener("click", function() {
         this.parentNode.classList.toggle("collapsedListNode");
         this.nextElementSibling.classList.toggle("collapsedContent");
       });
     }
   }
   //alert(i);
 }


}
