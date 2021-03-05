import { Component, OnInit} from '@angular/core';
import { AvatarService } from "../../services/avatar.service";
import { Router,ActivatedRoute } from "@angular/router";
import { Usuario} from "../../interfaces/usuario.interface";
import { UsuarioService} from "../../services/usuario.service";
import { RegEstudiante} from "../../interfaces/regEstudiante.interface";
import { RegEstudianteService} from "../../services/regEstudiante.service";
import { AvatarT} from "../../interfaces/avatarT.interface";
import { AvatarTService} from "../../services/avatarT.service";
import { Tipo} from "../../interfaces/tipo.interface";
import { TipoService} from "../../services/tipo.service";
import { RegHabilidad} from "../../interfaces/regHabilidad.interface";
import { RegHabilidadService} from "../../services/regHabilidad.service";
import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { RegLogro } from '../../interfaces/regLogro.interface';
import { RegLogroService } from '../../services/regLogro.service';

@Component({
  selector: 'app-avatar-simple',
  templateUrl: './avatar-simple.component.html',
  styleUrls: ['./avatar-simple.component.css']
})
export class AvatarSimpleComponent implements OnInit {

  private canEleId = 'renderCanvas';
  estudiante:Usuario;
  regE:RegEstudiante;
  avatarT:AvatarT;
  tipos:Tipo[];
  regsH:RegHabilidad[];
  regsLogro:RegLogro[];
  idEstudiante:string="";
  idAvatar=1;
  urlM="";
  chartTipos=[];
  chartNiveles=[];
  chartNivelesI=[];//para ideal
  totalLogros=0;
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
  public chartNivelesIG=[]; // para ideal

  constructor(private router: Router, private rutaActiva: ActivatedRoute,
      private avatarService: AvatarService,private _usuarioS: UsuarioService,
      private _regES: RegEstudianteService, private _avatarTS: AvatarTService, 
      private _tiposS:TipoService, private _regHS: RegHabilidadService, 
      private _reglogroS:RegLogroService) {
      this.rutaActiva.params.subscribe(params=>{
        this.idEstudiante = params['idEstudiante'];
      });

   }

  ngOnInit() {
    this.actualizarPagina();
    this.getEstudiante();
    this.getRegE();
    this.getTipos();
    this.getRegH();
    this.crearChartH();
    this.getRegLogros();
    this.render3dModel();
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



  getEstudiante(){
    let subsGetEst=this._usuarioS.getEstudiantes(true,["d_id","==",this.idEstudiante]).subscribe(data=>{
      subsGetEst.unsubscribe();
      this.estudiante=data[0];
    });
  }

  getRegE(){
    let subsGetRegEst=this._regES.getItem(true,["d_idEstudiante","==",this.idEstudiante]).subscribe(data=>{
      subsGetRegEst.unsubscribe();
      this.regE=data[0];
      this.getAvatarT();
    });
  }

  getAvatarT(){
    let subsGetAvatarT=this._avatarTS.getItem(true,["id","==",this.regE.idAvatar]).subscribe(data=>{
      subsGetAvatarT.unsubscribe();
      this.avatarT=data[0];
      this.idAvatar= this.avatarT.id;
      this.urlM= this.avatarT.url;
      this.render3dModel();
    });
  }

  getTipos(){
    let subsGetT=this._tiposS.getItem().subscribe(data=>{
      subsGetT.unsubscribe();
      this.tipos=data;
    });
  }


  getRegH(){
    let nGrupos=0;
    let subsGetH=this._regHS.getItem(true,["d_idEstudiante","==",this.idEstudiante],true,["idTipo","asc"]).subscribe(data=>{
      subsGetH.unsubscribe();
      this.regsH=data;
      this.chartTipos=[];
      this.chartNiveles=[];
      this.chartNivelesI=[]; //para ideal
      for (const rH of this.regsH) {
        this.chartNiveles.push(rH.nivel);
        for (const t of this.tipos) {
          if(rH.idTipo==t.id){
            this.chartTipos.push(""+t.nombre);
            this.chartNivelesI.push(t.nivelMaximo);//para ideal
          }
        }
      }

      nGrupos= Math.ceil(this.regsH.length/7);
     
      for (let index = 0; index < nGrupos; index++) {

        let a=this.chartTipos.splice(0,7);
        let b= this.chartNiveles.splice(0,7);
        let c=this.chartNivelesI.splice(0,7); //para ideal
        this.chartTiposG.push(a);
        this.chartNivelesG.push(b);
        this.chartNivelesIG.push(c);//para ideal
        this.chartDataG.push([
          { data: this.chartNivelesG[index], label: 'Nivel de habilidad actual' },
          { data: this.chartNivelesIG[index], label: 'Nivel de habilidad ideal' }//para ideal
        ]);
      }
    });
  }

  crearChartH(){
    this.radarChartLabels=this.chartTipos;
    this.radarChartData=[{ data: this.chartNiveles, label: 'Nivel de Habilidad' }];
  }

  getRegLogros(){
    let subsGetRegL=this._reglogroS.getItem(true,["d_idEstudiante","==",this.idEstudiante]).subscribe(data=>{
      subsGetRegL.unsubscribe();
      this.regsLogro=data;
      for (const rl of  this.regsLogro) {
        if(rl.valor!=0){
          this.totalLogros=this.totalLogros+1;
        }
      }
      this.pLogro[1]=""+(this.totalLogros/this.regsLogro.length)*100;
      this.pLogro[0]=this.pLogro[1]+"%";
    });
  }

  perfil() {
    this.router.navigate(['/user', 'perfil', this.idEstudiante]);
  }

}
