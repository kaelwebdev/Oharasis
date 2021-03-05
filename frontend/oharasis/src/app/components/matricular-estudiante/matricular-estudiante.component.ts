import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Usuario } from "../../interfaces/usuario.interface";
import { Curso } from "../../interfaces/curso.interface";
import { RegCalificacion } from "../../interfaces/regCalificacion.interface";
import { RegCalificacionService } from "../../services/regCalificacion.service";
import { UsuarioService } from "../../services/usuario.service";
import { CursoService } from "../../services/curso.service";
import { RegCalificacionSO } from "../../interfaces/regCalificacionSO.interface";
import { RegCalificacionSOService } from "../../services/regCalificacionSO.service";
import { Evaluacion } from "../../interfaces/evaluacion.interface";
import { EvaluacionService } from "../../services/evaluacion.service";
import { RegEvaluacionCriterio } from "../../interfaces/regEvaluacionCriterio.interface";
import { RegEvaluacionCriterioService } from "../../services/regEvaluacionCriterio.service";
import { Criterio } from "../../interfaces/criterio.interface";
import { CriterioService } from "../../services/criterio.service";
import swal from 'sweetalert2';

import { RegHabilidad } from "../../interfaces/regHabilidad.interface";
import { RegHabilidadService } from "../../services/regHabilidad.service";
import { RegLogro} from "../../interfaces/regLogro.interface";
import { RegLogroService } from "../../services/regLogro.service";

@Component({
  selector: 'app-matricular-estudiante',
  templateUrl: './matricular-estudiante.component.html',
  styleUrls: ['./matricular-estudiante.component.css']
})
export class MatricularEstudianteComponent implements OnInit {

  forma:FormGroup;
  editState:boolean =false;
  camposVacios:boolean =false;
  creado:boolean[]=[false,false];
  editado:boolean[]=[false,false];
  eliminado:boolean[]=[false,false];
  registrado:boolean[]=[false,false];
  regCalificaciones: RegCalificacion[];
  idUnico:boolean=false;
  estudiantes: Usuario[];
  cursos:Curso[];
  regCalificacion:RegCalificacion ={
    d_id:"",
    d_idCurso:"",
    d_idEstudiante:"",
    corte1:0,
    corte2:0,
    corte3:0,
    definitiva:0,
    estado:""
  }
  regsCalificacionSO:RegCalificacionSO[];

  regCalificacion_Seleccionado:RegCalificacion;

  constructor(public _regCalificacionS:RegCalificacionService,
     public _usuarioS:UsuarioService, public _cursoS:CursoService,
     public _regCalificacionSOS:RegCalificacionSOService,
     public _evaluacionS:EvaluacionService,public _regECS:RegEvaluacionCriterioService,
     public _criterioS:CriterioService, public _regHS:RegHabilidadService, 
     public _regLogroS:RegLogroService) {
    this.forma = new FormGroup({
      'lEstudiantes': new FormControl('',[Validators.required]),
      'lCursos': new FormControl('',
                                         [
                                           Validators.required,
                                           Validators.minLength(10)
                                          ])
    });

    this.forma.get('lEstudiantes').valueChanges.subscribe(val=>{
      this.regCalificacion.d_idEstudiante=val;
      this.verificarIdUnico(this.regCalificacion.d_idCurso,this.regCalificacion.d_idEstudiante);
    });

    this.forma.get('lCursos').valueChanges.subscribe(val=>{
      this.regCalificacion.d_idCurso=val;
      this.verificarIdUnico(this.regCalificacion.d_idCurso,this.regCalificacion.d_idEstudiante);
    });


   }
  
  ngOnInit() {
    this.getEstudiantes();
    this.getCursos();
    this.getRegCalificaciones();
  }

  crearRegCalificacion(){
    this.addRegCalificacion();
    this.clearFormulario();
  }


  getEstudiantes(){
    let subsGetEst=this._usuarioS.getEstudiantes(false,undefined,true,["nombre","asc"]).subscribe(data=>{
      subsGetEst.unsubscribe();
      this.estudiantes= data;
    });
  }

  getCursos(){
    let subsGetCursos=this._cursoS.getItem().subscribe(data=>{
      subsGetCursos.unsubscribe();
      this.cursos= data;
    });
  }

  getRegCalificaciones(){
    let subsGetRegsC=this._regCalificacionS.getItem().subscribe(data=>{
      subsGetRegsC.unsubscribe();
      this.regCalificaciones=data;
    });
  }

  verificarCamposVacios(){
    if (this.regCalificacion.d_idCurso!= '' && this.regCalificacion.d_idEstudiante != '') {
      this.camposVacios=false;
    } else {
      this.camposVacios=true;
    }
  }

  verificarIdUnico(a,b){
    if((a && b) != ""){
      let subsGetC=this._regCalificacionS.getRegistroV1(a,b).subscribe(data=>{
        subsGetC.unsubscribe();
        if (data.length!=0) {
          this.idUnico=true;
        } else {
          this.idUnico=false;
        }
        //subsGetC.unsubscribe();
      });
    }else{
      return this.idUnico=false;
    }
    
  }

  addRegCalificacion(){
    this.verificarCamposVacios();
    if (this.camposVacios==false ){

      let regEC:RegEvaluacionCriterio={
        d_id: "",
        d_idEvaluacion: "",
        d_idCriterio: "",
        d_idEstudiante: "",
        valor: 0,
        idCategoria: 0,
        corte:0
      }
      let evaluaciones:Evaluacion[];
      let criterios:Criterio[];
      let rc= Object.assign({}, this.regCalificacion);/*se hace para prevenir una situacion en la
      que this.clearFormulario() borre los datos de this.regCalificacion. con lo cual se trabaja 
      con una copia segura.
      */
      let subsGetEva= this._evaluacionS.getItem(true, ["d_idCurso","==",rc.d_idCurso]).subscribe(data=>{
        subsGetEva.unsubscribe();
        evaluaciones= data;
        for(let evaluacion of evaluaciones){
          let subsGetCriterios= this._criterioS.getItem(true, ["idEvaluacion","==",evaluacion.d_id]).subscribe(data=>{
            subsGetCriterios.unsubscribe();
            criterios= data;
            for(let criterio of criterios){
              regEC.d_idCriterio=criterio.d_id;
              regEC.d_idEstudiante=rc.d_idEstudiante;
              regEC.d_idEvaluacion=criterio.idEvaluacion;
              regEC.corte=evaluacion.idCorte;
              regEC.idCategoria=criterio.idCategoria;
              this._regECS.addItem(regEC);     
            }
            //subsGetCriterios.unsubscribe();
          });
        }
        let prmAddRegC=this._regCalificacionS.addItem(rc).then(data =>{
          this.creado[0]=data;
          this.creado[1]=true;
          setTimeout( () => { this.creado[1]=false }, 3000 );
          this.getRegCalificaciones();
        });
        //subsGetEva.unsubscribe();
      });
      
      
    }

  }
  addRegCalificacion2(){
    let regEC:RegEvaluacionCriterio={
      d_id: "",
      d_idEvaluacion: "",
      d_idCriterio: "",
      d_idEstudiante: "",
      valor: 0,
      idCategoria: 0,
      corte:0
    }
    let evaluaciones:Evaluacion[];  
    let criterios:Criterio[];
    let rc= Object.assign({}, this.regCalificacion);
    let subsGetEva= this._evaluacionS.getItem(true, ["d_idCurso","==",rc.d_idCurso]).subscribe(data=>{
      subsGetEva.unsubscribe();
      evaluaciones= data;
      for(let evaluacion of evaluaciones){
        let subsGetCriterios= this._criterioS.getItem(true, ["idEvaluacion","==",evaluacion.d_id]).subscribe(data=>{
          subsGetCriterios.unsubscribe();
          criterios= data;
          for(let criterio of criterios){
            regEC.d_idCriterio=criterio.d_id;
            regEC.d_idEstudiante=rc.d_idEstudiante;
            regEC.d_idEvaluacion=criterio.idEvaluacion;
            regEC.corte=evaluacion.idCorte;
            regEC.idCategoria=criterio.idCategoria;
            this._regECS.addItem(regEC);     
          }
          //subsGetCriterios.unsubscribe();
        });
      }
      let prmAddRegC = this._regCalificacionS.addItem(rc).then(data =>{
        this.creado[0]=data;
        this.creado[1]=true;
        setTimeout( () => { this.creado[1]=false }, 3000 );
        this.getRegCalificaciones();
      });
      //subsGetEva.unsubscribe();
    });

  }

  matricularTodo(){
    let b=this.forma.controls['lEstudiantes'].value;
    if(b.length===0){
    }else{
      if(this.cursos!= undefined){
        if(this.cursos.length>0){
          let Noasignados=[];
          let asignados=[];
          for (const curso of this.cursos) {
            let a= curso.d_id
            let subsGetRegC=this._regCalificacionS.getRegistroV1(a,b).subscribe(data=>{
              subsGetRegC.unsubscribe();
              if (data.length!=0) {
                  asignados.push(
                    curso.nombre+"-A"+curso.year+"-P"+curso.idPeriodo+"-G"+curso.idGrupo
                  );
              } else {
                Noasignados.push(
                  curso.nombre+"-A"+curso.year+"-P"+curso.idPeriodo+"-G"+curso.idGrupo
                  );
                  this.regCalificacion ={
                    d_id:"",
                    d_idCurso:"",
                    d_idEstudiante:"",
                    corte1:0,
                    corte2:0,
                    corte3:0,
                    definitiva:0,
                    estado:""
                  }
                  this.regCalificacion.d_idCurso=a;
                  this.regCalificacion.d_idEstudiante=b;
                  
                  this.addRegCalificacion2();
              }
            });
          }
        }
      }
    }
  }
  


  quitarMatriculas(){
    let b=this.forma.controls['lEstudiantes'].value;
    let asignados=[];
    let subsGetRegC=this._regCalificacionS.getItem(true,["d_idEstudiante","==",b]).subscribe(data=>{
      subsGetRegC.unsubscribe();
      let regCalificaciones= data;
      console.log(regCalificaciones);
      for (const regC of regCalificaciones) {
        
        let prmDeleteRegC = this._regCalificacionS.deleteItem(regC).then(data =>{
          let regL:RegLogro;
          let regH:RegHabilidad;
          let curso:Curso;

          let getSubsCurso=this._cursoS.getItem(true,["d_id","==",regC.d_idCurso]).subscribe(data=>{
            getSubsCurso.unsubscribe();
            curso= data[0];
            asignados.push(curso.nombre);
            let subsGetRegH=this._regHS.getRegistroV1(regC.d_idEstudiante,curso.idTipo).subscribe(data=>{
              subsGetRegH.unsubscribe();
              regH= data[0];//se logro obtener el regH relacionado con el curso que se quiere desmatricalar
              //gracias al tipo de curso al cual pertenece.
              let subsGetL=this._regLogroS.getRegistroV1(regC.d_idEstudiante,curso.idTipo).subscribe(data=>{
                subsGetL.unsubscribe();
                regL= data[0];
                if(regL.valor!=0){
                  regH.nivel=regH.nivel-1;
                  regL.valor=regL.valor-1;
                  this._regHS.updateItem(regH);
                  this._regLogroS.updateItem(regL);
                  this.eliminado[0]=true;
                  this.eliminado[1]=true;
                  setTimeout( () => { this.eliminado[1]=false }, 3000 );
                  this.getRegCalificaciones();
                }else{
                  regH.nivel=0;
                  this._regHS.updateItem(regH);
                  this.eliminado[0]=true;
                  this.eliminado[1]=true;
                  setTimeout( () => { this.eliminado[1]=false }, 3000 );
                  this.getRegCalificaciones();
                }
              });
            });
          });

        });
      }//fin for

    });
    console.log('asignados',asignados);
  }

  clearFormulario(){
    this.forma.reset({
      lEstudiantes:"",
      lCursos:""
    });
  }

  clearRegCalificacion(){
    this.regCalificacion.d_id="",
    this.regCalificacion.d_idCurso="";
    this.regCalificacion.d_idEstudiante="";
  }

  deleteRegCalificacion(event, regC:RegCalificacion){

    swal({
      title: '¿Esta seguro?',
      text: `Esta accion no se puede revertir. Se eliminara: la matricula,
       y los registros asociados. regCalifacion, regCSO, regEC`,
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
          text: 'Matricula Eliminada',
          showConfirmButton: false,
          timer: 1200
        }).then(() => {
          let prmDeleteRegC = this._regCalificacionS.deleteItem(regC).then(data =>{
            let regL:RegLogro;
            let regH:RegHabilidad;
            let curso:Curso;

            let getSubsCurso=this._cursoS.getItem(true,["d_id","==",regC.d_idCurso]).subscribe(data=>{
              getSubsCurso.unsubscribe();
              curso= data[0];
              let subsGetRegH=this._regHS.getRegistroV1(regC.d_idEstudiante,curso.idTipo).subscribe(data=>{
                subsGetRegH.unsubscribe();
                regH= data[0];/*se logro obtener el regH relacionado con el curso que se quiere desmatricalar
                gracias al tipo de curso al cual pertenece.*/
                let subsGetL=this._regLogroS.getRegistroV1(regC.d_idEstudiante,curso.idTipo).subscribe(data=>{
                  subsGetL.unsubscribe();
                  regL= data[0];
                  if(regL.valor!=0){
                    regH.nivel=regH.nivel-1;
                    regL.valor=regL.valor-1;
                    this._regHS.updateItem(regH);
                    this._regLogroS.updateItem(regL);
                    this.eliminado[0]=true;
                    this.eliminado[1]=true;
                    setTimeout( () => { this.eliminado[1]=false }, 3000 );
                    this.getRegCalificaciones();
                  }else{
                    regH.nivel=regH.nivel-1;
                    regL.valor=0;
                    this._regHS.updateItem(regH);
                    this._regLogroS.updateItem(regL);
                    this.eliminado[0]=true;
                    this.eliminado[1]=true;
                    setTimeout( () => { this.eliminado[1]=false }, 3000 );
                    this.getRegCalificaciones();
                  }
                });
              });
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
            title: 'Matricula eliminada'
          });

        });
      }
    });
  }

  editRegCalificacion($event, regCalificacion:RegCalificacion){
    this.editState=true;
    this.regCalificacion_Seleccionado= regCalificacion;

    this.forma.controls['lEstudiantes'].setValue(this.regCalificacion_Seleccionado.d_idEstudiante);
    this.forma.controls['lCursos'].setValue(this.regCalificacion_Seleccionado.d_idCurso);
  }

  cancelarEdicion(){
    this.editState=false;
    this.regCalificacion_Seleccionado= null;
    this.clearFormulario();
  }

  cancelarEdicion2(){
    this.editState=false;
    this.regCalificacion_Seleccionado= null;
  }

}
