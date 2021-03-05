import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observacion } from '../../interfaces/observacion.interface';
import { ObservacionService } from '../../services/observacion.service';
import { StorageService } from '../../services/storage.service';
import { Usuario} from '../../interfaces/usuario.interface';
import swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-observaciones',
  templateUrl: './agregar-observaciones.component.html',
  styleUrls: ['./agregar-observaciones.component.css']
})
export class AgregarObservacionesComponent implements OnInit {
  user: Usuario;
  forma: FormGroup;
  editState: boolean = false;
  camposVacios:boolean = false;
  creado: boolean[] = [false, false];
  editado: boolean[] = [false, false];
  eliminado: boolean[] = [false, false];
  observaciones: Observacion[];

  collectionName: string = '';

  observacion: Observacion = {
    d_id: "",
    d_idEmisor: "",
    d_idReceptor: "",
    d_idCurso: "",
    mensaje: "",
    asunto: ""
  }

  observacion_Seleccionada: Observacion;

  constructor(public _observacionS: ObservacionService, private router: Router,
    private rutaActiva: ActivatedRoute, private _stS: StorageService) {
    this.user = this._stS.getCurrentUser();
    this.collectionName = this._observacionS.collectionName;
    this.observacion.d_idEmisor = this.user.d_id;
    this.rutaActiva.params.subscribe(params => {
      this.observacion.d_idReceptor = params['idEstudiante'];
      this.observacion.d_idCurso = params['idCurso'];
    });

    this.forma = new FormGroup({
      'txtMensaje': new FormControl('', [Validators.required])
    });


    this.forma.get('txtMensaje').valueChanges.subscribe(val => {
      this.observacion.mensaje = val;
    });

   }

  ngOnInit() {
    this.getObservacion();
  }

  crearObservacion() {
    this.addObservacion();
    this.clearFormulario();
  }

  getObservacion() {
    let subsGetO = this._observacionS.getRegistroV1(this.observacion.d_idCurso, this.observacion.d_idReceptor).subscribe(data => {
      subsGetO.unsubscribe();
      this.observaciones = data;
    });

  }

  verificarCamposVacios() {
    if (this.observacion.mensaje != '') {
      this.camposVacios = false;
    } else {
      this.camposVacios = true;
    }
  }

  addObservacion() {
    this.verificarCamposVacios();
    if (this.camposVacios == false) {
      let prmAddO = this._observacionS.addItem(this.observacion).then(data => {
        this.creado[0] = data;
        this.creado[1] = true;
        setTimeout( () => { this.creado[1] = false; }, 3000 );
        this.clearFormulario();
        this.clearObservacion();
        this.getObservacion();
        const Toast = swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
        Toast({
          type: 'success',
          title: `Observación creada`
        });
      });
    }
  }

  clearFormulario() {
    this.forma.reset({
      txtMensaje: ""
    });
  }

  clearObservacion() {
    this.observacion.mensaje= ""
  }

  deleteObservacion(event, observacion: Observacion) {

    swal({
      title: '¿Esta seguro?',
      text: 'No podrás revertir los cambios',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.value) {
        swal({
          position: 'center',
          type: 'success',
          title: 'Eliminado correctamente',
          text: 'Observación Eliminada',
          showConfirmButton: false,
          timer: 1200
        }).then(() => {
          let prmDeleteO = this._observacionS.deleteItem(observacion).then(data => {
            this.eliminado[0] = data;
            this.eliminado[1] = true;
            setTimeout( () => { this.eliminado[1] = false; }, 3000 );
            this.getObservacion();
          });
          const Toast = swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          });
          Toast({
            type: 'success',
            title: 'Observación Eliminada'
          });

        });
      }
    });
  }

  editObservacion($event, observacion: Observacion) {
    this.editState = true;
    this.observacion_Seleccionada = observacion;
    this.forma.controls['txtMensaje'].setValue(this.observacion_Seleccionada.mensaje);
  }

  cancelarEdicion() {
    this.editState = false;
    this.observacion_Seleccionada = null;
    this.clearFormulario();
  }

  updateObservacion() {
    this.verificarCamposVacios();
    if (this.camposVacios == false) {
      this.observacion_Seleccionada.mensaje = this.observacion.mensaje;
      let prmUpdateO = this._observacionS.updateItem(this.observacion_Seleccionada).then(data => {
        this.editado[0] = data;
        this.editado[1] = true;
        setTimeout( () => { this.editado[1] = false }, 3000 );
        this.cancelarEdicion();
        this.getObservacion();
      });
    }
    const Toast = swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
      Toast({
        type: 'success',
        title: 'Observación actializada correctamente'
      });
  }

}
