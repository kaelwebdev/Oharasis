import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Evaluacion } from '../../interfaces/evaluacion.interface';
import { Curso } from '../../interfaces/curso.interface';
import { Corte } from '../../interfaces/corte.interface';
import { EvaluacionService } from '../../services/evaluacion.service';
import { CursoService } from '../../services/curso.service';
import {Router, ActivatedRoute} from '@angular/router';
import { Usuario } from '../../interfaces/usuario.interface';
import { StorageService } from '../../services/storage.service';
import swal from 'sweetalert2';
import { Grupo } from '../../interfaces/grupo.interface';
import { GrupoService } from '../../services/grupo.service';

// declaraciones jquery
declare let jQuery: any;
declare let $: any;

@Component({
  selector: 'app-evaluaciones',
  templateUrl: './evaluaciones.component.html',
  styleUrls: ['./evaluaciones.component.css']
})
export class EvaluacionesComponent implements OnInit {
  user:Usuario
  idCurso:string="";
  forma:FormGroup;
  forma2:FormGroup;
  editState:boolean =false;
  camposVacios:boolean =false;
  creado:boolean[]=[false,false];
  editado:boolean[]=[false,false];
  eliminado:boolean[]=[false,false];
  evaluaciones: Evaluacion[];
  grupos: Grupo[];
  cursos: Curso[];  
  cortes: Corte[] = [
    { id:1, nombre:"Primer Corte",},
    { id:2, nombre:"Segundo Corte"},
    { id:3, nombre:"Segundo Corte"}
  ]

  evaluacion:Evaluacion ={
    d_id:"",
    d_idCurso:"",
    d_idGrupo:"",
    idCorte: 0,
    nombre:"",
    peso:0
  }

  grupo:Grupo ={
    d_id:"",
    d_idCurso:"",
    idCorte: 0,
    nombre:"",
    peso:0
  }

  constructor(public _EvaluacionS:EvaluacionService, private rutaActiva:ActivatedRoute,
     public router:Router, public _CursoS:CursoService, private _stS:StorageService,
     private _grupoS: GrupoService) {
      this.user= this._stS.getCurrentUser();
      this.rutaActiva.params.subscribe(params=>{
        this.idCurso=params['idCurso'];
      });

    this.forma = new FormGroup({
      'lCortes': new FormControl('',[Validators.required]),
      'txtNombreE': new FormControl('',[Validators.required,Validators.maxLength(40)]),
      'pesoE': new FormControl('',[Validators.required, Validators.pattern("^[0-9]*$"),
      Validators.max(100), Validators.min(1)]),
      'lGrupos': new FormControl('',[Validators.required])
    });

    this.forma.get('lCortes').valueChanges.subscribe(val=>{
      this.evaluacion.idCorte = +val;
    });

    this.forma.get('txtNombreE').valueChanges.subscribe(val=>{
      this.evaluacion.nombre=val;
    });


    this.forma.get('pesoE').valueChanges.subscribe(val=>{
      this.evaluacion.peso= +val/100;
    });

    this.forma.get('lGrupos').valueChanges.subscribe(val=>{
      this.evaluacion.d_idGrupo= val;
    });

    this.forma2 = new FormGroup({
      'lCortesGrupo': new FormControl('',[Validators.required]),
      'txtNombreGrupo': new FormControl('',[Validators.required]), // Validators.pattern("^[0-9]*$"),
      'pesoGrupo': new FormControl('',[Validators.required, Validators.pattern("^[0-9]*$"),
        Validators.max(100), Validators.min(1)])
    });

    this.forma2.get('lCortesGrupo').valueChanges.subscribe(val=>{
      this.grupo.idCorte = +val;
    });

    this.forma2.get('txtNombreGrupo').valueChanges.subscribe(val=>{
      this.grupo.nombre=val;
    });

    this.forma2.get('pesoGrupo').valueChanges.subscribe(val=>{
      this.grupo.peso= +val/100;
    });

   }

   evaluacion_Seleccionada: Evaluacion;
  ngOnInit() {
    this.getGrupos();
    this.getEvaluaciones();
    this.getCursos();
  }
  crearEvaluacion() {
    this.addEvaluacion();
    this.clearFormulario();
  }
  crearGrupo() {
    this.addGrupo();
    this.clearGrupo();
  }
  getEvaluaciones() {
    let subsGetEva=this._EvaluacionS.getItem(true,["d_idCurso","==",this.idCurso], true, ["d_idGrupo","asc"]).subscribe(data=>{
      subsGetEva.unsubscribe();
      this.evaluaciones= data;
    });
  }

  getGrupos() {
    let subsGetGrupo=this._grupoS.getItem(true,["d_idCurso","==",this.idCurso]).subscribe(data=>{
      subsGetGrupo.unsubscribe();
      this.grupos= data;
    });
  }

  getCursos() {
    let subsGetCurso=this._CursoS.getItem(true,["d_idProfesor","==",this.user.d_id]).subscribe(data=>{
      subsGetCurso.unsubscribe();
      this.cursos= data;
    });
  }

  verificarCamposVacios() {
    if (this.evaluacion.nombre!= '' && this.evaluacion.d_idCurso != '' && this.evaluacion.idCorte != 0) {
      this.camposVacios=false;
    } else {
      this.camposVacios=true;
    }
  }



  addGrupo() {
    this.grupo.d_idCurso= this.idCurso;
    this.verificarCamposVacios();
      let prmAddGrupo =this._grupoS.addItem(this.grupo).then(data =>{
        this.creado[0]=data;
        this.creado[1]=true;
        setTimeout( () => { this.creado[1]=false }, 3000 );
        this.clearFormulario2();
        this.clearGrupo();
        this.getGrupos();
      });

      const Toast = swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
        Toast({
          type: 'success',
          title: 'Grupo creado correctamente'
        });
  }

  addEvaluacion() {
    this.evaluacion.d_idCurso = this.idCurso;
    this.verificarCamposVacios();
    if (this.camposVacios==false) {
      let prmAddEva =this._EvaluacionS.addItem(this.evaluacion).then(data =>{
        this.creado[0]=data;
        this.creado[1]=true;
        setTimeout( () => { this.creado[1]=false }, 3000 );
        this.clearFormulario();
        this.clearEvaluacion();
        this.getEvaluaciones();
      });
    }
    const Toast = swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
      Toast({
        type: 'success',
        title: 'Evaluación creada correctamente'
      });

  }

  clearFormulario() {
    this.forma.reset({
      lCortes:"",
      txtNombreE:"",
      pesoE:"",
      lGrupos:""
    });
  }

  clearFormulario2(){
    this.forma2.reset({
      lCortesGrupo:"",
      txtNombreGrupo:"",
      pesoGrupo:""
    });
  }

  clearEvaluacion() {
    this.evaluacion.d_id="";
    this.evaluacion.d_idCurso=this.idCurso;
    this.evaluacion.d_idGrupo="";
    this.evaluacion.idCorte=0;
    this.evaluacion.nombre="";
    this.evaluacion.peso=0;
  }

  clearGrupo(){
    this.grupo.d_id="",
    this.grupo.d_idCurso=this.idCurso;
    this.grupo.idCorte=0;
    this.grupo.nombre="";
    this.grupo.peso=0;
  }

  deleteEvaluacion(event, evaluacion: Evaluacion) {
      swal({
        title: '¿Esta reguro?',
        text: 'Está a punto de eliminar la evaluación',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.value) {
          swal({
            position: 'center',
            type: 'success',
            title: 'Eliminado correctamente',
            text: 'Evaluación Eliminada',
            showConfirmButton: false,
            timer: 1200
          }).then(() => {
            let prmDeleteEva = this._EvaluacionS.deleteItem(evaluacion).then(data => {
              this.eliminado[0] = data;
              this.eliminado[1] = true;
              setTimeout( () => { this.eliminado[1] = false }, 3000 );
              this.getEvaluaciones();
            });
          const Toast = swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          });
            Toast({
              type: 'success',
              title: 'Evaluación eliminada'
            });
          });
        }
      });
  }

  deleteGrupo(event, grupo: Grupo) {
    swal({
      title: '¿Esta reguro?',
      text: 'Está a punto de eliminar el grupo de evaluación',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        swal({
          position: 'center',
          type: 'success',
          title: 'Eliminado correctamente',
          text: 'Grupo eliminado',
          showConfirmButton: false,
          timer: 1200
        }).then(() => {
          let prmDeleteGrupo = this._grupoS.deleteItem(grupo).then(data => {
            this.eliminado[0] = data;
            this.eliminado[1] = true;
            setTimeout( () => { this.eliminado[1] = false }, 3000 );
            this.getGrupos();
            let subsGetEva = this._EvaluacionS.getItem(true, ["d_idGrupo", "==", grupo.d_id]).subscribe(data => {
              subsGetEva.unsubscribe();
              let evaluaciones = data;
              let contador = 0;
              for (const evaluacion of evaluaciones) {
                contador = contador+1;
                let prmDeleteEva = this._EvaluacionS.deleteItem(evaluacion).then(() => {
                 if (contador == evaluaciones.length) {
                   contador = 0;
                  this.getEvaluaciones();
                 }
                });
              }
            });
          });
        const Toast = swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
          Toast({
            type: 'success',
            title: 'Grupo eliminado'
          });
        });
      }
    });
}

  editEvaluacion($event, evaluacion: Evaluacion) {
    this.editState = true;
    this.evaluacion_Seleccionada = evaluacion;
    this.evaluacion.d_id=this.evaluacion_Seleccionada.d_id;
    this.evaluacion.d_idCurso=this.evaluacion_Seleccionada.d_idCurso;
    this.evaluacion.d_idGrupo=this.evaluacion_Seleccionada.d_idGrupo;
    this.forma.controls['lCortes'].setValue(this.evaluacion_Seleccionada.idCorte);
    this.forma.controls['txtNombreE'].setValue(this.evaluacion_Seleccionada.nombre);
    this.forma.controls['lGrupos'].setValue(this.evaluacion_Seleccionada.d_idGrupo);
    this.forma.controls['pesoE'].setValue(this.evaluacion_Seleccionada.peso*100);
  }

  cancelarEdicion() {
    this.editState=false;
    this.evaluacion_Seleccionada= null;
    this.clearFormulario();
  }


  updateEvaluacion() {

    this.verificarCamposVacios();
    if (this.camposVacios==false) {
      let prmUpdateEva=this._EvaluacionS.updateItem(this.evaluacion).then(data => {
        this.editado[0]=data;
        this.editado[1]=true;
        setTimeout( () => { this.editado[1]=false }, 3000 );
        this.cancelarEdicion();
        this.getEvaluaciones();
      });
    }

    const Toast = swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
      Toast({
        type: 'success',
        title: 'Evaluación actializada correctamente'
      });
  }

  verCriterios(eID: string) {
    this.router.navigate(['/user', 'agregarCriterios', eID]);
  }
}