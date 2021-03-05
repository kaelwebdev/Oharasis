import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Categoria } from '../../interfaces/categoria.interface';
import { Criterio } from '../../interfaces/criterio.interface';
import { CriterioService } from '../../services/criterio.service';
import { CategoriaService } from '../../services/categoria.service';
import { Evaluacion } from '../../interfaces/evaluacion.interface';
import { EvaluacionService } from '../../services/evaluacion.service';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-criterios',
  templateUrl: './agregar-criterios.component.html',
  styleUrls: ['./agregar-criterios.component.css']
})

export class AgregarCriteriosComponent implements OnInit {
  forma: FormGroup;
  editState: boolean = false;
  camposVacios:boolean = false;
  creado: boolean[]=[false, false];
  editado: boolean[]=[false, false];
  eliminado: boolean[]=[false, false];
  criterios: Criterio[];
  categorias: Categoria[];
  idEvaluacion: string = "";
  criterio: Criterio = {
    d_id: "",
    competencia: "",
    idCategoria: 0,
    idEvaluacion: ""
  }
  evaluacion: Evaluacion;
  criterio_Seleccionado: Criterio;

  constructor(public _criterioS: CriterioService, public _categoriaS: CategoriaService,
    public _evaluacionS: EvaluacionService, private rutaActiva: ActivatedRoute) {

    this.rutaActiva.params.subscribe(params => {
      this.idEvaluacion = params['id'];
      this.criterio.idEvaluacion = params['id'];
    });

    this.forma = new FormGroup({
      'lCategorias': new FormControl('', [Validators.required]),
      'txtACompetencias': new FormControl('',
                                         [
                                           Validators.required,
                                           Validators.minLength(10)
                                          ])
    });

    this.forma.get('lCategorias').valueChanges.subscribe(val => {
      this.criterio.idCategoria=+val;

    });
    // this.forma.setValue(this.usuario);
    this.forma.get('txtACompetencias').valueChanges.subscribe(val => {
      this.criterio.competencia = val;
    });


   }

  ngOnInit() {
    this.getEvaluacion();
    this.getCriterios();
    this.getCategorias();
  }
  crearCriterio() {
    this.addCriterio();
    this.clearFormulario();
  }
  getCriterios() {
    let subsGetCriterios = this._criterioS.getItem(true, ["idEvaluacion", "==", this.idEvaluacion]).subscribe(data => {
      subsGetCriterios.unsubscribe();
      this.criterios = data;
    });
  }
  getCategorias() {
    let subsGetCategorias = this._categoriaS.getItem(false, undefined, true,["id","asc"]).subscribe(data => {
      subsGetCategorias.unsubscribe();
      this.categorias = data;
    });
  }
  getEvaluacion() {
    let subsGetEva = this._evaluacionS.getItem(true, ["d_id", "==", this.idEvaluacion]).subscribe(data => {
      subsGetEva.unsubscribe();
      this.evaluacion = data[0];
    });
  }
  verificarCamposVacios() {
    if (this.criterio.competencia != '' && this.criterio.idCategoria != 0
     && this.criterio.idEvaluacion != '') {
      this.camposVacios = false;
    } else {
      this.camposVacios = true;
    }
  }

  addCriterio() {
    this.verificarCamposVacios();
    if (this.camposVacios == false) {
      let prmAddCriterio = this._criterioS.addItem(this.criterio, this.evaluacion).then(data => {
        this.creado[0]=data;
        this.creado[1]=true;
        setTimeout( () => { this.creado[1] = false }, 3000 );
        this.clearFormulario();
        this.clearCriterio();
        this.getCriterios();
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
        title: 'Criterio creado correctamente'
      });

  }

  clearFormulario() {
    this.forma.reset({
      lCategorias: "",
      txtACompetencias: ""
    });
  }

  clearCriterio() {
    this.criterio.d_id = "",
    this.criterio.competencia = "";
    this.criterio.idCategoria = 0;
    this.criterio.idEvaluacion = this.idEvaluacion;
  }

  deleteCriterio(event, criterio: Criterio) {

    swal({
      title: '¿Esta reguro?',
      text: 'Está a punto de eliminar el criterio',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        swal({
          position: 'center',
          type: 'success',
          title: 'Eliminado correctamente',
          text: 'Criterio de evaluación eliminado',
          showConfirmButton: false,
          timer: 1200
        }).then(() => {
          let prmDeleteCriterio = this._criterioS.deleteItem(criterio, this.evaluacion).then(data => {
            this.eliminado[0] = data;
            this.eliminado[1] = true;
            setTimeout( () => { this.eliminado[1] = false }, 3000 );
            this.getCriterios();
          });
        const Toast = swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
          Toast({
            type: 'success',
            title: 'Criterio de evaluación eliminado'
          });
        });
      }
    });
  }

  editCriterio($event, criterio: Criterio) {
    this.editState = true;
    this.criterio_Seleccionado = criterio;
    this.forma.controls['lCategorias'].setValue(this.criterio_Seleccionado.idCategoria);
    this.forma.controls['txtACompetencias'].setValue(this.criterio_Seleccionado.competencia);
  }

  cancelarEdicion() {
    this.editState = false;
    this.criterio_Seleccionado = null;
    this.clearFormulario();
  }

  updateCriterio() {
    this.verificarCamposVacios();
    if (this.camposVacios == false) {
      this.criterio_Seleccionado.competencia = this.criterio.competencia;
      this.criterio_Seleccionado.idCategoria = this.criterio.idCategoria;
      let prmUpdateCriterio = this._criterioS.updateItem(this.criterio_Seleccionado).then(data => {
        this.editado[0] = data;
        this.editado[1] = true;
        setTimeout( () => { this.editado[1] = false }, 3000 );
        this.cancelarEdicion();
        this.getCriterios();
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
        title: 'Criterio actializado correctamente'
      });

  }

}
