import { Component, OnInit, AfterContentInit, AfterViewInit } from '@angular/core';
import { AvatarService } from "../../services/avatar.service";
import { Router,ActivatedRoute } from "@angular/router"; //NavigationStart, NavigationEnd, NavigationError, NavigationCancel, RoutesRecognized
import { CursoService } from "../../services/curso.service";
import { Curso } from "../../interfaces/curso.interface";
import { Usuario} from "../../interfaces/usuario.interface";
import { UsuarioService} from "../../services/usuario.service";
import { RegEstudiante} from "../../interfaces/regEstudiante.interface";
import { RegEstudianteService} from "../../services/regEstudiante.service";
import { AvatarT} from "../../interfaces/avatarT.interface";
import { AvatarTService} from "../../services/avatarT.service";
import { Tipo} from "../../interfaces/tipo.interface";
import { TipoService} from "../../services/tipo.service";
import { RegCalificacion} from "../../interfaces/regCalificacion.interface";
import { RegCalificacionService} from "../../services/regCalificacion.service";
import { RegHabilidad} from "../../interfaces/regHabilidad.interface";
import { RegHabilidadService} from "../../services/regHabilidad.service";
import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { RegLogro } from '../../interfaces/regLogro.interface';
import { RegLogroService } from '../../services/regLogro.service';
import { StorageService } from '../../services/storage.service';
import { LogroService } from '../../services/logro.service';
import { Logro } from '../../interfaces/logro.interface';
declare let jQuery: any;
declare let $: any;

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css']
})
export class AvatarComponent implements OnInit {
  private canEleId = 'renderCanvas';
  user:Usuario;
  userRol:string="";
  idCurso:string="";
  curso:Curso;
  estudiante:Usuario;
  regE:RegEstudiante;
  avatarT:AvatarT;
  tipos:Tipo[];
  regC:RegCalificacion;
  regsH:RegHabilidad[];
  regsLogro:RegLogro[];
  idEstudiante:string="";
  idAvatar=1;
  urlM="";
  chartTipos=[];
  chartNiveles=[];
  chartNivelesI=[];//para ideal
  totalLogrosPasados=0;
  logrosPasados=[];
  logros:Logro[]=[];
  pLogro=["0px","0"];
  cargaFinalizada:boolean=false;
  public radarChartOptions: ChartOptions = {
    responsive: true,
  };

  public radarChartLabels: Label[];

  public radarChartData: ChartDataSets[];
  public radarChartType: ChartType = 'radar';


  public chartTiposG=[];
  public chartDataG=[];

  public chartNivelesG=[];
  public chartNivelesIG=[];//para ideal

  constructor(private router:Router,private rutaActiva:ActivatedRoute,
      private avatarService:AvatarService, private _cursoS:CursoService,
      private _usuarioS:UsuarioService, private _regES:RegEstudianteService,
      private _avatarTS:AvatarTService, private _tiposS:TipoService,
      private _regCS:RegCalificacionService, private _regHS:RegHabilidadService,
      private _reglogroS:RegLogroService, private _stS:StorageService,
      private _logroS:LogroService) {
      this.user= this._stS.getCurrentUser();
      this.rutaActiva.params.subscribe(params=>{
        this.userRol=this.user.rol;  
        if(this.userRol=="Profesor" || this.userRol=="Director"){
          this.idEstudiante=params['idEstudiante'];
          this.idCurso=params['idCurso'];
          if(this.idCurso==undefined){
            this.idCurso="";
          }
        }else if(this.userRol=="Estudiante"){
          this.idEstudiante=this.user.d_id;
          this.idCurso=params['idCurso'];
          if(this.idCurso==undefined){
            this.idCurso="";
          }
        }

      });
    
   }

  ngOnInit() {
    this.actualizarPagina();
    this.getCurso();
    this.getEstudiante();
    this.getRegE();
    this.getTipos();
    this.getRegC();
    this.getRegH();
    this.crearChartH();
    this.getRegLogros();  
    this.render3dModel();
    this.getLogros();
  }

 
  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  actualizarPagina(){
    let win = (window as any);
    if(win.location.search !== '?loaded=' ) {  
    win.location.search = '?loaded';
    }else{
      this.cargaFinalizada=true;
    }
  }

  render3dModel(){
    this.avatarService.createScene(this.canEleId, this.urlM,this.idAvatar);
    this.avatarService.animate();
  }

  getCurso(){
    let subsGetCursos=this._cursoS.getItem(true,["d_id","==",this.idCurso]).subscribe(data=>{
      subsGetCursos.unsubscribe();
      this.curso=data[0];
    });
  }

  getEstudiante() {
    let subsGetEst=this._usuarioS.getEstudiantes(true,["d_id","==",this.idEstudiante]).subscribe(data=>{
      subsGetEst.unsubscribe();
      this.estudiante=data[0];
    });
  }

  getRegE() {
    let subsGetRegE=this._regES.getItem(true,["d_idEstudiante","==",this.idEstudiante]).subscribe(data=>{
      subsGetRegE.unsubscribe();
      this.regE=data[0];
      this.getAvatarT();
    });
  }

  getAvatarT(){
    let subsGetAT=this._avatarTS.getItem(true,["id","==",this.regE.idAvatar]).subscribe(data=>{
      subsGetAT.unsubscribe();
      this.avatarT=data[0];
      this.idAvatar= this.avatarT.id;
      this.urlM= this.avatarT.url;
      this.render3dModel();
      $(document).ready(function() {
        $('[data-toggle="tooltip"]').tooltip();
      });
    });
  }

  getTipos(){
    let subsGetT=this._tiposS.getItem().subscribe(data=>{
      subsGetT.unsubscribe();
      this.tipos=data;
    });
  }

  getRegC(){
    let subsGetRegC=this._regCS.getRegistroV1(this.idCurso,this.idEstudiante).subscribe(data=>{
      subsGetRegC.unsubscribe();
      this.regC=data[0];
    });
  }

  getRegH(){
    let nGrupos=0;
    let subsGetRegH=this._regHS.getItem(true,["d_idEstudiante","==",this.idEstudiante], true,["idTipo","asc"]).subscribe(data=>{
      subsGetRegH.unsubscribe();
      this.regsH=data;
      this.chartTipos=[];
      this.chartNiveles=[];
      this.chartNivelesI=[]; // para ideal
      for (const rH of this.regsH) {
        this.chartNiveles.push(rH.nivel);
        for (const t of this.tipos) {
          if(rH.idTipo==t.id){
            this.chartTipos.push(""+t.nombre);
            this.chartNivelesI.push(t.nivelMaximo); // para ideal
          }
        }
      }

      nGrupos = Math.ceil(this.regsH.length/7);

      for (let index = 0; index < nGrupos; index++) {

        let a=this.chartTipos.splice(0, 7);
        let b= this.chartNiveles.splice(0, 7);
        let c=this.chartNivelesI.splice(0, 7); // para ideal
        this.chartTiposG.push(a);
        this.chartNivelesG.push(b);
        this.chartNivelesIG.push(c); // para ideal
        this.chartDataG.push([
          { data: this.chartNivelesG[index], label: '' },
          { data: this.chartNivelesIG[index], label: '' } // para ideal
        ]);
      }
      // this.crearChartH();
    });
  }

  crearChartH() {
    this.radarChartLabels=this.chartTipos;
    this.radarChartData=[{ data: this.chartNiveles, label: 'Nivel de Habilidad' }];
  }

  getRegLogros() {
    let subsRegL=this._reglogroS.getItem(true,["d_idEstudiante","==",this.idEstudiante]).subscribe(data=>{
      subsRegL.unsubscribe();
      this.regsLogro = data;
      let tlogrosPasados=[];
      let cantidadLogros= this.regsLogro.length;
      for (const rl of  this.regsLogro) {
        if (rl.valor!=0){
          this.totalLogrosPasados=this.totalLogrosPasados+1;
          tlogrosPasados.push(rl);
        }
      }
      this.logrosPasados=tlogrosPasados;
      this.pLogro[1]= ""+(this.totalLogrosPasados/cantidadLogros)*100;
      this.pLogro[0]=this.pLogro[1]+"%";
    });
  }

  getLogros(){
    let subsLogro=this._logroS.getItem().subscribe((data)=>{
      subsLogro.unsubscribe();
      this.logros=data;
    });
  }

  verCalificacion(){
    this.router.navigate(['/user','calificarEstudiante',this.idEstudiante,this.idCurso]);
  }

  realizarObservacion(){
    this.router.navigate(['/user','agregar-observacion',this.idEstudiante,this.idCurso]);
  }
}
