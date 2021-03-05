import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Curso } from "../../interfaces/curso.interface";
import { CursoService } from "../../services/curso.service";
import { Usuario } from "../../interfaces/usuario.interface";
import { UsuarioService } from "../../services/usuario.service";
import { RegCalificacion } from "../../interfaces/regCalificacion.interface";
import { RegCalificacionService } from "../../services/regCalificacion.service";
import {Router} from '@angular/router';
import { StorageService } from '../../services/storage.service';

declare let jQuery: any;
declare let $: any;

@Component({
  selector: 'app-buscar-cursos',
  templateUrl: './buscar-cursos.component.html',
  styleUrls: ['./buscar-cursos.component.css']
})

export class BuscarCursosComponent implements OnInit {
  user:Usuario;
  rolUser:string="";
  idUser:string="";
  forma:FormGroup;
  cursos: Curso[];
  periodos=[{id:1},{id:2}];
  grupos=[{id:1},{id:2},{id:3},{id:4},{id:5}];
  years=[2015,2016,2017,2018,2019];
  valFiltro=[0,0,0];
  filtrar:boolean=false;
  profesores:Usuario[];
  curso:Curso ={
    d_id:"",
    nombre:"",
    d_idProfesor: "",
    idTipo:0,
    idPeriodo:0,
    idGrupo:0,
    year:0,
    creditos:0
  }
  curso_Seleccionado:Curso;
  regsC:RegCalificacion[];
  ultimoCurso=0;
  conteoCurso=0;
  reset:boolean=false;
  // tslint:disable-next-line:no-inferrable-types
  cambio: boolean = false;

  constructor(public router:Router, public _cursoS:CursoService,
     public _usarioS:UsuarioService, public _regC:RegCalificacionService,
     public _stS:StorageService) {
      this.user= this._stS.getCurrentUser();
      this.idUser=this.user.d_id;
      this.rolUser=this.user.rol;
      
    this.forma = new FormGroup({
      'flYears': new FormControl('',[Validators.required]),
      'flPeriodos': new FormControl('',[Validators.required])
    });

    this.forma.get('flYears').valueChanges.subscribe(val=>{
      if(this.reset==false){
        
        if (val==''){
          this.filtrar=false
        }else{
          this.filtrar=true;
        }
       
        this.valFiltro[0]= +val;
        this.getCurso();

      }
      
    });

    this.forma.get('flPeriodos').valueChanges.subscribe(val=>{
      if(this.reset==false){
        if (val==''){
          this.filtrar=false
        }else{
          this.filtrar=true;
        }
        this.valFiltro[1]=+val;
        this.getCurso();
      }
      
    });


   }

  ngOnInit() {
    this.getCurso();
    this.getProfesores();
    
  }

  getProfesores(){
    let subsGetCursosP= this._usarioS.getProfesores().subscribe(data=>{
      subsGetCursosP.unsubscribe();
      this.profesores= data;
    });
  }

  getCurso(){
    if (this.filtrar==true){
      if(this.rolUser=="Profesor"){
        if (this.forma.controls['flYears'].value!='' && this.forma.controls['flPeriodos'].value=='') {
          let subsGetCursosP= this._cursoS.getCursosPV2(this.idUser,this.valFiltro[0]).subscribe(data=>{
            subsGetCursosP.unsubscribe();
            this.cursos= data;
            $(document).ready(function() {
              $('[data-toggle="tooltip"]').tooltip();
            });
          });
        } else if((this.forma.controls['flYears'].value=='' && this.forma.controls['flPeriodos'].value!='')) {
          let subsGetCursosP= this._cursoS.getCursosPV3(this.idUser,this.valFiltro[1]).subscribe(data=>{
            subsGetCursosP.unsubscribe();
            this.cursos= data;
            $(document).ready(function() {
              $('[data-toggle="tooltip"]').tooltip();
            });
          });
        }else{
          let subsGetCursosP= this._cursoS.getCursosP(this.idUser,this.valFiltro[0],this.valFiltro[1]).subscribe(data=>{
            subsGetCursosP.unsubscribe();
            this.cursos= data;
            $(document).ready(function() {
              $('[data-toggle="tooltip"]').tooltip();
            });
          });
        }

        
      }else if(this.rolUser=="Director"){
        if (this.forma.controls['flYears'].value!='' && this.forma.controls['flPeriodos'].value=='') {
          let subsGetCursosP= this._cursoS.getItem(true,["year","==",this.valFiltro[0]]).subscribe(data=>{
            subsGetCursosP.unsubscribe();
            this.cursos= data;
            $(document).ready(function() {
              $('[data-toggle="tooltip"]').tooltip();
            });
          });
        } else if((this.forma.controls['flYears'].value=='' && this.forma.controls['flPeriodos'].value!='')) {
          let subsGetCursosP= this._cursoS.getItem(true,["idPeriodo","==",this.valFiltro[1]]).subscribe(data=>{
            subsGetCursosP.unsubscribe();
            this.cursos= data;
            $(document).ready(function() {
              $('[data-toggle="tooltip"]').tooltip();
            });
          });
        }else{
          let subsGetCursosD= this._cursoS.getCursosD(this.valFiltro[0],this.valFiltro[1]).subscribe(data=>{
            subsGetCursosD.unsubscribe();
            this.cursos= data;
            $(document).ready(function() {
              $('[data-toggle="tooltip"]').tooltip();
            });
          });
        }
        
      }else if(this.rolUser=="Estudiante"){
        if (this.forma.controls['flYears'].value!='' && this.forma.controls['flPeriodos'].value=='') {
          this.getRegCalificacion('year');
        } else if((this.forma.controls['flYears'].value=='' && this.forma.controls['flPeriodos'].value!='')) {
          this.getRegCalificacion('periodo');
        }else{
          this.getRegCalificacion('year-periodo');
        }
      }


    }else{
      if(this.rolUser=="Profesor"){
        let subsGetCursos= this._cursoS.getItem(true,["d_idProfesor","==",this.idUser],true,["year","desc"]).subscribe(data=>{
          subsGetCursos.unsubscribe();
          this.cursos= data;
          $(document).ready(function() {
            $('[data-toggle="tooltip"]').tooltip();
          });
        });
      }else if(this.rolUser=="Director"){
        let subsGetCursos = this._cursoS.getItem(false,undefined,true,["year","desc"]).subscribe(data=>{
          subsGetCursos.unsubscribe();
          this.cursos= data;
          $(document).ready(function() {
            $('[data-toggle="tooltip"]').tooltip();
          });
        });
      }else if (this.rolUser=="Estudiante"){
        this.getRegCalificacion('sin filtro');
      } 
    }
  }

  getRegCalificacion(modo:string){
    let subsGetRegC=this._regC.getItem(true,["d_idEstudiante","==",this.idUser]).subscribe(data=>{
      subsGetRegC.unsubscribe();
      this.regsC= data;
      this.ultimoCurso= this.regsC.length;
      this.conteoCurso=0;
      this.cursos=[];

      for (const regC of this.regsC) {  
        let subsGetCursos= this._cursoS.getItem(true,["d_id","==",regC.d_idCurso]).subscribe(data=>{
          subsGetCursos.unsubscribe();
          if(modo=='year'){
            if(data[0].year== this.forma.controls['flYears'].value){
              this.cursos.push(data[0]);
            }else{
              this.regsC.splice(this.conteoCurso,1);
            }
          }else if(modo=='periodo'){
            if(data[0].year== this.forma.controls['flPeriodos'].value){
              this.cursos.push(data[0]);
            }else{
              this.regsC.splice(this.conteoCurso,1);
            }
          }else if(modo=='year-periodo'){
            if(data[0].year== this.forma.controls['flYears'].value
            && data[0].idPeriodo == this.forma.controls['flPeriodos'].value){
              this.cursos.push(data[0]);
            }else{
              this.regsC.splice(this.conteoCurso,1);
            }
          }else{
            this.cursos.push(data[0]);
          }
          
          this.conteoCurso=this.conteoCurso+1;
          
        });
        $(document).ready(function() {
          $('[data-toggle="tooltip"]').tooltip();
        });
      }
      
    });
  }
  
  filtrarCurso(){
    this.filtrar=true;
    this.getCurso();
  }

  cancelarFiltro(){
    this.filtrar=false;
    this.reset=true;
    this.clearFormulario();
    this.reset=false;
    this.getCurso();
  }
  
  verEstudiantes(cursoId){
    this.router.navigate(['/user','estudiantes',cursoId]);
  }

  verMiCalificacion(cursoId){
    this.router.navigate(['/user','miCalificacion',this.idUser,cursoId]);
  }

  change() {
    this.cambio = !this.cambio;
  }

  clearFormulario(){
    this.forma.reset({
      flYears:"",
      flPeriodos:""
    });
  }

}
