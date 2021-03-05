import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Curso } from "../../interfaces/curso.interface";
import { CursoService } from "../../services/curso.service";
import { Usuario } from "../../interfaces/usuario.interface";
import { UsuarioService } from "../../services/usuario.service";
import { Tipo } from "../../interfaces/tipo.interface";
import { TipoService } from "../../services/tipo.service";
import swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-cursos',
  templateUrl: './agregar-cursos.component.html',
  styleUrls: ['./agregar-cursos.component.css']
})
export class AgregarCursosComponent implements OnInit {
  forma:FormGroup;
  editState:boolean =false;
  camposVacios:boolean =false;
  creado:boolean[]=[false,false];
  editado:boolean[]=[false,false];
  eliminado:boolean[]=[false,false];
  filtros:any=[
    {id:"nombre", nombre:"nombre"},
    {id:"d_idProfesor", nombre:"Profesor"},
    {id:"idTipo", nombre:"Tipo"},
    {id:"idPeriodo", nombre:"Periodo"},
    {id:"idGrupo", nombre:"Grupo"},
    {id:"year", nombre:"Año"},
    {id:"creditos", nombre:"Creditos"}
  ];
  filtro:string="";
  valFiltro:string="";
  cursos: Curso[];
  profesores:Usuario[];
  tipos:Tipo[] = [];
  periodos=[{id:1},{id:2}];
  grupos=[{id:1},{id:2},{id:3},{id:4},{id:5}];
  years=[2015,2016,2017,2018,2019];
  creditos=[{id:1},{id:2},{id:3},{id:4}];

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
  
  constructor(public _cursoS:CursoService, public _usuarioS:UsuarioService,
    public _tipoS:TipoService) {
    this.forma = new FormGroup({
      'lProfesores': new FormControl('',[Validators.required]),
      'lTipos': new FormControl('',[Validators.required]),
      'lYears': new FormControl('',[Validators.required]),
      'lPeriodos': new FormControl('',[Validators.required]),
      'lGrupos': new FormControl('',[Validators.required]),
      'lCreditos': new FormControl('',[Validators.required]),
      'txtNombre': new FormControl('',
                                         [
                                           Validators.required,
                                           Validators.minLength(5)
                                          ]),
      'lFiltros': new FormControl(''),
      'txtFiltro': new FormControl(''),
      'flProfesores': new FormControl(''),
      'flTipos': new FormControl(''),
      'flYears': new FormControl(''),
      'flPeriodos': new FormControl(''),
      'flGrupos': new FormControl(''),
      'flCreditos': new FormControl('')
    });

    this.forma.get('lProfesores').valueChanges.subscribe(val=>{
      this.curso.d_idProfesor=val;
    });

    this.forma.get('lTipos').valueChanges.subscribe(val=>{
      this.curso.idTipo=+val; 
    });

    this.forma.get('lYears').valueChanges.subscribe(val=>{
      this.curso.year=+val;
    });

    this.forma.get('lPeriodos').valueChanges.subscribe(val=>{
      this.curso.idPeriodo=+val;
    });

    this.forma.get('lGrupos').valueChanges.subscribe(val=>{
      this.curso.idGrupo=+val;
    });

    this.forma.get('lCreditos').valueChanges.subscribe(val=>{
      this.curso.creditos=+val;
    });

    this.forma.get('txtNombre').valueChanges.subscribe(val=>{
      this.curso.nombre=val;
    });

    this.forma.get('lFiltros').valueChanges.subscribe(val=>{
      this.filtro=val;
      this.getCurso();
    });

    this.forma.get('txtFiltro').valueChanges.subscribe(val=>{
      this.valFiltro=val;
      this.getCurso();
    });

    this.forma.get('flProfesores').valueChanges.subscribe(val=>{
      this.valFiltro=val;
      this.getCurso();
    });

    this.forma.get('flTipos').valueChanges.subscribe(val=>{
      this.valFiltro=val;
      this.getCurso();
    });

    this.forma.get('flYears').valueChanges.subscribe(val=>{
      this.valFiltro=val;
      this.getCurso();
    });

    this.forma.get('flPeriodos').valueChanges.subscribe(val=>{
      this.valFiltro=val;
      this.getCurso();
    });

    this.forma.get('flGrupos').valueChanges.subscribe(val=>{
      this.valFiltro=val;
      this.getCurso();
    });

    this.forma.get('flCreditos').valueChanges.subscribe(val=>{
      this.valFiltro=val;
      this.getCurso();
    });

   }
  
  ngOnInit() {
    this.getTipos();
    this.getCurso();
    this.getProfesores();
    
  }
  crearCurso(){
    this.addCurso();
    this.clearFormulario();
  }
  getCurso(){
    
    if (this.filtro!=""&& this.valFiltro!=""){
      if(isNaN(Number(this.valFiltro))){
        let subsGetCursos=this._cursoS.getItem(true,[this.filtro,"==",this.valFiltro]).subscribe(data=>{
          subsGetCursos.unsubscribe();
          this.cursos= data;
        });
      }else{   
        let subsGetCursos=this._cursoS.getItem(true,[this.filtro,"==",Number(this.valFiltro)]).subscribe(data=>{
          subsGetCursos.unsubscribe();
          this.cursos= data;
        });
      }
      
    }else{
      let subsGetCursos= this._cursoS.getItem().subscribe(data=>{
        subsGetCursos.unsubscribe();
        this.cursos= data;
      });
    }
    
    
  }

  getProfesores(){
    let subsGetProfesores= this._usuarioS.getItem(true,["rol","==","Profesor"]).subscribe(data=>{
      subsGetProfesores.unsubscribe();
      this.profesores= data;
    });
  }

  getTipos(){
    let subsGetT=this._tipoS.getItem(false,undefined,true,["nombre","asc"]).subscribe(data=>{
      subsGetT.unsubscribe();
      this.tipos= data;
    });
  }

  verificarCamposVacios(){
    if (this.curso.nombre!= '' && this.curso.d_idProfesor != ""
    && this.curso.idTipo!= 0 && this.curso.idPeriodo != 0
    && this.curso.idGrupo!= 0 && this.curso.year != 0
    && this.curso.creditos != 0
    ) {
      this.camposVacios=false;
    } else {
      this.camposVacios=true;
    }
  }

  addCurso(){
    this.verificarCamposVacios();
    if (this.camposVacios==false){
      let prmAddCursos = this._cursoS.addItem(this.curso).then(data =>{
        this.creado[0]=data;
        this.creado[1]=true;
        setTimeout( () => { this.creado[1]=false }, 3000 );
        this.clearFormulario();
        this.clearCurso();
        this.getCurso();
      });
    }else{
      console.log("campos insuficentes para crear");
    }

  }

  clearFormulario(){
    this.forma.reset({
      lProfesores: "",
      lTipos:"",
      lPeriodos:"",
      lGrupos:"",
      lYears:"",
      lCreditos:"",
      txtNombre:"",
      lFiltros:"",
      txtFiltro:"",
      flProfesores: "",
      flTipos:"",
      flPeriodos:"",
      flGrupos:"",
      flYears:"",
      flCreditos:""
    });
  }

  clearCurso(){
    this.curso.d_id="",
    this.curso.d_idProfesor="",
    this.curso.idTipo=0,
    this.curso.idPeriodo=0,
    this.curso.idGrupo=0,
    this.curso.year=0,
    this.curso.creditos=0;
  }

  deleteCurso(event, curso: Curso) {

    swal({
      title: '¿Estas seguro?',
      text: `Esta accion no se podra revertir. se eliminara: el curso,
       y los registros asociados. regEvaluacion, regCalificacion.
        Tambien los registros asociados a los registros. regEC, y regSO`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        swal({
          position: 'center',
          type: 'success',
          title: 'Eliminado correctamente',
          text: 'Curso Eliminado',
          showConfirmButton: false,
          timer: 1200
        }).then(() => {
          let prmDeleteCursos = this._cursoS.deleteItem(curso).then(data =>{
            this.eliminado[0]=data;
            this.eliminado[1]=true;
            setTimeout( () => { this.eliminado[1]=false }, 3000 );
            this.getCurso();
          });
          const Toast = swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          });
          Toast({
            type: 'success',
            title: 'Curso eliminado'
          });

        });
      }
    });
  }

  editCurso($event, curso:Curso){
    this.editState=true;
    this.curso_Seleccionado= curso;
    this.forma.controls['lProfesores'].setValue(this.curso_Seleccionado.d_idProfesor);
    this.forma.controls['lTipos'].setValue(this.curso_Seleccionado.idTipo);
    this.forma.controls['lYears'].setValue(this.curso_Seleccionado.year);
    this.forma.controls['lPeriodos'].setValue(this.curso_Seleccionado.idPeriodo);
    this.forma.controls['lGrupos'].setValue(this.curso_Seleccionado.idGrupo);
    this.forma.controls['lCreditos'].setValue(this.curso_Seleccionado.creditos);
    this.forma.controls['txtNombre'].setValue(this.curso_Seleccionado.nombre);
  }

  cancelarEdicion(){
    this.editState=false;
    this.curso_Seleccionado= null;
    this.clearFormulario();
  }

  updateCurso(){
    
    this.verificarCamposVacios();
    if (this.camposVacios==false) {
      this.curso_Seleccionado.d_idProfesor=this.curso.d_idProfesor;
      this.curso_Seleccionado.idTipo=this.curso.idTipo;
      this.curso_Seleccionado.year=this.curso.year;
      this.curso_Seleccionado.idPeriodo=this.curso.idPeriodo;
      this.curso_Seleccionado.idGrupo=this.curso.idGrupo;
      this.curso_Seleccionado.creditos=this.curso.creditos;
      this.curso_Seleccionado.nombre=this.curso.nombre;   
      let prmUpdateCursos = this._cursoS.updateItem(this.curso_Seleccionado).then(data =>{
        this.editado[0]=data;
        this.editado[1]=true;
        setTimeout( () => { this.editado[1]=false }, 3000 );
        this.cancelarEdicion();
        this.getCurso();
      }); 
      
    }
  }


}
