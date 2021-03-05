import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Categoria } from "../../interfaces/categoria.interface";
import { CategoriaService } from "../../services/categoria.service";
import swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-categorias',
  templateUrl: './agregar-categorias.component.html',
  styleUrls: ['./agregar-categorias.component.css']
})
export class AgregarCategoriasComponent implements OnInit {
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
  categorias: Categoria[];
  categoria:Categoria ={
    d_id:"",
    id:0,
    nombre:""
  }

  categoria_Seleccionada:Categoria;

  constructor(public _categoriaS:CategoriaService) {
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
      for(var k in this.categorias) {
        if (this.categorias[k].id==+val){
          this.yaExiste=true;
        }
      } 

      this.categoria.id=+val;
    });

    this.forma.get('txtNombre').valueChanges.subscribe(val=>{
      this.categoria.nombre=val;
    });

    this.forma.get('lFiltros').valueChanges.subscribe(val=>{
      this.filtro=val;
      this.getCategoria();
    });

    this.forma.get('txtFiltro').valueChanges.subscribe(val=>{
      this.valFiltro=val;
      this.getCategoria();
    });

    this.forma.get('ftxtId').valueChanges.subscribe(val=>{
      this.valFiltro=val;
      this.getCategoria();
    });
   }

  ngOnInit() {
    this.getCategoria();
  }
  
  crearCategoria(){
    this.addCategoria();
    this.clearFormulario();
  }
  
  getCategoria(){

    if (this.filtro!=""&& this.valFiltro!=""){
      if(isNaN(Number(this.valFiltro))){
        let subsGetCategorias=this._categoriaS.getItem(true,[this.filtro,"==",this.valFiltro]).subscribe(data=>{
          subsGetCategorias.unsubscribe();
          this.categorias= data;
        });
      }else{
        let subsGetCategorias=this._categoriaS.getItem(true,[this.filtro,"==",Number(this.valFiltro)]).subscribe(data=>{
          subsGetCategorias.unsubscribe();
          this.categorias= data;
        });
      }
      
    }else{
      let subsGetCategorias= this._categoriaS.getItem(false,undefined,true,["id","asc"]).subscribe(data=>{
        subsGetCategorias.unsubscribe();
        this.categorias= data;
      });
    }
  }

  verificarCamposVacios(){
    if (this.categoria.nombre!= '' && this.categoria.id != 0
    ) {
      this.camposVacios=false;
    } else {
      this.camposVacios=true;
    }
  }

  addCategoria(){
    this.verificarCamposVacios();
    if (this.camposVacios==false){
      let prmAddCategorias = this._categoriaS.addItem(this.categoria).then(data =>{
        this.creado[0]=data;
        this.creado[1]=true;
        setTimeout( () => { this.creado[1]=false }, 3000 );
        this.clearFormulario();
        this.clearCategoria();
        this.getCategoria();
      });
      
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
  
  clearCategoria(){
    this.categoria.d_id="",
    this.categoria.id=0,
    this.categoria.nombre=""
  }

  deleteCategoria(event, categoria: Categoria) {

    swal({
      title: '¿Esta seguro?',
      text: `Esta accion no podra ser revertida. Se eleminara: la categoria,
       y los registros asociados. criterios, y regEC`,
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
          text: 'Categoria Eliminado',
          showConfirmButton: false,
          timer: 1200
        }).then(() => {
          let prmDeleteCategoria = this._categoriaS.deleteItem(categoria).then(data => {
            this.eliminado[0]=data;
            this.eliminado[1]=true;
            setTimeout( () => { this.eliminado[1]=false }, 3000 );
            this.getCategoria();
          });
          const Toast = swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          });
          Toast({
            type: 'success',
            title: 'Categoria eliminada'
          });

        });
      }
    });
  }

  editCategoria($event, categoria:Categoria){
    this.editState=true;
    this.categoria_Seleccionada= categoria;
    this.forma.controls['txtId'].setValue(this.categoria_Seleccionada.id);
    this.forma.controls['txtNombre'].setValue(this.categoria_Seleccionada.nombre);
    this.forma.controls['txtId'].disable();
  }

  cancelarEdicion(){
    this.editState=false;
    this.categoria_Seleccionada= null;
    this.clearFormulario();
    this.forma.controls['txtId'].enable();
  }

  updateCategoria(){
    this.verificarCamposVacios();
    if (this.camposVacios==false) {
      this.categoria_Seleccionada.id=this.categoria.id;
      this.categoria_Seleccionada.nombre=this.categoria.nombre;
      let prmUpdateCategoria = this._categoriaS.updateItem(this.categoria_Seleccionada).then(data =>{
        this.editado[0]=data;
        this.editado[1]=true;
        setTimeout( () => { this.editado[1]=false }, 3000 );
        this.cancelarEdicion();
        this.getCategoria();
      }); 
      
    }
  }


}
