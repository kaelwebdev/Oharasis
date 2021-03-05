import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { StorageService } from 'src/app/services/storage.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-lte-nav-bar',
  templateUrl: './lte-nav-bar.component.html'// ,
 // styleUrls: ['./lte-nav-bar.component.css']
})
export class LteNavBarComponent implements OnInit {
  public user: Usuario;

  loadAPI: Promise<any>;
  constructor(public _stS: StorageService, public _AuthS: AuthenticationService, public router: Router) {

    this.loadAPI = new Promise((resolve) => {
      this.loadScript();
      resolve(true);
    });

   }

  ngOnInit() {
  }

  public loadScript() {
    let isFound = false;
    let scripts = document.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; ++i) {
        if (scripts[i].getAttribute('src') == './assets/js-lte/demo.js') {
            //isFound = true;
            scripts[i].remove();
        }
    }

    if (isFound == false) {
        let dynamicScripts = ['./assets/js-lte/demo.js'];

        for (let i = 0; i < dynamicScripts .length; i++) {
            let node = document.createElement('script');
            node.src = dynamicScripts [i];
            node.type = 'text/javascript';
            node.async = false;
            node.charset = 'utf-8';
            document.getElementsByTagName('body')[0].appendChild(node);
        }
    }
  }

  logOut() {
    swal({
      title: 'Cerrar sesión',
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

  irAEditarPerfil() {
    this.router.navigate(['/user', 'editar-mi-perfil']);

  }

}
