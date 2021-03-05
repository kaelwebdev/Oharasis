import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() {

   }

  ngOnInit() {
   // this.deleteStyle(); //aun no es seguro utilizarlo
   /*la idea era quitar el css de adminlte solo al home
    pero al cambiar de pagina adminlte.css seguiria borrado
    por lo cual no sirvio este metodo totalmente.
   */
  }
  // public deleteStyle() {

  //   var style = document.getElementsByTagName("style");
  //   for (var i = 0; i < style.length; ++i) {
  //       if (style[i].innerText.toLowerCase().indexOf("adminlte")!=-1){
  //         console.log("encontre style admilte >");
  //         console.log(style[i]);
  //         style[i].parentNode.removeChild(style[i]);
  //         console.log("<encontre style admilte");
  //       }
  //   }
  // }


}
