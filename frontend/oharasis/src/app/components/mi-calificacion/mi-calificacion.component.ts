import { Component, OnInit } from '@angular/core';
import { Evaluacion } from "../../interfaces/evaluacion.interface";
import { EvaluacionService } from "../../services/evaluacion.service";
import { Criterio } from "../../interfaces/criterio.interface";
import { CriterioService } from "../../services/criterio.service";
import { RegEvaluacionCriterio } from "../../interfaces/regEvaluacionCriterio.interface";
import { RegEvaluacionCriterioService } from "../../services/regEvaluacionCriterio.service";
import { So } from "../../interfaces/so.interface";
import { SoService } from "../../services/so.service";
import { RegCalificacionSOService } from "../../services/regCalificacionSO.service";
import { RegCalificacionSO } from "../../interfaces/regCalificacionSO.interface";
import { CategoriaService } from "../../services/categoria.service";
import { Categoria } from "../../interfaces/categoria.interface";
import { Subscription } from 'rxjs';
import { ActivatedRoute } from "@angular/router";
import { Curso } from "../../interfaces/curso.interface";
import { CursoService } from "../../services/curso.service";
import { Usuario} from "../../interfaces/usuario.interface";
import { UsuarioService} from "../../services/usuario.service";
import { Observacion } from "../../interfaces/observacion.interface";
import { ObservacionService } from "../../services/observacion.service";

import { RegCalificacionPIService } from "../../services/regCalificacionPI.service";
import { RegCalificacionPI } from "../../interfaces/regCalificacionPI.interface";

declare let jQuery: any;
declare let $: any;

@Component({
  selector: 'app-mi-calificacion',
  templateUrl: './mi-calificacion.component.html',
  styleUrls: ['./mi-calificacion.component.css']
})
export class MiCalificacionComponent implements OnInit {
  idEstudiante: string="";
  idCorte: number =1;
  idCurso: string="";
  estudiante: Usuario={};
  curso: Curso;
  criterios: Criterio[]=[];
  evaluaciones: Evaluacion[];
  categorias: Categoria[];
  regsEC: RegEvaluacionCriterio[];
  regsCalificacionSO: RegCalificacionSO[];
  sos: So[];
  todo: any[];
  nEvaluaciones = [];
  pis = [{valor: 0, nombre:"No aplica"},
  {valor: 1, nombre:"Insuficiente"},
  {valor: 2, nombre:"En desarrollo"},
  {valor: 3, nombre:"Satisfactorio "},
  {valor: 4, nombre:"Sobresaliente"}
  ];
  calificacionAbet:number=0;
  calificacionE=[];
  calificacionC=[];
  observaciones:Observacion[];
  misCE=[];
  misCriterios=[];

  regsCPI:RegCalificacionPI[];
  regsCSOPI=[];
  detallesSOs=[];
  detalleGeneral=[];
  notas=[{valor:0, nombre:"No aplica"},
  {valor:1, nombre:"Insuficiente"},
  {valor:2, nombre:"En desarrollo"},
  {valor:3, nombre:"Satisfactorio "},
  {valor:4, nombre:"Sobresaliente"}
  ];

  constructor(public _criterioS:CriterioService, public _evaluacionS:EvaluacionService,
     public _regECS:RegEvaluacionCriterioService, public _regCalificacionSOS:RegCalificacionSOService,
     public _SoS:SoService, public _categoriaS:CategoriaService, public _cursoS:CursoService,
     public _usuarioS:UsuarioService, private rutaActiva:ActivatedRoute, public _observacionS:ObservacionService,
     public _regCPIS:RegCalificacionPIService) {
      this.rutaActiva.params.subscribe(params=>{
        this.idEstudiante=params['idEstudiante'];
        this.idCurso=params['idCurso'];
      });
   }

  ngOnInit() {
    this.getEstudiante();
    this.getCurso();
    this.getSO();
    this.getEvaluacion2();
    this.getCategorias();
    this.getregsCalificacionSOService();
    this.getObservaciones();
  }

  onChangeCorte(valorSeleccionado){
    this.idCorte=+valorSeleccionado;
    this.calificacionE=[];
    this.calificacionC=[];
    this.ngOnInit();

  }

  getEstudiante(){
    let subsGetEst=this._usuarioS.getEstudiantes(true,["d_id","==",this.idEstudiante]).subscribe(data=>{
      subsGetEst.unsubscribe();
      this.estudiante= data[0];
    });
  }

  getCurso(){
    let subsGetCurso=this._cursoS.getItem(true,["d_id","==",this.idCurso]).subscribe(data=>{
      subsGetCurso.unsubscribe();
      this.curso= data[0];
      $(document).ready(function() {
        $('[data-toggle="tooltip"]').tooltip();
      });
    });
  }


  getRegsEC2(idEvaluacion,i,lastRound){

    let subsGetRegsEC= this._regECS.getRegistroV3(this.idCorte,this.idEstudiante,idEvaluacion).subscribe(data=>{
      subsGetRegsEC.unsubscribe();
      for (const regEC of data) {
        this.misCE.push(regEC);
      }

      if(i==lastRound){
        this.regsEC=this.misCE;
        //subsGetRegsEC.unsubscribe();
      }
      
      
    });
  }

  getCriterios2(idEvaluacion,i,lastRound){
    let subsGetCriterios =this._criterioS.getItem(true,["idEvaluacion","==",idEvaluacion]).subscribe(data=>{
      subsGetCriterios.unsubscribe();
      for (const criterio of data) {
       this.misCriterios.push(criterio)
      }

      if(i==lastRound){
        this.criterios= this.misCriterios;
      }

    });
  }

  getEvaluacion2(){
    this.regsEC=[];
    this.criterios=[];
    this.misCE=[];
    this.misCriterios=[]; //sin testear

    let subsGetEva=this._evaluacionS.getRegistroV1(this.idCurso,this.idCorte).subscribe(data=>{
      subsGetEva.unsubscribe();
      this.evaluaciones= data;
      let lastRound=this.evaluaciones.length;
      let i=0;
      for (const evaluacion of this.evaluaciones) {
        i=i+1;
        this.getRegsEC2(evaluacion.d_id, i, lastRound);
        this.getCriterios2(evaluacion.d_id,i,lastRound);

      }

    });
  }

  getregsCalificacionSOService(){
    let subsGetRegCSO=this._regCalificacionSOS.getRegistroV3(1,this.idCurso,this.idEstudiante).subscribe(data=>{
      subsGetRegCSO.unsubscribe();
      this.regsCalificacionSO= data;
      let subsGetCPI=this._regCPIS.getRegistroV3(this.idEstudiante,this.idCurso).subscribe(data=>{
        subsGetCPI.unsubscribe();
        this.regsCPI= data;
        this.regsCSOPI =[];
        let tRegCPI =[];
        for (const regCSO of this.regsCalificacionSO) {
          for (const regCPI of this.regsCPI) {
            if (regCPI.idSo == regCSO.idSo) {
              tRegCPI.push(regCPI); //se obtienen los regCPI relacionados con el RegCSO
            }
          }
          this.regsCSOPI.push({
            regCSO:regCSO,
            regCPI:tRegCPI
          });
          tRegCPI =[];
        }

        this.calcularCA();
        //this.addEventIcon();
        // this.closeMenu();
      });
    });
  }

  getSO(){
    let subsGetRegSO=this._SoS.getItem().subscribe(data=>{
      subsGetRegSO.unsubscribe();
      this.sos= data;
    });
  }

  getCategorias(){
    let subsGetCategorias=this._categoriaS.getItem().subscribe(data=>{
      subsGetCategorias.unsubscribe();
      this.categorias= data;
    });
  }

  getObservaciones(){
    let subsGetO =this._observacionS.getRegistroV1(this.idCurso,this.idEstudiante).subscribe(data=>{
      subsGetO.unsubscribe();
      this.observaciones= data;
    });
  }

  calcularCA(){
    let i=0;
    let k=0;
    let total=0;
    let suma=0;
    this.detallesSOs=[];
    this.detalleGeneral=[];
    let n1=0,n2=0,n3=0,n4=0;
  
    for(let regCalificacionSO of this.regsCalificacionSO){
      let v = regCalificacionSO.valor;
      if(v!=0){ //v!=0
        for (const regCPI of this.regsCPI) {
          if(regCalificacionSO.idSo== regCPI.idSo){
            let v2= regCPI.valor;
            console.log(regCPI);
            if(v2!=0){
              i=i+1;
              k=k+1;  //1so->pi1=no aplica; 2so->pi1= no aplica;
              suma = suma +v2;
            switch (v2) {
              case 1:{n1=n1+1;break;}
              case 2: {n2=n2+1;break;}
              case 3:{n3=n3+1;break;}
              case 4: {n4=n4+1;break;}
              }
            }
            
          } //fin if2
        }//fin for2
        console.log("k:"+k);
        if (k==0){
          this.detallesSOs.push({
            idSO:regCalificacionSO.idSo,
            detalle:{
              sobresaliente: {cantidad:0, porcentaje: 0, parcentaje2:0},
              satisfactorio: {cantidad:0, porcentaje: 0, parcentaje2:0},
              enDesarrollo: {cantidad:0, porcentaje: 0, parcentaje2:0},
              insuficiente:{cantidad:0, porcentaje: 0, parcentaje2:0},
              nPi:0
            }
          });
        }else{
          this.detallesSOs.push({
            idSO:regCalificacionSO.idSo,
            detalle:{
              sobresaliente: {cantidad:n4, porcentaje: (n4*100)/(k)},
              satisfactorio: {cantidad:n3, porcentaje: (n3*100)/(k)},
              enDesarrollo: {cantidad:n2, porcentaje: (n2*100)/(k)},
              insuficiente:{cantidad:n1, porcentaje: (n1*100)/(k)},
              nPi:k
            }
          });
        }
        
      }
      k=0;n1=0;n2=0;n3=0;n4=0;
    }

  
    for (const detalleSO of this.detallesSOs) {
      n4= n4+detalleSO.detalle.sobresaliente.cantidad;
      n3=n3+detalleSO.detalle.satisfactorio.cantidad;
      n2=n2+detalleSO.detalle.enDesarrollo.cantidad;
      n1=n1+detalleSO.detalle.insuficiente.cantidad;

    }
    if(i==0){
      this.detalleGeneral.push({
        sobresaliente: {cantidad:0, porcentaje:0},
        satisfactorio: {cantidad:0, porcentaje: 0},
        enDesarrollo: {cantidad:0, porcentaje: 0},
        insuficiente:{cantidad:0, porcentaje: 0},
        nPi:0
      });
    }else{
      this.detalleGeneral.push({
        sobresaliente: {cantidad:n4, porcentaje: (n4*100)/(i)},
        satisfactorio: {cantidad:n3, porcentaje: (n3*100)/(i)},
        enDesarrollo: {cantidad:n2, porcentaje: (n2*100)/(i)},
        insuficiente:{cantidad:n1, porcentaje: (n1*100)/(i)},
        nPi:i
      });
    }
    console.log(this.detallesSOs);
    console.log(this.detalleGeneral);
    console.log("i",i); 
    console.log("suma",suma);
    if(i!=0){
      total= (suma*100) /(4*i);
    }else{
      total = 0;
    }
    this.calificacionAbet=total;
    console.log("c",this.calificacionAbet);
  }

  prevCalificacionCriterios(){
    let i=[];
    let promedio=0;
    let porcentajeHC=[];
    let suma=0;
    let sumaPH=0;
    let sumaPHC=0;
    let rNA=[]
    let idE="";
    let conteo=0;
    let t=[];
    let r=[]
    this.calificacionE=[];
    this.calificacionC=[];
    let idsCat2=[];

    for(let regEC of this.regsEC){
      conteo=conteo+1;
      if(idE!=regEC.d_idEvaluacion && idE!=""){
        t.push(r);
        r=[];
      }
      r.push(regEC);
      if(this.regsEC.length==conteo){
        t.push(r)
      }
      idE=regEC.d_idEvaluacion;
    }

    for(let arrayJ of t){
      i=[];
      i[0]=0;
      promedio=0;
      suma=0;
      sumaPH=0;
      sumaPHC=0;
      let porcentajeH=[];
      rNA=[]
      let idEv="";
      let idsCat=[];
      let encontrado=[false,false];
      for(let j of arrayJ){
        encontrado=[false,false];
        idEv=j.d_idEvaluacion;
        for (const a of idsCat) {
          if(a.id==j.idCategoria){
            encontrado[0]=true;
          }else{
          }
        }
        if(encontrado[0]==false){
          idsCat.push({id:j.idCategoria, cantidad:0, suma:0});
        }
        for (const a of idsCat2) {
          if(a.id==j.idCategoria){
            encontrado[1]=true;
          }else{
          }
        }
        if(encontrado[1]==false){
          idsCat2.push({id:j.idCategoria, cantidad:0, suma:0});
        }
        let v = j.valor;
        let idx=0;
        let idx2=0;
        for ( const a of idsCat) {
          if(j.idCategoria==a.id){ 
             idsCat[idx].cantidad=idsCat[idx].cantidad+1;
             idsCat[idx].suma=idsCat[idx].suma+v;
          }
          idx=idx+1;
        }

        for ( const a of idsCat2) {
          if(j.idCategoria==a.id){ 
             idsCat2[idx2].cantidad=idsCat2[idx2].cantidad+1;
             idsCat2[idx2].suma=idsCat2[idx2].suma+v;
          }
          idx2=idx2+1;
        }

        suma= suma+v;
        
        
        rNA.push(v);
        i[0]=i[0]+1;
      }

      promedio = suma/i[0];
      for (const a of idsCat) {
        sumaPH= (a.suma*100)/(a.cantidad*5);
        porcentajeH.push({idCategoria:a.id, valor:sumaPH});
      }
      this.calificacionE.push({id:idEv,promedio: promedio, porcentajeH: porcentajeH});
    }
    for (const a of idsCat2) {
      sumaPHC= (a.suma*100)/(a.cantidad*5);
      porcentajeHC.push({idCategoria:a.id, valor:sumaPHC});
    }
    this.calificacionC.push({idCorte:this.idCorte,porcentajeHC: porcentajeHC});    
  }

  imprimir(){
     window.print();
  }

}
