import { Component, OnInit } from '@angular/core';
import { Evaluacion } from '../../interfaces/evaluacion.interface';
import { EvaluacionService } from '../../services/evaluacion.service';
import { Criterio } from '../../interfaces/criterio.interface';
import { CriterioService } from '../../services/criterio.service';
import { RegEvaluacionCriterio } from '../../interfaces/regEvaluacionCriterio.interface';
import { RegEvaluacionCriterioService } from '../../services/regEvaluacionCriterio.service';
import { So } from '../../interfaces/so.interface';
import { SoService } from '../../services/so.service';
import { RegCalificacionSOService } from '../../services/regCalificacionSO.service';
import { RegCalificacionSO } from '../../interfaces/regCalificacionSO.interface';
import { Pi } from '../../interfaces/pi.interface';
import { PiService } from '../../services/pi.service';
import { RegCalificacionPIService } from '../../services/regCalificacionPI.service';
import { RegCalificacionPI } from '../../interfaces/regCalificacionPI.interface';
import { CategoriaService } from '../../services/categoria.service';
import { Categoria } from '../../interfaces/categoria.interface';
import { Router,ActivatedRoute } from '@angular/router';
import { Curso } from '../../interfaces/curso.interface';
import { CursoService } from '../../services/curso.service';
import { Usuario} from '../../interfaces/usuario.interface';
import { UsuarioService} from '../../services/usuario.service';
import { RegCalificacion} from '../../interfaces/regCalificacion.interface';
import {RegCalificacionService} from '../../services/regCalificacion.service';
import { RegHabilidad} from '../../interfaces/regHabilidad.interface';
import {RegHabilidadService} from '../../services/regHabilidad.service';
import { TipoService } from '../../services/tipo.service';
import { RegLogro} from '../../interfaces/regLogro.interface';
import { RegLogroService } from '../../services/regLogro.service';
import { RegEstudiante} from '../../interfaces/regEstudiante.interface';
import { RegEstudianteService } from '../../services/regEstudiante.service';
import swal from 'sweetalert2';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observacion} from '../../interfaces/observacion.interface';
import { ObservacionService } from '../../services/observacion.service';
import { Grupo} from '../../interfaces/grupo.interface';
import { GrupoService } from '../../services/grupo.service';

declare let jQuery: any;
declare let $: any;

@Component({
  selector: 'app-calificar-estudiante',
  templateUrl: './calificar-estudiante.component.html',
  styleUrls: ['./calificar-estudiante.component.css']
})

export class CalificarEstudianteComponent implements OnInit {
  idEstudiante: string = "";
  idCorte: number = 1;
  idCurso: string = "";
  estudiante:Usuario = {};
  curso:Curso;
  criterios:Criterio[] = [];
  evaluaciones:Evaluacion[];
  categorias:Categoria[];
  regsEC:RegEvaluacionCriterio[];
  regsCalificacionSO:RegCalificacionSO[];
  regsCSOPI = [];
  regsCPI:RegCalificacionPI[];
  regC:RegCalificacion;
  sos:So[];
  pis:Pi[];
  grupos:Grupo[];
  todo:any[];
  nEvaluaciones = [];
  notas = [{valor:0, nombre:"No aplica"},
  {valor:1, nombre:"Insuficiente"},
  {valor:2, nombre:"En desarrollo"},
  {valor:3, nombre:"Satisfactorio "},
  {valor:4, nombre:"Sobresaliente"}
  ];
  calificacionAbet: number = 0;
  calificacionE = [];
  calificacionC = [];
  utlimoCriterio = 0;
  conteoCriterio = 0;
  tempA = [];
  tempA2 = [];
  forma1:FormGroup;
  forma2:FormGroup;
  detallesSOs =[];
  detalleGeneral =[];
  constructor(public _criterioS:CriterioService, public _evaluacionS:EvaluacionService,
     public _regECS:RegEvaluacionCriterioService, public _regCalificacionSOS:RegCalificacionSOService,
     public _SoS:SoService, public _categoriaS:CategoriaService, public _cursoS:CursoService,
     public _usuarioS:UsuarioService,private router:Router,private rutaActiva:ActivatedRoute,
     public _regCS:RegCalificacionService, public _regHS:RegHabilidadService,
     public _tiposS:TipoService, public _regLogroS:RegLogroService,
     public _regEstS:RegEstudianteService, public _regCPIS:RegCalificacionPIService,
     public _piS:PiService, private _observacionS:ObservacionService,
     private _gruposS:GrupoService
     ) {
      this.forma1 = new FormGroup({
        'meNecesitas': new FormControl('')
      });

      this.forma2 = new FormGroup({
        'txtObservacion': new FormControl('')
      });


      this.rutaActiva.params.subscribe(params => {
        this.idEstudiante = params['idEstudiante'];
        this.idCurso = params['idCurso'];
      });

   }

  ngOnInit() {
    this.getEstudiante();
    this.getCurso();
    this.getSO();
    this.getPi();
    this.getEvaluacion2();
    this.getCategorias();
    this.getRegsCalificacionSO();
    this.getRegC();
    this.getGrupos();
  }

  addEventIcon() {

    $(document).ready(function() {
      $('.card-header').on('click', function() {
        let icono = $(this).find('i');
        if (icono.hasClass('fa-chevron-up')) {
          icono.removeClass('fas fa-chevron-up');
          icono.toggleClass('fas fa-chevron-down');
        } else {
          icono.removeClass('fas fa-chevron-down');
          icono.toggleClass('fas fa-chevron-up');
        }
      });
    });

  }

// closeMenu() {
//    // Cierra acordion cuando se da click por fuera
//     $(document).click(function(e) {
//       if (!$(e.target).is('.card-header')) {
//         let icono = $('.card-header').find('i');
//         console.log( 'entrooo',icono);
//         console.log(e);
//         if (icono.hasClass('fa-chevron-down')) {
//           icono.removeClass('fas fa-chevron-down');
//           icono.toggleClass('fas fa-chevron-up');
//           console.log('entroo!', icono);
//         }
//       }
//     });
//   }


  onChangeCorte(valorSeleccionado) {
    console.log(valorSeleccionado);
    this.calificacionE = [];
    this.calificacionC = [];
    this.idCorte =+ valorSeleccionado;

    this.getEvaluacion2(); // puesto
    this.getRegsCalificacionSO();
  }

  getEstudiante() {
    let subsGetEst = this._usuarioS.getEstudiantes(true,["d_id","==",this.idEstudiante]).subscribe(data => {
      subsGetEst.unsubscribe();
      this.estudiante = data[0];
    });
  }

  getCurso() {
    let subsGetCurso = this._cursoS.getItem(true,["d_id","==",this.idCurso]).subscribe(data => {
      subsGetCurso.unsubscribe();
      this.curso = data[0];
      $(document).ready(function() {
        $('[data-toggle="tooltip"]').tooltip();
      });
    });
  }

  getRegsEC2(idEvaluacion,i,lastRound) {

    let subsRegsEC = this._regECS.getRegistroV3(this.idCorte,this.idEstudiante,idEvaluacion).subscribe(data => {
      subsRegsEC.unsubscribe();
      for (const regEC of data) {
        this.tempA.push(regEC);
      }

      if(i == lastRound) {

        for (const rec of this.tempA) {
          this.forma1.addControl('ce'+rec.d_id, new FormControl(rec.valor, [Validators.required,
            Validators.pattern('^[0-5]{0,1}(\\.[0-9]{1,2})?$'), Validators.max(5)]));
        }

        this.regsEC = this.tempA;
      }

      $(document).ready(function() {
        $('[data-toggle="tooltip"]').tooltip();
      });

    });
  }

  getCriterios2(idEvaluacion,i,lastRound) {
    let subsGetCE = this._criterioS.getItem(true,["idEvaluacion","==",idEvaluacion]).subscribe(data => {
      subsGetCE.unsubscribe();
      for (const criterio of data) {
       this.tempA2.push(criterio)
      }

      if(i == lastRound) {
        this.criterios = this.tempA2;
      }

    });
  }

  getEvaluacion2() {
    this.regsEC = [];
    this.criterios = [];
    this.tempA = [];
    let subsGetEva =this._evaluacionS.getRegistroV1(this.idCurso,this.idCorte).subscribe(data => {
      subsGetEva.unsubscribe();
      this.evaluaciones = data;
      let lastRound = this.evaluaciones.length;
      let i=0;
      for (const evaluacion of this.evaluaciones) {
        i=i+1;
        this.getRegsEC2(evaluacion.d_id, i, lastRound); // se obtienen los CE de cada evaluacion del curso
        this.getCriterios2(evaluacion.d_id,i,lastRound); // se obtienen los criterios general para usar el pipe
      }
    });
  }

  getRegsCalificacionSO() {
    let subsGetCSO =this._regCalificacionSOS.getRegistroV3(1,this.idCurso,this.idEstudiante).subscribe(data => {
      subsGetCSO.unsubscribe();
      this.regsCalificacionSO = data;
      console.log(this.regsCalificacionSO);
      let subsGetCPI =this._regCPIS.getRegistroV3(this.idEstudiante,this.idCurso).subscribe(data => {
        subsGetCPI.unsubscribe();
        this.regsCPI = data;
        this.regsCSOPI = [];
        let tRegCPI =[];
        for (const regCSO of this.regsCalificacionSO) {
          for (const regCPI of this.regsCPI) {
            if (regCPI.idSo == regCSO.idSo) {
              tRegCPI.push(regCPI); // se obtienen los regCPI relacionados con el RegCSO
            }
          }
          this.regsCSOPI.push({
            regCSO:regCSO,
            regCPI:tRegCPI
          });
          tRegCPI =[];
        }

        this.calcularCA('DB');
        this.addEventIcon();
        // this.closeMenu();
      });
    });
  }

  getSO() {
    let subsGetSO=this._SoS.getItem().subscribe(data=>{
      subsGetSO.unsubscribe();
      this.sos= data;
    });
  }

  getPi() {
    let subsGetSO=this._piS.getItem().subscribe(data=>{
      subsGetSO.unsubscribe();
      this.pis= data;
    });
  }

  getCategorias() {
    let subsGetCategoria=this._categoriaS.getItem().subscribe(data=>{
      subsGetCategoria.unsubscribe();
      this.categorias= data;
    });
  }


  getRegC() {
    let subsGetRegC=this._regCS.getRegistroV1(this.idCurso,this.idEstudiante).subscribe(data=>{
      subsGetRegC.unsubscribe();
      this.regC=data[0];
    });
  }

  getGrupos() {
    let subsGetGrupos=this._gruposS.getItem(true,["d_idCurso","==",this.idCurso]).subscribe(data=>{
      subsGetGrupos.unsubscribe();
      this.grupos=data;
      console.log(this.grupos);
    });
  }

  calificarCortes() {

    let c1:number = this.regC.corte1;
    let c2:number = this.regC.corte2;
    let c3:number = this.regC.corte3;
    if(this.idCorte==1) {
      c1=this.calificacionC[0].definitiva;
    } else if(this.idCorte==2) {
      c2=this.calificacionC[0].definitiva;
    } else if(this.idCorte==3) {
      c3=this.calificacionC[0].definitiva;
    }

    this.regC.corte1=c1;
    this.regC.corte2=c2;
    this.regC.corte3=c3;  
    this.regC.definitiva=(c1*0.3)+(c2*0.3)+(c3*0.4);

    if (this.regC.estado=="") {
      if(this.regC.definitiva>=3){
        this.regC.estado="Aprobado";
        let prmUpdateRegC=this._regCS.updateItem(this.regC);
        let subsGetCurso=this._cursoS.getItem(true,["d_id","==",this.regC.d_idCurso]).subscribe(data=>{
          subsGetCurso.unsubscribe();
          let c =data[0];
          let subsGetRegH=this._regHS.getRegistroV1(this.idEstudiante,c.idTipo).subscribe(data=>{
            subsGetRegH.unsubscribe();
            let rH:RegHabilidad=data[0];
            rH.nivel=rH.nivel+1;  
            let prmUpdateRegH=this._regHS.updateItem(rH);
            let subsGetT=this._tiposS.getItem().subscribe(respTipos=>{
                subsGetT.unsubscribe();
              for (const t of respTipos) {
                if(rH.nivel==t.nivelMaximo && rH.idTipo==t.id ){
                  let subsGetRegL= this._regLogroS.getRegistroV1(this.idEstudiante,t.id).subscribe(data=>{
                    subsGetRegL.unsubscribe();
                    let rl:RegLogro=data[0];
                    rl.valor=1;
                    let prmUpdateRegL=this._regLogroS.updateItem(rl);
                    let subsGetRegEst= this._regEstS.getItem(true,["d_idEstudiante","==",this.idEstudiante]).subscribe(resp=>{
                      subsGetRegEst.unsubscribe();
                      let rEst:RegEstudiante=resp[0];
                      let tempArr= JSON.parse(rEst.disponibles);
                      let idsAT= [];
                      let idx=1;
                      for (let index = 0; index < (respTipos.length)+1; index++) {
                         idsAT.push({impar:idx, par:idx+1});
                         idx=idx+2;
                      }
                      if(tempArr[0] % 2 == 0) {
                        tempArr.push(idsAT[t.id].par);
                      }
                      else {
                        tempArr.push(idsAT[t.id].impar);
                      }

                      rEst.disponibles="["+tempArr.toString()+"]";
                      let prmUpdateRegEst=this._regEstS.updateItem(rEst);
                    });
                  });
                }
              }
            });
          });
        });
      }else{
        let prmUpdateRegC=this._regCS.updateItem(this.regC);
      }
    }else{
      if(this.regC.definitiva<3){
        this.regC.estado="";
        let prmUpdateRegC=this._regCS.updateItem(this.regC);
        let subsGetCurso=this._cursoS.getItem(true,["d_id","==",this.regC.d_idCurso]).subscribe(data=>{
          subsGetCurso.unsubscribe();
          let c =data[0];
          let subsGetregH =this._regHS.getRegistroV1(this.idEstudiante,c.idTipo).subscribe(data=>{
            subsGetregH.unsubscribe();
            let rH:RegHabilidad=data[0];
            rH.nivel=rH.nivel-1;
            let prmUpdateRegH=this._regHS.updateItem(rH);
            let subsGetT=this._tiposS.getItem().subscribe(respTipos=>{
              subsGetT.unsubscribe();
            for (const t of respTipos) {
              if(rH.nivel!=t.nivelMaximo && rH.idTipo==t.id ){
                let subsRegL= this._regLogroS.getRegistroV1(this.idEstudiante,t.id).subscribe(data=>{
                  subsRegL.unsubscribe();
                  let rl:RegLogro=data[0];
                  rl.valor=0;
                  let prmUpdateRegL=this._regLogroS.updateItem(rl);
                  let subsGetregEst= this._regEstS.getItem(true,["d_idEstudiante","==",this.idEstudiante]).subscribe(resp=>{
                    subsGetregEst.unsubscribe();
                    let rEst:RegEstudiante=resp[0];
                    let tempArr= JSON.parse(rEst.disponibles);
                    let idsAT= [];
                    let idx=1;
                    for (let index = 0; index < (respTipos.length)+1; index++) {
                       idsAT.push({impar:idx, par:idx+1});
                       idx=idx+2;
                    }
                    if(tempArr[0] % 2 == 0) {
                      for (let ii = 0; ii < tempArr.length; ii++) {
                        if(tempArr[ii]==idsAT[t.id].par){
                          tempArr.splice(ii, 1);
                        }
                      }
                    }else {
                      for (let ii = 0; ii < tempArr.length; ii++) {
                        if(tempArr[ii]==idsAT[t.id].impar){
                          tempArr.splice(ii, 1);
                        }
                      }
                    }
           
                    rEst.disponibles="["+tempArr.toString()+"]";
                    rEst.idAvatar= tempArr[0];
                    let prmUpdateRegEst=this._regEstS.updateItem(rEst);
                  });
                });
              }
            }
          }); 
          });
        });
      }else{
        let prmUpdateRegC=this._regCS.updateItem(this.regC);
      }
    }

    const Toast = swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
      Toast({
        type: 'success',
        title: 'Corte calificado correctamente'
      });

  }

  calcularCA(modo:string){
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
            let v2;
            if(modo=='prev'){
              v2= +(<HTMLSelectElement>document.getElementById('rcpi'+regCPI.d_id)).value;
            }else{
              v2= regCPI.valor;
            }
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

  calificarAbet() {

    for(const regCPI of this.regsCPI) {
      let selectItem=<HTMLSelectElement>document.getElementById('rcpi'+regCPI.d_id);
      if(selectItem==undefined || null){
      }else{
        let v = +(selectItem).value;
        let rcpi:RegCalificacionPI;
        rcpi=regCPI;
        rcpi.valor=v;
        let prmUpdateRegCSO=this._regCPIS.updateItem(rcpi);
      }
    }

    this.calcularCA('prev');
    const Toast = swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
      Toast({
        type: 'success',
        title: 'ABET calificado correctamente'
      });

  }

  prevCalificacionCriterios(){
    let cantidadCEEnE=0; //cantidad de CE en Evaluacion
    let promedio=0;
    let porcentajeHC=[];
    let suma=0;
    let sumaPH=0;
    let sumaPHC=0;
    let rNA=[];
    let idE="";
    let conteo=0; //sirve para indicar cuando crear el grupo de evaluaciones
    let evaluaciones=[]; //grupos de CE separados por evaluacion. Ej: evaluaciones=[ev1,ev2]
    let evaluacion=[]; //grupo de CE de una evaluacion. Ej: ev1=[{ce1},[ce2]] ev2=[{ce3},{ce4}]
    this.calificacionE=[];
    this.calificacionC=[];
    let categorias2=[]; //grupo de categorias a nivel de Corte
    let promedioG=0;
    let sumatoriaNotaPeso=0;
    //se organiza los criterios de evaluacion por evaluacion.
    //para ello la informacion debe venir previamente ordenada
    //por orden de d_idEvaluacion.
    this.regsEC.sort(function (a, b) {
      if (a.d_idEvaluacion > b.d_idEvaluacion) {
        return 1;
      }
      if (a.d_idEvaluacion < b.d_idEvaluacion) {
        return -1;
      }
      return 0;
    });
    console.log(this.regsEC);
    for(let regEC of this.regsEC){
      conteo=conteo+1;
      //a,a,b,b,c,d,ff

      if(idE!=regEC.d_idEvaluacion && idE!=""){
        evaluaciones.push(evaluacion);
        evaluacion=[];
      }
      evaluacion.push(regEC);
      if(this.regsEC.length==conteo){
        evaluaciones.push(evaluacion)
      }
      idE=regEC.d_idEvaluacion;
    }

    for(let evaluacion of evaluaciones){
      //Ej: Eva1= [c1,c2]
      cantidadCEEnE=0;
      promedio=0;
      suma=0;
      sumaPH=0;
      sumaPHC=0;
      let porcentajeH=[];
      rNA=[]
      let idEv="";
      let categorias=[]; //grupo de categorias a nivel de Evaluacion
      let encontrado=[false,false];

      //es posible que aqui se deba crear el for de evaluciones reales
      //el cual obtendria el peso de esta evaluacion

      for(let ce of evaluacion){
        //ej: ce1= {d_id:sdfg, valor:5, d_idEvaluacion:ghik3}
        encontrado=[false,false];
        idEv=ce.d_idEvaluacion;
        //se verifica si ya se a almacenado la categoria
        //teniendo en cuenta esta evaluacion.
        // Dado que se necesita almacenar solo una de cada tipo.
        // La primera vez nunca entra.
        for (const categoria of categorias) {
          
          if(categoria.id==ce.idCategoria){
            encontrado[0]=true;
          }
        }
        //en caso de no exisitir se almacena.
        //ce.categoria?? no era ce.idCategoria?
        if(encontrado[0]==false){
          categorias.push({id:ce.idCategoria, cantidad:0, suma:0});
        }
        //se verifica si ya se a almacenado la categoria
        //teninedo en cuenta todas las evaluaciones del corte
        //Dado que se necesita almacenar solo una de cada tipo.
        //La primera vez nunca entra.
        for (const categoria of categorias2) {
          if(categoria.id==ce.idCategoria){
            encontrado[1]=true;
          }else{
          }
        }
        if(encontrado[1]==false){
          categorias2.push({id:ce.idCategoria, cantidad:0, suma:0});
        }

        let v:number = +(<HTMLInputElement>document.getElementById('ce'+ce.d_id)).value;
        let idx=0;
        let idx2=0;
        //se obtiene informacion del CE sobre su categoria.
        for ( const categoria of categorias) {
          if(ce.idCategoria==categoria.id){ 
             categorias[idx].cantidad=categorias[idx].cantidad+1;
             categorias[idx].suma=categorias[idx].suma+v;
          }
          idx=idx+1;
        }
        //se obtiene informacion del CE sobre su categoria.
        for ( const categoria of categorias2) {
          if(ce.idCategoria==categoria.id){ 
             categorias2[idx2].cantidad=categorias2[idx2].cantidad+1;
             categorias2[idx2].suma=categorias2[idx2].suma+v;
          }
          idx2=idx2+1;
        }
        suma= suma+v; //prepara la sumatoria total para una sola evaluacion del corte
        rNA.push(v); //no hace nada
        cantidadCEEnE=cantidadCEEnE+1;//prepara la cantidad total de CE para una
        //sola evaluacion del corte
      }//fin iteracion categorias de evaluacion
      let sumatoriaValorCE=suma;
      //se calcula el promedio de una evaluacion
      promedio = sumatoriaValorCE/cantidadCEEnE;
      //se calcula el porcentaje de habilidad para cada categoria de una evaluacion del corte
      for (const categoria of categorias) {
        sumaPH= (categoria.suma*100)/(categoria.cantidad*5);
        porcentajeH.push({
          idCategoria:categoria.id,
          valor:sumaPH
        });
      }
      
      //---aqui se deberia crear el peso de la evaluacion
      //---la manera seria creando un "for" que recorra las evaluaciones reales
      //---sacando el peso de la evalucion cuyo d_id concida con la evaluacion actual
      let pesoEvaluacion=0; //---despues de esto iria ese "for"
      let d_idGrupo='';
      for (const miEvaluacion of this.evaluaciones) {
        if(miEvaluacion.d_id==idEv){
          pesoEvaluacion= miEvaluacion.peso;
          d_idGrupo=miEvaluacion.d_idGrupo
        }
      }
      //---Aqui se deberia crear el peso del grupo al cual pertenece dicha evaluacion
      //---la manera seria creando un "for" que recorra los grupos de evaluacion
      //---sacando el peso del grupo cuyo d-id coincida con el d_idGrupo de la evaluacion actual.
      
      let pesoGrupo=0; //---despues de esto iria ese for
      for (const grupo of this.grupos) {
        if(grupo.d_id==d_idGrupo){
          pesoGrupo=grupo.peso;
        }
      }
      //se crea el detalle de una evaluacion
      this.calificacionE.push({id:idEv,
        promedio: promedio,
        porcentajeH: porcentajeH,
        pesoEvaluacion:pesoEvaluacion,
        notaConPeso:promedio*pesoEvaluacion,
        pesoGrupo:pesoGrupo,
        d_idGrupo:d_idGrupo
      });    
    } //Fin iteracion de evaluaciones
    //se calcula el porcentaje de habilidad para cada categoria
    //teniendo en cuenta todas las evaluaciones del corte
    for (const categoria of categorias2) {
      sumaPHC= (categoria.suma*100)/(categoria.cantidad*5);
      porcentajeHC.push({
        idCategoria:categoria.id,
         valor:sumaPHC
      });
    }
    //se calcula el promedio general. Es decir, teniendo en cuenta
    //todas las evaluaciones del corte.
    //---se debe ordenar this.calificacionE por el d_idGrupo
    //---se deberia usar sort
    this.calificacionE.sort(function (a, b) {
      if (a.d_idGrupo > b.d_idGrupo) {
        return 1;
      }
      if (a.d_idGrupo < b.d_idGrupo) {
        return -1;
      }
      return 0;
    });
    console.log(this.calificacionE); 
    let conteo2=0;
    let idG="";
    let detallesAll=[];
    let detalleGroup=[];
    for (const detalleE of this.calificacionE) {
       promedioG= detalleE.promedio +promedioG;
       conteo2=conteo2+1;
      //entra en el if si se terminar el grupo anterior
      //creando entonces ese grupo anterior.
      if(idG!=detalleE.d_idGrupo && idG!=""){
        detallesAll.push(detalleGroup);
        detalleGroup=[];
      }
      //inicio la creacion del grupo
      detalleGroup.push(detalleE);
      //cuando ya termino de crear todos los grupos
      //los almaceno todos en un arreglo
      if(this.calificacionE.length==conteo2){
        detallesAll.push(detalleGroup)
      }
      idG=detalleE.d_idGrupo; 
    }
    let sumatoriaPorcentajeGrupo=0;
    let pesoGrupot=0;
    for (const detalleGroup of detallesAll) {
      let sumatoriaNotaPeso=0;
      for (const detalleE of detalleGroup) {
        console.log(detalleE);
        sumatoriaNotaPeso=detalleE.notaConPeso+sumatoriaNotaPeso;
        pesoGrupot=detalleE.pesoGrupo;
      }
      let porcentajeGrupo=sumatoriaNotaPeso*pesoGrupot;
      sumatoriaPorcentajeGrupo= porcentajeGrupo+sumatoriaPorcentajeGrupo;

    }

    promedioG=promedioG/evaluaciones.length;
    
    //se crea el detalle del corte
    
    this.calificacionC.push({
      idCorte:this.idCorte,
      porcentajeHC: porcentajeHC,
      promedioG:promedioG,
      definitiva:sumatoriaPorcentajeGrupo
    });
    console.log("cc");
    console.log(this.calificacionC);
    console.log("cE");
    console.log(this.calificacionE);

    this.getEvaluacion2();


  }

  calificarCriterios(){

    for(const regEC of this.regsEC){
      let v = +(<HTMLInputElement>document.getElementById('ce'+regEC.d_id)).value;
      let rec:RegEvaluacionCriterio;
      rec=regEC;
      rec.valor=v;
      let prmUpdateRegEC=this._regECS.updateItem(rec);
    }
    this.prevCalificacionCriterios();
    this.calificarCortes();
    const Toast = swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
      Toast({
        type: 'success',
        title: 'Criterio evaluado correctamente'
      });
  }

  imprimir(){
    window.print();
   }

   crearObservacion(){
    let observacion:Observacion = {
      d_id:"",
      d_idEmisor: "",
      d_idReceptor: "",
      d_idCurso:"",
      mensaje:"",
      asunto:""
    }

    observacion.d_idEmisor=this.idCurso;
    observacion.d_idReceptor=this.idEstudiante;
    observacion.d_idCurso=this.idCurso;
    observacion.mensaje= this.forma2.controls['txtObservacion'].value;
    observacion.asunto="c";
    let prmAddO=this._observacionS.addItem(observacion).then(data => {
      
      const Toast = swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
      Toast({
        type: 'success',
        title: 'Observación asignada'
      });
    });

   }


}
