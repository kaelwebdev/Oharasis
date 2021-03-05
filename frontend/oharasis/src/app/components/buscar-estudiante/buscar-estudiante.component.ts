import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Usuario } from "../../interfaces/usuario.interface";
import { UsuarioService } from "../../services/usuario.service";
import { Subscription } from 'rxjs';
import {Router} from '@angular/router';
@Component({
  selector: 'app-buscar-estudiante',
  templateUrl: './buscar-estudiante.component.html',
  styleUrls: ['./buscar-estudiante.component.css']
})
export class BuscarEstudianteComponent implements OnInit {
  getSubscribe:Subscription;
  forma:FormGroup;
  usuarios: Usuario[];
  valFiltro=["",""];
  filtrar:boolean = false;
  doubleF:boolean=false;
  usuario:Usuario = {
    d_id:"",
    alias:"",
    password:"",
    nombre:"",
    apellido:"",
    email:"",
    sexo:"",
    urlImagen:"",
    rol:""
  }

  borrar: boolean = false;

  usuario_Seleccionado:Usuario;

  constructor(public _usuarioS:UsuarioService, public router:Router) {
    this.forma = new FormGroup({
      'ftxtNombre': new FormControl(''),
      'ftxtApellido': new FormControl('')
    });


    this.forma.get('ftxtNombre').valueChanges.subscribe(val=>{
      this.valFiltro[0] = this.capitalizar(val);
      this.getUsuario();
    });

    this.forma.get('ftxtApellido').valueChanges.subscribe(val=>{
      this.valFiltro[1] = this.capitalizar(val);
      this.getUsuario();
    });

   }

   capitalizar(str) {
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

  ngOnInit() {
    this.getUsuario();
  }

  getUsuario() {

    if (this.borrar == true) {
      this.borrar = false;
      this.forma.controls['ftxtNombre'].setValue('');
      this.forma.controls['ftxtApellido'].setValue('');
    }

    if (this.valFiltro[0]=="" && this.valFiltro[1]=="") {
      this.filtrar = false;
      this.doubleF = false;
      let subsGetUsuarios = this._usuarioS.getItem(false, undefined , true, ["nombre","desc"]).subscribe(data=>{
        subsGetUsuarios.unsubscribe();
        this.usuarios = data;
      });
    } else {
      this.filtrar = true;
      if (this.valFiltro[0]!="" && this.valFiltro[1]=="") {
        this.doubleF=false;
        let subsGetUsuarios= this._usuarioS.filtrarNombre(this.valFiltro[0]).subscribe(data=>{
          subsGetUsuarios.unsubscribe();
          this.usuarios= data;
        });
      } else if (this.valFiltro[0]=="" && this.valFiltro[1]!=""){
        this.doubleF=false;
        let subsGetUsuarios= this._usuarioS.filtrarApellido(this.valFiltro[1]).subscribe(data=>{
          subsGetUsuarios.unsubscribe();
          this.usuarios= data;
        });
      } else if (this.valFiltro[0]!="" && this.valFiltro[1]!=""){
        this.doubleF=true;
        let subsGetUsuarios= this._usuarioS.getRegistroV1(this.valFiltro[0],this.valFiltro[1]).subscribe(data=>{
          subsGetUsuarios.unsubscribe();
          this.usuarios= data;
        });
      }
    }
  }

  filtrarEstudiante() {
    this.filtrar = true;
  }

  cancelarFiltro() {
    this.borrar = true;
    this.filtrar = false;
    this.getUsuario();
  }

  verPerfil(d_idU) {
    this.router.navigate(['/user', 'perfil', d_idU]);
  }

  verAvatar(d_idE) {
    this.router.navigate(['/user', 'estudianteAvatar', d_idE]);
  }

}
