import { Component, OnInit } from '@angular/core';
import { Usuario} from "../../interfaces/usuario.interface";
import { UsuarioService} from "../../services/usuario.service";
import { ActivatedRoute } from "@angular/router";
import { StorageService } from '../../services/storage.service';
import { RegEstudiante} from "../../interfaces/regEstudiante.interface";
import { RegEstudianteService} from "../../services/regEstudiante.service";

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  user: Usuario;
  usuario: Usuario;
  idUsuario: string;
  regEstudiante: RegEstudiante;

  constructor( private _usuarioS: UsuarioService, private _regEstS: RegEstudianteService,
    private rutaActiva: ActivatedRoute, private _stS: StorageService) {
    this.rutaActiva.params.subscribe(params => {
      this.idUsuario = params['d_idU'];
      if (this.idUsuario == undefined) {
        this.user = this._stS.getCurrentUser();
        this.usuario = this.user;
      }
    });

   }

  ngOnInit() {
    this.getUsuario();
  }

  getRegEstudiante() {
    let subsGetRegEst=this._regEstS.getItem(true,["d_idEstudiante","==",this.user.d_id]).subscribe(data=>{
      subsGetRegEst.unsubscribe();
      this.regEstudiante = data[0];

    });
  }

  getUsuario() {
    if (this.idUsuario == undefined) {
      let subsGetRegUsuario =this._usuarioS.getItem(true,["d_id","==", this.usuario.d_id]).subscribe(data => {
        subsGetRegUsuario.unsubscribe();
        this.usuario = data[0];
        if (this.usuario.rol == 'Estudiante') {
          this.getRegEstudiante();
        }
      });
    } else {
      let subsGetRegUsuario=this._usuarioS.getItem(true,["d_id","==", this.idUsuario]).subscribe(data => {
        subsGetRegUsuario.unsubscribe();
        this.usuario = data[0];
        if (this.usuario.rol == 'Estudiante') {
          this.getRegEstudiante();
        }
      });
    }
  }

  

}
