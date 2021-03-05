import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { Curso } from "../../interfaces/curso.interface";
import { UsuarioService } from "../../services/usuario.service";
import { RegCalificacion } from "../../interfaces/regCalificacion.interface";
import { RegCalificacionService } from "../../services/regCalificacion.service";
import { RegCalificacionSOService } from "../../services/regCalificacionSO.service";
import { RegCalificacionSO } from "../../interfaces/regCalificacionSO.interface";
import { RegEvaluacionCriterio } from "../../interfaces/regEvaluacionCriterio.interface";
import { RegEvaluacionCriterioService } from "../../services/regEvaluacionCriterio.service";
import { Categoria } from "../../interfaces/categoria.interface";
import { CategoriaService } from "../../services/categoria.service";
import { Evaluacion } from "../../interfaces/evaluacion.interface";
import { EvaluacionService } from "../../services/evaluacion.service";
import { Pi } from "../../interfaces/pi.interface";
import { PiService } from "../../services/pi.service";
import { SoService } from "../../services/so.service";
import { So } from "../../interfaces/so.interface";
import { RegCalificacionPIService } from "../../services/regCalificacionPI.service";
import { RegCalificacionPI } from '../../interfaces/regCalificacionPI.interface';
import { BehaviorSubject } from "rxjs";


//dona
import { ChartType,ChartDataSets } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';
//barra
import { ChartOptions } from 'chart.js';

@Component({
  selector: 'app-reporte-curso',
  templateUrl: './reporte-curso.component.html',
  styleUrls: ['./reporte-curso.component.css']
})
export class ReporteCursoComponent implements OnInit {
  regsC:RegCalificacion[];
  regsEC:RegEvaluacionCriterio[];
  regsECxC=[[],[],[]];
  regsCalificacionSO:RegCalificacionSO[]=[];
  idCurso:string="";
  curso:Curso={};
  categorias:Categoria[];
  evaluaciones:Evaluacion[];
  calificacionAbet:number=0;
  calificacionE=[[],[],[],[]];
  calificacionC=[[],[],[],[]];
  calificacionC1=[];
  calificacionC2=[];
  calificacionC3=[];
  graficar:boolean=false;
  ultimoEstudiante=0;
  nEst = 0;
  pis: Pi[];
  sos: So[];
  regsCPI: RegCalificacionPI [];
  detallesCAPI = [];
  detallesCapIOrdenada=[];
  public calificacionCAD=[[],[],[],[]];
  public calificacionCAL=[];
  // Dona
  public doughnutChartLabels: Label[] =   [];
  public doughnutChartData: MultiDataSet = [];
  public doughnutChartType: ChartType = 'doughnut';
  public doughnutChartDatasets: ChartDataSets[] = [];
  public chartColors: Array<any> = [];
  //Barra 
  public barChartLabels: Label[] =[];
  public barChartType: ChartType = 'bar';
  public barChartLegend = false;
  //public barChartPlugins = [pluginDataLabels];
  public barChartData: ChartDataSets[] = [];
  ///Radar
  public radarChartOptions: ChartOptions = {
    responsive: true,
  };
  public radarChartLabels: Label[] = [];

  public radarChartData: ChartDataSets[] = [
    { data: [65, 59, 90, 81, 56, 55, 40], label: 'Series A' }
  ];
  public radarChartType: ChartType = 'radar';
  //linea
  public lineChartData: ChartDataSets[] = [];
  public lineChartLabels: Label[] = [];
  public lineChartLegend = true;
  public lineChartType = 'line';

  //graficos para SO-PI
  public barChartLabels2: Label[] =['PI1','PI2', 'PI3'];
  public barChartData2: ChartDataSets[] = [];
  public barChartLegend2 = true;
  public chartColors2: Array<any> = [{backgroundColor:"#81c784"},
  {backgroundColor:"#fff176"}, {backgroundColor:"#ffb74d"}, {backgroundColor:"#ff8a65"} ];
  graficoSOPI:boolean=false;
  constructor(public router:Router, private rutaActiva:ActivatedRoute,
    public _usuarioS:UsuarioService, public _regCS:RegCalificacionService,
    public _regCalificacionSOS:RegCalificacionSOService, public _regECS:RegEvaluacionCriterioService,
    public _categoriaS:CategoriaService, public _evaluacionS:EvaluacionService, public _piS: PiService,
    public _so: SoService, public _regCPIS: RegCalificacionPIService
    ) {
      this.rutaActiva.params.subscribe(params=>{

        this.idCurso=params['idCurso'];

      });
     }

  ngOnInit() {
    this.getEvaluaciones();
    this.getCategorias();
    this.getRC();
    this.getRegsCalificacionSOS();
    this.getSos();

  }

  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    //console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    //console.log(event, active);
  }

  getRC() {
    let subsGetRegC=this._regCS.getItem(true,["d_idCurso","==",this.idCurso],false,undefined).subscribe(data=>{
      subsGetRegC.unsubscribe();
      this.regsC= data;
      this.regsEC=[];
      this.regsECxC=[[],[],[]];
      this.ultimoEstudiante=this.regsC.length;
      this.nEst=0;
      this.getRegEC2(); // puesto
    });
  }

  getSos() {
    let subsGetSos = this._so.getItem().subscribe( data => {
      subsGetSos.unsubscribe();
      this.sos = data;
      this.detallesCAPI = [];
      const a= new BehaviorSubject(0);
      a.subscribe(data=>{
        let final=this.sos.length;
        if(final==0){
          a.unsubscribe();
        }
        if(data==this.sos.length){
          a.unsubscribe();
          this.detallesCAPI.sort(function (a, b) {
            if (a.idSo > b.idSo) {
              return 1;
            }
            if (a.idSo < b.idSo) {
              return -1;
            }
            return 0;
          });

          this.detallesCapIOrdenada = this.groupBy(this.detallesCAPI, (item)=>
          {
            return [item.idSo];
          });

          console.log(this.detallesCAPI);
          console.log(this.detallesCapIOrdenada);
         
        }
        
      });
      for (const so of this.sos) {
        
        let subsGetRegCPi = this._regCPIS.getRegistroV4(so.id, this.idCurso).subscribe( data => {
          subsGetRegCPi.unsubscribe();
          let tGruposPi = []; // Es un arreglo de arreglos de objeto. [[{regPi1},{regPi1}],[{regPi2},{regPi2}]]
          this.regsCPI = data;
          let tGrupoTPi: RegCalificacionPI [] =  [];
          let idPi = 0;
          let conteo = 0;
          // a, a, b, b, c, d
          for (const regCPI of this.regsCPI) {
              conteo = conteo + 1;
            if( idPi != regCPI.idPi && idPi != 0 ) {
              tGruposPi.push(tGrupoTPi);
              tGrupoTPi = [];
            }
            tGrupoTPi.push(regCPI);
            if ( this.regsCPI.length == conteo ) {
              tGruposPi.push(tGrupoTPi);
            }
            idPi = regCPI.idPi;
          }
          let detalleCAPI = {
            sobresaliente: 0,
            satisfactorio: 0,
            enDesarrollo: 0,
            insuficiente: 0,
            idSo: 0,
            idPi: 0,
            nEstudiantes: 0,
            porcentajeAprobacion: 0
          };


          for (const grupoTipoPi of tGruposPi) {
            let idSoGrupo = 0;
            let idPiGrupo = 0;
            let nEstudiantes = 0;
            for (const regCPI2 of grupoTipoPi) {
              const regCPI: RegCalificacionPI = regCPI2;
              if (regCPI.valor == 4) {
                detalleCAPI.sobresaliente = detalleCAPI.sobresaliente + 1;
              } else if (regCPI.valor == 3) {
                detalleCAPI.satisfactorio = detalleCAPI.satisfactorio + 1;
              } else if (regCPI.valor == 2) {
                detalleCAPI.enDesarrollo = detalleCAPI.enDesarrollo + 1;
              } else if (regCPI.valor == 1) {
                detalleCAPI.insuficiente = detalleCAPI.insuficiente + 1;
              }
              idSoGrupo = regCPI.idSo;
              idPiGrupo = regCPI.idPi;
              nEstudiantes = nEstudiantes + 1;
            }
            detalleCAPI.idSo = idSoGrupo;
            detalleCAPI.idPi = idPiGrupo;
            detalleCAPI.nEstudiantes = nEstudiantes;
            if (nEstudiantes == 0) {
              detalleCAPI.sobresaliente = 0;
              detalleCAPI.satisfactorio = 0;
              detalleCAPI.enDesarrollo = 0;
              detalleCAPI.insuficiente = 0;
            } else {
              detalleCAPI.sobresaliente = (detalleCAPI.sobresaliente / nEstudiantes) * 100;
              detalleCAPI.satisfactorio = (detalleCAPI.satisfactorio / nEstudiantes) * 100;
              detalleCAPI.enDesarrollo = (detalleCAPI.enDesarrollo / nEstudiantes) * 100;
              detalleCAPI.insuficiente = (detalleCAPI.insuficiente / nEstudiantes) * 100;
              detalleCAPI.porcentajeAprobacion = (detalleCAPI.sobresaliente + detalleCAPI.satisfactorio);
            }

            this.detallesCAPI.push(detalleCAPI);

            detalleCAPI = {
              sobresaliente: 0,
              satisfactorio: 0,
              enDesarrollo: 0,
              insuficiente: 0,
              idSo: 0,
              idPi: 0,
              nEstudiantes: 0,
              porcentajeAprobacion: 0
            };
            
          }


          a.next(a.value+1);
          

        });//final subsGetRegCPi
      }
    });
  }

   groupBy( array , f ){
      var groups = {};
      array.forEach( ( o )=>
      {
        var group = JSON.stringify( f(o) );
        groups[group] = groups[group] || [];
        groups[group].push( o );  
      });
      return Object.keys(groups).map( ( group )=>
      {
        return groups[group]; 
      })
  }


  getRegsCalificacionSOS() {
    let subsGetRegCSOS = this._regCalificacionSOS.getItem(true,["d_idCurso", "==" ,this.idCurso]).subscribe(data => {
      subsGetRegCSOS.unsubscribe();
      this.regsCalificacionSO = data;
      this.calcularCA();
    });
  }

  getRegEC2() {
    let subsGetRegEC=this._regECS.getItem().subscribe(misRegEC=>{
      subsGetRegEC.unsubscribe();
      let subsEva =this._evaluacionS.getItem(true,["d_idCurso","==",this.idCurso]).subscribe(data=>{
        subsEva.unsubscribe();
        this.evaluaciones= data;
        let misCEDelCurso=[];
        for (const miRegEC of misRegEC) {
          for (const evaluacion of this.evaluaciones) {
            if(evaluacion.d_id==miRegEC.d_idEvaluacion){
              misCEDelCurso.push(miRegEC);
            }
          }
        }
            
        for (const r of misCEDelCurso) {
          this.regsEC.push(r);
          if(r.corte==1){
            this.regsECxC[0].push(r);
          }else if (r.corte==2){
            this.regsECxC[1].push(r);
          }else if(r.corte==3){
            this.regsECxC[2].push(r);
          }
        }
       
        this.nEst=this.regsC.length;

        this.calificacionC=[[],[],[],[]];
        this.calificacionE=[[],[],[],[]];
        this.calificacionCAD=[[],[],[],[]];
        this.calificacionCAL=[[],[],[],[]];
        this.calcularCCriterios(0);
        this.calcularCCriterios(1);
        this.calcularCCriterios(2);
        this.calcularCCriterios(3);
    

      });
      
      
    });
  }

  getCategorias(){
    let subsCategoria=this._categoriaS.getItem().subscribe(data=>{
      subsCategoria.unsubscribe();
      this.categorias= data;
    });
  }

  getEvaluaciones(){
    let subsEva=this._evaluacionS.getItem(true,["d_idCurso","==",this.idCurso]).subscribe(data=>{
      subsEva.unsubscribe();
      this.evaluaciones= data;
    });
  }

  calcularCA(){
    let i=0;
    let total=0;
    let suma=0;
    let rNA=[];
    for(let regCalificacionSO of this.regsCalificacionSO){
      let v = regCalificacionSO.valor;
      rNA.push(v);
      if(v!=0){
        i=i+1;
      }
      suma= suma+v;
    }
    if(i!=0){
      total = (suma*100)/(4*i);
    }else{
      total = 0;
    }
    this.calificacionAbet=total;
  }

  calcularCCriterios(idc){
    let i=[];
    let promedio=0;
    let porcentajeHC=[];
    let suma=0;
    let sumaPH=0;
    let sumaPHC=0;
    let rNA=[];
    let idE="";
    let conteo=0;
    let t=[];
    let r=[];
    let idsCat2=[];
    let registros=[];

    if(idc==0){
      registros=this.regsEC;
    }else if(idc==1){
      registros=this.regsECxC[0];
    }else if(idc==2){
      registros=this.regsECxC[1];
    }else if(idc==3){
      registros=this.regsECxC[2];
    }

    registros.sort(function (a, b) {
      if (a.d_idEvaluacion > b.d_idEvaluacion) {
        return -1;
      }
      if (a.d_idEvaluacion < b.d_idEvaluacion) {
        return 1;
      }
      return 0;
    }); 
    for(let regEC of registros){
      conteo=conteo+1;
      if(idE!=regEC.d_idEvaluacion && idE!=""){
        t.push(r);
        r=[];
      }
      r.push(regEC);
      if(registros.length==conteo){
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
      this.calificacionE[idc].push({id:idEv,promedio: promedio, porcentajeH: porcentajeH});    
    }

    for (const a of idsCat2) {
      sumaPHC= (a.suma*100)/(a.cantidad*5);
      porcentajeHC.push({idCategoria:a.id, valor:sumaPHC});
    }
    

    this.calificacionC[idc].push({idCorte:idc,porcentajeHC: porcentajeHC});
    
    

    this.cJson(idc);
  }

  cJson(idc){
    
    for (const phc of this.calificacionC[idc][0].porcentajeHC) {
      let a="";
      for (const c of this.categorias) {
        if(phc.idCategoria==c.id){
          a=c.nombre;
        }
      }
      this.calificacionCAD[idc].push(phc.valor);
      this.calificacionCAL[idc].push(""+a);

    }

    this.doughnutChartLabels=this.calificacionCAL[0];
    this.doughnutChartDatasets=[{
      data:this.calificacionCAD[0]
    }];

    this.barChartLabels=this.calificacionCAL[0];
    this.barChartData=[{
      data:this.calificacionCAD[0], label: 'Puntaje' 
    }];

    this.radarChartLabels=this.calificacionCAL[0];
    this.radarChartData=[{
      data:this.calificacionCAD[0], label: 'Puntaje' 
    }];



    let calificacionCALSort=[];
    let arr=[];
    for (let index = 0; index < this.calificacionCAL[0].length; index++) {

      for (let i = 0; i < 4; i++) {
        if(this.calificacionCAL[i][index]==undefined){
          arr.push("");
        }else{
          arr.push(this.calificacionCAL[i][index]);
        }
      }
     
      calificacionCALSort.push(arr);
      arr=[];

    }

 
    this.lineChartLabels=calificacionCALSort;

    this.lineChartData=[
      {data:this.calificacionCAD[0], label: 'General'},
      {data:this.calificacionCAD[1], label: 'Corte1'},
      {data:this.calificacionCAD[2], label: 'Corte2'},
      {data:this.calificacionCAD[3], label: 'Corte3'}
  ];

    this.graficar=true;
    this.crearColores(this.calificacionCAL[0]);
  }

  crearColores(nElementos){
    let colores= [];
    for (const iterator of nElementos) {
      let bgCR=Math.floor(Math.random() * 255); 
      let bgCG=Math.floor(Math.random() * 255);
      let bgCB=Math.floor(Math.random() * 255);
      let alfa=Math.random() * (1 - 0.3) + 0.3;  
      let color="rgba("+bgCR+","+bgCG+","+bgCB+","+1+")";
      colores.push(color);
    }

    this.chartColors=[ 
      {backgroundColor: colores }
    ];

  }

  imprimir(){
     window.print();
    }

  graficarSOPI(posSO:string){
    //empiza creacion para grafico
    
    let valoresXSO=[];
    for (const grupoSo of this.detallesCapIOrdenada) {
      let valorPIsobres=[];
      let valorPIsatisf=[];
      let valorPIenDes=[];
      let valorPIinsuf=[];
      let myIdSo=0;
      let myIdsPI=[];
      let i=0;
      for (const infoPi of grupoSo) {
        i=i+1;
        myIdSo=infoPi.idSo;
        myIdsPI.push("PI"+i);
        valorPIsobres.push(infoPi.sobresaliente);
        valorPIsatisf.push(infoPi.satisfactorio);
        valorPIenDes.push(infoPi.enDesarrollo);
        valorPIinsuf.push(infoPi.insuficiente);
      }
    
      valoresXSO["SO"+myIdSo]=
        {idSo:myIdSo,
         idsPi:myIdsPI,
         sobresaliente:valorPIsobres,
         satisfactorio:valorPIsatisf,
         enDesarrollo:valorPIenDes,
         insuficiente:valorPIinsuf
        };
    }
    
    this.barChartLabels2=valoresXSO[posSO].idsPi;
    this.barChartData2=[
      {data:valoresXSO[posSO].sobresaliente, label:'Sobresaliente'},
      {data:valoresXSO[posSO].satisfactorio, label:'Satisfactorio'},
      {data:valoresXSO[posSO].enDesarrollo, label:'En Desarrollo'},
      {data:valoresXSO[posSO].insuficiente, label:'Insuficiente'},
    ];
    console.log(valoresXSO);
    this.graficoSOPI=true;
  }

  cancelarGraficoSOPI(){
    this.graficoSOPI=false;
  }
}
