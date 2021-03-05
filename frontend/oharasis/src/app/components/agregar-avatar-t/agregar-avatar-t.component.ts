import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AvatarT } from "../../interfaces/avatarT.interface";
import { AvatarTService } from "../../services/avatarT.service";
import swal from 'sweetalert2';


@Component({
  selector: 'app-agregar-avatar-t',
  templateUrl: './agregar-avatar-t.component.html',
  styleUrls: ['./agregar-avatar-t.component.css']
})
export class AgregarAvatarTComponent implements OnInit {

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
  avatarTs: AvatarT[];
  avatarT:AvatarT ={
    d_id:"",
    id:0,
    nombre:"",
    url:""
  }

  avatarT_Seleccionada:AvatarT;

  constructor(public _avatarTS:AvatarTService) {
    this.forma = new FormGroup({
      'txtId': new FormControl('',[Validators.required,Validators.pattern("^(0|[1-9][0-9]*)$")]),
      'txtNombre': new FormControl('', [Validators.required]),
      'txtUrl': new FormControl('',  [Validators.required]),
      'lFiltros': new FormControl(''),
      'txtFiltro': new FormControl(''),
      'ftxtId': new FormControl('')
    });

    this.forma.get('txtId').valueChanges.subscribe(val=>{
      this.yaExiste=false;
      for(var k in this.avatarTs) {
        if (this.avatarTs[k].id==+val){
          this.yaExiste=true;
        }
      } 
      this.avatarT.id=+val;
    });

    this.forma.get('txtNombre').valueChanges.subscribe(val=>{
      this.avatarT.nombre=val;
    });

    this.forma.get('txtUrl').valueChanges.subscribe(val=>{
      this.avatarT.url=val;
    });

    this.forma.get('lFiltros').valueChanges.subscribe(val=>{
      this.filtro=val;
      this.getAvatarT();
    });

    this.forma.get('txtFiltro').valueChanges.subscribe(val=>{
      this.valFiltro=val;
      this.getAvatarT();
    });

    this.forma.get('ftxtId').valueChanges.subscribe(val=>{
      this.valFiltro=val;
      this.getAvatarT();
    });
  }

  ngOnInit() {
    this.getAvatarT();
  }
  
  crearAvatarT(){
    this.addAvatarT();
    this.clearFormulario();
  }
  
  getAvatarT(){

    if (this.filtro!=""&& this.valFiltro!=""){
      if(isNaN(Number(this.valFiltro))){
        let subsGetAT=this._avatarTS.getItem(true,[this.filtro,"==",this.valFiltro]).subscribe(data=>{
          subsGetAT.unsubscribe();
          this.avatarTs= data;
        });
      }else{
        let subsGetAT=this._avatarTS.getItem(true,[this.filtro,"==",Number(this.valFiltro)]).subscribe(data=>{
          subsGetAT.unsubscribe();
          this.avatarTs= data;
        });
      }
      
    }else{
      let subsGetAT= this._avatarTS.getItem(false,undefined,true,["id","asc"]).subscribe(data=>{
        subsGetAT.unsubscribe();
        this.avatarTs= data;
      });
    }
  }

  verificarCamposVacios(){
    if (this.avatarT.nombre!= '' && this.avatarT.id != 0
    ) {
      this.camposVacios=false;
    } else { 
      this.camposVacios=true;
    }
  }

  addAvatarT(){
    this.verificarCamposVacios();
    if (this.camposVacios==false){
      let prmAddAT = this._avatarTS.addItem(this.avatarT).then(data =>{
        this.creado[0]=data;
        this.creado[1]=true;
        setTimeout( () => { this.creado[1]=false }, 3000 );
        this.getAvatarT();
        this.clearFormulario();
        this.clearAvatarT();
      });
      
    }
  }

  clearFormulario(){
    this.forma.reset({
      txtId:"",
      txtNombre:"",
      txtUrl:"",
      lFiltros:"",
      txtFiltro:"",
      ftxtId:""
    });
  }
  
  clearAvatarT(){
    this.avatarT.d_id="",
    this.avatarT.id=0,
    this.avatarT.nombre="",
    this.avatarT.url=""
  }

  deleteAvatarT(event, avatarT: AvatarT) {

    swal({
      title: '¿Esta seguro?',
      text: `Esta accion no se podra revertir. Se eliminara: el avatar.
       Es posible que esto cuase inconsistencias en la logica de logros del proyecto`,
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
          text: 'Avatar Eliminado',
          showConfirmButton: false,
          timer: 1200
        }).then(() => {
              let prmDeleteAT = this._avatarTS.deleteItem(avatarT).then(data => {
                this.eliminado[0] = data;
                this.eliminado[1] = true;
                setTimeout( () => {
                  this.eliminado[1] = false;
                }, 3000 );
                this.getAvatarT();
              });
          const Toast = swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          });
          Toast({
            type: 'success',
            title: 'Avatar eliminado'
          });

        });
      }
    });
    
  }

  editAvatarT($event, avatarT:AvatarT){
    this.editState=true;
    this.avatarT_Seleccionada= avatarT;
    this.forma.controls['txtId'].setValue(this.avatarT_Seleccionada.id);
    this.forma.controls['txtNombre'].setValue(this.avatarT_Seleccionada.nombre);
    this.forma.controls['txtUrl'].setValue(this.avatarT_Seleccionada.url);
    this.forma.controls['txtId'].disable();
  }

  cancelarEdicion(){
    this.editState=false;
    this.avatarT_Seleccionada= null;
    this.clearFormulario();
    this.forma.controls['txtId'].enable();
  }

  updateAvatarT(){
    this.verificarCamposVacios();
    if (this.camposVacios==false) {
      this.avatarT_Seleccionada.id=this.avatarT.id;
      this.avatarT_Seleccionada.nombre=this.avatarT.nombre;
      this.avatarT_Seleccionada.url=this.avatarT.url;
      let prmUpdateAT = this._avatarTS.updateItem(this.avatarT_Seleccionada).then(data =>{
        this.editado[0]=data;
        this.editado[1]=true;
        setTimeout( () => { this.editado[1]=false }, 3000 );
        this.getAvatarT();
        this.cancelarEdicion();
      }); 
      
    }
  }

}
