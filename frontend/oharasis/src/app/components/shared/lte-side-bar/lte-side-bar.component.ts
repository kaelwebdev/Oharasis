import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../interfaces/usuario.interface';
import { StorageService } from '../../../services/storage.service';
import {Router} from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import swal from 'sweetalert2';

// Declaraciones para usar jQuery
declare let jQuery: any;
declare let $: any;

@Component({
  selector: 'app-lte-side-bar',
  templateUrl: './lte-side-bar.component.html',
  styleUrls: ['lte-side-bar.component.css']
})
export class LteSideBarComponent implements OnInit {
  user: Usuario;
  constructor(private _stS: StorageService, public router: Router, public _AuthS: AuthenticationService) {
    this.user = this._stS.getCurrentUser();

  }

  ngOnInit() {
    this.cerrarMenu();
  }

  cerrarMenu() {
    // Collapsa menu al seleccionar una opcion (editar, ver perfil)
    $(document).ready(function() {
      $('.cerrarMenu').click(function () {
          $('#colapsar').click();
      });
    });
    // this.closeMenu();
    $('.user-panel').css({'border-bottom' : 'none' });
  }

  // closeMenu() {
  //   // Cierra acordion cuando se da click por fuera
  //   $(document).click(function(e) {
  //    if (!$(e.target).is('.cerrarMenu')) {
  //        $('.collapse').collapse('hide');
  //      }
  //  });
  //  }


  irAMiPerfil() {
    this.router.navigate(['/user', 'mi-perfil']);
  }

  irAEditarPerfil() {
    this.router.navigate(['/user', 'editar-mi-perfil']);
  }

  logOut() {

    swal({
      title: 'Cerrar Sesión',
      text: `¿Estas seguro que quieres cerrar sesión?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        swal({
          position: 'center',
          type: 'success',
          title: 'Sesión cerrada correctamente',
          text: 'Vuelve pronto',
          showConfirmButton: false,
          timer: 1200
        }).then(() => {
          if (this._AuthS.logout()) {
            this._stS.logout();
          }
        });
      }
    });

  }

}
