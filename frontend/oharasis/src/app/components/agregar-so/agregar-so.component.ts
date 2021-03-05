import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { So } from "../../interfaces/so.interface";
import { SoService } from "../../services/so.service";
import swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-so',
  templateUrl: './agregar-so.component.html',
  styleUrls: ['./agregar-so.component.css']
})
export class AgregarSoComponent implements OnInit {

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
  sos: So[];
  so:So ={
    d_id:"",
    id:0,
    nombre:""
  }

  so_Seleccionada:So;

  constructor(public _soS:SoService) {
    this.forma = new FormGroup({
      'txtId': new FormControl('',[Validators.required,Validators.pattern("^(0|[1-9][0-9]*)$")]),
      'txtNombre': new FormControl('',
                                         [Validators.required]),
      'lFiltros': new FormControl(''),
      'txtFiltro': new FormControl(''),
      'ftxtId': new FormControl('')
    });
    
    this.forma.get('txtId').valueChanges.subscribe(val=>{
      this.yaExiste=false;
      for(var k in this.sos) {
        if (this.sos[k].id==+val){
          this.yaExiste=true;
        }
      } 

      this.so.id=+val;
    });

    this.forma.get('txtNombre').valueChanges.subscribe(val=>{
      this.so.nombre=val;
    });

    this.forma.get('lFiltros').valueChanges.subscribe(val=>{
      this.filtro=val;
      this.getSo();
    });

    this.forma.get('txtFiltro').valueChanges.subscribe(val=>{
      this.valFiltro=val;
      this.getSo();
    });

    this.forma.get('ftxtId').valueChanges.subscribe(val=>{
      this.valFiltro=val;
      this.getSo();
    });
   }

  ngOnInit() {
    this.getSo();
  }
  
  crearSo(){
    this.addSo();
    this.clearFormulario();
  }
  
  getSo(){

    if (this.filtro!=""&& this.valFiltro!=""){
      if(isNaN(Number(this.valFiltro))){
        let subsGetSos=this._soS.getItem(true,[this.filtro,"==",this.valFiltro]).subscribe(data=>{
          this.sos= data;
        });
      }else{
        let subsGetSos=this._soS.getItem(true,[this.filtro,"==",Number(this.valFiltro)]).subscribe(data=>{
          this.sos= data;
        });
      }
      
    }else{
      let subsGetSos= this._soS.getItem(false,undefined,true,["id","asc"]).subscribe(data=>{
        this.sos= data;
      });
    }
  }

  verificarCamposVacios(){
    if (this.so.nombre!= '' && this.so.id != 0
    ) {
      this.camposVacios=false;
    } else {
      this.camposVacios=true;
    }
  }

  addSo(){
    this.verificarCamposVacios();
    if (this.camposVacios==false){
      let prmAddSo = this._soS.addItem(this.so).then(data =>{
        this.creado[0]=data;
        this.creado[1]=true;
        setTimeout( () => { this.creado[1]=false }, 3000 );
        this.clearFormulario();
        this.clearSo();
        this.getSo();
      });
      
    }else{
      console.log("campos insuficentes para crear");
    }
  }

  clearFormulario(){
    this.forma.reset({
      txtId:"",
      txtNombre:"",
      lFiltros:"",
      txtFiltro:"",
      ftxtId:""
    });
  }
  
  clearSo(){
    this.so.d_id="",
    this.so.id=0,
    this.so.nombre=""
  }

  deleteSo(event, so:So){

    swal({
      title: '¿Esta seguro?',
      text: `Esta accion no podra ser revertida. Se eliminara: el SO,
       y los registros de calificacion SO asociados`,
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
          text: 'So Eliminado',
          showConfirmButton: false,
          timer: 1200
        }).then(() => {
          let prmDeleteSo = this._soS.deleteItem(so).then(data =>{
            this.eliminado[0]=data;
            this.eliminado[1]=true;
            setTimeout( () => { this.eliminado[1]=false }, 3000 );
            this.getSo();
          });
          const Toast = swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          });
          Toast({
            type: 'success',
            title: 'So eliminado'
          });

        });
      }
    });
  }

  editSo($event, so:So){
    this.editState=true;
    this.so_Seleccionada= so;
    this.forma.controls['txtId'].setValue(this.so_Seleccionada.id);
    this.forma.controls['txtNombre'].setValue(this.so_Seleccionada.nombre);
    this.forma.controls['txtId'].disable();
  }

  cancelarEdicion(){
    this.editState=false;
    this.so_Seleccionada= null;
    this.clearFormulario();
    this.forma.controls['txtId'].enable();
  }

  updateSo(){
    this.verificarCamposVacios();
    if (this.camposVacios==false) {
      this.so_Seleccionada.id=this.so.id;
      this.so_Seleccionada.nombre=this.so.nombre;
      let prmUpdateSo = this._soS.updateItem(this.so_Seleccionada).then(data =>{
        this.editado[0]=data;
        this.editado[1]=true;
        setTimeout( () => { this.editado[1]=false }, 3000 );
        this.cancelarEdicion();
        this.getSo();
      }); 
      
    } 
  }



}
