import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Usuario } from "../../interfaces/usuario.interface";
import { UsuarioService } from "../../services/usuario.service";
import swal from 'sweetalert2';

@Component({
  selector: 'app-crear-usuarios',
  templateUrl: './crear-usuarios.component.html',
  styleUrls: ['./crear-usuarios.component.css']
})
export class CrearUsuariosComponent implements OnInit {
  forma:FormGroup;
  editState:boolean =false;
  camposVacios:boolean =false;
  creado:boolean[]=[false,false];
  editado:boolean[]=[false,false];
  eliminado:boolean[]=[false,false];

  filtros:any=[
    {id:"alias", nombre:"Alias"},
    {id:"nombre", nombre:"Nombre"},
    {id:"apellido", nombre:"Apellido"},
    {id:"email", nombre:"Email"},
    {id:"sexo", nombre:"Sexo"},
    {id:"rol", nombre:"Rol"}
  ];
  filtro:string="";
  valFiltro:string="";
  usuarios: Usuario[];
  roles=[{id:"Estudiante"},{id:"Profesor"},{id:"Director"},{id:"Admin"}];
  sexos=[{id:"M" , nombre: "Masculino"},{id:"F", nombre:"Femenino"}];

  usuario:Usuario ={
    d_id:"",
    alias:"",
    password:"",
    nombre:"",
    apellido:"",
    email:"",
    sexo:"",
    urlImagen:"",
    rol:"",
    descripcion:""
  }
  usuario_Seleccionado:Usuario;

  constructor(public _usuarioS:UsuarioService) {
    this.forma = new FormGroup({
      'lRoles': new FormControl('',[Validators.required]),
      'txtAlias': new FormControl('',[Validators.required]),
      'txtPassword': new FormControl('',[Validators.required]),
      'txtNombre': new FormControl('',[Validators.required]),
      'txtApellido': new FormControl('',[Validators.required]),
      'txtEmail': new FormControl('',[Validators.required,Validators.email]),
      'lSexo': new FormControl('',[Validators.required]),
      'lFiltros': new FormControl(''),
      'flRoles': new FormControl(''),
      'ftxtAlias': new FormControl(''),
      'ftxtPassword': new FormControl(''),
      'ftxtNombre': new FormControl(''),
      'ftxtApellido': new FormControl(''),
      'ftxtEmail': new FormControl(''),
      'flSexo': new FormControl('')
    });

    this.forma.get('lRoles').valueChanges.subscribe(val=>{
      this.usuario.rol=val;
      
    });
    this.forma.get('txtAlias').valueChanges.subscribe(val=>{
      this.usuario.alias=val;
      
    });

    this.forma.get('txtPassword').valueChanges.subscribe(val=>{
      this.usuario.password=val;
      
    });

    this.forma.get('txtNombre').valueChanges.subscribe(val=>{
      this.usuario.nombre=val;
      
    });

    this.forma.get('txtApellido').valueChanges.subscribe(val=>{
      this.usuario.apellido=val;
      
    });

    this.forma.get('txtEmail').valueChanges.subscribe(val=>{
      this.usuario.email=val;
      
    });

    this.forma.get('lSexo').valueChanges.subscribe(val=>{
      this.usuario.sexo=val;
      if(this.usuario.sexo=="M"){
        this.usuario.urlImagen="./assets/img/UsuarioHombre.png"
      }else if(this.usuario.sexo=="F"){
        this.usuario.urlImagen="./assets/img/UsuarioMujer.png"
      }
    });

    this.forma.get('lFiltros').valueChanges.subscribe(val=>{
      this.filtro=val;
      this.getUsuario();
    });

    this.forma.get('flRoles').valueChanges.subscribe(val=>{
      this.valFiltro=val;
      this.getUsuario();
    });
    this.forma.get('ftxtAlias').valueChanges.subscribe(val=>{
      this.valFiltro=val;
      this.getUsuario();
    });

    this.forma.get('ftxtPassword').valueChanges.subscribe(val=>{
      this.valFiltro=val;
      this.getUsuario();
    });

    this.forma.get('ftxtNombre').valueChanges.subscribe(val=>{
      this.valFiltro=val;
      this.getUsuario();
    });

    this.forma.get('ftxtApellido').valueChanges.subscribe(val=>{
      this.valFiltro=val;
      this.getUsuario();
    });

    this.forma.get('ftxtEmail').valueChanges.subscribe(val=>{
      this.valFiltro=val;
      this.getUsuario();
    });

    this.forma.get('flSexo').valueChanges.subscribe(val=>{
      this.valFiltro=val;
      this.getUsuario();
    });
    

   }

  ngOnInit() {
    this.getUsuario();
  }

  crearUsuario(){
    this.addUsuario();
    this.clearFormulario();
  }
  getUsuario(){
    if (this.filtro!="" && this.valFiltro!=""){
      if(isNaN(Number(this.valFiltro))){
        let subsGetUsuarios=this._usuarioS.getItem(true,[this.filtro,"==",this.valFiltro]).subscribe(data=>{
          subsGetUsuarios.unsubscribe();
          this.usuarios= data;
        });
      }else{
        let subsGetUsuarios=this._usuarioS.getItem(true,[this.filtro,"==",Number(this.valFiltro)]).subscribe(data=>{
          subsGetUsuarios.unsubscribe();
          this.usuarios= data;
        });
      }
      
    }else{
      let subsGetUsuarios= this._usuarioS.getItem().subscribe(data=>{
        subsGetUsuarios.unsubscribe();
        this.usuarios= data;
      });
    }
    
    
  }

  verificarCamposVacios(){
    if (this.usuario.alias!='' &&
    this.usuario.password!='' &&
    this.usuario.nombre!='' &&
    this.usuario.apellido!='' &&
    this.usuario.email!='' &&
    this.usuario.sexo!='' &&
    this.usuario.rol!=''
    ) {
      this.camposVacios=false;
    } else {
      this.camposVacios=true;
    }
  }

  addUsuario(){

    this.verificarCamposVacios();
    if (this.camposVacios==false){
      let prmAddUsuario = this._usuarioS.addItem(this.usuario).then(data =>{
        this.creado[0]=data;
        this.creado[1]=true;
        setTimeout( () => { this.creado[1]=false }, 3000 );
        this.clearFormulario();
        this.clearUsuario();
        this.getUsuario();
      });
      
    }else{
      console.log("campos insuficentes para crear");
    }

  }

  clearFormulario(){
    this.forma.reset({
      txtAlias:"",
      txtPassword:"",
      txtNombre:"",
      txtApellido:"",
      txtEmail:"",
      lSexo:"",
      lRoles:"",
      lFiltros:"",
    });
  }

  clearUsuario(){
    this.usuario.d_id="",
    this.usuario.alias="",
    this.usuario.password="",
    this.usuario.nombre="",
    this.usuario.apellido="",
    this.usuario.email="",
    this.usuario.sexo="",
    this.usuario.urlImagen="";
    this.usuario.rol="";
    this.usuario.descripcion="";
  }

  deleteUsuario(event, usuario:Usuario){

    swal({
      title: '¿Estas seguro?',
      text: `Esta accion no se podra revertir.Se eliminara: al usuario,
      y sus registros asiociados. regLogro, regHabilidad,regEstudiante,
      regCalificacion, curso(si es profesor).Tambien los registros
      asociados a los registros. regCalificacionSo, regEC`,
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
          let prmDeleteUsuario = this._usuarioS.deleteItem(usuario).then(data =>{
            this.eliminado[0]=data;
            this.eliminado[1]=true;
            setTimeout( () => { this.eliminado[1]=false }, 3000 );
            this.getUsuario();
          });
          const Toast = swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          });
          Toast({
            type: 'success',
            title: 'Usuario eliminado'
          });

        });
      }
    });
  }

  editUsuario($event, usuario:Usuario){
    this.editState=true;
    this.usuario_Seleccionado= usuario;
    this.forma.controls['txtAlias'].setValue(this.usuario_Seleccionado.alias);
    this.forma.controls['txtPassword'].setValue(this.usuario_Seleccionado.password);
    this.forma.controls['txtNombre'].setValue(this.usuario_Seleccionado.nombre);
    this.forma.controls['txtApellido'].setValue(this.usuario_Seleccionado.apellido);
    this.forma.controls['txtEmail'].setValue(this.usuario_Seleccionado.email);
    this.forma.controls['lSexo'].setValue(this.usuario_Seleccionado.sexo);
    //urlimagen pendiente <aqui>
    this.forma.controls['lRoles'].setValue(this.usuario_Seleccionado.rol);


  }

  cancelarEdicion(){
    this.editState=false;
    this.usuario_Seleccionado= null;
    this.clearFormulario();
  }

  updateUsuario(){
    this.verificarCamposVacios();
    if (this.camposVacios==false) {
      this.usuario_Seleccionado.alias=this.usuario.alias;
      this.usuario_Seleccionado.password=this.usuario.password;
      this.usuario_Seleccionado.nombre=this.usuario.nombre;
      this.usuario_Seleccionado.apellido=this.usuario.apellido;
      this.usuario_Seleccionado.email=this.usuario.email;
      this.usuario_Seleccionado.sexo=this.usuario.sexo;
      this.usuario_Seleccionado.rol=this.usuario.rol;
      this.usuario_Seleccionado.urlImagen=this.usuario.urlImagen;
      let prmUpdateUsuario = this._usuarioS.updateItem(this.usuario_Seleccionado).then(data =>{
        this.editado[0]=data;
        this.editado[1]=true;
        setTimeout( () => { this.editado[1]=false }, 3000 );
        this.cancelarEdicion();
        this.getUsuario();
      }); 
      
    }
  }

}
