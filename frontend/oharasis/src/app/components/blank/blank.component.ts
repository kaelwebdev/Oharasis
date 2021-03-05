import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router"; 
import { StorageService } from '../../services/storage.service';
import { Usuario} from "../../interfaces/usuario.interface";
@Component({
  selector: 'app-blank',
  templateUrl: './blank.component.html',
  styleUrls: ['./blank.component.css']
})
export class BlankComponent implements OnInit {
  user:Usuario;
  constructor(private router:Router, private _stS:StorageService) {
    this.user= this._stS.getCurrentUser();
   }

  ngOnInit() {
    this.redireccionar();
  }

  redireccionar(){
    if(this.user.rol=="Estudiante"){
      this.router.navigate(['/user','mi-avatar']);
    }else if(this.user.rol=="Profesor" || this.user.rol=="Director"){
      this.router.navigate(['/user','buscarCursos']);
    }else if (this.user.rol=="Admin"){
      this.router.navigate(['/user','crearUsuarios']);
    }
  }

}
