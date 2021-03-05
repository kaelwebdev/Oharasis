import { Component, OnInit } from '@angular/core';
import { Logro } from "../../interfaces/logro.interface";
import { LogroService } from "../../services/logro.service";
import { RegLogro } from "../../interfaces/regLogro.interface";
import { RegLogroService } from "../../services/regLogro.service";
import { StorageService } from "../../services/storage.service";
import { Usuario } from '../../interfaces/usuario.interface';

@Component({
  selector: 'app-mis-logros',
  templateUrl: './mis-logros.component.html',
  styleUrls: ['./mis-logros.component.css']
})
export class MisLogrosComponent implements OnInit {
  user:Usuario
  logros:Logro[];
  regsLogro:RegLogro[];
  constructor(public _logroS:LogroService, public _regsLogroS:RegLogroService,
    private _stS:StorageService) {
    this.user= this._stS.getCurrentUser();
   }

  ngOnInit() {
    this.getLogros();
    
  }
  
  getRegLogros(){
    let subsRegsL =this._regsLogroS.getItem(true,["d_idEstudiante","==",this.user.d_id],true,["idLogro","asc"]).subscribe(data=>{
      subsRegsL.unsubscribe();
      this.regsLogro= data;
    });
  }

  getLogros(){
    let subsGetL=this._logroS.getItem(false,undefined,true,["id","asc"]).subscribe(data=>{
      subsGetL.unsubscribe();
      this.logros= data;
      this.getRegLogros();
    });
  }

  
}
