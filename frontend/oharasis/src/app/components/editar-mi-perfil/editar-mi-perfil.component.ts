import { Component, OnInit } from '@angular/core';
import { Usuario} from '../../interfaces/usuario.interface';
import { UsuarioService} from '../../services/usuario.service';
import { StorageService } from '../../services/storage.service';
import { RegEstudiante} from '../../interfaces/regEstudiante.interface';
import { RegEstudianteService} from '../../services/regEstudiante.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AvatarT} from '../../interfaces/avatarT.interface';
import { AvatarTService} from '../../services/avatarT.service';
import {Router} from '@angular/router';
import swal from 'sweetalert2';

// Declaraciones para usar jQuery
declare let jQuery: any;
declare let $: any;


@Component({
  selector: 'app-editar-mi-perfil',
  templateUrl: './editar-mi-perfil.component.html',
  styleUrls: ['./editar-mi-perfil.component.css']
})
export class EditarMiPerfilComponent implements OnInit {
  user: Usuario;
  usuario: Usuario;
  regEstudiante: RegEstudiante;
  avataresT: AvatarT[];
  forma: FormGroup;
  roles=[{id:"Estudiante"}, {id:"Profesor"}, {id:"Director"}, {id:"Admin"}];
  sexos=[{id:"M" , nombre: "Masculino"}, {id:"F", nombre:"Femenino"}];
  usuarioUpdate: Usuario;
  regEsUpdate: RegEstudiante;
  avataresDisponibles = [];
  editado: boolean[] = [false, false];

  constructor( private _usuarioS: UsuarioService, private _regES: RegEstudianteService,
     private _stS: StorageService, private _regATS: AvatarTService, private router: Router) {
      this.user = this._stS.getCurrentUser();

      if (this.user.rol == 'Estudiante' ) {
        this.forma = new FormGroup({
          'txtAlias': new FormControl(''+this.user.alias, [Validators.required]),
          'txtPassword': new FormControl(''+this.user.password , [Validators.required]),
          'txtNombre': new FormControl(''+this.user.nombre, [Validators.required]),
          'txtApellido': new FormControl(''+this.user.apellido, [Validators.required]),
          'txtEmail': new FormControl(''+this.user.email, [Validators.required]),
          'lSexos': new FormControl(''+this.user.sexo, [Validators.required]),
          'txtDescripcion': new FormControl(''+this.user.descripcion),
          'lAvatares': new FormControl('', [Validators.required])
        });
      } else {
        this.forma = new FormGroup({
          'txtAlias': new FormControl(''+this.user.alias, [Validators.required]),
          'txtPassword': new FormControl(''+this.user.password , [Validators.required]),
          'txtNombre': new FormControl(''+this.user.nombre, [Validators.required]),
          'txtApellido': new FormControl(''+this.user.apellido, [Validators.required]),
          'txtEmail': new FormControl(''+this.user.email, [Validators.required]),
          'lSexos': new FormControl(''+this.user.sexo, [Validators.required]),
          'txtDescripcion': new FormControl(''+this.user.descripcion)
        });
      }
     }

  ngOnInit() {
    this.getUsuario();
    if (this.user.rol=="Estudiante") {
      this.getRegEstudiante();
    }
    $(document).ready(function() {
      $('[data-toggle="tooltip"]').tooltip();
    });
  }
  getUsuario() {
    let subsGetUsuario = this._usuarioS.getItem(true,["d_id", "==", this.user.d_id]).subscribe(data => {
      subsGetUsuario.unsubscribe();
      this.usuario = data[0];
      this.actualizarDatos();
    });
  }
  getRegEstudiante() {
    if (this.user.rol == 'Estudiante') {
      let subsGetRegEst = this._regES.getItem(true,["d_idEstudiante", "==", this.user.d_id]).subscribe(data => {
        subsGetRegEst.unsubscribe();
        this.regEstudiante = data[0];
        this.avataresDisponibles = JSON.parse(this.regEstudiante.disponibles);
        this.actualizarDatos2();
        this.getAvataresT();
      });
    }
  }
  getAvataresT() {
    let subsGetRegAT = this._regATS.getItem().subscribe(data => {
      subsGetRegAT.unsubscribe();
      this.avataresT = data;
    });
  }
  actualizarDatos() {
    this.forma.controls['txtAlias'].setValue(this.usuario.alias);
    this.forma.controls['txtPassword'].setValue(this.usuario.password);
    this.forma.controls['txtNombre'].setValue(this.usuario.nombre);
    this.forma.controls['txtApellido'].setValue(this.usuario.apellido);
    this.forma.controls['txtEmail'].setValue(this.usuario.email);
    this.forma.controls['lSexos'].setValue(this.usuario.sexo);
    this.forma.controls['txtDescripcion'].setValue(this.usuario.descripcion);
  }
  actualizarDatos2() {
    this.forma.controls['lAvatares'].setValue(this.regEstudiante.idAvatar);
  }

  swalTemporizador() {
    let timerInterval: any;
    swal({
      title: 'Redireccionando',
      html: 'Será redireccionado en <strong></strong> segundos.',
      timer: 2000, // Timepo
      onBeforeOpen: () => {
        swal.showLoading();
        timerInterval = setInterval(() => {
          swal.getContent().querySelector('strong')
            .textContent = Math.ceil(swal.getTimerLeft() / 1000).toFixed();
        }, 100);
      },
      onClose: () => {
        clearInterval(timerInterval);
      }
    }).then((result) => {
      if (
        // Read more about handling dismissals
        result.dismiss === swal.DismissReason.timer
      ) {
          this.router.navigate(['/user']);

      }
    });
  }

  swalSucces() {
    swal({
      position: 'center',
      type: 'success',
      title: '¡Guardado!',
      text: 'Su información ha sido actualizada',
      showConfirmButton: false,
      timer: 1000
    }).then(() => {
      this.swalTemporizador();
    });
  }

  updateUsuario() {
    this.usuarioUpdate = {
      d_id: this.user.d_id,
      alias: this.forma.controls['txtAlias'].value,
      password: this.forma.controls['txtPassword'].value,
      nombre: this.forma.controls['txtNombre'].value,
      apellido: this.forma.controls['txtApellido'].value,
      email: this.forma.controls['txtEmail'].value,
      sexo: this.forma.controls['lSexos'].value,
      urlImagen: this.usuario.urlImagen,
      rol: this.user.rol,
      descripcion: this.forma.controls['txtDescripcion'].value
    };
    if (this.user.rol == 'Estudiante') {
      this.regEsUpdate = {
        d_id: this.regEstudiante.d_id,
        d_idEstudiante: this.regEstudiante.d_idEstudiante,
        idSemestre: this.regEstudiante.idSemestre,
        idAvatar: +this.forma.controls['lAvatares'].value,
        disponibles: this.regEstudiante.disponibles
      };
    }

    let prmUpdateUsuario = this._usuarioS.updateItem(this.usuarioUpdate).then(data => {
      if (this.user.rol == 'Estudiante') {
        let prmUpdateRegEst = this._regES.updateItem(this.regEsUpdate).then(regEstData => {
          this.editado[0] = regEstData;
          setTimeout( () => { this.editado[0] = false; }, 3000 );
          this.swalSucces();
        });
      } else {
        this.swalSucces();
      }

    });

  }

}
