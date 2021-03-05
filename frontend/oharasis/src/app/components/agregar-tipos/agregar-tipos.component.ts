import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Tipo } from "../../interfaces/tipo.interface";
import { TipoService } from "../../services/tipo.service";
import swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-tipos',
  templateUrl: './agregar-tipos.component.html',
  styleUrls: ['./agregar-tipos.component.css']
})
export class AgregarTiposComponent implements OnInit {

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
  tipos: Tipo[];
  tipo:Tipo ={
    d_id:"",
    id:0,
    nombre:"",
    nivelMaximo:1
  }

  tipo_Seleccionada:Tipo;

  constructor(public _tipoS:TipoService) {
    this.forma = new FormGroup({
      'txtId': new FormControl('',[Validators.required,Validators.pattern("^(0|[1-9][0-9]*)$")]),
      'txtNombre': new FormControl('', [Validators.required]),
      'txtNivelMaximo': new FormControl('', [Validators.required,Validators.pattern("^(0|[1-9][0-9]*)$")]),
      'lFiltros': new FormControl(''),
      'txtFiltro': new FormControl(''),
      'ftxtId': new FormControl('')
    });
    
    this.forma.get('txtId').valueChanges.subscribe(val=>{
      this.yaExiste=false;
      for(var k in this.tipos) {
        if (this.tipos[k].id==+val){
          this.yaExiste=true;
        }
      } 
      this.tipo.id=+val;
    
    
    });

    this.forma.get('txtNombre').valueChanges.subscribe(val=>{
      this.tipo.nombre=val;
    });

    this.forma.get('txtNivelMaximo').valueChanges.subscribe(val=>{
      this.tipo.nivelMaximo=+val;
    });

    this.forma.get('lFiltros').valueChanges.subscribe(val=>{
      this.filtro=val;
      this.getTipo();
    });

    this.forma.get('txtFiltro').valueChanges.subscribe(val=>{
      this.valFiltro=val;
      this.getTipo();
    });

    this.forma.get('ftxtId').valueChanges.subscribe(val=>{
      this.valFiltro=val;
      this.getTipo();
    });
   }

  ngOnInit() {
    this.getTipo();
  }
  
  crearTipo(){
    this.addTipo();
    this.clearFormulario();
  }
  
  getTipo(){
    if (this.filtro!=""&& this.valFiltro!=""){
      if(isNaN(Number(this.valFiltro))){
        let subsGetT=this._tipoS.getItem(true,[this.filtro,"==",this.valFiltro]).subscribe(data=>{
          subsGetT.unsubscribe();
          this.tipos= data;
        });
      }else{
        let subsGetT=this._tipoS.getItem(true,[this.filtro,"==",Number(this.valFiltro)]).subscribe(data=>{
          subsGetT.unsubscribe();
          this.tipos= data;
        });
      }
      
    }else{
      let subsGetT= this._tipoS.getItem(false,undefined,true,["id","asc"]).subscribe(data=>{
        subsGetT.unsubscribe();
        this.tipos= data;
      });
    }
  }

  verificarCamposVacios(){
    if (this.tipo.nombre!= '' && this.tipo.id != 0 && this.tipo.nivelMaximo != 0
    ) {
      this.camposVacios=false;
    } else { 
      this.camposVacios=true;
    }
  }

  addTipo(){
    this.verificarCamposVacios();
    if (this.camposVacios==false){
      let prmAddT = this._tipoS.addItem(this.tipo).then(data =>{
        this.creado[0]=data;
        this.creado[1]=true;
        setTimeout( () => { this.creado[1]=false }, 3000 );
        this.clearFormulario();
        this.clearTipo();
        this.getTipo();
      });
      
    }
  }

  clearFormulario(){
    this.forma.reset({
      txtId:"",
      txtNombre:"",
      txtNivelMaximo:"",
      lFiltros:"",
      txtFiltro:"",
      ftxtId:""
    });
  }
  
  clearTipo(){
    this.tipo.d_id="",
    this.tipo.id=0,
    this.tipo.nombre="",
    this.tipo.nivelMaximo=1
  }

  deleteTipo(event, tipo: Tipo) {

    swal({
      title: '¿Estas seguro?',
      text: `Esta accion no se podra revertir. Se eliminara: el tipo,
       los cursos y registros asociados. regHabilidad (eliminacion no implementada) y 
       regLogros (eliminacion no implementada). Tambien los registros asociados
       a los registros. regEvaluacion, regEC, y regCalificacion`,
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
          text: 'Tipo Eliminado',
          showConfirmButton: false,
          timer: 1200
        }).then(() => {
          let prmDeleteT = this._tipoS.deleteItem(tipo).then(data =>{
              this.eliminado[0]=data;
              this.eliminado[1]=true;
              setTimeout( () => { this.eliminado[1]=false }, 3000 );
              this.getTipo();
            });
          const Toast = swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          });
          Toast({
            type: 'success',
            title: 'Tipo eliminado'
          });

        });
      }
    });
  }

  editTipo($event, tipo:Tipo){
    this.editState=true;
    this.tipo_Seleccionada= tipo;
    this.forma.controls['txtId'].setValue(this.tipo_Seleccionada.id);
    this.forma.controls['txtNombre'].setValue(this.tipo_Seleccionada.nombre);
    this.forma.controls['txtNivelMaximo'].setValue(this.tipo_Seleccionada.nivelMaximo);
    this.forma.controls['txtId'].disable();
  }

  cancelarEdicion(){
    this.editState=false;
    this.tipo_Seleccionada= null;
    this.clearFormulario();
    this.forma.controls['txtId'].enable();
  }

  updateTipo(){
    this.verificarCamposVacios();
    if (this.camposVacios==false) {
      this.tipo_Seleccionada.id=this.tipo.id;
      this.tipo_Seleccionada.nombre=this.tipo.nombre;
      this.tipo_Seleccionada.nivelMaximo=this.tipo.nivelMaximo;
      let prmUpdateT = this._tipoS.updateItem(this.tipo_Seleccionada).then(data =>{
        this.editado[0]=data;
        this.editado[1]=true;
        setTimeout( () => { this.editado[1]=false }, 3000 );
        this.cancelarEdicion();
        this.getTipo();
      }); 
      
    }
  }

}
