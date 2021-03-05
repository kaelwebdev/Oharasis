import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Pi } from "../../interfaces/pi.interface";
import { PiService } from "../../services/pi.service";
import { So } from "../../interfaces/so.interface";
import { SoService } from "../../services/so.service";
import swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-pi',
  templateUrl: './agregar-pi.component.html',
  styleUrls: ['./agregar-pi.component.css']
})
export class AgregarPiComponent implements OnInit {

  forma:FormGroup;
  editState:boolean =false;
  camposVacios:boolean =false;
  creado:boolean[]=[false,false];
  editado:boolean[]=[false,false];
  eliminado:boolean[]=[false,false];
  yaExiste:boolean=false;
  filtros:any=[
    {id:"id", nombre:"id"},
    {id:"nombre", nombre:"nombre"}
  ];
  filtro:string="";
  valFiltro:string="";
  pis: Pi[];
  pi:Pi ={
    d_id:"",
    id:0,
    nombre:"",
    idSo:0
  }
  sos:So[];

  pi_Seleccionada:Pi;

  constructor(public _piS:PiService, private _soS:SoService) {
    this.forma = new FormGroup({
      'txtId': new FormControl('',[Validators.required,Validators.pattern("^(0|[1-9][0-9]*)$")]),
      'txtNombre': new FormControl('',[Validators.required]),
      'lSos': new FormControl('',[Validators.required]),
      'lFiltros': new FormControl(''),
      'txtFiltro': new FormControl(''),
      'ftxtId': new FormControl('')
    });
    
    this.forma.get('txtId').valueChanges.subscribe(val=>{
      this.yaExiste=false;
      for(var k in this.pis) {
        if (this.pis[k].id==+val){
          this.yaExiste=true;
        }
      } 

      this.pi.id=+val;
    });

    this.forma.get('txtNombre').valueChanges.subscribe(val=>{
      this.pi.nombre=val;
    });

    this.forma.get('lSos').valueChanges.subscribe(val=>{
      this.pi.idSo=+val;
    });

    this.forma.get('lFiltros').valueChanges.subscribe(val=>{
      this.filtro=val;
    });

    this.forma.get('txtFiltro').valueChanges.subscribe(val=>{
      this.valFiltro=val;
    });

    this.forma.get('ftxtId').valueChanges.subscribe(val=>{
      this.valFiltro=val;
    });
   }

  ngOnInit() {
    this.getPi();
    this.getSo();
  }
  
  crearPi(){
    this.addPi();
    
  }
  
  getPi(){

    if (this.filtro!=""&& this.valFiltro!=""){
      if(isNaN(Number(this.valFiltro))){
        let subsGetPis=this._piS.getItem(true,[this.filtro,"==",this.valFiltro]).subscribe(data=>{
          subsGetPis.unsubscribe();
          this.pis= data;
        });
      }else{
        let subsGetPis=this._piS.getItem(true,[this.filtro,"==",Number(this.valFiltro)]).subscribe(data=>{
          subsGetPis.unsubscribe();
          this.pis= data;
        });
      }
      
    }else{
      let subsGetPis= this._piS.getItem(false,undefined,true,["id","asc"]).subscribe(data=>{
        subsGetPis.unsubscribe();
        this.pis= data;
      });
    }
  }

  getSo(){
    this._soS.getItem(false,undefined,true,["id","asc"]).subscribe((data)=>{
      this.sos=data;
    });
  }

  verificarCamposVacios(){
    if (this.pi.nombre!= '' && this.pi.id != 0 && this.pi.idSo !=0
    ) {
      this.camposVacios=false;
    } else {
      this.camposVacios=true;
    }
  }

  addPi(){
    this.verificarCamposVacios();
    if (this.camposVacios==false){
      let prmAddPi = this._piS.addItem(this.pi).then(data =>{
        this.creado[0]=data;
        this.creado[1]=true;
        setTimeout( () => { this.creado[1]=false }, 3000 );
        this.getPi();
      });
    }
  }

  clearFormulario(){
    this.forma.reset({
      txtId:"",
      txtNombre:"",
      lSos:"",
      lFiltros:"",
      txtFiltro:"",
      ftxtId:""
    });
  }
  
  clearPi(){
    this.pi.d_id="",
    this.pi.id=0,
    this.pi.nombre="",
    this.pi.idSo=0
  }

  deletePi(event, pi:Pi){

    swal({
      title: '¿Esta seguro?',
      text: `Esta accion no podra ser revertida. Se eliminara: el PI,
       y los registros de calificacion PI asociados`,
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
          text: 'Pi Eliminado',
          showConfirmButton: false,
          timer: 1200
        }).then(() => {
          let prmDeletePi = this._piS.deleteItem(pi).then(data =>{
            this.eliminado[0]=data;
            this.eliminado[1]=true;
            setTimeout( () => { this.eliminado[1]=false }, 3000 );
            this.getPi();
          });
          const Toast = swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          });
          Toast({
            type: 'success',
            title: 'Pi eliminado'
          });

        });
      }
    });
  }

  editPi($event, pi:Pi){
    this.editState=true;
    this.pi_Seleccionada= pi;
    this.forma.controls['txtId'].setValue(this.pi_Seleccionada.id);
    this.forma.controls['txtNombre'].setValue(this.pi_Seleccionada.nombre);
    this.forma.controls['lSos'].setValue(this.pi_Seleccionada.idSo);
    this.forma.controls['txtId'].disable();
  }

  cancelarEdicion(){
    this.editState=false;
    this.pi_Seleccionada= null;
    this.clearFormulario();
    this.forma.controls['txtId'].enable();
  }

  updatePi(){
    this.verificarCamposVacios();
    if (this.camposVacios==false) {
      this.pi_Seleccionada.id=this.pi.id;
      this.pi_Seleccionada.nombre=this.pi.nombre;
      this.pi_Seleccionada.idSo=this.pi.idSo;
      let prmUpdatePi = this._piS.updateItem(this.pi_Seleccionada).then(data =>{
        this.editado[0]=data;
        this.editado[1]=true;
        setTimeout( () => { this.editado[1]=false }, 3000 );
        this.cancelarEdicion();
        this.getPi();
      }); 
      
    } 
  }

}
