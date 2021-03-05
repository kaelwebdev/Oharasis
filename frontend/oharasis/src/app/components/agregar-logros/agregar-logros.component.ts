import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Logro } from "../../interfaces/logro.interface";
import { LogroService } from "../../services/logro.service";
import swal from 'sweetalert2';

@Component({
  selector: 'app-agregars-logro',
  templateUrl: './agregar-logros.component.html',
  styleUrls: ['./agregar-logros.component.css']
})
export class AgregarLogrosComponent implements OnInit {

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
  logros: Logro[];
  logro:Logro ={
    d_id:"",
    id:0,
    nombre:"",
    descripcion:""
  }

  logro_Seleccionada:Logro;

  constructor(public _logroS:LogroService) {
    this.forma = new FormGroup({
      'txtId': new FormControl('',[Validators.required,Validators.pattern("^(0|[1-9][0-9]*)$")]),
      'txtNombre': new FormControl('', [Validators.required]),
      'txtDescripcion': new FormControl(''),
      'lFiltros': new FormControl(''),
      'txtFiltro': new FormControl(''),
      'ftxtId': new FormControl('')
    });

    this.forma.get('txtId').valueChanges.subscribe(val=>{
      this.yaExiste=false;
      for(var k in this.logros) {
        if (this.logros[k].id==+val){
          this.yaExiste=true;
        }
      } 
      this.logro.id=+val;
    });

    this.forma.get('txtNombre').valueChanges.subscribe(val=>{
      this.logro.nombre=val;
    });

    this.forma.get('txtDescripcion').valueChanges.subscribe(val=>{
      this.logro.descripcion=val;
    });

    this.forma.get('lFiltros').valueChanges.subscribe(val=>{
      this.filtro=val;
      this.getLogro();
    });

    this.forma.get('txtFiltro').valueChanges.subscribe(val=>{
      this.valFiltro=val;
      this.getLogro();
    });

    this.forma.get('ftxtId').valueChanges.subscribe(val=>{
      this.valFiltro=val;
      this.getLogro();
    });
   }

  ngOnInit() {
    this.getLogro();
  }
  
  crearLogro(){
    this.addLogro();
    this.clearFormulario();
  }
  
  getLogro(){

    if (this.filtro!=""&& this.valFiltro!=""){
      if(isNaN(Number(this.valFiltro))){
        let subsGetL=this._logroS.getItem(true,[this.filtro,"==",this.valFiltro]).subscribe(data=>{
          this.logros= data;
        });
      }else{
        let subsGetL=this._logroS.getItem(true,[this.filtro,"==",Number(this.valFiltro)]).subscribe(data=>{
          this.logros= data;
        });
      }

    }else{
      let subsGetL= this._logroS.getItem(false,undefined,true,["id","asc"]).subscribe(data=>{
        this.logros= data;
      });
    }
  }

  verificarCamposVacios() {
    if (this.logro.nombre!= '' && this.logro.id != 0
    ) {
      this.camposVacios=false;
    } else {
      this.camposVacios=true;
    }
  }

  addLogro() {
    this.verificarCamposVacios();
    if (this.camposVacios==false){
      let prmAddL = this._logroS.addItem(this.logro).then(data =>{
        this.creado[0]=data;
        this.creado[1]=true;
        setTimeout( () => { this.creado[1]=false }, 3000 );
        this.clearFormulario();
        this.clearLogro();
        this.getLogro();
      });
      
    } else{
      console.log('campos insuficentes para crear');
    }
  }

  clearFormulario() {
    this.forma.reset({
      txtId:"",
      txtNombre:"",
      txtDescripcion:"",
      lFiltros:"",
      txtFiltro:"",
      ftxtId:""
    });
  }

  clearLogro() {
    this.logro.d_id="",
    this.logro.id=0,
    this.logro.nombre="",
    this.logro.descripcion=""
  }

  deleteLogro(event, logro: Logro) {

    swal({
      title: '¿Esta seguro?',
      text: `Esta acción no podra ser revertida. Se eliminara: el logro,
       y los registros asociados. regLogro (Eliminación no implementada). Es posible que esto cuase
        inconsistencias en la logica de logros del sistema`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar'
    }).then((result) => {
      if (result.value) {
        swal({
          position: 'center',
          type: 'success',
          title: 'Eliminado correctamente',
          text: 'Logro Eliminado',
          showConfirmButton: false,
          timer: 1200
        }).then(() => {
          let prmDeleteL = this._logroS.deleteItem(logro).then(data => {
              this.eliminado[0] = data;
              this.eliminado[1] = true;
              setTimeout( () => { this.eliminado[1] = false }, 3000 );
              this.getLogro();
            });
          const Toast = swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          });
          Toast({
            type: 'success',
            title: 'Logro eliminado'
          });

        });
      }
    });
  }

  editLogro($event, logro:Logro){
    this.editState=true;
    this.logro_Seleccionada= logro;
    this.forma.controls['txtId'].setValue(this.logro_Seleccionada.id);
    this.forma.controls['txtNombre'].setValue(this.logro_Seleccionada.nombre);
    this.forma.controls['txtDescripcion'].setValue(this.logro_Seleccionada.descripcion);
    this.forma.controls['txtId'].disable();
  }

  cancelarEdicion(){
    this.editState=false;
    this.logro_Seleccionada= null;
    this.clearFormulario();
    this.forma.controls['txtId'].enable();
  }

  updateLogro(){
    this.verificarCamposVacios();
    if (this.camposVacios==false) {
      this.logro_Seleccionada.id=this.logro.id;
      this.logro_Seleccionada.nombre=this.logro.nombre;
      this.logro_Seleccionada.descripcion=this.logro.descripcion;
      let prmUpdateL = this._logroS.updateItem(this.logro_Seleccionada).then(data =>{
        this.editado[0]=data;
        this.editado[1]=true;
        setTimeout( () => { this.editado[1]=false }, 3000 );
        this.cancelarEdicion();
        this.getLogro();
      }); 
      
    }
  }

}
