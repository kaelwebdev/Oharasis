import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Curso } from "../../interfaces/curso.interface";
import { CursoService } from "../../services/curso.service";
import { Usuario } from "../../interfaces/usuario.interface";
import { UsuarioService } from "../../services/usuario.service";
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';

@Component({
  selector: 'app-asignar-profesor',
  templateUrl: './asignar-profesor.component.html',
  styleUrls: ['./asignar-profesor.component.css']
})
export class AsignarProfesorComponent implements OnInit {

  getSubscribe:Subscription;
  forma:FormGroup;
  asignado:boolean[]=[false,false];
  camposVacios:boolean =false;
  cursos: Curso[];
  profesores:Usuario[];

  curso: Curso = {
    d_id: '',
    nombre: '',
    d_idProfesor: '',
    idTipo: 0,
    idPeriodo: 0,
    idGrupo: 0,
    year: 0,
    creditos: 0
  }

  curso_Seleccionado:Curso;

  constructor(public _cursoS:CursoService, public _usuarioS:UsuarioService) {
    this.forma = new FormGroup({
      'lProfesores': new FormControl('',[Validators.required]),
      'lCursos': new FormControl('',[Validators.required])
    });

    this.forma.get('lProfesores').valueChanges.subscribe(val=>{
      this.curso.d_idProfesor=val;
    });

    this.forma.get('lCursos').valueChanges.subscribe(val=>{
      this.curso.d_id=val; 
    });



   }

  ngOnInit() {
    this.getCursos();
    this.getProfesores();
  }

  getCursos() {

    let subsGetCursos= this._cursoS.getItem(false,undefined,true,["year","desc"]).subscribe(data=>{
      subsGetCursos.unsubscribe();
      this.cursos= data;
    });

  }

  getCurso() {
    this.curso.d_id = this.forma.controls['lCursos'].value;
    let subsGetCurso = this._cursoS.getItem(true, ['d_id', '==', this.curso.d_id]).subscribe(data => {
      subsGetCurso.unsubscribe();
      this.curso = data[0];
    });
  }

  updateCurso() {
    let prmUpdateCurso = this._cursoS.updateItem(this.curso).then(data => {
      this.asignado[0] = data;
      this.asignado[1] = true;
      setTimeout( () => { this.asignado[1] = false; }, 3000 );
      this.clearFormulario();
      this.clearCurso();
    });
  }

  getProfesores() {
    let subsGetProfesores= this._usuarioS.getProfesores().subscribe(data=>{
      subsGetProfesores.unsubscribe();
      this.profesores = data;
    });
  }

  verificarCamposVacios() {
    if (this.curso.d_id!= '' && this.curso.d_idProfesor != ""
    ) {
      this.camposVacios=false;
    } else {
      this.camposVacios=true;
    }
  }

  clearFormulario(){
    this.forma.reset({
      lProfesores: "",
      lCursos:""
    });
  }

  clearCurso(){
    this.curso.d_id="",
    this.curso.d_idProfesor=""
  }


  actualizarCurso() {
    this.verificarCamposVacios();
    if (this.camposVacios==false) {
      this.getCurso();
      const Toast = swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
      Toast({
        type: 'success',
        title: 'Profesor asignado'
      });
    }

  }

}

