import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { Usuario } from "../../interfaces/usuario.interface";
import { UsuarioService } from "../../services/usuario.service";
import { RegCalificacion } from "../../interfaces/regCalificacion.interface";
import { RegCalificacionService } from "../../services/regCalificacion.service";
import { StorageService } from '../../services/storage.service';
import { Curso } from "../../interfaces/curso.interface";
import { CursoService } from "../../services/curso.service";

declare let jQuery: any;
declare let $: any;

@Component({
  selector: 'app-estudiantes',
  templateUrl: './estudiantes.component.html',
  styleUrls: ['./estudiantes.component.css']
})

export class EstudiantesComponent implements OnInit {
  user: Usuario;
  estudiantes: Usuario[];
  regsC: RegCalificacion[];
  idCurso: string="";
  curso:Curso;
  constructor(public router:Router, private rutaActiva:ActivatedRoute,
    public _usuarioS:UsuarioService, public _regCS:RegCalificacionService,
    public _stS:StorageService, public _cursoS:CursoService) {
      this.user= this._stS.getCurrentUser();
      this.rutaActiva.params.subscribe(params=>{
        this.idCurso=params['idCurso'];
      });
   }

  ngOnInit() {
    this.getRC();
    this.getCurso();
  }

  getCurso(){
    let subsGetCurso=this._cursoS.getItem(true,["d_id","==",this.idCurso]).subscribe(data => {
      subsGetCurso.unsubscribe();
      this.curso=data[0];
      $(document).ready(function() {
        $('[data-toggle="tooltip"]').tooltip();
      });
    });
  }

  getRC() {
    let subsGetRegC=this._regCS.getItem(true,["d_idCurso","==",this.idCurso], false, undefined).subscribe(data => {
      subsGetRegC.unsubscribe();
      this.regsC = data;
      this.estudiantes = [];
      for (const regC of this.regsC) {
        this.addEM(regC.d_idEstudiante);
      }
    });
  }

  addEM(idE) {
    let subsGetEst=this._usuarioS.getEstudiantes(true,["d_id","==",idE],true,["nombre","asc"]).subscribe(data => {
      subsGetEst.unsubscribe();
      this.estudiantes.push(data[0]);
    });
  }

  verEstudiante(eID) {
    this.router.navigate(['/user', 'avatar', eID, this.idCurso]);
  }

  verReporte() {
    this.router.navigate(['/user', 'reporteCurso', this.idCurso]);
  }

  verEvaluaciones() {
    this.router.navigate(['/user', 'evaluaciones', this.idCurso]);
  }

  verConfiguracion() {
    this.router.navigate(['/user', 'configurar-curso', this.idCurso]);
  }

}
