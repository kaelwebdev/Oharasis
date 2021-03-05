import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { So } from '../../interfaces/so.interface';
import { SoService } from '../../services/so.service';
import { RegCalificacionSO } from '../../interfaces/regCalificacionSO.interface';
import { RegCalificacionSOService } from '../../services/regCalificacionSO.service';
import { BehaviorSubject } from 'rxjs';
import swal from 'sweetalert2';

// Declaraciones para usar jQuery
declare let jQuery: any;
declare let $: any;


@Component({
  selector: 'app-configurar-curso',
  templateUrl: './configurar-curso.component.html',
  styleUrls: ['./configurar-curso.component.css']
})
export class ConfigurarCursoComponent implements OnInit {
  d_idCurso: string;
  estados = [{valor: 0, nombre: 'No aplica'},
  {valor: 1, nombre: 'Aplica'}
  ];
  cortes = [{valor: 0, nombre: 'Todos los Cortes'},
  {valor: 1, nombre: 'Primer Corte'},
  {valor: 2, nombre: 'Segundo Corte'},
  {valor: 3, nombre: 'Tercer Corte'}
  ];
  sos: So[];
  regsCSO: RegCalificacionSO[];
  constructor( private rutaActiva: ActivatedRoute, private _soS: SoService,
    private _regCSOS: RegCalificacionSOService, public router: Router) {

    this.rutaActiva.params.subscribe(params => {
      this.d_idCurso = params['idCurso'];
    });
   }

  ngOnInit() {
    this.getSOs();
  }

  getSOs() {
    let subsGetSO = this._soS.getItem(false, undefined, true, ['id', 'asc']).subscribe(data => {
      subsGetSO.unsubscribe();
      this.sos = data;
      console.log(this.sos);
      $(document).ready(function() {
        $('[data-toggle="tooltip"]').tooltip();
      });
    });
  }

  swalTemRedirect() {
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
        result.dismiss === swal.DismissReason.timer
      ) {
        this.router.navigate(['/user', 'estudiantes', this.d_idCurso]);

      }
    });
  }

  swalSuccess() {
    swal({
      position: 'center',
      type: 'success',
      title: '¡Guardado!',
      text: 'Cambios guardados correctamente',
      showConfirmButton: false,
      timer: 1000
    }).then(() => {
      this.swalTemRedirect();
    });
  }

  guardarCambios() {

    let subsGetRegSO = this._regCSOS.getItem(true, ['d_idCurso', '==', this.d_idCurso], true, ['idSo', 'asc']).subscribe(data => {
      subsGetRegSO.unsubscribe();
      this.regsCSO = data;
      const a = new BehaviorSubject(0);
      a.subscribe(data => {
        let final = this.regsCSO.length;
        console.log(data);
        if (final == 0) {
          a.unsubscribe();
        }
        if (data == final) {
          a.unsubscribe();
          console.log('fin');
          this.swalSuccess();
          // swal({
          //   position: 'center',
          //   type: 'success',
          //   title: '¡Guardado!',
          //   text: 'Cambios guardados',
          //   showConfirmButton: false,
          //   timer: 1200
          // });
          // setTimeout( () => {
          //   this.router.navigate(['/user', 'estudiantes', this.d_idCurso]);
          // }, 1500);
        }

    });
      for (const regCSO of this.regsCSO) {
        regCSO.valor = +(<HTMLSelectElement>document.getElementById('estado'+regCSO.idSo)).value;
        console.log(this.regsCSO);
        let prmUpdateRegCSO = this._regCSOS.updateItem(regCSO).then(() => {
          a.next(a.value+1);
        });

      }

    });
  }

}
